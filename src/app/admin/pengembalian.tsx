import React from 'react';
import { Alert, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AdminPageLayout, { adminUi } from '../../components/organisms/AdminPageLayout';
import { useAdmin } from '../../context/AdminContext';
import { formatRupiah } from '../../constants/adminDemo';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

export default function ReturnScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { transactions, bikes } = useAdmin();
  const transaction = transactions.find((item) => item.id === id && item.status === 'Sedang Berlangsung') ?? transactions.find((item) => item.status === 'Sedang Berlangsung');
  if (!transaction) return <AdminPageLayout title="Pengembalian" subtitle="Tidak ada transaksi aktif yang perlu diproses." showBack><View style={adminUi.card}><Text style={styles.text}>Semua transaksi sudah diproses.</Text></View></AdminPageLayout>;
  const units = bikes.filter((bike) => transaction.unitIds.includes(bike.id));

  return (
    <AdminPageLayout title="Pengembalian" subtitle="Catat waktu kembali dan lanjutkan pemeriksaan kondisi unit." showBack>
      <View style={styles.alert}><Ionicons name="information-circle-outline" size={20} color={COLORS.secondaryDark} /><Text style={styles.alertText}>Pengembalian pada MVP diproses untuk seluruh unit dalam satu transaksi, tidak parsial.</Text></View>
      <View style={adminUi.card}>
        <Text style={styles.cardTitle}>{transaction.id}</Text>
        <Text style={styles.customer}>{transaction.customerName}</Text>
        <Text style={styles.muted}>{transaction.phone}</Text>
        <View style={adminUi.divider} />
        <Info label="Mulai sewa" value={transaction.startTime} />
        <Info label="Estimasi selesai" value={transaction.estimatedEnd} />
        <Info label="Durasi tercatat" value={`${transaction.durationHours} jam (estimasi)`} />
        <Info label="Total transaksi" value={formatRupiah(transaction.total)} last />
      </View>
      <Text style={adminUi.sectionTitle}>Unit yang Dikembalikan</Text>
      {units.map((unit) => <View key={unit.id} style={styles.unitRow}><Ionicons name="bicycle" size={22} color={COLORS.secondaryDark} /><View style={{ flex: 1, marginLeft: 10 }}><Text style={styles.unitName}>{unit.name}</Text><Text style={styles.muted}>{unit.id}</Text></View><Text style={styles.unitStatus}>Sedang Disewa</Text></View>)}
      <TouchableOpacity style={adminUi.button} onPress={() => Alert.alert('Lanjut Pemeriksaan', 'Setiap unit akan diperiksa sebelum statusnya dikembalikan menjadi Tersedia atau Perawatan.', [{ text: 'Batal', style: 'cancel' }, { text: 'Periksa Unit', onPress: () => router.push(`/admin/pemeriksaan?id=${transaction.id}` as any) }])}>
        <Text style={adminUi.buttonText}>Lanjut Pemeriksaan Unit</Text><Ionicons name="arrow-forward" size={18} color={COLORS.textPrimary} style={{ marginLeft: 8 }} />
      </TouchableOpacity>
    </AdminPageLayout>
  );
}
function Info({ label, value, last }: { label: string; value: string; last?: boolean }) { return <View style={[styles.infoRow, last && { borderBottomWidth: 0 }]}><Text style={styles.muted}>{label}</Text><Text style={styles.text}>{value}</Text></View>; }
const styles = StyleSheet.create({
  alert: { flexDirection: 'row', alignItems: 'flex-start', gap: 9, backgroundColor: '#E0F2FE', padding: 13, borderRadius: 12, marginBottom: SIZES.medium }, alertText: { ...FONTS.caption, color: COLORS.secondaryDark, flex: 1, lineHeight: 18 },
  cardTitle: { ...FONTS.labelLarge, color: COLORS.secondaryDark }, customer: { ...FONTS.headline3, color: COLORS.textPrimary, marginTop: 7 }, muted: { ...FONTS.caption, color: COLORS.textSecondary }, text: { ...FONTS.body, color: COLORS.textPrimary, marginTop: 3 },
  infoRow: { paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  unitRow: { flexDirection: 'row', alignItems: 'center', padding: 13, backgroundColor: COLORS.surface, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, marginBottom: 9 }, unitName: { ...FONTS.labelMedium, color: COLORS.textPrimary }, unitStatus: { ...FONTS.caption, color: '#0369A1' },
});
