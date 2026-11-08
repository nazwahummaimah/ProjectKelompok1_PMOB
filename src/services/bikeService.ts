
import { supabase } from '../lib/supabase';

// Tipe data sepeda yang digunakan oleh halaman katalog
export interface PublicBike {
  id: string;
  category: string;
  name: string;
  price: string;
  status: 'Tersedia' | 'Sedang Disewa' | 'Perawatan';
  location: string;
  address?: string;
  features: string[];
  image: string;
  description: string;
}

// Mengambil seluruh data sepeda untuk katalog publik
export async function getPublicBikes(): Promise<PublicBike[]> {
  const { data, error } = await supabase
    .from('bikes')
    .select(`
      id,
      bike_code,
      name,
      category,
      status,
      hourly_rate,
      image_path,
      description,
      branch_id,
      branches (
        name,
        address
      )
    `)
    .order('bike_code');

  if (error) {
    throw error;
  }

  const { data: defaultPricing, error: pricingError } = await supabase
    .from('pricing_rules')
    .select('hourly_rate')
    .eq('customer_type', 'Umum')
    .eq('day_type', 'Hari biasa')
    .eq('is_active', true)
    .limit(1)
    .maybeSingle();
  if (pricingError) throw pricingError;
  const publicHourlyRate = Number(defaultPricing?.hourly_rate ?? 0);

  // Mengubah data Supabase menjadi format yang digunakan Katalog
  return (data ?? []).map((bike) => {
    const branch = Array.isArray(bike.branches)
      ? bike.branches[0]
      : bike.branches;

    let status: PublicBike['status'] = 'Tersedia';

    if (bike.status === 'Sedang Disewa') {
      status = 'Sedang Disewa';
    } else if (bike.status === 'Perawatan') {
      status = 'Perawatan';
    } else {
      status = 'Tersedia';
    }

    return {
      id: bike.bike_code,
      category: bike.category,
      name: bike.name,
      price: Number(publicHourlyRate || bike.hourly_rate || 0).toLocaleString('id-ID'),
      status,
      location: branch?.name ?? 'Lokasi tidak tersedia',
      address: branch?.address ?? undefined,
      features: [
        branch?.name ?? 'Cabang tidak tersedia',
      ],
      image: bike.image_path ?? '',
      description: bike.description ?? '',
    };
  });
}

// Mengambil detail sepeda berdasarkan ID database
export async function getBikeById(id: string) {
  const { data, error } = await supabase
    .from('bikes')
    .select(`
      *,
      branches (
        name,
        address
      )
    `)
    .eq('bike_code', id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}