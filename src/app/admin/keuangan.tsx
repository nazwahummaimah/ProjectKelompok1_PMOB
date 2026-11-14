
import React, { useMemo, useState } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import AdminPageLayout, {
  adminUi,
} from '../../components/organisms/AdminPageLayout';

import { useAdmin } from '../../context/AdminContext';

import {
  ExpenseCategory,
  PaymentMethod,
  formatRupiah,
} from '../../constants/adminTypes';

import {
  COLORS,
  FONTS,
  SIZES,
} from '../../constants/theme';

type Period = 'Hari ini' | 'Minggu ini' | 'Bulan ini';

const PERIODS: Period[] = [
  'Hari ini',
  'Minggu ini',
  'Bulan ini',
];

const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Perawatan',
  'Spare Part',
  'Operasional',
  'Lainnya',
];

const PAYMENT_METHODS: PaymentMethod[] = [
  'Tunai',
  'QRIS',
];

const getLocalDate = (date: Date = new Date()): string => {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
};

// Mengambil bagian tanggal dari string YYYY-MM-DD
// maupun timestamp ISO.
const getDateKey = (value?: string | null): string => {
  if (!value) return '';

  return value.slice(0, 10);
};

const getWeekStart = (): string => {
  const date = new Date();
  date.setDate(date.getDate() - 6);

  return getLocalDate(date);
};

export default function FinanceScreen() {
  const router = useRouter();

  const {
    transactions,
    expenses,
  } = useAdmin();

  const [period, setPeriod] = useState<Period>('Bulan ini');

  const today = getLocalDate();
  const weekStart = getWeekStart();
  const monthStart = today.slice(0, 7);

  // Filter transaksi berdasarkan periode.
  const filteredTransactions = useMemo(() => {
    return transactions.filter((item) => {
      const date = getDateKey(item.date);

      if (!date) return false;

      if (period === 'Hari ini') {
        return date === today;
      }

      if (period === 'Minggu ini') {
        return date >= weekStart && date <= today;
      }

      return date.startsWith(monthStart);
    });
  }, [
    transactions,
    period,
    today,
    weekStart,
    monthStart,
  ]);

  // Filter pengeluaran berdasarkan periode.
  const filteredExpenses = useMemo(() => {
    return expenses.filter((item) => {
      const date = getDateKey(item.date);

      if (!date) return false;

      if (period === 'Hari ini') {
        return date === today;
      }

      if (period === 'Minggu ini') {
        return date >= weekStart && date <= today;
      }

      return date.startsWith(monthStart);
    });
  }, [
    expenses,
    period,
    today,
    weekStart,
    monthStart,
  ]);

  // Transaksi yang pembayarannya sudah lunas.
  const paidTransactions = useMemo(
    () =>
      filteredTransactions.filter(
        (item) => item.paymentStatus === 'Lunas',
      ),
    [filteredTransactions],
  );

  // Transaksi yang belum lunas.
  const unpaidTransactions = useMemo(
    () =>
      filteredTransactions.filter(
        (item) => item.paymentStatus === 'Belum Lunas',
      ),
    [filteredTransactions],
  );

  // Total pemasukan dari transaksi lunas.
  const income = useMemo(
    () =>
      paidTransactions.reduce(
        (sum, item) => sum + Number(item.total || 0),
        0,
      ),
    [paidTransactions],
  );

  // Total pengeluaran.
  const expenseTotal = useMemo(
    () =>
      filteredExpenses.reduce(
        (sum, item) => sum + Number(item.amount || 0),
        0,
      ),
    [filteredExpenses],
  );

  // Selisih operasional.
  const difference = income - expenseTotal;

  // Rincian pemasukan berdasarkan metode pembayaran.
  const paymentBreakdown = useMemo(() => {
    return PAYMENT_METHODS.map((method) => {
      const methodTransactions = paidTransactions.filter(
        (item) => item.paymentMethod === method,
      );

      const amount = methodTransactions.reduce(
        (sum, item) => sum + Number(item.total || 0),
        0,
      );

      return {
        method,
        amount,
        count: methodTransactions.length,
      };
    });
  }, [paidTransactions]);

  // Rincian pengeluaran berdasarkan kategori.
  const expenseBreakdown = useMemo(() => {
    return EXPENSE_CATEGORIES.map((category) => {
      const categoryExpenses = filteredExpenses.filter(
        (item) => item.category === category,
      );

      const amount = categoryExpenses.reduce(
        (sum, item) => sum + Number(item.amount || 0),
        0,
      );

      return {
        category,
        amount,
        count: categoryExpenses.length,
      };
    });
  }, [filteredExpenses]);

  const openDetailReport = () => {
    router.push(
      `/admin/detail-laporan?period=${encodeURIComponent(period)}` as any,
    );
  };

  return (
    <AdminPageLayout
      title="Keuangan & Laporan"
      subtitle="Pantau pemasukan, pengeluaran, dan kondisi keuangan operasional."
      activeTab="Lainnya"
      showBottomNav
    >
      {/* FILTER PERIODE */}
      <Text style={styles.sectionHeading}>
        Periode Laporan
      </Text>

      <View style={styles.periodRow}>
        {PERIODS.map((item) => {
          const selected = period === item;

          return (
            <TouchableOpacity
              key={item}
              onPress={() => setPeriod(item)}
              style={[
                adminUi.chip,
                selected && adminUi.chipActive,
              ]}
            >
              <Text
                style={[
                  styles.periodText,
                  selected && styles.periodActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* RINGKASAN LABA / SELISIH */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <View style={styles.summaryIcon}>
            <Ionicons
              name="wallet-outline"
              size={21}
              color="#FFFFFF"
            />
          </View>

          <Text style={styles.summaryEyebrow}>
            SELISIH OPERASIONAL · {period.toUpperCase()}
          </Text>
        </View>

        <Text
          style={[
            styles.difference,
            difference < 0 && styles.negativeDifference,
          ]}
        >
          {formatRupiah(difference)}
        </Text>

        <Text style={styles.summaryNote}>
          Pemasukan dikurangi pengeluaran yang tercatat.
        </Text>

        <View style={styles.summaryDivider} />

        <View style={styles.summaryFooter}>
          <View>
            <Text style={styles.summaryFooterLabel}>
              Total pemasukan
            </Text>

            <Text style={styles.summaryFooterValue}>
              {formatRupiah(income)}
            </Text>
          </View>

          <View>
            <Text style={styles.summaryFooterLabel}>
              Total pengeluaran
            </Text>

            <Text style={styles.summaryFooterValue}>
              {formatRupiah(expenseTotal)}
            </Text>
          </View>
        </View>
      </View>

      {/* METRIK UTAMA */}
      <Text style={styles.sectionHeading}>
        Ringkasan Keuangan
      </Text>

      <View style={styles.metricRow}>
        <View style={[adminUi.card, styles.metricCard]}>
          <View style={styles.metricIcon}>
            <Ionicons
              name="trending-up-outline"
              size={20}
              color="#15803D"
            />
          </View>

          <Text style={styles.metricLabel}>
            Pemasukan
          </Text>

          <Text style={styles.metricValue}>
            {formatRupiah(income)}
          </Text>

          <Text style={styles.helper}>
            {paidTransactions.length} transaksi lunas
          </Text>
        </View>

        <View style={[adminUi.card, styles.metricCard]}>
          <View style={styles.metricIcon}>
            <Ionicons
              name="trending-down-outline"
              size={20}
              color="#B45309"
            />
          </View>

          <Text style={styles.metricLabel}>
            Pengeluaran
          </Text>

          <Text style={styles.metricValue}>
            {formatRupiah(expenseTotal)}
          </Text>

          <Text style={styles.helper}>
            {filteredExpenses.length} catatan biaya
          </Text>
        </View>
      </View>

      {/* STATUS TRANSAKSI */}
      <Text style={styles.sectionHeading}>
        Status Transaksi
      </Text>

      <View style={adminUi.card}>
        <View style={styles.statusRow}>
          <View style={styles.statusInfo}>
            <View style={[styles.statusDot, { backgroundColor: '#16A34A' }]} />
            <Text style={styles.rowLabel}>
              Transaksi lunas
            </Text>
          </View>

          <Text style={styles.rowValue}>
            {paidTransactions.length}
          </Text>
        </View>

        <View style={adminUi.divider} />

        <View style={styles.statusRow}>
          <View style={styles.statusInfo}>
            <View style={[styles.statusDot, { backgroundColor: '#D97706' }]} />
            <Text style={styles.rowLabel}>
              Belum lunas
            </Text>
          </View>

          <Text style={styles.rowValue}>
            {unpaidTransactions.length}
          </Text>
        </View>

        <View style={adminUi.divider} />

        <View style={styles.statusRow}>
          <Text style={styles.rowLabel}>
            Total transaksi
          </Text>

          <Text style={styles.rowValue}>
            {filteredTransactions.length}
          </Text>
        </View>
      </View>

      {/* PEMASUKAN BERDASARKAN PEMBAYARAN */}
      <Text style={styles.sectionHeading}>
        Rincian Pemasukan
      </Text>

      <View style={adminUi.card}>
        {paymentBreakdown.map((item, index) => (
          <React.Fragment key={item.method}>
            <View style={styles.breakdownRow}>
              <View style={styles.breakdownInfo}>
                <View style={styles.breakdownIcon}>
                  <Ionicons
                    name={
                      item.method === 'Tunai'
                        ? 'cash-outline'
                        : 'qr-code-outline'
                    }
                    size={19}
                    color={COLORS.secondaryDark}
                  />
                </View>

                <View style={styles.breakdownText}>
                  <Text style={styles.breakdownTitle}>
                    {item.method}
                  </Text>

                  <Text style={styles.helper}>
                    {item.count} transaksi
                  </Text>
                </View>
              </View>

              <Text style={styles.breakdownAmount}>
                {formatRupiah(item.amount)}
              </Text>
            </View>

            {index < paymentBreakdown.length - 1 ? (
              <View style={adminUi.divider} />
            ) : null}
          </React.Fragment>
        ))}
      </View>

      {/* PENGELUARAN BERDASARKAN KATEGORI */}
      <Text style={styles.sectionHeading}>
        Rincian Pengeluaran
      </Text>

      <View style={adminUi.card}>
        {expenseBreakdown.map((item, index) => (
          <React.Fragment key={item.category}>
            <View style={styles.breakdownRow}>
              <View style={styles.breakdownInfo}>
                <View style={styles.categoryIndicator}>
                  <Ionicons
                    name="receipt-outline"
                    size={18}
                    color="#B45309"
                  />
                </View>

                <View style={styles.breakdownText}>
                  <Text style={styles.breakdownTitle}>
                    {item.category}
                  </Text>

                  <Text style={styles.helper}>
                    {item.count} catatan
                  </Text>
                </View>
              </View>

              <Text style={styles.breakdownAmount}>
                {formatRupiah(item.amount)}
              </Text>
            </View>

            {index < expenseBreakdown.length - 1 ? (
              <View style={adminUi.divider} />
            ) : null}
          </React.Fragment>
        ))}
      </View>

      {/* DETAIL LAPORAN */}
      <Text style={styles.sectionHeading}>
        Laporan Keuangan
      </Text>

      <View style={adminUi.card}>
        <View style={styles.reportHeader}>
          <View style={styles.reportIcon}>
            <Ionicons
              name="document-text-outline"
              size={23}
              color={COLORS.secondaryDark}
            />
          </View>

          <View style={styles.reportInfo}>
            <Text style={styles.reportTitle}>
              Detail Laporan Keuangan
            </Text>

            <Text style={styles.helper}>
              Lihat rincian transaksi dan pengeluaran berdasarkan periode.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={adminUi.button}
          onPress={openDetailReport}
          activeOpacity={0.8}
        >
          <Text style={adminUi.buttonText}>
            Buka Detail Laporan
          </Text>

          <Ionicons
            name="arrow-forward"
            size={17}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>

      {/* CATATAN */}
      <View style={styles.disclaimerCard}>
        <Ionicons
          name="information-circle-outline"
          size={19}
          color={COLORS.textSecondary}
        />

        <Text style={styles.disclaimer}>
          Ringkasan ini merupakan laporan operasional sederhana.
          Belum mencakup neraca, pajak, depresiasi aset, atau rekonsiliasi bank.
          Pemasukan dihitung dari transaksi dengan status pembayaran Lunas.
        </Text>
      </View>
    </AdminPageLayout>
  );
}

const styles = StyleSheet.create({
  sectionHeading: {
    ...FONTS.labelLarge,
    color: COLORS.textPrimary,
    marginBottom: 12,
    marginTop: 5,
  },

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
    marginBottom: SIZES.large,
  },

  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },

  summaryIcon: {
    width: 35,
    height: 35,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  summaryEyebrow: {
    ...FONTS.caption,
    color: '#BAE6FD',
    letterSpacing: 0.5,
    flexShrink: 1,
  },

  difference: {
    ...FONTS.display,
    color: '#FFFFFF',
    marginTop: 12,
  },

  negativeDifference: {
    color: '#FCA5A5',
  },

  summaryNote: {
    ...FONTS.caption,
    color: '#E0F2FE',
    marginTop: 5,
  },

  summaryDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginVertical: 16,
  },

  summaryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },

  summaryFooterLabel: {
    ...FONTS.caption,
    color: '#BAE6FD',
  },

  summaryFooterValue: {
    ...FONTS.labelMedium,
    color: '#FFFFFF',
    marginTop: 5,
  },

  metricRow: {
    flexDirection: 'row',
    gap: 9,
    marginBottom: SIZES.large,
  },

  metricCard: {
    flex: 1,
    minWidth: 0,
    marginBottom: 0,
  },

  metricIcon: {
    width: 35,
    height: 35,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  metricLabel: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: 10,
  },

  metricValue: {
    ...FONTS.headline3,
    color: COLORS.textPrimary,
    marginTop: 7,
  },

  helper: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: 4,
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 35,
  },

  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  rowLabel: {
    ...FONTS.body,
    color: COLORS.textSecondary,
  },

  rowValue: {
    ...FONTS.labelMedium,
    color: COLORS.textPrimary,
  },

  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    paddingVertical: 5,
  },

  breakdownInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
    gap: 10,
  },

  breakdownIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },

  categoryIndicator: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },

  breakdownText: {
    flex: 1,
    minWidth: 0,
  },

  breakdownTitle: {
    ...FONTS.labelMedium,
    color: COLORS.textPrimary,
  },

  breakdownAmount: {
    ...FONTS.labelMedium,
    color: COLORS.textPrimary,
    textAlign: 'right',
    flexShrink: 0,
  },

  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },

  reportIcon: {
    width: 43,
    height: 43,
    borderRadius: 12,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },

  reportInfo: {
    flex: 1,
    minWidth: 0,
  },

  reportTitle: {
    ...FONTS.labelMedium,
    color: COLORS.textPrimary,
  },

  disclaimerCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    marginTop: SIZES.large,
    marginBottom: SIZES.large,
    padding: 12,
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radiusMedium,
  },

  disclaimer: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    lineHeight: 19,
    flex: 1,
  },
});
