import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  AdminBike,
  AdminExpense,
  AdminMaintenance,
  AdminTransaction,
  CustomerType,
  DayType,
  GuaranteeType,
  MaintenanceType,
  PaymentMethod,
  PaymentStatus,
  ReturnCondition,
  getHourlyRate,
} from '../constants/adminTypes';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

interface CreateTransactionInput {
  customerName: string;
  phone: string;
  customerType: CustomerType;
  unitIds: string[];
  durationHours: number;
  dayType: DayType;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  guaranteeType: GuaranteeType;
}

type BikeForm = Pick<AdminBike, 'name' | 'category' | 'notes'>;
type ExpenseInput = Omit<AdminExpense, 'id'>;

interface AdminContextValue {
  bikes: AdminBike[];
  transactions: AdminTransaction[];
  expenses: AdminExpense[];
  maintenance: AdminMaintenance[];
  pricingRates: Record<string, number>;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  addBike: (input: BikeForm) => Promise<AdminBike>;
  updateBike: (id: string, input: BikeForm) => Promise<void>;
  createTransaction: (input: CreateTransactionInput) => Promise<AdminTransaction>;
  markTransactionPaid: (id: string) => Promise<void>;
  confirmHandover: (id: string) => Promise<void>;
  completeReturn: (id: string, conditions: Record<string, ReturnCondition>, notes: string) => Promise<void>;
  addExpense: (input: ExpenseInput) => Promise<void>;
  updateExpense: (id: string, input: ExpenseInput) => Promise<void>;
  startMaintenance: (id: string, type: MaintenanceType, note: string) => Promise<void>;
  completeMaintenance: (id: string, fitToUse: boolean) => Promise<void>;
}

const AdminContext = createContext<AdminContextValue | undefined>(undefined);
const db: any = supabase;

function normalizePhone(value: string): string {
  const digits = (value ?? '').replace(/\D/g, '');
  if (digits.startsWith('62')) return `0${digits.slice(2)}`;
  if (digits.startsWith('8')) return `0${digits}`;
  return digits;
}

function localDate(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function timeLabel(value?: string | null): string {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return `${String(date.getHours()).padStart(2, '0')}.${String(date.getMinutes()).padStart(2, '0')} WIB`;
}

function relationOne<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? value[0] ?? null : value;
}

function mapBike(row: any): AdminBike {
  const branch = relationOne(row.branches);
  return {
    id: row.bike_code,
    dbId: row.id,
    branchId: row.branch_id,
    branchName: branch?.name ?? undefined,
    branchAddress: branch?.address ?? undefined,
    name: row.name,
    category: row.category === 'Folding Bike' ? 'Folding Bike' : 'Mountain Bike (MTB)',
    status: row.status,
    notes: row.description ?? '',
    qrCode: row.qr_code,
  };
}

function mapRental(row: any): AdminTransaction {
  const items = (row.rental_items ?? []).map((item: any) => ({
    ...item,
    bike: relationOne(item.bikes),
  }));
  const unitIds = items.map((item: any) => item.bike?.bike_code).filter(Boolean);
  const returnConditions: Record<string, ReturnCondition> = {};
  const returnNotes = items.map((item: any) => item.return_note).filter(Boolean).join('; ');
  items.forEach((item: any) => {
    if (item.bike?.bike_code && item.return_condition) {
      returnConditions[item.bike.bike_code] = item.return_condition;
    }
  });

  return {
    id: row.id,
    customerName: row.customer_name,
    phone: row.customer_phone ?? '',
    customerType: row.customer_type,
    unitIds,
    date: row.rental_date,
    startTime: timeLabel(row.started_at),
    estimatedEnd: timeLabel(row.estimated_end_at),
    durationHours: Number(row.duration_hours ?? 0),
    dayType: row.day_type,
    hourlyRate: Number(row.hourly_rate ?? 0),
    total: Number(row.total ?? 0),
    paymentMethod: row.payment_method,
    paymentStatus: row.payment_status,
    guaranteeType: row.guarantee_type,
    status: row.status,
    returnTime: timeLabel(row.returned_at),
    returnConditions,
    returnNotes,
  };
}

function mapExpense(row: any): AdminExpense {
  const bike = relationOne(row.bikes);
  return {
    id: row.id,
    category: row.category,
    amount: Number(row.amount),
    date: row.expense_date,
    description: row.description ?? '',
    relatedUnitId: bike?.bike_code ?? undefined,
  };
}

function mapMaintenance(row: any): AdminMaintenance {
  const bike = relationOne(row.bikes);
  return {
    id: row.id,
    unitId: bike?.bike_code ?? row.bike_id,
    type: row.type,
    note: row.note ?? '',
    status: row.status,
    date: row.maintenance_date,
  };
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const { user, profile, loading: authLoading } = useAuth();
  const [bikes, setBikes] = useState<AdminBike[]>([]);
  const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
  const [expenses, setExpenses] = useState<AdminExpense[]>([]);
  const [maintenance, setMaintenance] = useState<AdminMaintenance[]>([]);
  const [pricingRates, setPricingRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshData = useCallback(async () => {
    if (!user || profile?.role !== 'admin') {
      setBikes([]);
      setTransactions([]);
      setExpenses([]);
      setMaintenance([]);
      setPricingRates({});
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [bikeResult, rentalResult, expenseResult, maintenanceResult, pricingResult] = await Promise.all([
        db.from('bikes').select('*, branches(name, address)').order('bike_code'),
        db.from('rentals').select('*, rental_items(id, bike_id, return_condition, return_note, returned_at, bikes(bike_code, name, category))').order('created_at', { ascending: false }),
        db.from('expenses').select('*, bikes(bike_code)').order('expense_date', { ascending: false }),
        db.from('maintenance').select('*, bikes(bike_code)').order('maintenance_date', { ascending: false }),
        db.from('pricing_rules').select('customer_type, day_type, hourly_rate').eq('is_active', true),
      ]);
      const firstError = bikeResult.error ?? rentalResult.error ?? expenseResult.error ?? maintenanceResult.error ?? pricingResult.error;
      if (firstError) throw firstError;

      setBikes((bikeResult.data ?? []).map(mapBike));
      setTransactions((rentalResult.data ?? []).map(mapRental));
      setExpenses((expenseResult.data ?? []).map(mapExpense));
      setMaintenance((maintenanceResult.data ?? []).map(mapMaintenance));
      const nextRates: Record<string, number> = {};
      (pricingResult.data ?? []).forEach((rule: any) => { nextRates[`${rule.customer_type}|${rule.day_type}`] = Number(rule.hourly_rate); });
      setPricingRates(nextRates);
    } catch (err: any) {
      const message = err?.message ?? 'Gagal memuat data operasional dari Supabase.';
      setError(message);
      console.error('Admin data load:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id, profile?.role]);

  useEffect(() => {
    if (authLoading) return;
    void refreshData();
  }, [authLoading, refreshData]);

  const activeBranchId = useCallback(async (): Promise<string> => {
    const { data, error: branchError } = await db
      .from('branches')
      .select('id')
      .eq('is_active', true)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();
    if (branchError) throw branchError;
    if (!data?.id) throw new Error('Belum ada cabang aktif. Tambahkan atau aktifkan cabang terlebih dahulu.');
    return data.id;
  }, []);

  const addBike = useCallback(async (input: BikeForm) => {
    const branchId = await activeBranchId();
    const { data: defaultPricing, error: pricingError } = await db.from('pricing_rules')
      .select('hourly_rate')
      .eq('customer_type', 'Umum')
      .eq('day_type', 'Hari biasa')
      .eq('is_active', true)
      .limit(1)
      .maybeSingle();
    if (pricingError) throw pricingError;
    const { data: existingCodes, error: latestError } = await db.from('bikes').select('bike_code');
    if (latestError) throw latestError;
    const lastNumber = (existingCodes ?? []).reduce((max: number, row: any) => {
      const number = Number(String(row.bike_code ?? '').match(/(\d+)$/)?.[1] ?? 0);
      return Math.max(max, number);
    }, 0);
    const bikeCode = `B-${String(lastNumber + 1).padStart(3, '0')}`;
    const { data, error: insertError } = await db.from('bikes').insert({
      bike_code: bikeCode,
      name: input.name,
      category: input.category,
      branch_id: branchId,
      status: 'Tersedia',
      hourly_rate: Number(defaultPricing?.hourly_rate ?? getHourlyRate('Umum', 'Hari biasa')),
      description: input.notes,
      qr_code: `JAMAL-${bikeCode}`,
    }).select('*, branches(name, address)').single();
    if (insertError) throw insertError;
    const bike = mapBike(data);
    setBikes((current) => [...current, bike]);
    return bike;
  }, [activeBranchId]);

  const updateBike = useCallback(async (id: string, input: BikeForm) => {
    const bike = bikes.find((item) => item.id === id);
    if (!bike?.dbId) throw new Error('ID sepeda di database tidak ditemukan.');
    const { error: updateError } = await db.from('bikes').update({
      name: input.name,
      category: input.category,
      description: input.notes,
      updated_at: new Date().toISOString(),
    }).eq('id', bike.dbId);
    if (updateError) throw updateError;
    setBikes((current) => current.map((item) => item.id === id ? { ...item, ...input } : item));
  }, [bikes]);

  const createTransaction = useCallback(async (input: CreateTransactionInput) => {
    const selectedBikes = input.unitIds.map((id) => bikes.find((bike) => bike.id === id)).filter(Boolean) as AdminBike[];
    if (selectedBikes.length !== input.unitIds.length || selectedBikes.some((bike) => !bike.dbId)) {
      throw new Error('Satu atau beberapa unit tidak ditemukan di database. Muat ulang halaman dan coba lagi.');
    }
    if (selectedBikes.some((bike) => bike.status !== 'Tersedia')) {
      throw new Error('Ada unit yang sudah tidak tersedia. Silakan pilih unit lain.');
    }
    const selectedDatabaseIds = selectedBikes.map((bike) => bike.dbId);
    const { data: activeItems, error: activeItemsError } = await db.from('rental_items')
      .select('bike_id, rentals(status)')
      .in('bike_id', selectedDatabaseIds);
    if (activeItemsError) throw activeItemsError;
    const reserved = (activeItems ?? []).some((item: any) => {
      const rental = relationOne(item.rentals);
      return rental && rental.status !== 'Selesai';
    });
    if (reserved) throw new Error('Salah satu unit sudah tercatat dalam transaksi yang belum selesai. Muat ulang daftar unit.');
    const branchIds = [...new Set(selectedBikes.map((bike) => bike.branchId).filter(Boolean))];
    if (branchIds.length !== 1) throw new Error('Semua unit dalam satu transaksi harus berasal dari cabang yang sama.');

    const { data: pricing, error: pricingError } = await db.from('pricing_rules')
      .select('hourly_rate')
      .eq('customer_type', input.customerType)
      .eq('day_type', input.dayType)
      .eq('is_active', true)
      .limit(1)
      .maybeSingle();
    if (pricingError) throw pricingError;
    const hourlyRate = Number(pricing?.hourly_rate ?? getHourlyRate(input.customerType, input.dayType));
    const { data: matchingProfiles, error: profileError } = await db.from('profiles').select('id, phone')
      .not('phone', 'is', null);
    if (profileError) throw profileError;
    const normalizedPhone = normalizePhone(input.phone);
    const matchedProfile = (matchingProfiles ?? []).find((item: any) => normalizePhone(item.phone ?? '') === normalizedPhone);

    const rentalPayload: any = {
      user_id: matchedProfile?.id ?? null,
      branch_id: branchIds[0],
      customer_name: input.customerName,
      customer_phone: input.phone,
      customer_type: input.customerType,
      rental_date: localDate(),
      started_at: null,
      estimated_end_at: null,
      returned_at: null,
      duration_hours: input.durationHours,
      hourly_rate: hourlyRate,
      total: hourlyRate * input.durationHours * selectedBikes.length,
      day_type: input.dayType,
      payment_method: input.paymentMethod,
      payment_status: input.paymentStatus,
      guarantee_type: input.guaranteeType,
      status: 'Menunggu Serah Terima',
      created_by: user?.id,
    };
    const { data: rental, error: rentalError } = await db.from('rentals').insert(rentalPayload).select('*').single();
    if (rentalError) throw rentalError;

    const { error: itemError } = await db.from('rental_items').insert(
      selectedBikes.map((bike) => ({ rental_id: rental.id, bike_id: bike.dbId }))
    );
    if (itemError) {
      await db.from('rentals').delete().eq('id', rental.id);
      throw itemError;
    }

    const transaction: AdminTransaction = {
      id: rental.id,
      customerName: input.customerName,
      phone: input.phone,
      customerType: input.customerType,
      unitIds: input.unitIds,
      date: rental.rental_date,
      startTime: '-',
      estimatedEnd: '-',
      durationHours: input.durationHours,
      dayType: input.dayType,
      hourlyRate,
      total: Number(rental.total),
      paymentMethod: input.paymentMethod,
      paymentStatus: input.paymentStatus,
      guaranteeType: input.guaranteeType,
      status: 'Menunggu Serah Terima',
    };
    setTransactions((current) => [transaction, ...current]);
    await refreshData();
    return transaction;
  }, [bikes, refreshData, user?.id]);

  const markTransactionPaid = useCallback(async (id: string) => {
    const { error: updateError } = await db.from('rentals').update({ payment_status: 'Lunas', updated_at: new Date().toISOString() }).eq('id', id);
    if (updateError) throw updateError;
    await refreshData();
  }, [refreshData]);

  const confirmHandover = useCallback(async (id: string) => {
    const transaction = transactions.find((item) => item.id === id);
    if (!transaction) throw new Error('Transaksi tidak ditemukan.');
    if (transaction.paymentStatus !== 'Lunas') throw new Error('Pembayaran harus berstatus Lunas sebelum serah terima.');
    const now = new Date();
    const estimatedEnd = new Date(now.getTime() + transaction.durationHours * 60 * 60 * 1000);
    const ids = bikes.filter((bike) => transaction.unitIds.includes(bike.id)).map((bike) => bike.dbId).filter(Boolean);
    const { error: bikeError } = await db.from('bikes').update({ status: 'Sedang Disewa', updated_at: now.toISOString() }).in('id', ids);
    if (bikeError) throw bikeError;
    const { error: rentalError } = await db.from('rentals').update({
      status: 'Sedang Berlangsung',
      started_at: now.toISOString(),
      estimated_end_at: estimatedEnd.toISOString(),
      updated_at: now.toISOString(),
    }).eq('id', id);
    if (rentalError) throw rentalError;
    await refreshData();
  }, [transactions, bikes, refreshData]);

  const completeReturn = useCallback(async (id: string, conditions: Record<string, ReturnCondition>, notes: string) => {
    const transaction = transactions.find((item) => item.id === id);
    if (!transaction) throw new Error('Transaksi tidak ditemukan.');
    const now = new Date().toISOString();
    const items = bikes.filter((bike) => transaction.unitIds.includes(bike.id));
    for (const bike of items) {
      if (!bike.dbId) continue;
      const condition = conditions[bike.id] ?? 'Baik';
      const { error: itemError } = await db.from('rental_items').update({
        return_condition: condition,
        return_note: notes || null,
        returned_at: now,
      }).eq('rental_id', id).eq('bike_id', bike.dbId);
      if (itemError) throw itemError;
      const nextStatus = condition === 'Baik' ? 'Tersedia' : 'Perawatan';
      const { error: bikeError } = await db.from('bikes').update({ status: nextStatus, updated_at: now }).eq('id', bike.dbId);
      if (bikeError) throw bikeError;
      if (condition !== 'Baik') {
        const { error: maintenanceError } = await db.from('maintenance').insert({
          bike_id: bike.dbId,
          type: 'Perbaikan',
          note: notes || `Hasil pemeriksaan pengembalian: ${condition}.`,
          status: 'Menunggu',
          maintenance_date: localDate(),
          created_by: user?.id,
        });
        if (maintenanceError) throw maintenanceError;
      }
    }
    const { error: rentalError } = await db.from('rentals').update({
      status: 'Selesai', returned_at: now, updated_at: now,
    }).eq('id', id);
    if (rentalError) throw rentalError;
    await refreshData();
  }, [transactions, bikes, refreshData, user?.id]);

  const addExpense = useCallback(async (input: ExpenseInput) => {
    const relatedBike = input.relatedUnitId ? bikes.find((bike) => bike.id === input.relatedUnitId) : undefined;
    const branchId = relatedBike?.branchId ?? await activeBranchId();
    const { error: insertError } = await db.from('expenses').insert({
      branch_id: branchId,
      related_bike_id: relatedBike?.dbId ?? null,
      category: input.category,
      amount: input.amount,
      expense_date: input.date,
      description: input.description,
      created_by: user?.id,
    });
    if (insertError) throw insertError;
    await refreshData();
  }, [bikes, activeBranchId, refreshData, user?.id]);

  const updateExpense = useCallback(async (id: string, input: ExpenseInput) => {
    const relatedBike = input.relatedUnitId ? bikes.find((bike) => bike.id === input.relatedUnitId) : undefined;
    const branchId = relatedBike?.branchId ?? await activeBranchId();
    const { error: updateError } = await db.from('expenses').update({
      branch_id: branchId,
      related_bike_id: relatedBike?.dbId ?? null,
      category: input.category,
      amount: input.amount,
      expense_date: input.date,
      description: input.description,
    }).eq('id', id);
    if (updateError) throw updateError;
    await refreshData();
  }, [bikes, activeBranchId, refreshData]);

  const startMaintenance = useCallback(async (id: string, type: MaintenanceType, note: string) => {
    const now = new Date().toISOString();
    const { error: updateError } = await db.from('maintenance').update({
      type, note, status: 'Sedang Dikerjakan', started_at: now,
    }).eq('id', id);
    if (updateError) throw updateError;
    await refreshData();
  }, [refreshData]);

  const completeMaintenance = useCallback(async (id: string, fitToUse: boolean) => {
    const { data: record, error: readError } = await db.from('maintenance').select('bike_id').eq('id', id).single();
    if (readError) throw readError;
    const now = new Date().toISOString();
    const { error: updateError } = await db.from('maintenance').update({ status: 'Selesai', completed_at: now }).eq('id', id);
    if (updateError) throw updateError;
    const { error: bikeError } = await db.from('bikes').update({ status: fitToUse ? 'Tersedia' : 'Perawatan', updated_at: now }).eq('id', record.bike_id);
    if (bikeError) throw bikeError;
    await refreshData();
  }, [refreshData]);

  const value = useMemo(() => ({
    bikes, transactions, expenses, maintenance, pricingRates, loading, error, refreshData,
    addBike, updateBike, createTransaction, markTransactionPaid, confirmHandover,
    completeReturn, addExpense, updateExpense, startMaintenance, completeMaintenance,
  }), [bikes, transactions, expenses, maintenance, pricingRates, loading, error, refreshData, addBike, updateBike, createTransaction, markTransactionPaid, confirmHandover, completeReturn, addExpense, updateExpense, startMaintenance, completeMaintenance]);

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const value = useContext(AdminContext);
  if (!value) throw new Error('useAdmin harus digunakan di dalam AdminProvider.');
  return value;
}
