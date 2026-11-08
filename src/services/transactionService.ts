
import { supabase } from '../lib/supabase';

/* =========================================================
   TYPES
========================================================= */

export type CustomerType = 'Pelajar' | 'Umum';

export type DayType = 'Hari biasa' | 'Hari libur';

export type GuaranteeType =
  | 'Identitas Terverifikasi'
  | 'Sepeda Motor';

export type PaymentMethod = 'Tunai' | 'QRIS';

export type PaymentStatus = 'Lunas' | 'Belum Lunas';

export type TransactionStatus =
  | 'Menunggu Serah Terima'
  | 'Sedang Berlangsung'
  | 'Selesai';

export type ReturnCondition =
  | 'Baik'
  | 'Rusak ringan'
  | 'Rusak berat';

export interface Transaction {
  id: string;
  transaction_code: string;
  user_id: string | null;
  customer_name: string;
  phone: string;
  customer_type: CustomerType;
  rental_date: string;
  estimated_end: string;
  duration_hours: number;
  day_type: DayType;
  hourly_rate: number;
  total: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  guarantee_type: GuaranteeType;
  status: TransactionStatus;
  actual_return_time: string | null;
  return_notes: string | null;
  created_by: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface TransactionItem {
  id: string;
  transaction_id: string;
  bike_id: string;
  return_condition: ReturnCondition | null;
  return_note: string | null;
  created_at: string | null;
}

export interface TransactionItemWithBike extends TransactionItem {
  bikes: {
    id: string;
    name: string;
    category: string;
    image_url: string | null;
    status: string;
  } | null;
}

export interface TransactionWithItems extends Transaction {
  transaction_items: TransactionItemWithBike[];
}

export interface RegisteredCustomer {
  id: string;
  full_name: string;
  phone: string | null;
  customer_type: CustomerType;
  role: string;
}

export interface CreateTransactionInput {
  userId?: string | null;
  customerName: string;
  phone: string;
  customerType: CustomerType;
  bikeIds: string[];
  durationHours: number;
  dayType: DayType;
  hourlyRate: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  guaranteeType: GuaranteeType;
  rentalDate?: string;
}

/* =========================================================
   HELPERS
========================================================= */

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

function validateCustomerInput(
  input: CreateTransactionInput
): void {
  if (input.customerName.trim().length < 3) {
    throw new Error('Nama pelanggan minimal 3 karakter.');
  }

  const digits = normalizePhone(input.phone);

  if (digits.length < 9 || digits.length > 15) {
    throw new Error('Nomor WhatsApp harus terdiri dari 9–15 digit.');
  }

  if (!input.bikeIds.length) {
    throw new Error('Pilih minimal satu sepeda.');
  }

  if (new Set(input.bikeIds).size !== input.bikeIds.length) {
    throw new Error('Terdapat sepeda yang dipilih lebih dari satu kali.');
  }

  if (
    !Number.isFinite(input.durationHours) ||
    input.durationHours < 1 ||
    input.durationHours > 24
  ) {
    throw new Error('Durasi sewa harus antara 1 sampai 24 jam.');
  }

  if (!Number.isFinite(input.hourlyRate) || input.hourlyRate < 0) {
    throw new Error('Tarif per jam tidak valid.');
  }
}

/* =========================================================
   GET TRANSACTIONS - ADMIN
========================================================= */

/**
 * Mengambil seluruh transaksi.
 * Admin dapat melihat seluruh transaksi melalui RLS.
 */
export async function getTransactions(): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Gagal mengambil transaksi: ${error.message}`);
  }

  return (data ?? []) as Transaction[];
}

/* =========================================================
   GET TRANSACTION DETAIL
========================================================= */

/**
 * Mengambil detail transaksi beserta sepeda yang disewa.
 */
export async function getTransactionById(
  id: string
): Promise<TransactionWithItems | null> {
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      *,
      transaction_items (
        *,
        bikes (
          id,
          name,
          category,
          image_url,
          status
        )
      )
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new Error(`Gagal mengambil detail transaksi: ${error.message}`);
  }

  return data as unknown as TransactionWithItems | null;
}

/* =========================================================
   GET MY RENTAL HISTORY - USER
========================================================= */

/**
 * Mengambil riwayat penyewaan milik pengguna yang sedang login.
 * Transaksi guest tidak akan muncul di riwayat akun.
 */
export async function getMyTransactions(): Promise<Transaction[]> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw new Error(`Gagal memeriksa akun: ${authError.message}`);
  }

  if (!user) {
    throw new Error('Silakan login terlebih dahulu.');
  }

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('rental_date', { ascending: false });

  if (error) {
    throw new Error(`Gagal mengambil riwayat penyewaan: ${error.message}`);
  }

  return (data ?? []) as Transaction[];
}

/* =========================================================
   SEARCH REGISTERED CUSTOMER
========================================================= */

/**
 * Mencari akun pelanggan berdasarkan nomor WhatsApp.
 *
 * Fungsi ini digunakan Admin ketika membuat transaksi.
 * Pencocokan nomor dilakukan dengan normalisasi angka,
 * sehingga format 08xxx dan 08xx-xxx dapat dicocokkan.
 */
export async function searchRegisteredCustomerByPhone(
  phone: string
): Promise<RegisteredCustomer | null> {
  const digits = normalizePhone(phone);

  if (digits.length < 9 || digits.length > 15) {
    throw new Error('Nomor WhatsApp harus terdiri dari 9–15 digit.');
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, phone, customer_type, role')
    .not('phone', 'is', null);

  if (error) {
    throw new Error(`Gagal mencari pelanggan: ${error.message}`);
  }

  const customer = (data ?? []).find((profile) => {
    const profilePhone = normalizePhone(profile.phone ?? '');

    return (
      profilePhone === digits &&
      String(profile.role).toLowerCase() !== 'admin'
    );
  });

  return (customer as RegisteredCustomer | undefined) ?? null;
}

/* =========================================================
   CREATE TRANSACTION - ADMIN ONLY
========================================================= */

/**
 * Membuat transaksi melalui database function.
 *
 * Fungsi database:
 * admin_create_rental_transaction
 *
 * Transaksi dan seluruh item sepeda disimpan secara atomik.
 * Hanya Admin yang dapat membuat transaksi.
 */
export async function createTransaction(
  input: CreateTransactionInput
): Promise<string> {
  validateCustomerInput(input);

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw new Error(`Gagal memeriksa akun: ${authError.message}`);
  }

  if (!user) {
    throw new Error('Admin harus login terlebih dahulu.');
  }

  const rentalDate = input.rentalDate
    ? new Date(input.rentalDate)
    : new Date();

  if (Number.isNaN(rentalDate.getTime())) {
    throw new Error('Tanggal penyewaan tidak valid.');
  }

  const estimatedEnd = new Date(
    rentalDate.getTime() +
      input.durationHours * 60 * 60 * 1000
  );

  const digits = normalizePhone(input.phone);

  const total =
    input.hourlyRate *
    input.durationHours *
    input.bikeIds.length;

  if (!Number.isFinite(total) || total < 0) {
    throw new Error('Total transaksi tidak valid.');
  }

  const { data, error } = await supabase.rpc(
    'admin_create_rental_transaction',
    {
      p_user_id: input.userId ?? null,
      p_customer_name: input.customerName.trim(),
      p_phone: digits,
      p_customer_type: input.customerType,
      p_rental_date: rentalDate.toISOString(),
      p_estimated_end: estimatedEnd.toISOString(),
      p_duration_hours: input.durationHours,
      p_day_type: input.dayType,
      p_hourly_rate: input.hourlyRate,
      p_total: total,
      p_payment_method: input.paymentMethod,
      p_payment_status: input.paymentStatus,
      p_guarantee_type: input.guaranteeType,
      p_bike_ids: input.bikeIds,
    }
  );

  if (error) {
    throw new Error(`Gagal membuat transaksi: ${error.message}`);
  }

  if (!data) {
    throw new Error('Transaksi gagal dibuat karena ID tidak ditemukan.');
  }

  return data as string;
}

/* =========================================================
   UPDATE PAYMENT STATUS - ADMIN
========================================================= */

/**
 * Memperbarui status pembayaran.
 */
export async function updatePaymentStatus(
  transactionId: string,
  paymentStatus: PaymentStatus
): Promise<Transaction> {
  const { data, error } = await supabase
    .from('transactions')
    .update({
      payment_status: paymentStatus,
      updated_at: new Date().toISOString(),
    })
    .eq('id', transactionId)
    .select()
    .single();

  if (error) {
    throw new Error(`Gagal memperbarui pembayaran: ${error.message}`);
  }

  return data as Transaction;
}

/* =========================================================
   UPDATE TRANSACTION STATUS - ADMIN
========================================================= */

/**
 * Memperbarui status transaksi.
 *
 * Catatan:
 * Gunakan fungsi ini hanya untuk perubahan status yang
 * tidak memerlukan perubahan status sepeda.
 *
 * Proses serah terima dan pengembalian akan dibuat melalui
 * fungsi khusus pada tahap integrasi detail transaksi.
 */
export async function updateTransactionStatus(
  transactionId: string,
  status: TransactionStatus
): Promise<Transaction> {
  const { data, error } = await supabase
    .from('transactions')
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', transactionId)
    .select()
    .single();

  if (error) {
    throw new Error(`Gagal memperbarui status transaksi: ${error.message}`);
  }

  return data as Transaction;
}
