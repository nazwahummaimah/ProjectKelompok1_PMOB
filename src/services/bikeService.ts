
import { supabase } from '../lib/supabase';

// Tipe data sepeda yang digunakan oleh halaman katalog
export interface PublicBike {
  id: string;
  category: string;
  name: string;
  price: string;
  status: 'Tersedia' | 'Sedang Disewa' | 'Perawatan';
  location: string;
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

  // Mengubah data Supabase menjadi format yang digunakan Katalog
  return (data ?? []).map((bike) => {
    const branch = Array.isArray(bike.branches)
      ? bike.branches[0]
      : bike.branches;

    let status: PublicBike['status'] = 'Tersedia';

    if (bike.status === 'rented') {
      status = 'Sedang Disewa';
    } else if (bike.status === 'maintenance') {
      status = 'Perawatan';
    } else if (bike.status === 'available') {
      status = 'Tersedia';
    }

    return {
      id: bike.bike_code,
      category: bike.category,
      name: bike.name,
      price: String(bike.hourly_rate),
      status,
      location: branch?.name ?? 'Lokasi tidak tersedia',
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
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}