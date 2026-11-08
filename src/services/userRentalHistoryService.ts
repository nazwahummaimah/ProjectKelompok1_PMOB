
import { supabase } from '../lib/supabase';

import type {
  TransactionWithItems,
} from './transactionService';

/**
 * Mengambil riwayat transaksi milik pengguna yang sedang login.
 *
 * Transaksi pelanggan tamu tidak akan muncul karena user_id-nya NULL.
 * RLS Supabase tetap menjadi lapisan keamanan utama.
 */
export async function getMyRentalHistory(): Promise<TransactionWithItems[]> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw new Error(
      `Gagal memeriksa akun: ${authError.message}`
    );
  }

  if (!user) {
    throw new Error('Silakan login terlebih dahulu.');
  }

  const { data, error } = await supabase
    .from('transactions')
    .select(`
      *,
      transaction_items (
        id,
        transaction_id,
        bike_id,
        return_condition,
        return_note,
        created_at,
        bikes (
          id,
          name,
          category,
          image_url,
          status
        )
      )
    `)
    .eq('user_id', user.id)
    .order('rental_date', { ascending: false });

  if (error) {
    throw new Error(
      `Gagal mengambil riwayat penyewaan: ${error.message}`
    );
  }

  return (data ?? []) as unknown as TransactionWithItems[];
}

/**
 * Mengambil satu detail transaksi milik pengguna yang sedang login.
 *
 * Filter ID dan user_id diterapkan bersamaan.
 * Pengguna tidak dapat membuka transaksi akun lain hanya dengan
 * mengganti parameter ID pada URL.
 */
export async function getMyRentalDetail(
  transactionId: string
): Promise<TransactionWithItems | null> {
  if (!transactionId?.trim()) {
    throw new Error('ID transaksi tidak valid.');
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw new Error(
      `Gagal memeriksa akun: ${authError.message}`
    );
  }

  if (!user) {
    throw new Error('Silakan login terlebih dahulu.');
  }

  const { data, error } = await supabase
    .from('transactions')
    .select(`
      *,
      transaction_items (
        id,
        transaction_id,
        bike_id,
        return_condition,
        return_note,
        created_at,
        bikes (
          id,
          name,
          category,
          image_url,
          status
        )
      )
    `)
    .eq('id', transactionId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Gagal mengambil detail penyewaan: ${error.message}`
    );
  }

  return data as unknown as TransactionWithItems | null;
}
