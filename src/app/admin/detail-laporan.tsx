import React from 'react';
import { Alert, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import AdminPageLayout, { adminUi } from '../../components/organisms/AdminPageLayout';
import { useAdmin } from '../../context/AdminContext';
import { formatRupiah } from '../../constants/adminTypes';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

export default function ReportDetailScreen() {
  const params = useLocalSearchParams<{ period?: string }>();
  const period = Array.isArray(params.period) ? params.period[0] : params.period ?? 'Bulan ini';
  const { transactions, expenses } = useAdmin();
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const weekStartDate = new Date(now); weekStartDate.setDate(now.getDate() - 6);
  const weekStart = `${weekStartDate.getFullYear()}-${String(weekStartDate.getMonth() + 1).padStart(2, '0')}-${String(weekStartDate.getDate()).padStart(2, '0')}`;
  const monthStart = today.slice(0, 7);
  const matches = (date: string) => period === 'Hari ini' ? date === today : period === 'Minggu ini' ? date >= weekStart && date <= today : date.startsWith(monthStart);
  const transactionRows = transactions.filter((item) => item.paymentStatus === 'Lunas' && matches(item.date));
  const expenseRows = expenses.filter((item) => matches(item.date));
  const income = transactionRows.reduce((sum, item) => sum + item.total, 0);
  const expenseTotal = expenseRows.reduce((sum, item) => sum + item.amount, 0);

  const exportDemo = () => Alert.alert('Pratinjau PDF', 'Pada prototipe frontend, tombol ini mensimulasikan aksi unduh laporan PDF. Integrasi generator PDF dilakukan pada tahap berikutnya.');

  return (
    <AdminPageLayout title="Detail Laporan" subtitle={`Periode: ${period}`} showBack>
      <View style={styles.summary}><Text style={styles.summaryLabel}>SELISIH OPERASIONAL</Text><Text style={styles.summaryValue}>{formatRupiah(income - expenseTotal)}</Text></View>
      <Text style={adminUi.sectionTitle}>Pemasukan · {transactionRows.length} transaksi</Text>
      {transactionRows.map((item) => <View key={item.id} style={styles.row}><View style={{ flex: 1 }}><Text style={styles.rowTitle}>{item.customerName}</Text><Text style={styles.meta}>{item.id} · {item.date}</Text></View><Text style={styles.amount}>{formatRupiah(item.total)}</Text></View>)}
      {transactionRows.length === 0 ? <Text style={styles.empty}>Tidak ada pemasukan lunas pada periode ini.</Text> : null}
      <Text style={adminUi.sectionTitle}>Pengeluaran · {expenseRows.length} catatan</Text>
      {expenseRows.map((item) => <View key={item.id} style={styles.row}><View style={{ flex: 1 }}><Text style={styles.rowTitle}>{item.description}</Text><Text style={styles.meta}>{item.category} · {item.date}</Text></View><Text style={styles.expenseAmount}>−{formatRupiah(item.amount)}</Text></View>)}
      {expenseRows.length === 0 ? <Text style={styles.empty}>Tidak ada pengeluaran tercatat pada periode ini.</Text> : null}
      <View style={adminUi.card}>
        <Info label="Total pemasukan" value={formatRupiah(income)} />
        <Info label="Total pengeluaran" value={formatRupiah(expenseTotal)} />
        <Info label="Selisih operasional" value={formatRupiah(income - expenseTotal)} last />
      </View>
      <TouchableOpacity style={adminUi.button} onPress={exportDemo}><Ionicons name="download-outline" size={18} color={COLORS.textPrimary} /><Text style={[adminUi.buttonText, { marginLeft: 8 }]}>Unduh Laporan PDF</Text></TouchableOpacity>
      <Text style={styles.helper}>Fitur unduh PDF masih berupa simulasi UI, belum menghasilkan berkas.</Text>
    </AdminPageLayout>
  );
}
function Info({ label, value, last }: { label: string; value: string; last?: boolean }) { return <View style={[styles.infoRow, last && { borderBottomWidth: 0 }]}><Text style={styles.meta}>{label}</Text><Text style={styles.rowTitle}>{value}</Text></View>; }
const styles = StyleSheet.create({
  summary: { backgroundColor: COLORS.secondaryDark, borderRadius: SIZES.radiusLarge, padding: SIZES.large }, summaryLabel: { ...FONTS.caption, color: '#BAE6FD' }, summaryValue: { ...FONTS.headline1, color: '#FFFFFF', marginTop: 5 },
  row: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: SIZES.radiusMedium, padding: 12, flexDirection: 'row', alignItems: 'center', marginBottom: 8 }, rowTitle: { ...FONTS.labelMedium, color: COLORS.textPrimary }, meta: { ...FONTS.caption, color: COLORS.textSecondary, marginTop: 3 }, amount: { ...FONTS.labelMedium, color: '#15803D', marginLeft: 8 }, expenseAmount: { ...FONTS.labelMedium, color: '#B45309', marginLeft: 8 }, empty: { ...FONTS.caption, color: COLORS.textSecondary, marginBottom: 12 },
  infoRow: { paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: COLORS.border }, helper: { ...FONTS.caption, color: COLORS.textSecondary, marginTop: 9 },
});
