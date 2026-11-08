
import { supabase } from '../lib/supabase';

/**
 * Mengonfirmasi serah terima sepeda kepada pelanggan.
 *
 * Proses dilakukan melalui RPC database agar:
 * - Hanya Admin yang dapat menjalankan proses.
 * - Semua sepeda diperiksa ketersediaannya.
 * - Status seluruh sepeda berubah secara atomik.
 * - Status transaksi berubah menjadi Sedang Berlangsung.
 */
export async function confirmRentalHandover(
  transactionId: string
): Promise<string> {
  if (!transactionId || !transactionId.trim()) {
    throw new Error('ID transaksi tidak valid.');
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw new Error(
      `Gagal memeriksa akun Admin: ${authError.message}`
    );
  }

  if (!user) {
    throw new Error('Silakan login sebagai Admin terlebih dahulu.');
  }

  const { data, error } = await supabase.rpc(
    'admin_confirm_rental_handover',
    {
      p_transaction_id: transactionId,
    }
  );

  if (error) {
    throw new Error(
      `Gagal melakukan serah terima: ${error.message}`
    );
  }

  if (!data) {
    throw new Error(
      'Serah terima gagal karena ID transaksi tidak dikembalikan.'
    );
  }

  return data as string;
}
