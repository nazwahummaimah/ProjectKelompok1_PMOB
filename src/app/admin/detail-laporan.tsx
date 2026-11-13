import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AdminPageLayout, { adminUi } from '../../components/organisms/AdminPageLayout';
import AdminDataState from '../../components/molecules/AdminDataState';
import { useAdmin } from '../../context/AdminContext';
import { formatRupiah } from '../../constants/adminTypes';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

export default function ReportDetailScreen() {
  const params = useLocalSearchParams<{ period?: string }>();
  const period = Array.isArray(params.period) ? params.period[0] : params.period ?? 'Bulan ini';
  const { transactions, expenses, loading, error, refreshData } = useAdmin();
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const weekStartDate = new Date(now);
  weekStartDate.setDate(now.getDate() - 6);
  const weekStart = `${weekStartDate.getFullYear()}-${String(weekStartDate.getMonth() + 1).padStart(2, '0')}-${String(weekStartDate.getDate()).padStart(2, '0')}`;
  const monthStart = today.slice(0, 7);
  const matches = (date: string) => period === 'Hari ini'
    ? date === today
    : period === 'Minggu ini'
      ? date >= weekStart && date <= today
      : date.startsWith(monthStart);
  const transactionRows = transactions.filter((item) => item.paymentStatus === 'Lunas' && matches(item.date));
  const expenseRows = expenses.filter((item) => matches(item.date));
  const income = transactionRows.reduce((sum, item) => sum + item.total, 0);
  const expenseTotal = expenseRows.reduce((sum, item) => sum + item.amount, 0);

  return (
    <AdminPageLayout title="Detail Laporan" subtitle={`Periode: ${period}`} showBack>
      {loading ? <AdminDataState kind="loading" title="Memuat detail laporan" description="Data pemasukan dan pengeluaran sedang diambil." /> : null}
      {!loading && error ? <AdminDataState kind="error" title="Detail laporan belum dapat dimuat" description="Periksa koneksi, lalu coba muat data kembali." onRetry={refreshData} /> : null}
      {!loading && !error && transactions.length === 0 && expenses.length === 0 ? (
        <AdminDataState kind="empty" title="Belum ada data laporan" description="Laporan akan terisi setelah transaksi atau pengeluaran dicatat." />
      ) : null}
      {!loading && !error && (transactions.length > 0 || expenses.length > 0) ? (
        <>
          <View style={styles.summary}>
            <Text style={styles.summaryLabel}>SELISIH OPERASIONAL</Text>
            <Text style={styles.summaryValue}>{formatRupiah(income - expenseTotal)}</Text>
          </View>

          <Text style={adminUi.sectionTitle}>Pemasukan · {transactionRows.length} transaksi</Text>
          {transactionRows.map((item) => (
            <View key={item.id} style={styles.row}>
              <View style={styles.rowContent}>
                <Text style={styles.rowTitle}>{item.customerName}</Text>
                <Text style={styles.meta}>{item.id} · {item.date}</Text>
              </View>
              <Text style={styles.amount}>{formatRupiah(item.total)}</Text>
            </View>
          ))}
          {transactionRows.length === 0 ? <Text style={styles.empty}>Tidak ada pemasukan lunas pada periode ini.</Text> : null}

          <Text style={adminUi.sectionTitle}>Pengeluaran · {expenseRows.length} catatan</Text>
          {expenseRows.map((item) => (
            <View key={item.id} style={styles.row}>
              <View style={styles.rowContent}>
                <Text style={styles.rowTitle}>{item.description}</Text>
                <Text style={styles.meta}>{item.category} · {item.date}</Text>
              </View>
              <Text style={styles.expenseAmount}>−{formatRupiah(item.amount)}</Text>
            </View>
          ))}
          {expenseRows.length === 0 ? <Text style={styles.empty}>Tidak ada pengeluaran tercatat pada periode ini.</Text> : null}

          <View style={adminUi.card}>
            <Info label="Total pemasukan" value={formatRupiah(income)} />
            <Info label="Total pengeluaran" value={formatRupiah(expenseTotal)} />
            <Info label="Selisih operasional" value={formatRupiah(income - expenseTotal)} last />
          </View>
          <View style={styles.notice}>
            <Text style={styles.noticeText}>Ekspor PDF belum tersedia. Rincian di atas dapat dilihat langsung pada halaman ini.</Text>
          </View>
        </>
      ) : null}
    </AdminPageLayout>
  );
}

function Info({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.infoRow, last && styles.infoRowLast]}>
      <Text style={styles.meta}>{label}</Text>
      <Text style={styles.rowTitle}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  summary: { backgroundColor: COLORS.secondaryDark, borderRadius: SIZES.radiusLarge, padding: SIZES.large },
  summaryLabel: { ...FONTS.caption, color: '#BAE6FD' },
  summaryValue: { ...FONTS.headline1, color: '#FFFFFF', marginTop: 5 },
  row: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: SIZES.radiusMedium, padding: 12, flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  rowContent: { flex: 1, minWidth: 0 },
  rowTitle: { ...FONTS.labelMedium, color: COLORS.textPrimary },
  meta: { ...FONTS.caption, color: COLORS.textSecondary, marginTop: 3 },
  amount: { ...FONTS.labelMedium, color: '#15803D', marginLeft: 8 },
  expenseAmount: { ...FONTS.labelMedium, color: '#92400E', marginLeft: 8 },
  empty: { ...FONTS.caption, color: COLORS.textSecondary, marginBottom: 12 },
  infoRow: { paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  infoRowLast: { borderBottomWidth: 0 },
  notice: { backgroundColor: '#F1F5F9', borderRadius: SIZES.radiusMedium, padding: SIZES.medium, marginTop: SIZES.medium },
  noticeText: { ...FONTS.caption, color: COLORS.textSecondary, lineHeight: 19 },
});
