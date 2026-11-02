import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AdminPageLayout, { adminUi } from '../../components/organisms/AdminPageLayout';
import { useAdmin } from '../../context/AdminContext';
import { ReturnCondition } from '../../constants/adminDemo';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

const CONDITIONS: ReturnCondition[] = ['Baik', 'Rusak ringan', 'Rusak berat'];

export default function InspectionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { transactions, bikes, completeReturn } = useAdmin();
  const transaction = transactions.find((item) => item.id === id && item.status === 'Sedang Berlangsung') ?? transactions.find((item) => item.status === 'Sedang Berlangsung');
  const [conditions, setConditions] = useState<Record<string, ReturnCondition>>({});
  const [notes, setNotes] = useState('');

  if (!transaction) return <AdminPageLayout title="Pemeriksaan Unit" subtitle="Tidak ada transaksi aktif untuk diperiksa." showBack><View style={adminUi.card}><Text style={styles.copy}>Transaksi tidak ditemukan.</Text></View></AdminPageLayout>;
  const units = bikes.filter((bike) => transaction.unitIds.includes(bike.id));
  const handleFinish = () => {
    const finalConditions = Object.fromEntries(units.map((unit) => [unit.id, conditions[unit.id] ?? 'Baik'])) as Record<string, ReturnCondition>;
    const hasDamage = Object.values(finalConditions).some((condition) => condition !== 'Baik');
    Alert.alert('Konfirmasi Pemeriksaan', hasDamage ? 'Unit dengan kerusakan akan masuk status Perawatan. Tidak ada denda yang dihitung otomatis.' : 'Semua unit dinyatakan baik dan akan kembali tersedia.', [
      { text: 'Periksa Lagi', style: 'cancel' },
      { text: 'Selesaikan', onPress: () => { completeReturn(transaction.id, finalConditions, notes.trim()); router.replace('/admin/transaksi' as any); } },
    ]);
  };

  return (
    <AdminPageLayout title="Pemeriksaan Unit" subtitle={`Transaksi ${transaction.id}. Pilih kondisi untuk setiap sepeda.`} showBack>
      <View style={styles.notice}><Text style={styles.noticeText}>Status unit tidak berubah sebelum pemeriksaan disimpan.</Text></View>
      {units.map((unit) => (
        <View key={unit.id} style={adminUi.card}>
          <Text style={styles.unitId}>{unit.id}</Text><Text style={styles.unitName}>{unit.name}</Text>
          <Text style={styles.label}>Kondisi setelah dikembalikan</Text>
          <View style={styles.choiceRow}>{CONDITIONS.map((condition) => <TouchableOpacity key={condition} onPress={() => setConditions((current) => ({ ...current, [unit.id]: condition }))} style={[adminUi.chip, (conditions[unit.id] ?? 'Baik') === condition && adminUi.chipActive]}><Text style={[styles.choiceText, (conditions[unit.id] ?? 'Baik') === condition && styles.choiceActive]}>{condition}</Text></TouchableOpacity>)}</View>
        </View>
      ))}
      <View style={adminUi.card}>
        <Text style={styles.label}>Catatan pemeriksaan (opsional)</Text>
        <TextInput value={notes} onChangeText={setNotes} style={[adminUi.input, styles.multiline]} placeholder="Contoh: rem belakang perlu penyetelan." placeholderTextColor={COLORS.textSecondary} multiline textAlignVertical="top" />
        <Text style={styles.helper}>Kerusakan ringan/berat mengubah status unit menjadi Perawatan. Nilai kompensasi tidak dihitung otomatis pada prototipe.</Text>
      </View>
      <TouchableOpacity style={adminUi.button} onPress={handleFinish}><Text style={adminUi.buttonText}>Simpan Pemeriksaan & Selesaikan</Text></TouchableOpacity>
    </AdminPageLayout>
  );
}
const styles = StyleSheet.create({
  notice: { backgroundColor: '#E0F2FE', padding: 12, borderRadius: 12, marginBottom: 12 }, noticeText: { ...FONTS.caption, color: COLORS.secondaryDark },
  unitId: { ...FONTS.caption, color: COLORS.secondaryDark, fontWeight: '700' }, unitName: { ...FONTS.labelLarge, color: COLORS.textPrimary, marginTop: 3, marginBottom: 14 }, label: { ...FONTS.labelMedium, color: COLORS.textPrimary, marginBottom: 8 },
  choiceRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 }, choiceText: { ...FONTS.caption, color: COLORS.textSecondary }, choiceActive: { color: COLORS.secondaryDark, fontWeight: '700' }, multiline: { minHeight: 90, paddingTop: 12 }, helper: { ...FONTS.caption, color: COLORS.textSecondary, lineHeight: 18, marginTop: 10 }, copy: { ...FONTS.body, color: COLORS.textSecondary },
});
