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

export const RENTAL_LOCATION = 'Lokasi Rental Mas Joko';
export const ADMIN_DEMO_EMAIL = 'admin@jamaljepret.id';

export function getHourlyRate(customerType: CustomerType, dayType: DayType): number {
  if (customerType === 'Pelajar') return dayType === 'Hari libur' ? 12000 : 10000;
  return dayType === 'Hari libur' ? 15000 : 12000;
}

export function formatRupiah(value: number): string {
  return `Rp${Math.max(0, Math.round(value)).toLocaleString('id-ID')}`;
}

const bikeNames = [
  'Polygon Cascade 4', 'United Miami 3', 'Dahon Mariner D8', 'Polygon Monarch',
  'Dahon Mariner D8', 'United Stylo', 'Element Pikes', 'Polygon Cascade 4',
  'Polygon Cascade 4', 'United Miami 3', 'Pacific Invert', 'Dahon Mariner D8',
  'Dahon Vybe D7', 'United Stylo', 'Element Pikes', 'Dahon Vybe D7',
  'Polygon Cascade 4', 'Dahon Mariner D8', 'United Miami 3', 'Dahon Vybe D7',
];

export const INITIAL_ADMIN_BIKES: AdminBike[] = Array.from({ length: 20 }, (_, index) => {
  const number = index + 1;
  const id = `B-${String(number).padStart(3, '0')}`;
  const isFolding = [3, 4, 5, 7, 9, 12, 13, 14, 16, 18, 20].includes(number);
  const rentedUnitNumbers = [1, 15, 16, 17, 18];
  const status: AdminBikeStatus = number >= 19 ? 'Perawatan' : rentedUnitNumbers.includes(number) ? 'Sedang Disewa' : 'Tersedia';
  return {
    id,
    name: bikeNames[index],
    category: isFolding ? 'Folding Bike' : 'Mountain Bike (MTB)',
    status,
    notes: status === 'Perawatan' ? 'Menunggu pemeriksaan dan perawatan teknis.' : 'Kondisi unit tercatat baik.',
    qrCode: `JAMAL-${id}`,
  };
});

export const INITIAL_ADMIN_TRANSACTIONS: AdminTransaction[] = [
  {
    id: 'TRX-2026-0021', customerName: 'Andi Saputra', phone: '081234567891', customerType: 'Pelajar',
    unitIds: ['B-015', 'B-016'], date: '2026-11-02', startTime: '08.15 WIB', estimatedEnd: '12.15 WIB',
    durationHours: 4, dayType: 'Hari biasa', hourlyRate: 10000, total: 80000, paymentMethod: 'QRIS',
    paymentStatus: 'Lunas', guaranteeType: 'Identitas Terverifikasi', status: 'Sedang Berlangsung',
  },
  {
    id: 'TRX-2026-0020', customerName: 'Rina Aprilia', phone: '081234567890', customerType: 'Umum',
    unitIds: ['B-017', 'B-018'], date: '2026-11-02', startTime: '07.30 WIB', estimatedEnd: '11.30 WIB',
    durationHours: 4, dayType: 'Hari biasa', hourlyRate: 12000, total: 96000, paymentMethod: 'Tunai',
    paymentStatus: 'Lunas', guaranteeType: 'Sepeda Motor', status: 'Sedang Berlangsung',
  },
  {
    id: 'TRX-2026-0019', customerName: 'Dimas Pratama', phone: '082112223333', customerType: 'Pelajar',
    unitIds: ['B-002'], date: '2026-11-01', startTime: '09.00 WIB', estimatedEnd: '11.00 WIB',
    durationHours: 2, dayType: 'Hari libur', hourlyRate: 12000, total: 24000, paymentMethod: 'QRIS',
    paymentStatus: 'Lunas', guaranteeType: 'Identitas Terverifikasi', status: 'Selesai', returnTime: '11.10 WIB',
    returnConditions: { 'B-002': 'Baik' }, returnNotes: 'Unit dikembalikan dalam kondisi baik.',
  },
  {
    // This is the same Budi Santoso transaction shown in the User rental history.
    id: 'TRX-2026-0018', customerName: 'Budi Santoso', phone: '081398765432', customerType: 'Pelajar',
    unitIds: ['B-001'], date: '2026-11-02', startTime: '09.00 WIB', estimatedEnd: '12.00 WIB',
    durationHours: 3, durationLabel: '1 jam 25 menit', dayType: 'Hari biasa', hourlyRate: 10000, total: 30000,
    paymentMethod: 'QRIS', paymentStatus: 'Lunas', guaranteeType: 'Identitas Terverifikasi', status: 'Sedang Berlangsung',
  },
  {
    id: 'TRX-2026-0017', customerName: 'Fajar Ramadhan', phone: '085700011122', customerType: 'Pelajar',
    unitIds: ['B-006'], date: '2026-10-30', startTime: '10.00 WIB', estimatedEnd: '12.00 WIB',
    durationHours: 2, dayType: 'Hari biasa', hourlyRate: 10000, total: 20000, paymentMethod: 'QRIS',
    paymentStatus: 'Lunas', guaranteeType: 'Identitas Terverifikasi', status: 'Selesai', returnTime: '12.05 WIB',
    returnConditions: { 'B-006': 'Baik' }, returnNotes: 'Unit dikembalikan dalam kondisi baik.',
  },
  {
    id: 'TRX-2026-0014', customerName: 'Budi Santoso', phone: '081398765432', customerType: 'Pelajar',
    unitIds: ['B-003'], date: '2026-10-28', startTime: '08.00 WIB', estimatedEnd: '11.00 WIB',
    durationHours: 3, dayType: 'Hari biasa', hourlyRate: 10000, total: 30000, paymentMethod: 'QRIS',
    paymentStatus: 'Lunas', guaranteeType: 'Identitas Terverifikasi', status: 'Selesai', returnTime: '11.00 WIB',
    returnConditions: { 'B-003': 'Baik' }, returnNotes: 'Unit dikembalikan dalam kondisi baik.',
  },
  {
    id: 'TRX-2026-0009', customerName: 'Budi Santoso', phone: '081398765432', customerType: 'Pelajar',
    unitIds: ['B-008'], date: '2026-10-24', startTime: '13.00 WIB', estimatedEnd: '15.00 WIB',
    durationHours: 2, dayType: 'Hari libur', hourlyRate: 12000, total: 24000, paymentMethod: 'Tunai',
    paymentStatus: 'Lunas', guaranteeType: 'Sepeda Motor', status: 'Selesai', returnTime: '15.00 WIB',
    returnConditions: { 'B-008': 'Baik' }, returnNotes: 'Unit dikembalikan dalam kondisi baik.',
  },
  {
    id: 'TRX-2026-0005', customerName: 'Budi Santoso', phone: '081398765432', customerType: 'Pelajar',
    unitIds: ['B-012'], date: '2026-10-20', startTime: '10.00 WIB', estimatedEnd: '12.00 WIB',
    durationHours: 2, dayType: 'Hari biasa', hourlyRate: 10000, total: 20000, paymentMethod: 'QRIS',
    paymentStatus: 'Lunas', guaranteeType: 'Identitas Terverifikasi', status: 'Selesai', returnTime: '12.00 WIB',
    returnConditions: { 'B-012': 'Baik' }, returnNotes: 'Unit dikembalikan dalam kondisi baik.',
  },
];

export const INITIAL_ADMIN_EXPENSES: AdminExpense[] = [
  { id: 'EXP-001', category: 'Operasional', amount: 75000, date: '2026-11-02', description: 'Kebutuhan kebersihan area rental' },
  { id: 'EXP-002', category: 'Spare Part', amount: 125000, date: '2026-11-01', description: 'Penggantian kabel rem unit B-019', relatedUnitId: 'B-019' },
  { id: 'EXP-003', category: 'Perawatan', amount: 50000, date: '2026-10-30', description: 'Pelumas rantai dan pengecekan rutin' },
];

export const INITIAL_ADMIN_MAINTENANCE: AdminMaintenance[] = [
  { id: 'MNT-001', unitId: 'B-019', type: 'Perbaikan', note: 'Pengecekan sistem pengereman.', status: 'Menunggu', date: '2026-11-02' },
  { id: 'MNT-002', unitId: 'B-020', type: 'Servis rutin', note: 'Penyetelan drivetrain dan pemeriksaan ban.', status: 'Menunggu', date: '2026-11-02' },
];
