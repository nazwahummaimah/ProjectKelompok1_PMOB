export interface DemoUserProfile {
  fullName: string;
  email: string;
  phone: string;
  customerType: 'Pelajar' | 'Umum';
  memberSince: string;
}

export type RentalHistoryStatus = 'Sedang Berlangsung' | 'Selesai';

export interface RentalHistoryRecord {
  id: string;
  date: string;
  status: RentalHistoryStatus;
  bikeName: string;
  unitId: string;
  category: string;
  startTime: string;
  endTime?: string;
  duration: string;
  customerType: 'Pelajar' | 'Umum';
  hourlyRate: string;
  total?: string;
  paymentMethod?: 'Tunai' | 'QRIS';
  paymentStatus?: 'Lunas' | 'Belum Lunas';
  guaranteeType: 'Identitas Terverifikasi' | 'Sepeda Motor';
  returnCondition?: 'Baik' | 'Rusak ringan' | 'Rusak berat';
  returnNote?: string;
}

export const DEMO_USER_PROFILE: DemoUserProfile = {
  fullName: 'Budi Santoso',
  email: 'budi.santoso@gmail.com',
  phone: '081398765432',
  customerType: 'Pelajar',
  memberSince: 'September 2026',
};

export const DEMO_RENTAL_HISTORY: RentalHistoryRecord[] = [
  {
    id: 'TRX-2026-0018',
    date: '2 November 2026',
    status: 'Sedang Berlangsung',
    bikeName: 'Polygon Cascade 4',
    unitId: 'B-001',
    category: 'Mountain Bike (MTB)',
    startTime: '09.00 WIB',
    duration: '1 jam 25 menit',
    customerType: 'Pelajar',
    hourlyRate: 'Rp10.000/jam',
    paymentMethod: 'QRIS',
    paymentStatus: 'Lunas',
    guaranteeType: 'Identitas Terverifikasi',
  },
  {
    id: 'TRX-2026-0014',
    date: '28 Oktober 2026',
    status: 'Selesai',
    bikeName: 'Dahon Mariner D8',
    unitId: 'B-003',
    category: 'Folding Bike',
    startTime: '08.00 WIB',
    endTime: '11.00 WIB',
    duration: '3 jam',
    customerType: 'Pelajar',
    hourlyRate: 'Rp10.000/jam',
    total: 'Rp30.000',
    paymentMethod: 'QRIS',
    paymentStatus: 'Lunas',
    guaranteeType: 'Identitas Terverifikasi',
    returnCondition: 'Baik',
    returnNote: 'Unit dikembalikan dalam kondisi baik.',
  },
  {
    id: 'TRX-2026-0009',
    date: '24 Oktober 2026',
    status: 'Selesai',
    bikeName: 'Polygon Cascade 4',
    unitId: 'B-008',
    category: 'Mountain Bike (MTB)',
    startTime: '13.00 WIB',
    endTime: '15.00 WIB',
    duration: '2 jam',
    customerType: 'Pelajar',
    hourlyRate: 'Rp12.000/jam',
    total: 'Rp24.000',
    paymentMethod: 'Tunai',
    paymentStatus: 'Lunas',
    guaranteeType: 'Sepeda Motor',
    returnCondition: 'Baik',
    returnNote: 'Unit dikembalikan dalam kondisi baik.',
  },
  {
    id: 'TRX-2026-0005',
    date: '20 Oktober 2026',
    status: 'Selesai',
    bikeName: 'Dahon Mariner D8',
    unitId: 'B-012',
    category: 'Folding Bike',
    startTime: '10.00 WIB',
    endTime: '12.00 WIB',
    duration: '2 jam',
    customerType: 'Pelajar',
    hourlyRate: 'Rp10.000/jam',
    total: 'Rp20.000',
    paymentMethod: 'QRIS',
    paymentStatus: 'Lunas',
    guaranteeType: 'Identitas Terverifikasi',
    returnCondition: 'Baik',
    returnNote: 'Unit dikembalikan dalam kondisi baik.',
  },
];

export const DEMO_RENTAL_SUMMARY = {
  total: 4,
  ongoing: 1,
  completed: 3,
};
