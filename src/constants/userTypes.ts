// Shape used by the user rental-history UI. Records are fetched from Supabase.
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
