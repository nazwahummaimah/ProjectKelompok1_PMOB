export interface DemoUserProfile {
  fullName: string;
  email: string;
  phone: string;
  customerType: 'Pelajar' | 'Umum';
  memberSince: string;
}

export type RentalHistoryStatus = 'Menunggu Serah Terima' | 'Sedang Berlangsung' | 'Selesai';

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

// Demo account is linked to rental transactions through this WhatsApp number.
export const DEMO_USER_PROFILE: DemoUserProfile = {
  fullName: 'Budi Santoso',
  email: 'budi.santoso@gmail.com',
  phone: '081398765432',
  customerType: 'Pelajar',
  memberSince: 'September 2026',
};
