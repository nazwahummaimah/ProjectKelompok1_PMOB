
import React, { useCallback, useEffect, useState } from 'react';

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

import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router';

import HeaderApp from '../../components/molecules/HeaderApp';

import BottomNavBar, {
  UserTabType,
} from '../../components/molecules/BottomNavBar';

import RentalStatusBadge from '../../components/molecules/RentalStatusBadge';

import {
  COLORS,
  FONTS,
  SIZES,
} from '../../constants/theme';

import { formatRupiah } from '../../constants/adminDemo';

import {
  getMyRentalDetail,
} from '../../services/userRentalHistoryService';

import type {
  TransactionWithItems,
} from '../../services/transactionService';

export default function RentalHistoryDetailScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{ id?: string }>();

  const id = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const [rental, setRental] =
    useState<TransactionWithItems | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDetail = useCallback(async () => {
    if (!id) {
      setError('ID transaksi tidak ditemukan.');
      setRental(null);
      setLoading(false);
      return;
    }

    try {
      setError('');

      const result = await getMyRentalDetail(id);

      if (!result) {
        setRental(null);
        setError(
          'Transaksi tidak ditemukan atau tidak terhubung dengan akun ini.'
        );
        return;
      }

      setRental(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Gagal mengambil detail penyewaan.'
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadDetail();
  }, [loadDetail]);

  const handleTabPress = (tab: UserTabType) => {
    switch (tab) {
      case 'Beranda':
        router.push('/user' as any);
        break;

      case 'Riwayat':
        router.push('/user/riwayat' as any);
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

  const goBackToHistory = () => {
    router.replace('/user/riwayat' as any);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />

        <HeaderApp />

        <View style={styles.stateContainer}>
          <ActivityIndicator
            size="large"
            color={COLORS.secondaryDark}
          />

          <Text style={styles.stateText}>
            Memuat detail penyewaan...
          </Text>
        </View>

        <BottomNavBar
          variant="user"
          activeTab="Riwayat"
          onTabPress={handleTabPress}
        />
      </SafeAreaView>
    );
  }

  if (error || !rental) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />

        <HeaderApp />

        <View style={styles.emptyState}>
          <Ionicons
            name="alert-circle-outline"
            size={42}
            color="#DC2626"
          />

          <Text style={styles.pageTitle}>
            Transaksi tidak ditemukan
          </Text>

          <Text style={styles.errorDescription}>
            {error || 'Data transaksi tidak tersedia.'}
          </Text>

          <TouchableOpacity
            style={styles.backButton}
            onPress={goBackToHistory}
          >
            <Ionicons
              name="arrow-back"
              size={18}
              color={COLORS.surface}
            />

            <Text style={styles.backButtonText}>
              Kembali ke Riwayat
            </Text>
          </TouchableOpacity>
        </View>

        <BottomNavBar
          variant="user"
          activeTab="Riwayat"
          onTabPress={handleTabPress}
        />
      </SafeAreaView>
    );
  }

  const isOngoing =
    rental.status === 'Sedang Berlangsung';

  const isPending =
    rental.status === 'Menunggu Serah Terima';

  const isCompleted =
    rental.status === 'Selesai';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <HeaderApp />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* KEMBALI */}

        <TouchableOpacity
          style={styles.backLink}
          onPress={goBackToHistory}
        >
          <Ionicons
            name="arrow-back"
            size={18}
            color={COLORS.secondaryDark}
          />

          <Text style={styles.backText}>
            Kembali
          </Text>
        </TouchableOpacity>

        {/* HEADER TRANSAKSI */}

        <View style={styles.titleRow}>
          <View style={styles.titleCopy}>
            <Text style={styles.eyebrow}>
              DETAIL TRANSAKSI
            </Text>

            <Text style={styles.pageTitle}>
              Detail Sewa
            </Text>

            <Text style={styles.transactionId}>
              {rental.transaction_code}
            </Text>
          </View>

          <RentalStatusBadge status={rental.status} />
        </View>

        {/* DAFTAR SEPEDA */}

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>
            Sepeda yang Disewa
          </Text>

          {rental.transaction_items.map((item) => (
            <View
              key={item.id}
              style={styles.bikeCard}
            >
              <View style={styles.bikeIcon}>
                <Ionicons
                  name="bicycle"
                  size={30}
                  color={COLORS.secondaryDark}
                />
              </View>

              <View style={styles.bikeInfo}>
                <Text style={styles.bikeCategory}>
                  {item.bikes?.category ?? 'Kategori tidak tersedia'}
                </Text>

                <Text style={styles.bikeName}>
                  {item.bikes?.name ?? 'Sepeda tidak ditemukan'}
                </Text>

                <Text style={styles.bikeUnit}>
                  Unit {item.bike_id}
                </Text>

                {isCompleted && item.return_condition ? (
                  <Text style={styles.returnCondition}>
                    Kondisi kembali: {item.return_condition}
                  </Text>
                ) : null}

                {isCompleted && item.return_note ? (
                  <Text style={styles.returnNote}>
                    Catatan: {item.return_note}
                  </Text>
                ) : null}
              </View>
            </View>
          ))}
        </View>

        {/* STATUS NOTICE */}

        {(isOngoing || isPending) ? (
          <View style={styles.notice}>
            <Ionicons
              name="information-circle-outline"
              size={19}
              color={COLORS.secondaryDark}
            />

            <Text style={styles.noticeText}>
              {isPending
                ? 'Transaksi sudah dicatat oleh petugas. Serah terima sepeda dilakukan langsung di lokasi rental.'
                : 'Penyewaan masih berlangsung. Silakan selesaikan pengembalian langsung kepada petugas di lokasi rental.'}
            </Text>
          </View>
        ) : null}

        {/* INFORMASI PENYEWAAN */}

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>
            Informasi Penyewaan
          </Text>

          <InfoRow
            label="Tanggal sewa"
            value={formatDateTime(rental.rental_date)}
          />

          <InfoRow
            label="Estimasi selesai"
            value={formatDateTime(rental.estimated_end)}
          />

          <InfoRow
            label="Waktu pengembalian aktual"
            value={
              rental.actual_return_time
                ? formatDateTime(rental.actual_return_time)
                : isCompleted
                  ? '-'
                  : 'Belum dikembalikan'
            }
          />

          <InfoRow
            label="Durasi"
            value={`${rental.duration_hours} jam`}
          />

          <InfoRow
            label="Jumlah sepeda"
            value={`${rental.transaction_items.length} unit`}
          />

          <InfoRow
            label="Kategori penyewa"
            value={rental.customer_type}
          />

          <InfoRow
            label="Jenis hari"
            value={rental.day_type}
          />

          <InfoRow
            label="Tarif per jam"
            value={`${formatRupiah(Number(rental.hourly_rate))}/unit`}
          />
        </View>

        {/* PEMBAYARAN DAN JAMINAN */}

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>
            Pembayaran & Jaminan
          </Text>

          <InfoRow
            label="Metode pembayaran"
            value={rental.payment_method}
          />

          <InfoRow
            label="Status pembayaran"
            value={rental.payment_status}
          />

          <InfoRow
            label="Jenis jaminan"
            value={rental.guarantee_type}
          />

          <InfoRow
            label="Total pembayaran"
            value={formatRupiah(Number(rental.total))}
            last
          />
        </View>

        {/* INFORMASI PENGEMBALIAN */}

        {isCompleted ? (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>
              Informasi Pengembalian
            </Text>

            <InfoRow
              label="Waktu pengembalian"
              value={
                rental.actual_return_time
                  ? formatDateTime(rental.actual_return_time)
                  : '-'
              }
            />

            <InfoRow
              label="Catatan umum"
              value={rental.return_notes || 'Tidak ada catatan.'}
              last
            />

            <View style={styles.completedNotice}>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color="#15803D"
              />

              <Text style={styles.completedText}>
                Transaksi telah selesai.
              </Text>
            </View>
          </View>
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
// KOMPONEN INFORMASI
// =========================================

function InfoRow({
  label,
  value,
  last,
}: {
  label: string;
  value?: string;
  last?: boolean;
}) {
  return (
    <View
      style={[
        styles.infoRow,
        last && { borderBottomWidth: 0 },
      ]}
    >
      <Text style={styles.infoLabel}>
        {label}
      </Text>

      <Text style={styles.infoValue}>
        {value || '-'}
      </Text>
    </View>
  );
}

// =========================================
// FORMAT TANGGAL
// =========================================

function formatDateTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return (
    date.toLocaleString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Jakarta',
    }) + ' WIB'
  );
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

  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: SIZES.large,
    gap: 6,
  },

  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.large,
  },

  backText: {
    ...FONTS.labelMedium,
    color: COLORS.secondaryDark,
  },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: SIZES.radiusPill,
    backgroundColor: COLORS.secondaryDark,
    marginTop: 18,
  },

  backButtonText: {
    ...FONTS.labelMedium,
    color: COLORS.surface,
  },

  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    marginBottom: SIZES.large,
  },

  titleCopy: {
    flex: 1,
  },

  eyebrow: {
    ...FONTS.caption,
    color: COLORS.secondaryDark,
    fontWeight: '700',
    letterSpacing: 1.1,
    marginBottom: 4,
  },

  pageTitle: {
    ...FONTS.headline1,
    color: COLORS.textPrimary,
  },

  transactionId: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: 4,
  },

  sectionCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusLarge,
    padding: SIZES.large,
    marginBottom: SIZES.medium,
  },

  sectionTitle: {
    ...FONTS.headline3,
    color: COLORS.secondaryDark,
    marginBottom: SIZES.medium,
  },

  bikeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingVertical: 12,
  },

  bikeIcon: {
    width: 60,
    height: 60,
    borderRadius: SIZES.radiusMedium,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.medium,
  },

  bikeInfo: {
    flex: 1,
  },

  bikeCategory: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
  },

  bikeName: {
    ...FONTS.headline3,
    color: COLORS.secondaryDark,
    marginTop: 2,
  },

  bikeUnit: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: 3,
  },

  returnCondition: {
    ...FONTS.caption,
    color: COLORS.secondaryDark,
    fontWeight: '700',
    marginTop: 5,
  },

  returnNote: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },

  notice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#E0F2FE',
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.medium,
    marginBottom: SIZES.large,
  },

  noticeText: {
    ...FONTS.caption,
    color: COLORS.secondaryDark,
    flex: 1,
    lineHeight: 18,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },

  infoLabel: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    flex: 1,
  },

  infoValue: {
    ...FONTS.labelMedium,
    color: COLORS.textPrimary,
    flex: 1,
    textAlign: 'right',
  },

  completedNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#DCFCE7',
    padding: 12,
    borderRadius: 12,
    marginTop: 15,
  },

  completedText: {
    ...FONTS.labelMedium,
    color: '#15803D',
  },

  stateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },

  stateText: {
    ...FONTS.body,
    color: COLORS.textSecondary,
  },

  errorDescription: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 19,
  },
});
