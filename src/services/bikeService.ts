
import { supabase } from '../lib/supabase';

export type BikeStatus =
  | 'Tersedia'
  | 'Sedang Disewa'
  | 'Perawatan';

export interface Bike {
  id: string;
  name: string;
  category: string;
  price_per_hour: number;
  status: BikeStatus;
  location: string | null;
  address: string | null;
  opening_hours: string | null;
  features: string[] | null;
  image_url: string | null;
  tire_size: string | null;
  brakes: string | null;
  transmission: string | null;
  facilities: string | null;
  technical_condition: string | null;
  extra_tags: string[] | null;
  notes: string | null;
  qr_code: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export type CreateBikeInput = {
  name: string;
  category: string;
  price_per_hour?: number;
  location?: string | null;
  address?: string | null;
  opening_hours?: string | null;
  features?: string[];
  image_url?: string | null;
  tire_size?: string | null;
  brakes?: string | null;
  transmission?: string | null;
  facilities?: string | null;
  technical_condition?: string | null;
  extra_tags?: string[];
  notes?: string | null;
};

export type UpdateBikeInput = Partial<CreateBikeInput> & {
  status?: BikeStatus;
};

const BIKE_SELECT = '*';

/**
 * Mengambil seluruh data sepeda.
 * Bisa dipanggil oleh halaman katalog publik maupun inventaris Admin.
 */
export async function getBikes(): Promise<Bike[]> {
  const { data, error } = await supabase
    .from('bikes')
    .select(BIKE_SELECT)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Gagal mengambil data sepeda: ${error.message}`);
  }

  return (data ?? []) as Bike[];
}

/**
 * Mengambil detail sepeda berdasarkan ID.
 */
export async function getBikeById(id: string): Promise<Bike | null> {
  const { data, error } = await supabase
    .from('bikes')
    .select(BIKE_SELECT)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new Error(`Gagal mengambil detail sepeda: ${error.message}`);
  }

  return data as Bike | null;
}

/**
 * Membuat ID sepeda berikutnya dengan format B-001, B-002, dst.
 */
async function generateBikeId(): Promise<string> {
  const { data, error } = await supabase
    .from('bikes')
    .select('id');

  if (error) {
    throw new Error(`Gagal membuat kode sepeda: ${error.message}`);
  }

  const highestNumber = (data ?? []).reduce((highest, item) => {
    const match = String(item.id).match(/^B-(\d+)$/i);
    const number = match ? Number(match[1]) : 0;
    return Math.max(highest, number);
  }, 0);

  return `B-${String(highestNumber + 1).padStart(3, '0')}`;
}

/**
 * Menambahkan unit sepeda baru.
 * Status awal otomatis Tersedia.
 */
export async function createBike(
  input: CreateBikeInput
): Promise<Bike> {
  const name = input.name.trim();
  const category = input.category.trim();

  if (name.length < 3) {
    throw new Error('Nama sepeda minimal 3 karakter.');
  }

  if (!category) {
    throw new Error('Kategori sepeda wajib diisi.');
  }

  const id = await generateBikeId();

  const payload = {
    id,
    name,
    category,
    price_per_hour: input.price_per_hour ?? 0,
    status: 'Tersedia' as BikeStatus,
    location: input.location ?? null,
    address: input.address ?? null,
    opening_hours: input.opening_hours ?? null,
    features: input.features ?? [],
    image_url: input.image_url ?? null,
    tire_size: input.tire_size ?? null,
    brakes: input.brakes ?? null,
    transmission: input.transmission ?? null,
    facilities: input.facilities ?? null,
    technical_condition: input.technical_condition ?? null,
    extra_tags: input.extra_tags ?? [],
    notes: input.notes ?? null,
    qr_code: `JAMAL-${id}`,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('bikes')
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw new Error(`Gagal menambahkan sepeda: ${error.message}`);
  }

  return data as Bike;
}

/**
 * Memperbarui informasi unit sepeda.
 */
export async function updateBike(
  id: string,
  input: UpdateBikeInput
): Promise<Bike> {
  const payload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (input.name !== undefined) {
    payload.name = input.name.trim();
  }

  if (input.category !== undefined) {
    payload.category = input.category.trim();
  }

  if (input.price_per_hour !== undefined) {
    payload.price_per_hour = input.price_per_hour;
  }

  if (input.status !== undefined) {
    payload.status = input.status;
  }

  if (input.location !== undefined) payload.location = input.location;
  if (input.address !== undefined) payload.address = input.address;
  if (input.opening_hours !== undefined) payload.opening_hours = input.opening_hours;
  if (input.features !== undefined) payload.features = input.features;
  if (input.image_url !== undefined) payload.image_url = input.image_url;
  if (input.tire_size !== undefined) payload.tire_size = input.tire_size;
  if (input.brakes !== undefined) payload.brakes = input.brakes;
  if (input.transmission !== undefined) payload.transmission = input.transmission;
  if (input.facilities !== undefined) payload.facilities = input.facilities;
  if (input.technical_condition !== undefined) payload.technical_condition = input.technical_condition;
  if (input.extra_tags !== undefined) payload.extra_tags = input.extra_tags;
  if (input.notes !== undefined) payload.notes = input.notes;

  const { data, error } = await supabase
    .from('bikes')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Gagal memperbarui data sepeda: ${error.message}`);
  }

  return data as Bike;
}

/**
 * Memperbarui status operasional sepeda.
 */
export async function updateBikeStatus(
  id: string,
  status: BikeStatus
): Promise<Bike> {
  return updateBike(id, { status });
}
