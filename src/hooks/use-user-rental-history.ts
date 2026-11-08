import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { formatRupiah } from '../constants/adminTypes';
import type { RentalHistoryRecord } from '../constants/userTypes';

const db: any = supabase;

function formatIndonesianDate(value: string): string {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

function timeLabel(value?: string | null): string {
  if (!value) return '-';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '-' : `${String(date.getHours()).padStart(2, '0')}.${String(date.getMinutes()).padStart(2, '0')} WIB`;
}

function one<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? value[0] ?? null : value;
}

export function useUserRentalHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState<RentalHistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user?.id) {
      setHistory([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data, error: queryError } = await db.from('rentals')
        .select('id, rental_date, started_at, estimated_end_at, returned_at, duration_hours, hourly_rate, total, customer_type, payment_method, payment_status, guarantee_type, status, rental_items(return_condition, return_note, bikes(bike_code, name, category))')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (queryError) throw queryError;

      const records: RentalHistoryRecord[] = (data ?? []).map((rental: any) => {
        const items = (rental.rental_items ?? []).map((item: any) => ({ ...item, bike: one(item.bikes) }));
        const first = items[0];
        const firstBike = first?.bike;
        const codes = items.map((item: any) => item.bike?.bike_code).filter(Boolean);
        const conditions = items.map((item: any) => item.return_condition).filter(Boolean);
        const durationHours = Number(rental.duration_hours ?? 0);
        return {
          id: rental.id,
          date: formatIndonesianDate(rental.rental_date),
          status: rental.status,
          bikeName: `${firstBike?.name ?? 'Sepeda'}${Math.max(0, codes.length - 1) ? ` +${codes.length - 1} unit` : ''}`,
          unitId: codes.join(', ') || '-',
          category: firstBike?.category ?? '-',
          startTime: timeLabel(rental.started_at),
          endTime: rental.status === 'Selesai' ? timeLabel(rental.returned_at) : undefined,
          duration: `${durationHours} jam`,
          customerType: rental.customer_type,
          hourlyRate: `${formatRupiah(Number(rental.hourly_rate ?? 0))}/jam`,
          total: formatRupiah(Number(rental.total ?? 0)),
          paymentMethod: rental.payment_method,
          paymentStatus: rental.payment_status,
          guaranteeType: rental.guarantee_type,
          returnCondition: conditions[0],
          returnNote: items.map((item: any) => item.return_note).filter(Boolean).join('; ') || undefined,
        };
      });
      setHistory(records);
    } catch (err: any) {
      setError(err?.message ?? 'Gagal memuat riwayat penyewaan.');
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => { void refresh(); }, [refresh]);

  const summary = {
    total: history.length,
    ongoing: history.filter((item) => item.status === 'Sedang Berlangsung').length,
    completed: history.filter((item) => item.status === 'Selesai').length,
    pending: history.filter((item) => item.status === 'Menunggu Serah Terima').length,
  };

  return { history, summary, loading, error, refresh };
}
