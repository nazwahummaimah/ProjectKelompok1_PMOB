
import React, { useMemo, useState } from 'react';

import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useRouter } from 'expo-router';

import HeaderApp from '../../components/molecules/HeaderApp';

import BottomNavBar, {
  UserTabType,
} from '../../components/molecules/BottomNavBar';

import RentalStatusBadge from '../../components/molecules/RentalStatusBadge';

import { COLORS, FONTS, SIZES } from '../../constants/theme';

import { formatRupiah } from '../../constants/adminDemo';

import { useUserRentalHistory } from '../../hooks/use-user-rental-history';

import type {
  TransactionWithItems,
} from '../../services/transactionService';

type HistoryFilter =
  | 'Semua'
  | 'Menunggu Serah Terima'
  | 'Sedang Berlangsung'
  | 'Selesai';

const FILTERS: HistoryFilter[] = [
  'Semua',
  'Menunggu Serah Terima',
  'Sedang Berlangsung',
  'Selesai',
];

export default function RentalHistoryScreen() {
  const router = useRouter();

  const [filter, setFilter] = useState<HistoryFilter>('Semua');

  const {
    history,
    summary,
    loading,
    refreshing,
    error,
    refresh,
  } = useUserRentalHistory();

  const filteredRentals = useMemo(
    () =>
      filter === 'Semua'
        ? history
        : history.filter((rental) => rental.status === filter),
    [history, filter]
  );

  const handleTabPress = (tab: UserTabType) => {
    switch (tab) {
      case 'Beranda':
        router.push('/user' as any);
        break;

      case 'Riwayat':
        break;

      case 'Scan':
        router.push({
          pathname: '/public/durasi-sewa' as any,
          params: { source: 'user' },
        });
        break;

      case 'Profil':
        router.push('/user/profil' as any);
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <HeaderApp />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}

        <View style={styles.titleSection}>
          <Text style={styles.eyebrow}>
            AKTIVITAS AKUN
          </Text>

          <Text style={styles.pageTitle}>
            Riwayat Sewa
          </Text>

          <Text style={styles.pageSubtitle}>
            Semua aktivitas penyewaan sepeda yang terhubung
            dengan akunmu.
          </Text>
        </View>

        {/* SUMMARY */}

        {!loading && !error ? <View style={styles.summaryStrip}>
          <View style={styles.summaryCell}>
            <Text style={styles.summaryValue}>
              {summary.total}
            </Text>

            <Text style={styles.summaryLabel}>
              Total
            </Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryCell}>
            <Text style={styles.summaryValue}>
              {summary.ongoing}
            </Text>

            <Text style={styles.summaryLabel}>
              Berlangsung
            </Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryCell}>
            <Text style={styles.summaryValue}>
              {summary.completed}
            </Text>

            <Text style={styles.summaryLabel}>
              Selesai
            </Text>
          </View>
        </View> : null}

        {/* FILTER */}

        <View style={styles.filterRow}>
          {FILTERS.map((option) => {
            const selected = filter === option;

            const label =
              option === 'Menunggu Serah Terima'
                ? 'Menunggu'
                : option === 'Sedang Berlangsung'
                  ? 'Berlangsung'
                  : option;

            return (
              <TouchableOpacity
                key={option}
                style={[
                  styles.filterChip,
                  selected && styles.filterChipActive,
                ]}
                onPress={() => setFilter(option)}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={`Filter ${label}`}
              >
                <Text
                  style={[
                    styles.filterText,
                    selected && styles.filterTextActive,
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* LIST HEADER */}

        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>
            Daftar Penyewaan
          </Text>

          <Text style={styles.listCount}>
            {loading ? 'Memuat...' : error ? 'Data belum tersedia' : `${filteredRentals.length} transaksi`}
          </Text>
        </View>

        {/* LOADING */}

        {loading ? (
          <View style={styles.stateContainer}>
            <ActivityIndicator
              size="large"
              color={COLORS.secondaryDark}
            />

            <Text style={styles.stateText}>
              Memuat riwayat penyewaan...
            </Text>
          </View>
        ) : error ? (
          /* ERROR */

          <View style={styles.emptyState}>
            <Ionicons
              name="alert-circle-outline"
              size={36}
              color="#DC2626"
            />

            <Text style={styles.emptyTitle}>
              Gagal memuat riwayat
            </Text>

            <Text style={styles.emptyDescription}>
              {error}
            </Text>

            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => {
                void refresh();
              }}
              disabled={refreshing}
              accessibilityRole="button"
              accessibilityLabel="Muat ulang riwayat penyewaan"
              accessibilityState={{ disabled: refreshing }}
            >
              <Text style={styles.retryText}>
                Coba Lagi
              </Text>
            </TouchableOpacity>
          </View>
        ) : filteredRentals.length > 0 ? (
          /* TRANSACTION LIST */

          filteredRentals.map((rental) => (
            <RentalCard
              key={rental.id}
              rental={rental}
              onPress={() =>
                router.push({
                  pathname: '/user/detail-riwayat' as any,
                  params: { id: rental.id },
                })
              }
            />
          ))
        ) : (
          /* EMPTY STATE */

          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="receipt-outline"
                size={28}
                color={COLORS.secondaryDark}
              />
            </View>

            <Text style={styles.emptyTitle}>
              Belum ada riwayat
            </Text>

            <Text style={styles.emptyDescription}>
              Transaksi yang terhubung dengan akunmu akan
              muncul di sini setelah Admin membuat transaksi.
            </Text>
          </View>
        )}

        {!loading && !error && history.length > 0 ? (
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={() => {
              void refresh();
            }}
            disabled={refreshing}
          >
            {refreshing ? (
              <ActivityIndicator
                size="small"
                color={COLORS.secondaryDark}
              />
            ) : (
              <Ionicons
                name="refresh-outline"
                size={17}
                color={COLORS.secondaryDark}
              />
            )}

            <Text style={styles.refreshText}>
              Perbarui Riwayat
            </Text>
          </TouchableOpacity>
        ) : null}
      </ScrollView>

      <BottomNavBar
        variant="user"
        activeTab="Riwayat"
        onTabPress={handleTabPress}
      />
    </SafeAreaView>
  );
}

// =========================================
// KARTU TRANSAKSI
// =========================================

function RentalCard({
  rental,
  onPress,
}: {
  rental: TransactionWithItems;
  onPress: () => void;
}) {
  const firstItem = rental.transaction_items[0];

  const firstBike = firstItem?.bikes;

  const extraUnits = Math.max(
    0,
    rental.transaction_items.length - 1
  );

  const bikeName = firstBike?.name ?? 'Sepeda';

  const bikeLabel = extraUnits > 0
    ? `${bikeName} +${extraUnits} unit`
    : bikeName;

  const bikeIds = rental.transaction_items
    .map((item) => item.bike_id)
    .join(', ');

  const date = formatDate(rental.rental_date);

  const ongoing = rental.status === 'Sedang Berlangsung';

  const pending = rental.status === 'Menunggu Serah Terima';

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.82}
      onPress={onPress}
    >
      <View style={styles.cardTop}>
        <View style={{ flex: 1 }}>
          <Text style={styles.transactionCode}>
            {rental.transaction_code}
          </Text>

          <Text style={styles.cardDate}>
            {date}
          </Text>
        </View>

        <RentalStatusBadge status={rental.status} />
      </View>

      <View style={styles.cardDivider} />

      <View style={styles.bikeRow}>
        <View style={styles.bikeIcon}>
          <Ionicons
            name="bicycle"
            size={25}
            color={COLORS.secondaryDark}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.bikeName}>
            {bikeLabel}
          </Text>

          <Text style={styles.bikeUnit}>
            Unit {bikeIds || '-'}
          </Text>

          <Text style={styles.bikeCategory}>
            {firstBike?.category ?? '-'}
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={18}
          color={COLORS.textSecondary}
        />
      </View>

      <View style={styles.cardBottom}>
        <View style={styles.durationInfo}>
          <Ionicons
            name="time-outline"
            size={15}
            color={COLORS.textSecondary}
          />

          <Text style={styles.cardDuration}>
            {rental.duration_hours} jam
          </Text>
        </View>

        <Text
          style={[
            styles.cardAmount,
            (ongoing || pending) && styles.ongoingAmount,
          ]}
        >
          {ongoing
            ? 'Sedang berlangsung'
            : pending
              ? 'Menunggu serah terima'
              : formatRupiah(Number(rental.total))}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

// =========================================
// FORMAT TANGGAL
// =========================================

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  });
}

// =========================================
// STYLES
// =========================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scrollContent: {
    padding: SIZES.large,
    paddingBottom: SIZES.large,
  },

  titleSection: {
    marginBottom: SIZES.large,
  },

  eyebrow: {
    ...FONTS.caption,
    color: COLORS.secondaryDark,
    fontWeight: '700',
    letterSpacing: 1.1,
    marginBottom: 5,
  },

  pageTitle: {
    ...FONTS.headline1,
    color: COLORS.textPrimary,
  },

  pageSubtitle: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    marginTop: 5,
    lineHeight: 21,
  },

  summaryStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusMedium,
    paddingVertical: SIZES.medium,
    marginBottom: SIZES.large,
  },

  summaryCell: {
    flex: 1,
    alignItems: 'center',
  },

  summaryValue: {
    ...FONTS.headline2,
    color: COLORS.secondaryDark,
  },

  summaryLabel: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  summaryDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.border,
  },

  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginBottom: SIZES.large,
  },

  filterChip: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: SIZES.radiusPill,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },

  filterChipActive: {
    backgroundColor: COLORS.secondaryDark,
    borderColor: COLORS.secondaryDark,
  },

  filterText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },

  filterTextActive: {
    color: COLORS.surface,
  },

  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },

  listTitle: {
    ...FONTS.headline3,
    color: COLORS.secondaryDark,
  },

  listCount: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLarge,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SIZES.large,
    marginBottom: SIZES.medium,
  },

  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },

  transactionCode: {
    ...FONTS.labelMedium,
    color: COLORS.textPrimary,
  },

  cardDate: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: 3,
  },

  cardDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SIZES.medium,
  },

  bikeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  bikeIcon: {
    width: 46,
    height: 46,
    borderRadius: SIZES.radiusMedium,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.medium,
  },

  bikeName: {
    ...FONTS.labelLarge,
    color: COLORS.secondaryDark,
  },

  bikeUnit: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  bikeCategory: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SIZES.medium,
    gap: 8,
  },

  durationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  cardDuration: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },

  cardAmount: {
    ...FONTS.labelMedium,
    color: COLORS.textPrimary,
    textAlign: 'right',
  },

  ongoingAmount: {
    color: COLORS.secondaryDark,
    fontSize: 12,
  },

  stateContainer: {
    minHeight: 170,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },

  stateText: {
    ...FONTS.body,
    color: COLORS.textSecondary,
  },

  emptyState: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusLarge,
    padding: SIZES.xxlarge,
  },

  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.medium,
  },

  emptyTitle: {
    ...FONTS.labelLarge,
    color: COLORS.textPrimary,
    marginTop: 10,
  },

  emptyDescription: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 5,
    lineHeight: 19,
  },

  retryButton: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: SIZES.radiusPill,
    backgroundColor: COLORS.secondaryDark,
  },

  retryText: {
    ...FONTS.labelMedium,
    color: COLORS.surface,
  },

  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    padding: 12,
    marginTop: 5,
  },

  refreshText: {
    ...FONTS.labelMedium,
    color: COLORS.secondaryDark,
  },
});
