
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import type { ReactNode } from 'react';

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

import { getBikes } from '../services/bikeService';

import {
  getTransactions,
  createTransaction as createTransactionService,
  updatePaymentStatus,
  searchRegisteredCustomerByPhone,
} from '../services/transactionService';

import { confirmRentalHandover } from '../services/rentalHandoverService';

import {
  completeRentalReturn,
} from '../services/rentalReturnService';

// =====================================================
// TYPES
// =====================================================

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

type BikeForm = Pick<
  AdminBike,
  'name' | 'category' | 'notes'
>;

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

  createTransaction: (
    input: CreateTransactionInput,
  ) => Promise<AdminTransaction>;

  markTransactionPaid: (id: string) => Promise<void>;
  confirmHandover: (id: string) => Promise<void>;

  completeReturn: (
    id: string,
    conditions: Record<string, ReturnCondition>,
    notes: string,
  ) => Promise<void>;

  addExpense: (input: ExpenseInput) => Promise<void>;
  updateExpense: (
    id: string,
    input: ExpenseInput,
  ) => Promise<void>;

  startMaintenance: (
    id: string,
    type: MaintenanceType,
    note: string,
  ) => Promise<void>;

  completeMaintenance: (
    id: string,
    fitToUse: boolean,
  ) => Promise<void>;
}

// =====================================================
// CONTEXT
// =====================================================

const AdminContext = createContext<
  AdminContextValue | undefined
>(undefined);

// =====================================================
// DATABASE HELPER
// =====================================================

const db: any = supabase;

function normalizePhone(value: string): string {
  let digits = (value ?? '').replace(/\D/g, '');

  if (digits.startsWith('62')) {
    digits = `0${digits.slice(2)}`;
  } else if (digits.startsWith('8')) {
    digits = `0${digits}`;
  }

  return digits;
}

function timeLabel(value?: string | null): string {
  if (!value) return '-';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return `${String(date.getHours()).padStart(2, '0')}.${String(
    date.getMinutes(),
  ).padStart(2, '0')} WIB`;
}

function localDate(): string {
  const now = new Date();

  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-');
}

function createDefaultPricingRates(): Record<string, number> {
  return {
    'Pelajar|Hari biasa': getHourlyRate(
      'Pelajar',
      'Hari biasa',
    ),
    'Pelajar|Hari libur': getHourlyRate(
      'Pelajar',
      'Hari libur',
    ),
    'Umum|Hari biasa': getHourlyRate(
      'Umum',
      'Hari biasa',
    ),
    'Umum|Hari libur': getHourlyRate(
      'Umum',
      'Hari libur',
    ),
  };
}

// =====================================================
// DATA MAPPING
// =====================================================

function mapBike(row: any): AdminBike {
  return {
    id: row.id,
    dbId: row.id,

    name: row.name ?? '',
    category: row.category,
    status: row.status,

    notes: row.description ?? '',
    qrCode: row.qr_code ?? '',
  } as AdminBike;
}

function mapTransaction(
  row: any,
  transactionItems: any[],
): AdminTransaction {
  const items = transactionItems.filter(
    (item) => item.transaction_id === row.id,
  );

  const unitIds = items.map(
    (item) => item.bike_id,
  );

  const returnConditions: Record<string, ReturnCondition> = {};

  const returnNotes = items
    .map((item) => item.return_note)
    .filter(Boolean)
    .join('; ');

  items.forEach((item) => {
    if (item.bike_id && item.return_condition) {
      returnConditions[item.bike_id] =
        item.return_condition as ReturnCondition;
    }
  });

  return {
    id: row.id,

    customerName: row.customer_name ?? '',
    phone: row.phone ?? '',
    customerType: row.customer_type,

    unitIds,

    date: row.rental_date,
    startTime:
      row.status === 'Menunggu Serah Terima'
        ? '-'
        : timeLabel(row.rental_date),

    estimatedEnd: timeLabel(row.estimated_end),

    durationHours: Number(row.duration_hours ?? 0),
    dayType: row.day_type,

    hourlyRate: Number(row.hourly_rate ?? 0),
    total: Number(row.total ?? 0),

    paymentMethod: row.payment_method,
    paymentStatus: row.payment_status,
    guaranteeType: row.guarantee_type,

    status: row.status,

    returnTime: timeLabel(row.actual_return_time),
    returnConditions,
    returnNotes,
  } as AdminTransaction;
}

function mapExpense(
  row: any,
  bikes: AdminBike[],
): AdminExpense {
  const relatedBikeId =
    row.related_bike_id ?? row.bike_id ?? null;

  const relatedBike = bikes.find(
    (bike) => bike.id === relatedBikeId,
  );

  return {
    id: row.id,
    category: row.category,
    amount: Number(row.amount ?? 0),
    date: row.expense_date,
    description: row.description ?? '',
    relatedUnitId: relatedBike?.id ?? undefined,
  } as AdminExpense;
}

function mapMaintenance(
  row: any,
  bikes: AdminBike[],
): AdminMaintenance {
  const relatedBike = bikes.find(
    (bike) => bike.id === row.bike_id,
  );

  return {
    id: row.id,
    unitId: relatedBike?.id ?? row.bike_id,
    type: row.type,
    note: row.note ?? '',
    status: row.status,
    date: row.maintenance_date,
  } as AdminMaintenance;
}

// =====================================================
// PROVIDER
// =====================================================

export function AdminProvider({
  children,
}: {
  children: ReactNode;
}) {
  const {
    user,
    profile,
    loading: authLoading,
  } = useAuth();

  const [bikes, setBikes] = useState<AdminBike[]>([]);
  const [transactions, setTransactions] = useState<
    AdminTransaction[]
  >([]);

  const [expenses, setExpenses] = useState<AdminExpense[]>([]);
  const [maintenance, setMaintenance] = useState<
    AdminMaintenance[]
  >([]);

  const [pricingRates, setPricingRates] = useState<
    Record<string, number>
  >(createDefaultPricingRates);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ===================================================
  // REFRESH ALL ADMIN DATA
  // ===================================================

  const refreshData = useCallback(async () => {
    if (!user || profile?.role !== 'admin') {
      setBikes([]);
      setTransactions([]);
      setExpenses([]);
      setMaintenance([]);
      setPricingRates(createDefaultPricingRates());
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      /*
       * Ambil data sepeda dan transaksi melalui service.
       * Tidak menggunakan nested relationship untuk
       * mengambil data transaksi.
       */
      const [
        bikeData,
        transactionData,
        itemResult,
        expenseResult,
        maintenanceResult,
      ] = await Promise.all([
        getBikes(),
        getTransactions(),

        db
          .from('transaction_items')
          .select(
            'id, transaction_id, bike_id, return_condition, return_note',
          ),

        db
          .from('expenses')
          .select('*')
          .order('expense_date', { ascending: false }),

        db
          .from('maintenance')
          .select('*')
          .order('maintenance_date', { ascending: false }),
      ]);

      if (itemResult.error) {
        throw itemResult.error;
      }

      if (expenseResult.error) {
        throw expenseResult.error;
      }

      if (maintenanceResult.error) {
        throw maintenanceResult.error;
      }

      const mappedBikes = (bikeData ?? []).map(
        (bike: any) => mapBike(bike),
      );

      const mappedTransactions = (transactionData ?? []).map(
        (transaction: any) =>
          mapTransaction(
            transaction,
            itemResult.data ?? [],
          ),
      );

      const mappedExpenses = (expenseResult.data ?? []).map(
        (expense: any) =>
          mapExpense(expense, mappedBikes),
      );

      const mappedMaintenance = (
        maintenanceResult.data ?? []
      ).map((record: any) =>
        mapMaintenance(record, mappedBikes),
      );

      setBikes(mappedBikes);
      setTransactions(mappedTransactions);
      setExpenses(mappedExpenses);
      setMaintenance(mappedMaintenance);
    } catch (err: any) {
      const message =
        err?.message ??
        'Gagal memuat data operasional dari Supabase.';

      setError(message);

      console.error('Admin data load error:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id, profile?.role]);

  useEffect(() => {
    if (authLoading) return;

    void refreshData();
  }, [authLoading, refreshData]);

  // ===================================================
  // BIKE MANAGEMENT
  // ===================================================

  const addBike = useCallback(
    async (input: BikeForm): Promise<AdminBike> => {
      if (!user || profile?.role !== 'admin') {
        throw new Error('Hanya Admin yang dapat menambahkan sepeda.');
      }

      if (!input.name.trim()) {
        throw new Error('Nama sepeda wajib diisi.');
      }

      const { data: existingBikes, error: readError } =
        await db.from('bikes').select('id');

      if (readError) throw readError;

      const lastNumber = (existingBikes ?? []).reduce(
        (max: number, row: any) => {
          const number = Number(
            String(row.id ?? '').match(/(\d+)$/)?.[1] ?? 0,
          );

          return Math.max(max, number);
        },
        0,
      );

      const bikeId = `B-${String(lastNumber + 1).padStart(3, '0')}`;

      const { data, error: insertError } = await db
        .from('bikes')
        .insert({
          id: bikeId,
          name: input.name.trim(),
          category: input.category,
          status: 'Tersedia',
          description: input.notes?.trim() ?? '',
          qr_code: `JAMAL-${bikeId}`,
        })
        .select('*')
        .single();

      if (insertError) throw insertError;

      const newBike = mapBike(data);

      setBikes((current) => [...current, newBike]);

      return newBike;
    },
    [user?.id, profile?.role],
  );

  const updateBike = useCallback(
    async (id: string, input: BikeForm): Promise<void> => {
      if (!user || profile?.role !== 'admin') {
        throw new Error('Hanya Admin yang dapat mengubah data sepeda.');
      }

      const { error: updateError } = await db
        .from('bikes')
        .update({
          name: input.name.trim(),
          category: input.category,
          description: input.notes?.trim() ?? '',
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (updateError) throw updateError;

      setBikes((current) =>
        current.map((bike) =>
          bike.id === id
            ? {
                ...bike,
                ...input,
              }
            : bike,
        ),
      );
    },
    [user?.id, profile?.role],
  );

  // ===================================================
  // CREATE TRANSACTION
  // ===================================================

  const createTransaction = useCallback(
    async (
      input: CreateTransactionInput,
    ): Promise<AdminTransaction> => {
      if (!user || profile?.role !== 'admin') {
        throw new Error('Hanya Admin yang dapat membuat transaksi.');
      }

      if (!input.unitIds.length) {
        throw new Error('Pilih minimal satu sepeda.');
      }

      const selectedBikes = input.unitIds.map((id) =>
        bikes.find((bike) => bike.id === id),
      );

      if (selectedBikes.some((bike) => !bike)) {
        throw new Error(
          'Satu atau beberapa sepeda tidak ditemukan. Muat ulang data.',
        );
      }

      if (
        selectedBikes.some(
          (bike) => bike?.status !== 'Tersedia',
        )
      ) {
        throw new Error(
          'Ada sepeda yang sudah tidak tersedia.',
        );
      }

      const hourlyRate =
        pricingRates[
          `${input.customerType}|${input.dayType}`
        ] ??
        getHourlyRate(input.customerType, input.dayType);

      // Cari akun pelanggan berdasarkan nomor telepon.
      const registeredCustomer =
        await searchRegisteredCustomerByPhone(input.phone);

      // Pembuatan transaksi dilakukan melalui RPC service.
      const transactionId = await createTransactionService({
        userId: registeredCustomer?.id ?? null,
        customerName: input.customerName,
        phone: input.phone,
        customerType: input.customerType,
        bikeIds: input.unitIds,
        durationHours: input.durationHours,
        dayType: input.dayType,
        hourlyRate,
        paymentMethod: input.paymentMethod,
        paymentStatus: input.paymentStatus,
        guaranteeType: input.guaranteeType,
      });

      await refreshData();

      const createdTransaction = transactions.find(
        (transaction) => transaction.id === transactionId,
      );

      if (createdTransaction) {
        return createdTransaction;
      }

      // Jika state belum sempat diperbarui, buat hasil sementara.
      return {
        id: transactionId,
        customerName: input.customerName,
        phone: input.phone,
        customerType: input.customerType,
        unitIds: input.unitIds,
        date: new Date().toISOString(),
        startTime: '-',
        estimatedEnd: '-',
        durationHours: input.durationHours,
        dayType: input.dayType,
        hourlyRate,
        total:
          hourlyRate *
          input.durationHours *
          input.unitIds.length,
        paymentMethod: input.paymentMethod,
        paymentStatus: input.paymentStatus,
        guaranteeType: input.guaranteeType,
        status: 'Menunggu Serah Terima',
        returnTime: '-',
        returnConditions: {},
        returnNotes: '',
      } as AdminTransaction;
    },
    [
      user?.id,
      profile?.role,
      bikes,
      pricingRates,
      refreshData,
      transactions,
    ],
  );

  // ===================================================
  // UPDATE PAYMENT
  // ===================================================

  const markTransactionPaid = useCallback(
    async (id: string): Promise<void> => {
      if (!user || profile?.role !== 'admin') {
        throw new Error('Hanya Admin yang dapat mengubah pembayaran.');
      }

      await updatePaymentStatus(id, 'Lunas');

      await refreshData();
    },
    [user?.id, profile?.role, refreshData],
  );

  // ===================================================
  // CONFIRM HANDOVER
  // ===================================================

  const confirmHandover = useCallback(
    async (id: string): Promise<void> => {
      if (!user || profile?.role !== 'admin') {
        throw new Error('Hanya Admin yang dapat melakukan serah terima.');
      }

      const transaction = transactions.find(
        (item) => item.id === id,
      );

      if (!transaction) {
        throw new Error('Transaksi tidak ditemukan.');
      }

      if (transaction.status !== 'Menunggu Serah Terima') {
        throw new Error(
          'Transaksi tidak berada dalam status menunggu serah terima.',
        );
      }

      if (transaction.paymentStatus !== 'Lunas') {
        throw new Error(
          'Pembayaran harus berstatus Lunas sebelum serah terima.',
        );
      }

      // Menggunakan RPC atomik yang sudah dibuat.
      await confirmRentalHandover(id);

      await refreshData();
    },
    [
      user?.id,
      profile?.role,
      transactions,
      refreshData,
    ],
  );

  // ===================================================
  // COMPLETE RETURN
  // ===================================================

  const completeReturn = useCallback(
    async (
      id: string,
      conditions: Record<string, ReturnCondition>,
      notes: string,
    ): Promise<void> => {
      if (!user || profile?.role !== 'admin') {
        throw new Error('Hanya Admin yang dapat memproses pengembalian.');
      }

      const transaction = transactions.find(
        (item) => item.id === id,
      );

      if (!transaction) {
        throw new Error('Transaksi tidak ditemukan.');
      }

      if (transaction.status !== 'Sedang Berlangsung') {
        throw new Error(
          'Hanya transaksi yang sedang berlangsung yang dapat dikembalikan.',
        );
      }

      if (!transaction.unitIds.length) {
        throw new Error(
          'Tidak ditemukan sepeda pada transaksi ini.',
        );
      }

      const returnItems = transaction.unitIds.map((bikeId) => ({
        bikeId,
        condition: conditions[bikeId] ?? 'Baik',
        note: notes.trim() || undefined,
      }));

      // Satu RPC untuk mengembalikan transaksi dan seluruh sepeda.
      await completeRentalReturn(
        id,
        notes,
        returnItems as any,
      );

      await refreshData();
    },
    [
      user?.id,
      profile?.role,
      transactions,
      refreshData,
    ],
  );

  // ===================================================
  // EXPENSE MANAGEMENT
  // ===================================================

  const addExpense = useCallback(
    async (input: ExpenseInput): Promise<void> => {
      if (!user || profile?.role !== 'admin') {
        throw new Error('Hanya Admin yang dapat menambahkan pengeluaran.');
      }

      const relatedBike = input.relatedUnitId
        ? bikes.find((bike) => bike.id === input.relatedUnitId)
        : undefined;

      const { error: insertError } = await db
        .from('expenses')
        .insert({
          related_bike_id: relatedBike?.id ?? null,
          category: input.category,
          amount: input.amount,
          expense_date: input.date,
          description: input.description,
          created_by: user.id,
        });

      if (insertError) throw insertError;

      await refreshData();
    },
    [user?.id, profile?.role, bikes, refreshData],
  );

  const updateExpense = useCallback(
    async (
      id: string,
      input: ExpenseInput,
    ): Promise<void> => {
      if (!user || profile?.role !== 'admin') {
        throw new Error('Hanya Admin yang dapat mengubah pengeluaran.');
      }

      const relatedBike = input.relatedUnitId
        ? bikes.find((bike) => bike.id === input.relatedUnitId)
        : undefined;

      const { error: updateError } = await db
        .from('expenses')
        .update({
          related_bike_id: relatedBike?.id ?? null,
          category: input.category,
          amount: input.amount,
          expense_date: input.date,
          description: input.description,
        })
        .eq('id', id);

      if (updateError) throw updateError;

      await refreshData();
    },
    [user?.id, profile?.role, bikes, refreshData],
  );

  // ===================================================
  // MAINTENANCE MANAGEMENT
  // ===================================================

  const startMaintenance = useCallback(
    async (
      id: string,
      type: MaintenanceType,
      note: string,
    ): Promise<void> => {
      if (!user || profile?.role !== 'admin') {
        throw new Error('Hanya Admin yang dapat memproses maintenance.');
      }

      const { error: updateError } = await db
        .from('maintenance')
        .update({
          type,
          note,
          status: 'Sedang Dikerjakan',
          started_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (updateError) throw updateError;

      await refreshData();
    },
    [user?.id, profile?.role, refreshData],
  );

  const completeMaintenance = useCallback(
    async (
      id: string,
      fitToUse: boolean,
    ): Promise<void> => {
      if (!user || profile?.role !== 'admin') {
        throw new Error('Hanya Admin yang dapat menyelesaikan maintenance.');
      }

      const { data: record, error: readError } = await db
        .from('maintenance')
        .select('bike_id')
        .eq('id', id)
        .single();

      if (readError) throw readError;

      const now = new Date().toISOString();

      const { error: updateError } = await db
        .from('maintenance')
        .update({
          status: 'Selesai',
          completed_at: now,
        })
        .eq('id', id);

      if (updateError) throw updateError;

      const { error: bikeError } = await db
        .from('bikes')
        .update({
          status: fitToUse ? 'Tersedia' : 'Perawatan',
          updated_at: now,
        })
        .eq('id', record.bike_id);

      if (bikeError) throw bikeError;

      await refreshData();
    },
    [user?.id, profile?.role, refreshData],
  );

  // ===================================================
  // CONTEXT VALUE
  // ===================================================

  const value = useMemo<AdminContextValue>(
    () => ({
      bikes,
      transactions,
      expenses,
      maintenance,
      pricingRates,

      loading,
      error,

      refreshData,

      addBike,
      updateBike,

      createTransaction,
      markTransactionPaid,
      confirmHandover,
      completeReturn,

      addExpense,
      updateExpense,

      startMaintenance,
      completeMaintenance,
    }),
    [
      bikes,
      transactions,
      expenses,
      maintenance,
      pricingRates,
      loading,
      error,
      refreshData,
      addBike,
      updateBike,
      createTransaction,
      markTransactionPaid,
      confirmHandover,
      completeReturn,
      addExpense,
      updateExpense,
      startMaintenance,
      completeMaintenance,
    ],
  );

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

// =====================================================
// CUSTOM HOOK
// =====================================================

export function useAdmin(): AdminContextValue {
  const context = useContext(AdminContext);

  if (!context) {
    throw new Error(
      'useAdmin harus digunakan di dalam AdminProvider.',
    );
  }

  return context;
}
