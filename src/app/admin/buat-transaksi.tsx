import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AdminPageLayout, { adminUi } from '../../components/organisms/AdminPageLayout';
import AdminStatusBadge from '../../components/molecules/AdminStatusBadge';
import { useAdmin } from '../../context/AdminContext';
import { CustomerType, DayType, GuaranteeType, PaymentMethod, formatRupiah, getHourlyRate } from '../../constants/adminDemo';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

export default function CreateTransactionScreen() {
  const router = useRouter();
  const { bikes, transactions, createTransaction } = useAdmin();
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [customerLookupMessage, setCustomerLookupMessage] = useState('');
  const [customerType, setCustomerType] = useState<CustomerType>('Umum');
  const [dayType, setDayType] = useState<DayType>('Hari biasa');
  const [duration, setDuration] = useState('2');
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
  const [guarantee, setGuarantee] = useState<GuaranteeType>('Identitas Terverifikasi');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Tunai');
  const [paymentMarkedPaid, setPaymentMarkedPaid] = useState(false);

  const availableBikes = bikes.filter((bike) => bike.status === 'Tersedia');
  const hours = Math.max(1, Math.min(24, Number.parseInt(duration, 10) || 1));
  const hourlyRate = getHourlyRate(customerType, dayType);
  const total = hourlyRate * hours * selectedUnits.length;

  const toggleUnit = (id: string) => setSelectedUnits((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

  const handleCustomerLookup = () => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 9 || digits.length > 15) { setCustomerLookupMessage('Masukkan nomor WhatsApp yang valid untuk mencari pelanggan.'); return; }
    const previous = transactions.find((item) => item.phone.replace(/\D/g, '') === digits);
    if (previous) {
      setCustomerName(previous.customerName);
      setCustomerType(previous.customerType);
      setCustomerLookupMessage(`Pelanggan ditemukan: ${previous.customerName}. Data pelanggan demo dimuat.`);
    } else {
      setCustomerName('');
      setCustomerLookupMessage('Pelanggan belum ditemukan. Isi nama untuk mencatat pelanggan baru.');
    }
  };

  const handleSubmit = () => {
    if (customerName.trim().length < 3) { Alert.alert('Nama pelanggan', 'Masukkan nama pelanggan minimal 3 karakter.'); return; }
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 9 || digits.length > 15) { Alert.alert('Nomor WhatsApp', 'Nomor WhatsApp harus terdiri dari 9–15 digit.'); return; }
    if (selectedUnits.length === 0) { Alert.alert('Pilih unit', 'Pilih minimal satu unit yang tersedia.'); return; }
    const transaction = createTransaction({
      customerName: customerName.trim(), phone: digits, customerType, unitIds: selectedUnits,
      durationHours: hours, dayType, paymentMethod, paymentStatus: paymentMarkedPaid ? 'Lunas' : 'Belum Lunas', guaranteeType: guarantee,
    });
    Alert.alert('Transaksi dibuat', paymentMarkedPaid ? 'Pembayaran tercatat Lunas. Unit belum berstatus disewa sampai serah terima dikonfirmasi.' : 'Transaksi tercatat Belum Lunas. Serah terima belum dapat dilakukan.', [
      { text: 'Lihat Transaksi', onPress: () => router.replace(`/admin/detail-transaksi?id=${transaction.id}` as any) },
    ]);
  };

  return (
    <AdminPageLayout title="Buat Transaksi" subtitle="Catat penyewaan langsung di lokasi. Pembayaran dan serah terima dicatat terpisah." showBack>
      <View style={adminUi.card}>
        <Text style={styles.sectionTitle}>1. Identitas Pelanggan</Text>
        <Text style={styles.label}>Nama lengkap *</Text>
        <TextInput value={customerName} onChangeText={setCustomerName} style={adminUi.input} placeholder="Nama pelanggan" placeholderTextColor={COLORS.textSecondary} />
        <Text style={[styles.label, { marginTop: 12 }]}>Nomor WhatsApp *</Text>
        <View style={styles.lookupRow}>
          <TextInput value={phone} onChangeText={(value) => { setPhone(value); setCustomerLookupMessage(''); }} style={[adminUi.input, { flex: 1 }]} placeholder="08xxxxxxxxxx" keyboardType="phone-pad" placeholderTextColor={COLORS.textSecondary} />
          <TouchableOpacity style={styles.lookupButton} onPress={handleCustomerLookup}><Text style={styles.lookupButtonText}>Cari</Text></TouchableOpacity>
        </View>
        {customerLookupMessage ? <Text style={styles.lookupMessage}>{customerLookupMessage}</Text> : null}
        <Text style={[styles.label, { marginTop: 14 }]}>Kategori pelanggan</Text>
        <ChoiceRow options={['Pelajar', 'Umum']} value={customerType} onChange={(value) => setCustomerType(value as CustomerType)} />
      </View>

      <View style={adminUi.card}>
        <Text style={styles.sectionTitle}>2. Pilih Unit Sepeda</Text>
        <Text style={styles.helper}>Hanya unit berstatus Tersedia yang dapat dipilih.</Text>
        {availableBikes.map((bike) => {
          const selected = selectedUnits.includes(bike.id);
          return <TouchableOpacity key={bike.id} onPress={() => toggleUnit(bike.id)} style={[styles.unitRow, selected && styles.unitRowSelected]}>
            <View style={styles.checkbox}>{selected ? <Text style={styles.checkMark}>✓</Text> : null}</View>
            <View style={{ flex: 1 }}><Text style={styles.unitName}>{bike.name}</Text><Text style={styles.helper}>{bike.id} · {bike.category}</Text></View>
            <AdminStatusBadge status={bike.status} />
          </TouchableOpacity>;
        })}
      </View>

      <View style={adminUi.card}>
        <Text style={styles.sectionTitle}>3. Durasi dan Tarif</Text>
        <Text style={styles.label}>Jenis hari</Text>
        <ChoiceRow options={['Hari biasa', 'Hari libur']} value={dayType} onChange={(value) => setDayType(value as DayType)} />
        <Text style={[styles.label, { marginTop: 14 }]}>Durasi sewa (jam)</Text>
        <View style={styles.durationRow}>
          <TouchableOpacity style={styles.stepper} onPress={() => setDuration(String(Math.max(1, hours - 1)))}><Text style={styles.stepperText}>−</Text></TouchableOpacity>
          <TextInput value={duration} onChangeText={(value) => setDuration(value.replace(/[^0-9]/g, '').slice(0, 2))} keyboardType="number-pad" style={styles.durationInput} />
          <TouchableOpacity style={styles.stepper} onPress={() => setDuration(String(Math.min(24, hours + 1)))}><Text style={styles.stepperText}>+</Text></TouchableOpacity>
        </View>
        <Text style={styles.helper}>Tarif {customerType.toLowerCase()} · {dayType.toLowerCase()}: {formatRupiah(hourlyRate)}/jam/unit</Text>
        <View style={styles.totalRow}><Text style={styles.totalLabel}>Estimasi total</Text><Text style={styles.totalValue}>{formatRupiah(total)}</Text></View>
        <Text style={styles.helper}>Perhitungan: tarif per jam × durasi × jumlah unit. Harga paket belum ditetapkan.</Text>
      </View>

      <View style={adminUi.card}>
        <Text style={styles.sectionTitle}>4. Jaminan dan Pembayaran</Text>
        <Text style={styles.label}>Jenis jaminan</Text>
        <ChoiceRow options={['Identitas Terverifikasi', 'Sepeda Motor']} value={guarantee} onChange={(value) => setGuarantee(value as GuaranteeType)} />
        <Text style={[styles.label, { marginTop: 14 }]}>Metode pembayaran</Text>
        <ChoiceRow options={['Tunai', 'QRIS']} value={paymentMethod} onChange={(value) => setPaymentMethod(value as PaymentMethod)} />
        <TouchableOpacity style={styles.paymentToggle} onPress={() => setPaymentMarkedPaid((value) => !value)}>
          <View style={[styles.checkbox, paymentMarkedPaid && styles.checkboxActive]}>{paymentMarkedPaid ? <Text style={styles.checkMark}>✓</Text> : null}</View>
          <View style={{ flex: 1 }}><Text style={styles.unitName}>Tandai pembayaran Lunas</Text><Text style={styles.helper}>QRIS dicatat manual, bukan melalui payment gateway.</Text></View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={[adminUi.button, selectedUnits.length === 0 && { opacity: 0.6 }]} onPress={handleSubmit}>
        <Text style={adminUi.buttonText}>Simpan Transaksi</Text>
      </TouchableOpacity>
    </AdminPageLayout>
  );
}

function ChoiceRow({ options, value, onChange }: { options: string[]; value: string; onChange: (value: string) => void }) {
  return <View style={styles.choiceRow}>{options.map((option) => <TouchableOpacity key={option} onPress={() => onChange(option)} style={[adminUi.chip, value === option && adminUi.chipActive]}><Text style={[styles.choiceText, value === option && styles.choiceTextActive]}>{option}</Text></TouchableOpacity>)}</View>;
}
const styles = StyleSheet.create({
  sectionTitle: { ...FONTS.labelLarge, color: COLORS.secondaryDark, marginBottom: 14 },
  label: { ...FONTS.labelMedium, color: COLORS.textPrimary, marginBottom: 7 },
  helper: { ...FONTS.caption, color: COLORS.textSecondary, lineHeight: 17 },
  choiceRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, choiceText: { ...FONTS.caption, color: COLORS.textSecondary }, choiceTextActive: { color: COLORS.secondaryDark, fontWeight: '700' },
  unitRow: { flexDirection: 'row', alignItems: 'center', padding: 10, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, marginTop: 9, gap: 10 }, unitRowSelected: { borderColor: COLORS.secondaryDark, backgroundColor: '#F0F9FF' },
  checkbox: { width: 21, height: 21, borderWidth: 1.5, borderColor: '#94A3B8', borderRadius: 6, alignItems: 'center', justifyContent: 'center' }, checkboxActive: { backgroundColor: COLORS.secondaryDark, borderColor: COLORS.secondaryDark }, checkMark: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  unitName: { ...FONTS.labelMedium, color: COLORS.textPrimary },
  lookupRow: { flexDirection: 'row', alignItems: 'center', gap: 8 }, lookupButton: { height: 46, minWidth: 62, borderRadius: SIZES.radiusMedium, backgroundColor: '#E0F2FE', alignItems: 'center', justifyContent: 'center' }, lookupButtonText: { ...FONTS.labelMedium, color: COLORS.secondaryDark }, lookupMessage: { ...FONTS.caption, color: COLORS.secondaryDark, marginTop: 6, lineHeight: 17 },
  durationRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }, stepper: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#E0F2FE', alignItems: 'center', justifyContent: 'center' }, stepperText: { fontSize: 23, color: COLORS.secondaryDark, fontWeight: '600' }, durationInput: { width: 70, height: 42, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, textAlign: 'center', ...FONTS.labelLarge, color: COLORS.textPrimary },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, marginTop: 12, borderTopWidth: 1, borderTopColor: COLORS.border }, totalLabel: { ...FONTS.labelMedium, color: COLORS.textSecondary }, totalValue: { ...FONTS.headline2, color: COLORS.secondaryDark },
  paymentToggle: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 16, padding: 12, backgroundColor: '#F8FAFC', borderRadius: 12 },
});
