import { useMemo } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useUserProfile } from '../context/UserProfileContext';
import { formatRupiah } from '../constants/adminDemo';
import type { AdminTransaction } from '../constants/adminDemo';
import type { RentalHistoryRecord } from '../constants/userDemo';

function normalizePhone(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (digits.startsWith('62')) return `0${digits.slice(2)}`;
  if (digits.startsWith('8')) return `0${digits}`;
  return digits;
}

function formatIndonesianDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(year, (month || 1) - 1, day || 1);
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

function toHistoryRecord(transaction: AdminTransaction, bikes: ReturnType<typeof useAdmin>['bikes']): RentalHistoryRecord {
  const firstUnitId = transaction.unitIds[0] || '-';
  const firstBike = bikes.find((bike) => bike.id === firstUnitId);
  const extraUnits = Math.max(0, transaction.unitIds.length - 1);
  const bikeName = firstBike?.name || 'Sepeda';
  const status = transaction.status;
  const firstCondition = transaction.returnConditions?.[firstUnitId];

  return {
    id: transaction.id,
    date: formatIndonesianDate(transaction.date),
    status,
    bikeName: extraUnits ? `${bikeName} +${extraUnits} unit` : bikeName,
    unitId: transaction.unitIds.join(', '),
    category: firstBike?.category || '-',
    startTime: transaction.startTime,
    endTime: status === 'Selesai' ? transaction.returnTime : undefined,
    duration: transaction.durationLabel || `${transaction.durationHours} jam`,
    customerType: transaction.customerType,
    hourlyRate: `${formatRupiah(transaction.hourlyRate)}/jam`,
    total: formatRupiah(transaction.total),
    paymentMethod: transaction.paymentMethod,
    paymentStatus: transaction.paymentStatus,
    guaranteeType: transaction.guaranteeType,
    returnCondition: firstCondition,
    returnNote: transaction.returnNotes,
  };
}

export function useUserRentalHistory() {
  const { transactions, bikes } = useAdmin();
  const { profile } = useUserProfile();
  const linkedPhone = normalizePhone(profile.phone);

  const history = useMemo(() => transactions
    .filter((transaction) => normalizePhone(transaction.phone) === linkedPhone)
    .sort((a, b) => b.id.localeCompare(a.id))
    .map((transaction) => toHistoryRecord(transaction, bikes)), [transactions, bikes, linkedPhone]);

  const summary = useMemo(() => ({
    total: history.length,
    ongoing: history.filter((item) => item.status === 'Sedang Berlangsung').length,
    completed: history.filter((item) => item.status === 'Selesai').length,
    pending: history.filter((item) => item.status === 'Menunggu Serah Terima').length,
  }), [history]);

  return { history, summary };
}
