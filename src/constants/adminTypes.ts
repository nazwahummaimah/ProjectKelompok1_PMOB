// Domain types and formatting helpers used by the admin screens.
// Operational records are loaded from Supabase through AdminContext.
export type AdminBikeStatus = 'Tersedia' | 'Sedang Disewa' | 'Perawatan';
export type CustomerType = 'Pelajar' | 'Umum';
export type DayType = 'Hari biasa' | 'Hari libur';
export type PaymentMethod = 'Tunai' | 'QRIS';
export type PaymentStatus = 'Lunas' | 'Belum Lunas';
export type GuaranteeType = 'Identitas Terverifikasi' | 'Sepeda Motor';
export type TransactionStatus = 'Menunggu Serah Terima' | 'Sedang Berlangsung' | 'Selesai';
export type ReturnCondition = 'Baik' | 'Rusak ringan' | 'Rusak berat';
export type ExpenseCategory = 'Perawatan' | 'Spare Part' | 'Operasional' | 'Lainnya';
export type MaintenanceType = 'Perbaikan' | 'Servis rutin' | 'Penggantian komponen';

export interface AdminBike {
  id: string;
  dbId?: string;
  branchId?: string;
  branchName?: string;
  branchAddress?: string;
  name: string;
  category: 'Mountain Bike (MTB)' | 'Folding Bike';
  status: AdminBikeStatus;
  notes: string;
  qrCode: string;
}

export interface AdminTransaction {
  id: string;
  customerName: string;
  phone: string;
  customerType: CustomerType;
  unitIds: string[];
  date: string;
  startTime: string;
  estimatedEnd: string;
  durationHours: number;
  durationLabel?: string;
  dayType: DayType;
  hourlyRate: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  guaranteeType: GuaranteeType;
  status: TransactionStatus;
  returnTime?: string;
  returnConditions?: Record<string, ReturnCondition>;
  returnNotes?: string;
}

export interface AdminExpense {
  id: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  description: string;
  relatedUnitId?: string;
}

export interface AdminMaintenance {
  id: string;
  unitId: string;
  type: MaintenanceType;
  note: string;
  status: 'Menunggu' | 'Sedang Dikerjakan' | 'Selesai';
  date: string;
}

// Fallback values are used only when no active pricing rule is found in Supabase.
export function getHourlyRate(customerType: CustomerType, dayType: DayType): number {
  if (customerType === 'Pelajar') return dayType === 'Hari libur' ? 12000 : 10000;
  return dayType === 'Hari libur' ? 15000 : 12000;
}

export function formatRupiah(value: number): string {
  return `Rp${Math.round(value).toLocaleString('id-ID')}`;
}
