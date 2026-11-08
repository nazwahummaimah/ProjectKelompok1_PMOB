// UI-facing shape for bike records fetched from Supabase.
export interface BikeData {
  id: string;
  category: string;
  name: string;
  price: string;
  status: 'Tersedia' | 'Sedang Disewa' | 'Perawatan';
  location: string;
  address?: string;
  hours?: string;
  features: string[];
  image: string;
  returnTime?: string;
  returnLocationNote?: string;
  tireSize?: string;
  brakes?: string;
  transmission?: string;
  facilities?: string;
  techCondition?: string;
  extraTags?: string[];
}
