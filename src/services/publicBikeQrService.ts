
import { supabase } from '../lib/supabase';

export type PublicBikeQrInfo = {
  bike_id: string;
  bike_name: string;
  bike_category: string;
  bike_status: 'Tersedia' | 'Sedang Disewa' | 'Perawatan';
  bike_image_url: string | null;
  price_per_hour: number;
  rental_date: string | null;
  estimated_end: string | null;
  duration_hours: number | null;
};

export async function getPublicBikeQrInfo(
  qrValue: string,
): Promise<PublicBikeQrInfo> {
  const value = qrValue?.trim();

  if (!value) {
    throw new Error('Kode QR kosong atau tidak valid.');
  }

  const { data, error } = await supabase.rpc(
    'get_public_bike_qr_info',
    {
      p_qr_value: value,
    },
  );

  if (error) {
    throw new Error(`Gagal membaca informasi sepeda: ${error.message}`);
  }

  const result = Array.isArray(data) ? data[0] : data;

  if (!result) {
    throw new Error('Sepeda tidak ditemukan.');
  }

  return result as PublicBikeQrInfo;
}
