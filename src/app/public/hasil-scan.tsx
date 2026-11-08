
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { COLORS, SIZES, FONTS } from '../../constants/theme';
import BottomNavBar, {
  TabType,
  UserTabType,
} from '../../components/molecules/BottomNavBar';
import {
  getPublicBikeQrInfo,
  PublicBikeQrInfo,
} from '../../services/publicBikeQrService';

const formatRupiah = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value || 0);

const formatDateTime = (value: string | null) => {
  if (!value) return '-';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return '-';

  return date.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Mengubah sisa waktu menjadi HH:MM:SS.
const formatCountdown = (milliseconds: number) => {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [
    String(hours).padStart(2, '0'),
    String(minutes).padStart(2, '0'),
    String(seconds).padStart(2, '0'),
  ].join(':');
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Tersedia':
      return {
        background: '#DCFCE7',
        text: '#15803D',
        icon: '#16A34A',
      };

    case 'Sedang Disewa':
      return {
        background: '#FEF3C7',
        text: '#B45309',
        icon: '#D97706',
      };

    default:
      return {
        background: '#FEE2E2',
        text: '#B91C1C',
        icon: '#DC2626',
      };
  }
};

const HasilScan: React.FC = () => {
  const router = useRouter();

  const params = useLocalSearchParams<{
    bikeId?: string;
    source?: string;
  }>();

  const bikeId = Array.isArray(params.bikeId)
    ? params.bikeId[0]
    : params.bikeId;

  const isUserFlow = params.source === 'user';

  const [bike, setBike] = useState<PublicBikeQrInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Sisa waktu dalam milidetik.
  const [remainingMs, setRemainingMs] = useState<number | null>(null);

  // Mengambil informasi sepeda dari Supabase.
  useEffect(() => {
    let mounted = true;

    const loadBike = async () => {
      if (!bikeId) {
        setError('ID sepeda tidak ditemukan.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        const result = await getPublicBikeQrInfo(bikeId);

        if (mounted) {
          setBike(result);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : 'Gagal mengambil informasi sepeda.',
          );
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadBike();

    return () => {
      mounted = false;
    };
  }, [bikeId]);

  // Timer hitung mundur berdasarkan estimated_end dari Supabase.
  useEffect(() => {
    if (
      bike?.bike_status !== 'Sedang Disewa' ||
      !bike.estimated_end
    ) {
      setRemainingMs(null);
      return;
    }

    const endTime = new Date(bike.estimated_end).getTime();

    if (Number.isNaN(endTime)) {
      setRemainingMs(null);
      return;
    }

    const updateCountdown = () => {
      const remaining = Math.max(0, endTime - Date.now());

      setRemainingMs(remaining);

      return remaining;
    };

    // Langsung hitung ketika halaman dibuka.
    const initialRemaining = updateCountdown();

    if (initialRemaining <= 0) {
      return;
    }

    // Perbarui setiap satu detik.
    const interval = setInterval(() => {
      const remaining = updateCountdown();

      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [bike?.bike_status, bike?.estimated_end]);

  const handleTabPress = (tab: TabType) => {
    switch (tab) {
      case 'Beranda':
        router.push('/public/' as any);
        break;

      case 'Katalog':
        router.push('/public/katalog' as any);
        break;

      case 'DurasiSewa':
        router.push('/public/durasi-sewa' as any);
        break;

      case 'Login':
        router.push('/public/login' as any);
        break;
    }
  };

  const handleUserTabPress = (tab: UserTabType) => {
    switch (tab) {
      case 'Beranda':
        router.push('/user' as any);
        break;

      case 'Riwayat':
        router.push('/user/riwayat' as any);
        break;

      case 'Scan':
        router.push({
          pathname: '/public/durasi-sewa',
          params: { source: 'user' },
        } as any);
        break;

      case 'Profil':
        router.push('/user/profil' as any);
        break;
    }
  };

  const handleScanAgain = () => {
    router.replace({
      pathname: '/public/durasi-sewa',
      params: isUserFlow ? { source: 'user' } : {},
    } as any);
  };

  const statusStyle = bike
    ? getStatusColor(bike.bike_status)
    : null;

  const timerExpired = remainingMs !== null && remainingMs <= 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color={COLORS.secondaryDark}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Informasi Sepeda
        </Text>

        <View style={styles.backButton} />
      </View>

      {/* Loading */}
      {loading ? (
        <View style={styles.centerState}>
          <ActivityIndicator
            size="large"
            color={COLORS.secondaryDark}
          />

          <Text style={styles.stateText}>
            Mengambil informasi sepeda...
          </Text>
        </View>
      ) : error || !bike ? (
        /* Error */
        <View style={styles.centerState}>
          <Ionicons
            name="alert-circle-outline"
            size={54}
            color="#DC2626"
          />

          <Text style={styles.errorTitle}>
            Sepeda Tidak Ditemukan
          </Text>

          <Text style={styles.stateText}>
            {error || 'Informasi sepeda tidak tersedia.'}
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleScanAgain}
          >
            <Ionicons
              name="qr-code-outline"
              size={18}
              color="#FFFFFF"
            />

            <Text style={styles.primaryButtonText}>
              Pindai Ulang
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Gambar Sepeda */}
          <View style={styles.imageContainer}>
            {bike.bike_image_url ? (
              <Image
                source={{ uri: bike.bike_image_url }}
                style={styles.bikeImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons
                  name="bicycle-outline"
                  size={72}
                  color="#94A3B8"
                />
              </View>
            )}

            <View style={styles.imageId}>
              <Text style={styles.imageIdText}>
                # {bike.bike_id}
              </Text>
            </View>
          </View>

          {/* Informasi Utama */}
          <View style={styles.mainInfo}>
            <Text style={styles.categoryLabel}>
              KATEGORI SEPEDA
            </Text>

            <Text style={styles.bikeName}>
              {bike.bike_name}
            </Text>

            <Text style={styles.categoryName}>
              {bike.bike_category}
            </Text>

            <Text style={styles.price}>
              {formatRupiah(Number(bike.price_per_hour))}
              <Text style={styles.priceUnit}> / jam</Text>
            </Text>
          </View>

          {/* Status Sepeda */}
          {statusStyle && (
            <View
              style={[
                styles.statusCard,
                { backgroundColor: statusStyle.background },
              ]}
            >
              <View style={styles.statusHeader}>
                <Ionicons
                  name={
                    bike.bike_status === 'Tersedia'
                      ? 'checkmark-circle'
                      : bike.bike_status === 'Sedang Disewa'
                        ? 'time'
                        : 'construct'
                  }
                  size={24}
                  color={statusStyle.icon}
                />

                <Text
                  style={[
                    styles.statusTitle,
                    { color: statusStyle.text },
                  ]}
                >
                  {bike.bike_status}
                </Text>
              </View>

              {/* Status Tersedia */}
              {bike.bike_status === 'Tersedia' && (
                <Text style={styles.statusDescription}>
                  Sepeda ini tersedia dan dapat disewa langsung
                  di outlet Jamal Jepret. Silakan datang dan
                  konfirmasi kepada Admin.
                </Text>
              )}

              {/* Status Sedang Disewa */}
              {bike.bike_status === 'Sedang Disewa' && (
                <View>
                  <Text style={styles.statusDescription}>
                    Sepeda ini sedang digunakan oleh pelanggan lain.
                  </Text>

                  <View style={styles.rentalInfo}>
                    <Text style={styles.infoLabel}>
                      Mulai disewa
                    </Text>

                    <Text style={styles.infoValue}>
                      {formatDateTime(bike.rental_date)}
                    </Text>
                  </View>

                  <View style={styles.rentalInfo}>
                    <Text style={styles.infoLabel}>
                      Estimasi selesai
                    </Text>

                    <Text style={styles.infoValue}>
                      {formatDateTime(bike.estimated_end)}
                    </Text>
                  </View>

                  <View style={styles.rentalInfo}>
                    <Text style={styles.infoLabel}>
                      Durasi sewa
                    </Text>

                    <Text style={styles.infoValue}>
                      {bike.duration_hours ?? '-'} jam
                    </Text>
                  </View>

                  {/* Countdown Timer */}
                  <View style={styles.countdownContainer}>
                    <View style={styles.countdownHeader}>
                      <Ionicons
                        name="hourglass-outline"
                        size={19}
                        color="#92400E"
                      />

                      <Text style={styles.countdownLabel}>
                        WAKTU TERSISA
                      </Text>
                    </View>

                    {remainingMs === null ? (
                      <Text style={styles.countdownUnavailable}>
                        Estimasi waktu kembali belum tersedia.
                      </Text>
                    ) : (
                      <>
                        <Text
                          style={[
                            styles.countdownTime,
                            timerExpired && styles.countdownExpired,
                          ]}
                        >
                          {formatCountdown(remainingMs)}
                        </Text>

                        <Text style={styles.countdownUnit}>
                          Jam : Menit : Detik
                        </Text>

                        <Text
                          style={[
                            styles.countdownMessage,
                            timerExpired && styles.countdownExpired,
                          ]}
                        >
                          {timerExpired
                            ? 'Waktu sewa telah melewati estimasi pengembalian.'
                            : 'Hitung mundur menuju estimasi pengembalian sepeda.'}
                        </Text>
                      </>
                    )}
                  </View>
                </View>
              )}

              {/* Status Perawatan */}
              {bike.bike_status === 'Perawatan' && (
                <Text style={styles.statusDescription}>
                  Sepeda ini sedang dalam perawatan dan belum
                  dapat disewa. Silakan pilih unit sepeda lain
                  yang tersedia.
                </Text>
              )}
            </View>
          )}

          {/* Informasi Penyewaan */}
          <View style={styles.noticeCard}>
            <Ionicons
              name="storefront-outline"
              size={21}
              color={COLORS.secondaryDark}
            />

            <View style={styles.noticeContent}>
              <Text style={styles.noticeTitle}>
                Penyewaan langsung di outlet
              </Text>

              <Text style={styles.noticeDescription}>
                QR Code hanya digunakan untuk melihat informasi
                dan status sepeda. Proses penyewaan, pembayaran,
                serta serah terima dilakukan langsung oleh Admin
                di outlet.
              </Text>
            </View>
          </View>

          {/* Scan Ulang */}
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleScanAgain}
          >
            <Ionicons
              name="qr-code-outline"
              size={19}
              color={COLORS.secondaryDark}
            />

            <Text style={styles.secondaryButtonText}>
              Pindai Sepeda Lain
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Bottom Navigation */}
      {isUserFlow ? (
        <BottomNavBar
          variant="user"
          activeTab="Scan"
          onTabPress={handleUserTabPress}
        />
      ) : (
        <BottomNavBar
          activeTab="DurasiSewa"
          onTabPress={handleTabPress}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  header: {
    height: 58,
    paddingHorizontal: SIZES.large,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },

  backButton: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    ...FONTS.headline3,
    color: COLORS.textPrimary,
  },

  scrollContent: {
    padding: SIZES.large,
    paddingBottom: 32,
  },

  imageContainer: {
    width: '100%',
    height: 220,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
    position: 'relative',
  },

  bikeImage: {
    width: '100%',
    height: '100%',
  },

  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  imageId: {
    position: 'absolute',
    left: 12,
    bottom: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },

  imageIdText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  mainInfo: {
    paddingVertical: 20,
  },

  categoryLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: COLORS.textSecondary,
  },

  bikeName: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 5,
  },

  categoryName: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },

  price: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.secondaryDark,
    marginTop: 12,
  },

  priceUnit: {
    fontSize: 13,
    fontWeight: '400',
    color: COLORS.textSecondary,
  },

  statusCard: {
    padding: 18,
    borderRadius: 16,
    marginBottom: 16,
  },

  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginBottom: 10,
  },

  statusTitle: {
    fontSize: 17,
    fontWeight: '800',
  },

  statusDescription: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 21,
  },

  rentalInfo: {
    marginTop: 12,
  },

  infoLabel: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 3,
  },

  infoValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },

  countdownContainer: {
    marginTop: 18,
    padding: 15,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(217, 119, 6, 0.18)',
    alignItems: 'center',
  },

  countdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },

  countdownLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#92400E',
  },

  countdownTime: {
    fontSize: 34,
    fontWeight: '900',
    color: '#B45309',
    letterSpacing: 2,
    fontVariant: ['tabular-nums'],
    marginTop: 9,
  },

  countdownUnit: {
    fontSize: 10,
    color: '#92400E',
    marginTop: 2,
    letterSpacing: 1,
  },

  countdownMessage: {
    fontSize: 11,
    color: '#92400E',
    textAlign: 'center',
    lineHeight: 17,
    marginTop: 10,
  },

  countdownExpired: {
    color: '#B91C1C',
  },

  countdownUnavailable: {
    fontSize: 12,
    color: '#92400E',
    textAlign: 'center',
    marginTop: 10,
  },

  noticeCard: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    marginBottom: 18,
  },

  noticeContent: {
    flex: 1,
  },

  noticeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 5,
  },

  noticeDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 19,
  },

  secondaryButton: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.secondaryDark,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },

  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.secondaryDark,
  },

  centerState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  stateText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 21,
  },

  errorTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 14,
  },

  primaryButton: {
    marginTop: 22,
    backgroundColor: COLORS.secondaryDark,
    borderRadius: 12,
    paddingHorizontal: 22,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

export default HasilScan;