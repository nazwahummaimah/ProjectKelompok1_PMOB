
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import {
  useRouter,
  useFocusEffect,
} from 'expo-router';

import AdminPageLayout, {
  adminUi,
} from '../../components/organisms/AdminPageLayout';

import AdminMetricCard from '../../components/molecules/AdminMetricCard';
import AdminActionRow from '../../components/molecules/AdminActionRow';
import AdminTransactionCard from '../../components/molecules/AdminTransactionCard';

import {
  AdminTransaction,
} from '../../constants/adminDemo';

import { COLORS, FONTS, SIZES } from '../../constants/theme';

import {
  getBikes,
  Bike,
} from '../../services/bikeService';

import {
  getTransactions,
} from '../../services/transactionService';

import { supabase } from '../../lib/supabase';

import type { Transaction } from '../../services/transactionService';

type TransactionItemReference = {
  transaction_id: string;
  bike_id: string;
};

export default function AdminDashboardScreen() {
  const router = useRouter();

  const [bikes, setBikes] = useState<Bike[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<AdminTransaction[]>([]);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const getLocalDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const formatDate = (value: string) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return '-';

    return getLocalDateKey(date);
  };

  const formatTime = (value: string) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return '-';

    return `${String(date.getHours()).padStart(2, '0')}.${String(
      date.getMinutes(),
    ).padStart(2, '0')} WIB`;
  };

  const formatToday = () => {
    return new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const mapTransactionToCard = (
    transaction: Transaction,
    unitIds: string[],
  ): AdminTransaction => {
    return {
      id: transaction.transaction_code,
      customerName: transaction.customer_name,
      phone: transaction.phone,
      customerType: transaction.customer_type,
      unitIds,
      date: formatDate(transaction.rental_date),
      startTime: formatTime(transaction.rental_date),
      estimatedEnd: transaction.estimated_end,
      durationHours: Number(transaction.duration_hours),
      dayType: transaction.day_type,
      hourlyRate: Number(transaction.hourly_rate),
      total: Number(transaction.total),
      paymentMethod: transaction.payment_method,
      paymentStatus: transaction.payment_status,
      guaranteeType: transaction.guarantee_type,
      status: transaction.status,
    };
  };

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage('');

      // Ambil inventaris dan transaksi langsung dari Supabase.
      const [bikeData, transactionData] = await Promise.all([
        getBikes(),
        getTransactions(),
      ]);

      setBikes(bikeData);
      setTransactions(transactionData);

      // Ambil dua transaksi terbaru untuk kartu dashboard.
      const latestTransactions = transactionData.slice(0, 2);

      if (latestTransactions.length === 0) {
        setRecentTransactions([]);
        return;
      }

      const transactionIds = latestTransactions.map(
        (transaction) => transaction.id,
      );

      // Ambil daftar sepeda yang terkait dengan transaksi terbaru.
      const { data: itemData, error: itemError } = await supabase
        .from('transaction_items')
        .select('transaction_id, bike_id')
        .in('transaction_id', transactionIds);

      if (itemError) {
        throw new Error(
          `Gagal mengambil detail unit transaksi: ${itemError.message}`,
        );
      }

      const items = (itemData ?? []) as TransactionItemReference[];

      const mappedTransactions = latestTransactions.map((transaction) => {
        const unitIds = items
          .filter((item) => item.transaction_id === transaction.id)
          .map((item) => item.bike_id);

        return mapTransactionToCard(transaction, unitIds);
      });

      setRecentTransactions(mappedTransactions);
    } catch (error) {
      console.error('Admin dashboard error:', error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Gagal mengambil data dashboard.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh dashboard ketika halaman kembali difokuskan.
  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, [loadDashboard]),
  );

  // Ringkasan inventaris aktual.
  const available = bikes.filter(
    (item) => item.status === 'Tersedia',
  ).length;

  const rented = bikes.filter(
    (item) => item.status === 'Sedang Disewa',
  ).length;

  const maintenance = bikes.filter(
    (item) => item.status === 'Perawatan',
  ).length;

  // Transaksi yang belum selesai.
  const activeTransactions = transactions.filter(
    (item) =>
      item.status === 'Sedang Berlangsung' ||
      item.status === 'Menunggu Serah Terima',
  );

  // Jumlah transaksi yang benar-benar selesai hari ini.
  const todayKey = getLocalDateKey(new Date());

  const completedToday = transactions.filter((item) => {
    if (item.status !== 'Selesai' || !item.actual_return_time) {
      return false;
    }

    return getLocalDateKey(
      new Date(item.actual_return_time),
    ) === todayKey;
  }).length;

  return (
    <AdminPageLayout
      title="Dashboard"
      subtitle="Ringkasan operasional Rental Sepeda Jamal_Jepret."
      activeTab="Dashboard"
      showBottomNav
    >
      {/* Welcome */}
      <View style={styles.welcomeCard}>
        <View style={styles.welcomeIcon}>
          <Ionicons
            name="speedometer-outline"
            size={23}
            color={COLORS.secondaryDark}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.welcomeEyebrow}>
            PANEL ADMIN
          </Text>

          <Text style={styles.welcomeTitle}>
            Selamat bertugas!
          </Text>

          <Text style={styles.welcomeText}>
            Pantau armada dan transaksi dari satu tempat.
          </Text>
        </View>
      </View>

      {/* Loading */}
      {loading && (
        <View style={styles.stateContainer}>
          <ActivityIndicator
            size="small"
            color={COLORS.secondaryDark}
          />

          <Text style={styles.stateText}>
            Memuat data dashboard...
          </Text>
        </View>
      )}

      {/* Error */}
      {!loading && !!errorMessage && (
        <View style={styles.errorContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={25}
            color="#DC2626"
          />

          <Text style={styles.errorText}>
            {errorMessage}
          </Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadDashboard}
          >
            <Text style={styles.retryButtonText}>
              Coba Lagi
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Dashboard Data */}
      {!errorMessage && (
        <>
          {/* Ringkasan Inventaris */}
          <Text style={adminUi.sectionTitle}>
            Ringkasan Inventaris
          </Text>

          <View style={styles.metricGrid}>
            <AdminMetricCard
              label="Total unit"
              value={loading ? '-' : bikes.length}
              icon="bicycle-outline"
            />

            <AdminMetricCard
              label="Tersedia"
              value={loading ? '-' : available}
              icon="checkmark-circle-outline"
              tone="green"
            />
          </View>

          <View style={[styles.metricGrid, { marginTop: 10 }]}>
            <AdminMetricCard
              label="Disewa"
              value={loading ? '-' : rented}
              icon="time-outline"
              tone="blue"
            />

            <AdminMetricCard
              label="Perawatan"
              value={loading ? '-' : maintenance}
              icon="construct-outline"
              tone="orange"
            />
          </View>

          {/* Operasional Hari Ini */}
          <View style={adminUi.between}>
            <Text style={adminUi.sectionTitle}>
              Operasional Hari Ini
            </Text>

            <Text style={styles.dateText}>
              {formatToday()}
            </Text>
          </View>

          <View style={adminUi.card}>
            <View style={adminUi.between}>
              <View style={styles.operationItem}>
                <Text style={styles.operationValue}>
                  {loading ? '-' : activeTransactions.length}
                </Text>

                <Text style={styles.operationLabel}>
                  Transaksi aktif
                </Text>
              </View>

              <View style={styles.verticalDivider} />

              <View style={styles.operationItem}>
                <Text style={styles.operationValue}>
                  {loading ? '-' : completedToday}
                </Text>

                <Text style={styles.operationLabel}>
                  Selesai hari ini
                </Text>
              </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.quickActions}>
              <TouchableOpacity
                style={styles.quickAction}
                onPress={() =>
                  router.push('/admin/buat-transaksi' as any)
                }
              >
                <Ionicons
                  name="add-circle-outline"
                  size={19}
                  color={COLORS.secondaryDark}
                />

                <Text style={styles.quickActionText}>
                  Buat transaksi
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickAction}
                onPress={() =>
                  router.push('/admin/form-unit' as any)
                }
              >
                <Ionicons
                  name="bicycle-outline"
                  size={19}
                  color={COLORS.secondaryDark}
                />

                <Text style={styles.quickActionText}>
                  Tambah unit
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Perlu Ditindaklanjuti */}
          <Text style={adminUi.sectionTitle}>
            Perlu Ditindaklanjuti
          </Text>

          <AdminActionRow
            title="Pengembalian sepeda"
            subtitle="Periksa transaksi yang sedang berlangsung."
            icon="return-up-back-outline"
            onPress={() =>
              router.push('/admin/transaksi?filter=active' as any)
            }
            rightText={String(rented)}
          />

          <AdminActionRow
            title="Unit dalam perawatan"
            subtitle="Lihat unit yang belum layak digunakan."
            icon="construct-outline"
            onPress={() =>
              router.push('/admin/perawatan' as any)
            }
            rightText={String(maintenance)}
          />

          {/* Transaksi Terbaru */}
          <View style={adminUi.between}>
            <Text style={adminUi.sectionTitle}>
              Transaksi Terbaru
            </Text>

            <TouchableOpacity
              onPress={() =>
                router.push('/admin/transaksi' as any)
              }
            >
              <Text style={styles.seeAll}>
                Lihat semua
              </Text>
            </TouchableOpacity>
          </View>

          {recentTransactions.map((transaction) => (
            <AdminTransactionCard
              key={transaction.id}
              transaction={transaction}
              onPress={() =>
                router.push(
                  `/admin/detail-transaksi?id=${
                    transactions.find(
                      (item) =>
                        item.transaction_code === transaction.id,
                    )?.id
                  }` as any,
                )
              }
            />
          ))}

          {!loading && recentTransactions.length === 0 && (
            <View style={styles.emptyTransaction}>
              <Ionicons
                name="receipt-outline"
                size={30}
                color={COLORS.textSecondary}
              />

              <Text style={styles.stateText}>
                Belum ada transaksi.
              </Text>
            </View>
          )}
        </>
      )}
    </AdminPageLayout>
  );
}

const styles = StyleSheet.create({
  welcomeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    padding: SIZES.large,
    borderRadius: SIZES.radiusLarge,
  },

  welcomeIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  welcomeEyebrow: {
    ...FONTS.caption,
    color: COLORS.secondaryDark,
    letterSpacing: 1,
  },

  welcomeTitle: {
    ...FONTS.headline3,
    color: COLORS.secondaryDark,
    marginTop: 2,
  },

  welcomeText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: 3,
  },

  metricGrid: {
    flexDirection: 'row',
    gap: 10,
  },

  dateText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: SIZES.large,
  },

  operationItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },

  operationValue: {
    ...FONTS.headline1,
    color: COLORS.secondaryDark,
  },

  operationLabel: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: 3,
    textAlign: 'center',
  },

  verticalDivider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 12,
  },

  quickActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },

  quickAction: {
    flex: 1,
    minHeight: 40,
    borderRadius: 10,
    backgroundColor: '#F0F9FF',
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },

  quickActionText: {
    ...FONTS.caption,
    color: COLORS.secondaryDark,
    fontWeight: '700',
  },

  seeAll: {
    ...FONTS.labelMedium,
    color: COLORS.secondaryDark,
    marginTop: SIZES.large,
  },

  stateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 8,
  },

  stateText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },

  errorContainer: {
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 18,
    marginTop: 16,
    gap: 10,
  },

  errorText: {
    ...FONTS.caption,
    color: '#B91C1C',
    textAlign: 'center',
  },

  retryButton: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 9,
  },

  retryButtonText: {
    ...FONTS.labelMedium,
    color: COLORS.textPrimary,
  },

  emptyTransaction: {
    alignItems: 'center',
    padding: 24,
    gap: 8,
  },
});
