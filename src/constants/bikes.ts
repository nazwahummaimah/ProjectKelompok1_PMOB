// constants/bikes.ts

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

export const ALL_BIKES: BikeData[] = [
  {
    id: 'Unit B-001',
    category: 'MOUNTAIN BIKE (MTB)',
    name: 'Polygon Cascade 4',
    price: '20.000',
    status: 'Tersedia',
    location: 'Pos Stasiun Tugu',
    address: 'Jl. Pasar Kembang (Pintu Keluar Selatan, 30m dari loket)',
    hours: 'Buka setiap hari: 06:00 - 22:00 WIB',
    features: ['24 Speed Shimano', 'Helm Gratis', 'Rem Hidrolik'],
    image: 'https://via.placeholder.com/400x200',
    tireSize: '27.5 Inch MTB',
    brakes: 'Rem Hidrolik Shimano',
    transmission: '3 × 8 Kecepatan',
    facilities: 'Helm SNI & Kunci',
    techCondition: 'Servis berkala, rem, serta tekanan ban diperiksa 2 hari lalu oleh mekanik Mas Joko.',
    extraTags: ['✓ Kunci Spiral Baja', '✓ Lampu Reflektor Depan-Belakang', '✓ Tempat Botol Minum (Bottle Cage)'],
  },
  {
    id: 'Unit B-003',
    category: 'FOLDING BIKE',
    name: 'Dahon Mariner D8',
    price: '20.000',
    status: 'Sedang Disewa',
    location: 'Pos Alun-alun Kidul',
    address: 'Jl. Alun-Alun Kidul No. 12, Kraton',
    hours: 'Buka setiap hari: 06:00 - 23:00 WIB',
    features: ['Lipat Praktis', 'Pos Alun-alun Kidul'],
    image: 'https://via.placeholder.com/400x200',
    returnTime: '16:00 WIB',
    returnLocationNote: 'Kembali sore ini di Pos Alun-Alun Kidul',
    tireSize: '20 Inch Folding',
    brakes: 'V-Brake Tektro',
    transmission: '1 × 8 Kecepatan',
    facilities: 'Helm SNI & Kunci Lipat',
    techCondition: 'Kondisi lipatan kokoh, engsel telah dioles pelumas khusus.',
    extraTags: ['✓ Kunci Spiral Baja', '✓ Bagasi Belakang'],
  },
  {
    id: 'Unit B-008',
    category: 'CITY BIKE KERANJANG',
    name: 'Phoenix City 26',
    price: '15.000',
    status: 'Tersedia',
    location: 'Pos Malioboro (Depan Mall)',
    address: 'Jl. Malioboro (Samping Hotel Mutiara)',
    hours: 'Buka setiap hari: 06:00 - 23:00 WIB',
    features: ['Keranjang Depan', 'Kunci Ganda', 'Lampu Dinamo'],
    image: 'https://via.placeholder.com/400x200',
    tireSize: '26 Inch City',
    brakes: 'Tromol & Drum Brake',
    transmission: 'Single Speed',
    facilities: 'Keranjang Besi & Pelindung Rantai',
    techCondition: 'Keranjang kokoh, lampu dinamo menyala terang.',
    extraTags: ['✓ Keranjang Depan', '✓ Boncengan Busa', '✓ Bel Sepeda'],
  },
  {
    id: 'Unit B-012',
    category: 'ROAD BIKE TOURING',
    name: 'United Inertia',
    price: '25.000',
    status: 'Sedang Disewa',
    location: 'Pos Stasiun Tugu',
    address: 'Jl. Pasar Kembang (Pintu Keluar Selatan)',
    hours: 'Buka setiap hari: 06:00 - 22:00 WIB',
    features: ['Ringan & Cepat', 'Dropbar Ergonomis'],
    image: 'https://via.placeholder.com/400x200',
    returnTime: '15:30 WIB',
    returnLocationNote: 'Kembali sore ini di Pos Tugu',
    tireSize: '700c Road',
    brakes: 'U-Brake Alloy',
    transmission: '2 × 9 Kecepatan',
    facilities: 'Helm Aerodinamis & Kit Tambal Ban',
    techCondition: 'Rantai dan derailleur baru diganti.',
    extraTags: ['✓ Rangka Alloy', '✓ Dropbar Ergonomis'],
  },
  {
    id: 'Unit B-019',
    category: 'ELECTRIC BIKE',
    name: 'Selis E-City',
    price: '35.000',
    status: 'Tersedia',
    location: 'Pos Malioboro',
    address: 'Jl. Malioboro (Depan Mall)',
    hours: 'Buka setiap hari: 06:00 - 23:00 WIB',
    features: ['Baterai 36V Pedal-Assist', 'Pos Malioboro'],
    image: 'https://via.placeholder.com/400x200',
    tireSize: '24 Inch E-Bike',
    brakes: 'Disc Brake Depan Belakang',
    transmission: 'Electric Pedal Assist',
    facilities: 'Charger & Indicator Battery',
    techCondition: 'Baterai 100% terisi penuh, motor listrik prima.',
    extraTags: ['✓ Baterai 36V 10Ah', '✓ Panel Speedometer Digital'],
  },
];

// Helper untuk mencari sepeda berdasarkan ID
export const getBikeById = (id?: string): BikeData => {
  if (!id) return ALL_BIKES[0];
  const found = ALL_BIKES.find((b) => b.id.toLowerCase() === id.toLowerCase() || b.id.replace('ID: ', '').toLowerCase() === id.toLowerCase());
  return found || ALL_BIKES[0];
};