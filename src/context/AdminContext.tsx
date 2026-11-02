import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  AdminBike, AdminExpense, AdminMaintenance, AdminTransaction, CustomerType, DayType,
  GuaranteeType, MaintenanceType, PaymentMethod, PaymentStatus,
  ReturnCondition, TransactionStatus, INITIAL_ADMIN_BIKES, INITIAL_ADMIN_EXPENSES,
  INITIAL_ADMIN_MAINTENANCE, INITIAL_ADMIN_TRANSACTIONS, getHourlyRate,
} from '../constants/adminDemo';

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

interface AdminContextValue {
  bikes: AdminBike[];
  transactions: AdminTransaction[];
  expenses: AdminExpense[];
  maintenance: AdminMaintenance[];
  addBike: (input: Pick<AdminBike, 'name' | 'category' | 'notes'>) => AdminBike;
  updateBike: (id: string, input: Pick<AdminBike, 'name' | 'category' | 'notes'>) => void;
  createTransaction: (input: CreateTransactionInput) => AdminTransaction;
  markTransactionPaid: (id: string) => void;
  confirmHandover: (id: string) => void;
  completeReturn: (id: string, conditions: Record<string, ReturnCondition>, notes: string) => void;
  addExpense: (input: Omit<AdminExpense, 'id'>) => void;
  updateExpense: (id: string, input: Omit<AdminExpense, 'id'>) => void;
  startMaintenance: (id: string, type: MaintenanceType, note: string) => void;
  completeMaintenance: (id: string, fitToUse: boolean) => void;
  updateCustomerProfile: (previousPhone: string, updates: { customerName?: string; phone?: string }) => void;
}

const AdminContext = createContext<AdminContextValue | undefined>(undefined);

function normalizePhone(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (digits.startsWith('62')) return `0${digits.slice(2)}`;
  if (digits.startsWith('8')) return `0${digits}`;
  return digits;
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [bikes, setBikes] = useState<AdminBike[]>(INITIAL_ADMIN_BIKES);
  const [transactions, setTransactions] = useState<AdminTransaction[]>(INITIAL_ADMIN_TRANSACTIONS);
  const [expenses, setExpenses] = useState<AdminExpense[]>(INITIAL_ADMIN_EXPENSES);
  const [maintenance, setMaintenance] = useState<AdminMaintenance[]>(INITIAL_ADMIN_MAINTENANCE);

  const addBike = useCallback((input: Pick<AdminBike, 'name' | 'category' | 'notes'>) => {
    const nextNumber = Math.max(20, ...bikes.map((bike) => Number(bike.id.slice(2)) || 0)) + 1;
    const id = `B-${String(nextNumber).padStart(3, '0')}`;
    const bike: AdminBike = { ...input, id, status: 'Tersedia', qrCode: `JAMAL-${id}` };
    setBikes((current) => [...current, bike]);
    return bike;
  }, [bikes]);

  const updateBike = useCallback((id: string, input: Pick<AdminBike, 'name' | 'category' | 'notes'>) => {
    setBikes((current) => current.map((bike) => bike.id === id ? { ...bike, ...input } : bike));
  }, []);

  const createTransaction = useCallback((input: CreateTransactionInput) => {
    const idNumber = Math.max(21, ...transactions.map((item) => Number(item.id.split('-').pop()) || 0)) + 1;
    const id = `TRX-2026-${String(idNumber).padStart(4, '0')}`;
    const hourlyRate = getHourlyRate(input.customerType, input.dayType);
    const total = hourlyRate * input.durationHours * input.unitIds.length;
    const transaction: AdminTransaction = {
      ...input,
      id,
      date: '2026-11-02',
      startTime: '-',
      estimatedEnd: '-',
      hourlyRate,
      total,
      status: 'Menunggu Serah Terima',
    };
    setTransactions((current) => [transaction, ...current]);
    return transaction;
  }, [transactions]);

  const markTransactionPaid = useCallback((id: string) => {
    setTransactions((current) => current.map((item) => item.id === id ? { ...item, paymentStatus: 'Lunas' } : item));
  }, []);

  const confirmHandover = useCallback((id: string) => {
    const now = new Date();
    const startTime = `${String(now.getHours()).padStart(2, '0')}.${String(now.getMinutes()).padStart(2, '0')} WIB`;
    setTransactions((current) => current.map((item) => item.id === id ? {
      ...item, status: 'Sedang Berlangsung', startTime,
      estimatedEnd: `${String((now.getHours() + item.durationHours) % 24).padStart(2, '0')}.${String(now.getMinutes()).padStart(2, '0')} WIB`,
    } : item));
    const transaction = transactions.find((item) => item.id === id);
    if (transaction) {
      setBikes((current) => current.map((bike) => transaction.unitIds.includes(bike.id) ? { ...bike, status: 'Sedang Disewa' } : bike));
    }
  }, [transactions]);

  const completeReturn = useCallback((id: string, conditions: Record<string, ReturnCondition>, notes: string) => {
    const transaction = transactions.find((item) => item.id === id);
    if (!transaction) return;
    setTransactions((current) => current.map((item) => item.id === id ? {
      ...item, status: 'Selesai', returnTime: 'Dikonfirmasi', returnConditions: conditions, returnNotes: notes,
    } : item));
    setBikes((current) => current.map((bike) => {
      if (!transaction.unitIds.includes(bike.id)) return bike;
      return { ...bike, status: conditions[bike.id] === 'Baik' ? 'Tersedia' : 'Perawatan' };
    }));
    Object.entries(conditions).forEach(([unitId, condition]) => {
      if (condition !== 'Baik') {
        setMaintenance((current) => [...current, {
          id: `MNT-${String(current.length + 1).padStart(3, '0')}`,
          unitId,
          type: 'Perbaikan',
          note: notes || `Hasil pemeriksaan pengembalian: ${condition}.`,
          status: 'Menunggu',
          date: '2026-11-02',
        }]);
      }
    });
  }, [transactions]);

  const addExpense = useCallback((input: Omit<AdminExpense, 'id'>) => {
    setExpenses((current) => [{ ...input, id: `EXP-${String(current.length + 1).padStart(3, '0')}` }, ...current]);
  }, []);

  const updateExpense = useCallback((id: string, input: Omit<AdminExpense, 'id'>) => {
    setExpenses((current) => current.map((item) => item.id === id ? { ...item, ...input } : item));
  }, []);

  const startMaintenance = useCallback((id: string, type: MaintenanceType, note: string) => {
    setMaintenance((current) => current.map((item) => item.id === id ? { ...item, type, note, status: 'Sedang Dikerjakan' } : item));
  }, []);

  const completeMaintenance = useCallback((id: string, fitToUse: boolean) => {
    const record = maintenance.find((item) => item.id === id);
    setMaintenance((current) => current.map((item) => item.id === id ? { ...item, status: 'Selesai' } : item));
    if (record) {
      setBikes((current) => current.map((bike) => bike.id === record.unitId ? { ...bike, status: fitToUse ? 'Tersedia' : 'Perawatan' } : bike));
    }
  }, [maintenance]);

  const updateCustomerProfile = useCallback((previousPhone: string, updates: { customerName?: string; phone?: string }) => {
    const previousKey = normalizePhone(previousPhone);
    setTransactions((current) => current.map((item) => normalizePhone(item.phone) === previousKey
      ? { ...item, customerName: updates.customerName ?? item.customerName, phone: updates.phone ?? item.phone }
      : item));
  }, []);

  const value = useMemo(() => ({
    bikes, transactions, expenses, maintenance, addBike, updateBike, createTransaction,
    markTransactionPaid, confirmHandover, completeReturn, addExpense, updateExpense, startMaintenance, completeMaintenance, updateCustomerProfile,
  }), [bikes, transactions, expenses, maintenance, addBike, updateBike, createTransaction, markTransactionPaid, confirmHandover, completeReturn, addExpense, updateExpense, startMaintenance, completeMaintenance, updateCustomerProfile]);

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const value = useContext(AdminContext);
  if (!value) throw new Error('useAdmin harus digunakan di dalam AdminProvider.');
  return value;
}
