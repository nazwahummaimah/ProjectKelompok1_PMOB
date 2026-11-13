import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AdminPageLayout, { adminUi } from '../../components/organisms/AdminPageLayout';
import AdminDataState from '../../components/molecules/AdminDataState';
import { useAdmin } from '../../context/AdminContext';
import { formatRupiah } from '../../constants/adminTypes';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

type Period = 'Hari ini' | 'Minggu ini' | 'Bulan ini';
const PERIODS: Period[] = ['Hari ini', 'Minggu ini', 'Bulan ini'];

const getDateBounds = () => {
  const today = new Date();
  const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join('-');

  const weekStartDate = new Date(today);
  weekStartDate.setDate(today.getDate() - 6);
  const weekStart = [
    weekStartDate.getFullYear(),
    String(weekStartDate.getMonth() + 1).padStart(2, '0'),
    String(weekStartDate.getDate()).padStart(2, '0'),
  ].join('-');

  return {
    today: todayString,
    weekStart,
    monthStart: todayString.slice(0, 7),
  };
};

export default function FinanceScreen() {
  const router = useRouter();
  const { transactions, expenses, loading, error, refreshData } = useAdmin();
  const [period, setPeriod] = useState<Period>('Bulan ini');
  const bounds = getDateBounds();

  const matchesPeriod = (date: string) => {
    if (period === 'Hari ini') return date === bounds.today;
    if (period === 'Minggu ini') {
      return date >= bounds.weekStart && date <= bounds.today;
    }
    return date.startsWith(bounds.monthStart);
  };

  const filteredTransactions = useMemo(
    () => transactions.filter((item) => matchesPeriod(item.date)),
    [transactions, period, bounds.today, bounds.weekStart, bounds.monthStart],
  );
  const filteredExpenses = useMemo(
    () => expenses.filter((item) => matchesPeriod(item.date)),
    [expenses, period, bounds.today, bounds.weekStart, bounds.monthStart],
  );

  const income = filteredTransactions
    .filter((item) => item.paymentStatus === 'Lunas')
    .reduce((sum, item) => sum + item.total, 0);
  const expenseTotal = filteredExpenses.reduce((sum, item) => sum + item.amount, 0);
  const difference = income - expenseTotal;
  const reportRoute = `/admin/detail-laporan?period=${encodeURIComponent(period)}`;

  return (
    <AdminPageLayout
      title="Keuangan & Laporan"
      subtitle="Ringkasan pemasukan dan pengeluaran berdasarkan pencatatan operasional."
      activeTab="Lainnya"
      showBottomNav
    >
      {loading ? (
        <AdminDataState
          kind="loading"
          title="Memuat ringkasan keuangan"
          description="Data transaksi dan pengeluaran sedang diambil."
        />
      ) : null}

      {!loading && error ? (
        <AdminDataState
          kind="error"
          title="Ringkasan belum dapat dimuat"
          description="Periksa koneksi, lalu coba muat data kembali."
          onRetry={refreshData}
        />
      ) : null}

      {!loading && !error && transactions.length === 0 && expenses.length === 0 ? (
        <AdminDataState
          kind="empty"
          title="Belum ada data keuangan"
          description="Ringkasan akan muncul setelah transaksi atau pengeluaran tercatat."
        />
      ) : null}

      {!loading && !error && (transactions.length > 0 || expenses.length > 0) ? (
        <>
          <View style={styles.periodRow}>
            {PERIODS.map((item) => {
              const selected = period === item;

              return (
                <TouchableOpacity
                  key={item}
                  onPress={() => setPeriod(item)}
                  style={[adminUi.chip, selected && adminUi.chipActive]}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  accessibilityLabel={`Tampilkan data ${item.toLowerCase()}`}
                >
                  <Text style={[styles.periodText, selected && styles.periodActive]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryEyebrow}>
              Selisih operasional · {period}
            </Text>
            <Text style={[styles.difference, difference < 0 && styles.negativeDifference]}>
              {formatRupiah(difference)}
            </Text>
            <Text style={styles.summaryNote}>
              Pemasukan dikurangi pengeluaran yang tercatat.
            </Text>
          </View>

          <View style={styles.metricRow}>
            <View style={[adminUi.card, styles.metricCard]}>
              <View style={adminUi.row}>
                <Ionicons name="trending-up-outline" color="#15803D" size={18} />
                <Text style={styles.metricLabel}>Pemasukan</Text>
              </View>
              <Text style={styles.metricValue}>{formatRupiah(income)}</Text>
              <Text style={styles.helper}>Transaksi berstatus Lunas</Text>
            </View>

            <View style={[adminUi.card, styles.metricCard]}>
              <View style={adminUi.row}>
                <Ionicons name="trending-down-outline" color="#B45309" size={18} />
                <Text style={styles.metricLabel}>Pengeluaran</Text>
              </View>
              <Text style={styles.metricValue}>{formatRupiah(expenseTotal)}</Text>
              <Text style={styles.helper}>Catatan biaya</Text>
            </View>
          </View>

          <View style={adminUi.between}>
            <Text style={adminUi.sectionTitle}>Rincian Periode</Text>
            <TouchableOpacity
              onPress={() => router.push(reportRoute as any)}
              accessibilityRole="button"
              accessibilityLabel="Lihat detail laporan"
              style={styles.detailLinkButton}
            >
              <Text style={styles.link}>Lihat detail</Text>
            </TouchableOpacity>
          </View>

          <View style={adminUi.card}>
            <Info
              label="Transaksi lunas"
              value={String(filteredTransactions.filter((item) => item.paymentStatus === 'Lunas').length)}
            />
            <View style={adminUi.divider} />
            <Info label="Jumlah transaksi" value={String(filteredTransactions.length)} />
            <View style={adminUi.divider} />
            <Info label="Catatan pengeluaran" value={String(filteredExpenses.length)} />
          </View>

          <TouchableOpacity
            style={adminUi.outlineButton}
            onPress={() => router.push(reportRoute as any)}
            accessibilityRole="button"
            accessibilityLabel="Buka detail laporan keuangan"
          >
            <Ionicons name="document-text-outline" size={18} color={COLORS.secondaryDark} />
            <Text style={[adminUi.buttonText, styles.reportButtonText]}>
              Buka Detail Laporan
            </Text>
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            Ringkasan ini bukan laporan akuntansi lengkap. Tidak mencakup neraca, pajak,
            depresiasi, atau rekonsiliasi bank.
          </Text>
        </>
      ) : null}
    </AdminPageLayout>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  periodRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginBottom: SIZES.large,
  },
  periodText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  periodActive: {
    color: COLORS.secondaryDark,
    fontWeight: '700',
  },
  summaryCard: {
    backgroundColor: COLORS.secondaryDark,
    borderRadius: SIZES.radiusLarge,
    padding: SIZES.large,
    marginBottom: SIZES.medium,
  },
  summaryEyebrow: {
    ...FONTS.caption,
    color: '#BAE6FD',
  },
  difference: {
    ...FONTS.display,
    color: COLORS.surface,
    marginTop: 8,
  },
  negativeDifference: {
    color: '#FECACA',
  },
  summaryNote: {
    ...FONTS.caption,
    color: '#E0F2FE',
    marginTop: 5,
  },
  metricRow: {
    flexDirection: 'row',
    gap: 9,
  },
  metricCard: {
    flex: 1,
    minWidth: 0,
  },
  metricLabel: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginLeft: 6,
  },
  metricValue: {
    ...FONTS.headline3,
    color: COLORS.textPrimary,
    marginTop: 12,
  },
  helper: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: 3,
  },
  detailLinkButton: {
    minHeight: 44,
    justifyContent: 'center',
  },
  link: {
    ...FONTS.labelMedium,
    color: COLORS.secondaryDark,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 7,
  },
  rowLabel: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    flex: 1,
  },
  rowValue: {
    ...FONTS.labelMedium,
    color: COLORS.textPrimary,
    textAlign: 'right',
  },
  reportButtonText: {
    marginLeft: 8,
  },
  disclaimer: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginTop: SIZES.large,
  },
});
