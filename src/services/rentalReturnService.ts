
import { supabase } from '../lib/supabase';

export type RentalReturnCondition =
  | 'Baik'
  | 'Rusak ringan'
  | 'Rusak berat';

export interface RentalReturnItemInput {
  bike_id: string;
  return_condition: RentalReturnCondition;
  return_note?: string;
}

/**
 * Memproses pengembalian seluruh sepeda dalam satu transaksi.
 * Perubahan kondisi sepeda, status sepeda, dan status transaksi
 * dikerjakan secara atomik oleh database RPC.
 */
export async function completeRentalReturn(
  transactionId: string,
  returnNotes: string,
  items: RentalReturnItemInput[]
): Promise<string> {
  if (!transactionId.trim()) {
    throw new Error('ID transaksi tidak valid.');
  }

  if (!items.length) {
    throw new Error('Data pengembalian sepeda wajib diisi.');
  }

  const bikeIds = items.map((item) => item.bike_id);

  if (new Set(bikeIds).size !== bikeIds.length) {
    throw new Error('Terdapat sepeda duplikat dalam data pengembalian.');
  }

  for (const item of items) {
    if (!item.bike_id.trim()) {
      throw new Error('ID sepeda tidak valid.');
    }

    if (
      !['Baik', 'Rusak ringan', 'Rusak berat'].includes(
        item.return_condition
      )
    ) {
      throw new Error(
        `Kondisi pengembalian sepeda ${item.bike_id} tidak valid.`
      );
    }
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
    'admin_complete_rental_return',
    {
      p_transaction_id: transactionId,
      p_return_notes: returnNotes.trim() || null,
      p_items: items.map((item) => ({
        bike_id: item.bike_id,
        return_condition: item.return_condition,
        return_note: item.return_note?.trim() || '',
      })),
    }
  );

  if (error) {
    throw new Error(
      `Gagal memproses pengembalian: ${error.message}`
    );
  }

  if (!data) {
    throw new Error(
      'Pengembalian gagal karena ID transaksi tidak dikembalikan.'
    );
  }

  return data as string;
}
