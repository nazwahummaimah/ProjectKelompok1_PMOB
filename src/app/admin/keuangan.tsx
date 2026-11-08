import React, { useMemo, useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AdminPageLayout, { adminUi } from '../../components/organisms/AdminPageLayout';
import { useAdmin } from '../../context/AdminContext';
import { formatRupiah } from '../../constants/adminTypes';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

type Period = 'Hari ini' | 'Minggu ini' | 'Bulan ini';
const PERIODS: Period[] = ['Hari ini', 'Minggu ini', 'Bulan ini'];
const today = new Date();
const TODAY = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
const WEEK_START_DATE = new Date(today);
WEEK_START_DATE.setDate(today.getDate() - 6);
const WEEK_START = `${WEEK_START_DATE.getFullYear()}-${String(WEEK_START_DATE.getMonth() + 1).padStart(2, '0')}-${String(WEEK_START_DATE.getDate()).padStart(2, '0')}`;
const MONTH_START = TODAY.slice(0, 7);

export default function FinanceScreen() {
  const router = useRouter();
  const { transactions, expenses } = useAdmin();
  const [period, setPeriod] = useState<Period>('Bulan ini');
  const filteredTransactions = useMemo(() => transactions.filter((item) => {
    if (period === 'Hari ini') return item.date === TODAY;
    if (period === 'Minggu ini') return item.date >= WEEK_START && item.date <= TODAY;
    return item.date.startsWith(MONTH_START);
  }), [transactions, period]);
  const filteredExpenses = useMemo(() => expenses.filter((item) => {
    if (period === 'Hari ini') return item.date === TODAY;
    if (period === 'Minggu ini') return item.date >= WEEK_START && item.date <= TODAY;
    return item.date.startsWith(MONTH_START);
  }), [expenses, period]);
  const income = filteredTransactions.filter((item) => item.paymentStatus === 'Lunas').reduce((sum, item) => sum + item.total, 0);
  const expenseTotal = filteredExpenses.reduce((sum, item) => sum + item.amount, 0);
  const difference = income - expenseTotal;

  return (
    <AdminPageLayout title="Keuangan & Laporan" subtitle="Ringkasan pemasukan dan pengeluaran berdasarkan pencatatan operasional." activeTab="Lainnya" showBottomNav>
      <View style={styles.periodRow}>{PERIODS.map((item) => <TouchableOpacity key={item} onPress={() => setPeriod(item)} style={[adminUi.chip, period === item && adminUi.chipActive]}><Text style={[styles.periodText, period === item && styles.periodActive]}>{item}</Text></TouchableOpacity>)}</View>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryEyebrow}>SELISIH OPERASIONAL · {period.toUpperCase()}</Text>
        <Text style={[styles.difference, difference < 0 && { color: '#B91C1C' }]}>{formatRupiah(difference)}</Text>
        <Text style={styles.summaryNote}>Pemasukan dikurangi pengeluaran yang tercatat.</Text>
      </View>
      <View style={styles.metricRow}>
        <View style={adminUi.card}><View style={adminUi.row}><Ionicons name="trending-up-outline" color="#15803D" size={18} /><Text style={styles.metricLabel}>Pemasukan</Text></View><Text style={styles.metricValue}>{formatRupiah(income)}</Text><Text style={styles.helper}>Transaksi berstatus Lunas</Text></View>
        <View style={adminUi.card}><View style={adminUi.row}><Ionicons name="trending-down-outline" color="#B45309" size={18} /><Text style={styles.metricLabel}>Pengeluaran</Text></View><Text style={styles.metricValue}>{formatRupiah(expenseTotal)}</Text><Text style={styles.helper}>Catatan biaya</Text></View>
      </View>
      <View style={adminUi.between}><Text style={adminUi.sectionTitle}>Rincian Periode</Text><TouchableOpacity onPress={() => router.push(`/admin/detail-laporan?period=${encodeURIComponent(period)}` as any)}><Text style={styles.link}>Lihat detail</Text></TouchableOpacity></View>
      <View style={adminUi.card}>
        <View style={adminUi.between}><Text style={styles.rowLabel}>Transaksi lunas</Text><Text style={styles.rowValue}>{filteredTransactions.filter((item) => item.paymentStatus === 'Lunas').length}</Text></View>
        <View style={adminUi.divider} />
        <View style={adminUi.between}><Text style={styles.rowLabel}>Jumlah transaksi</Text><Text style={styles.rowValue}>{filteredTransactions.length}</Text></View>
        <View style={adminUi.divider} />
        <View style={adminUi.between}><Text style={styles.rowLabel}>Catatan pengeluaran</Text><Text style={styles.rowValue}>{filteredExpenses.length}</Text></View>
      </View>
      <TouchableOpacity style={adminUi.outlineButton} onPress={() => router.push(`/admin/detail-laporan?period=${encodeURIComponent(period)}` as any)}><Ionicons name="document-text-outline" size={18} color={COLORS.secondaryDark} /><Text style={[adminUi.buttonText, { marginLeft: 8 }]}>Buka Detail Laporan</Text></TouchableOpacity>
      <Text style={styles.disclaimer}>Ringkasan ini bukan laporan akuntansi lengkap. Tidak mencakup neraca, pajak, depresiasi, atau rekonsiliasi bank.</Text>
    </AdminPageLayout>
  );
}
const styles = StyleSheet.create({
  periodRow: { flexDirection: 'row', gap: 7, marginBottom: SIZES.large }, periodText: { ...FONTS.caption, color: COLORS.textSecondary }, periodActive: { color: COLORS.secondaryDark, fontWeight: '700' },
  summaryCard: { backgroundColor: COLORS.secondaryDark, borderRadius: SIZES.radiusLarge, padding: SIZES.large, marginBottom: SIZES.medium }, summaryEyebrow: { ...FONTS.caption, color: '#BAE6FD', letterSpacing: 0.7 }, difference: { ...FONTS.display, color: '#FFFFFF', marginTop: 8 }, summaryNote: { ...FONTS.caption, color: '#E0F2FE', marginTop: 5 },
  metricRow: { flexDirection: 'row', gap: 9 }, metricLabel: { ...FONTS.caption, color: COLORS.textSecondary, marginLeft: 6 }, metricValue: { ...FONTS.headline3, color: COLORS.textPrimary, marginTop: 12 }, helper: { ...FONTS.caption, color: COLORS.textSecondary, marginTop: 3 },
  link: { ...FONTS.labelMedium, color: COLORS.secondaryDark, marginTop: SIZES.large }, rowLabel: { ...FONTS.body, color: COLORS.textSecondary }, rowValue: { ...FONTS.labelMedium, color: COLORS.textPrimary }, disclaimer: { ...FONTS.caption, color: COLORS.textSecondary, lineHeight: 18, marginTop: SIZES.large },
});
