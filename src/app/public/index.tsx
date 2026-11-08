
import React, { useCallback, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';

import { COLORS, SIZES, FONTS } from '../../constants/theme';
import HeaderApp from '../../components/molecules/HeaderApp';
import BikeCard from '../../components/organisms/BikeCard';
import type { BikeData } from '../../constants/bikes';
import HowToRentSection from '../../components/organisms/HowToRentSection';
import BottomNavBar, {
  TabType,
} from '../../components/molecules/BottomNavBar';

import {
  getBikes,
  Bike,
} from '../../services/bikeService';

const Beranda: React.FC = () => {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabType>('Beranda');
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const loadBikes = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage('');

      const data = await getBikes();

      setBikes(data);
    } catch (error) {
      console.error('Public dashboard bike error:', error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Gagal mengambil data sepeda.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Memuat ulang data ketika Beranda kembali dibuka.
  useFocusEffect(
    useCallback(() => {
      loadBikes();
    }, [loadBikes]),
  );

  const handleTabPress = (tab: TabType) => {
    setActiveTab(tab);

    switch (tab) {
      case 'Beranda':
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

  // Jumlah unit berdasarkan data aktual Supabase.
  const availableCount = bikes.filter(
    (bike) => bike.status === 'Tersedia',
  ).length;

  // Armada unggulan: maksimal tiga unit terbaru.
  const featuredBikes = bikes.slice(0, 3);

  // Adapter Bike Supabase menjadi format yang dipakai BikeCard.
  const mapBikeToCard = (bike: Bike): BikeData => ({
    id: bike.id,
    category: bike.category,
    name: bike.name,
    price: Number(bike.price_per_hour).toLocaleString('id-ID'),
    status: bike.status,
    location: bike.location || 'Outlet Jamal Jepret',
    address: bike.address || undefined,
    hours: bike.opening_hours || undefined,
    features:
      bike.features && bike.features.length > 0
        ? bike.features
        : ['Informasi unit tersedia'],
    image:
      bike.image_url ||
      'https://placehold.co/400x200/png',
    returnTime:
      bike.status === 'Sedang Disewa'
        ? 'Cek detail unit'
        : bike.status === 'Perawatan'
          ? 'Dalam perawatan'
          : undefined,
    returnLocationNote:
      bike.status === 'Sedang Disewa'
        ? 'Lihat informasi estimasi pengembalian pada detail unit'
        : bike.status === 'Perawatan'
          ? 'Unit sedang dalam perawatan'
          : undefined,
    tireSize: bike.tire_size || undefined,
    brakes: bike.brakes || undefined,
    transmission: bike.transmission || undefined,
    facilities: bike.facilities || undefined,
    techCondition: bike.technical_condition || undefined,
    extraTags: bike.extra_tags || undefined,
  });

  return (
    <SafeAreaView style={styles.container}>
      <HeaderApp notificationCount={0} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>
              📍 Jl. Yudhasari 2, Sunyaragi, Kota Cirebon.
            </Text>
          </View>

          <Text style={styles.heroTitle}>
            Sewa Sepeda Lebih Mudah
          </Text>

          <Text style={styles.heroSubtitle}>
            Jelajahi armada sepeda yang siap pakai langsung di
            lokasi pos rental Jamal_Jepret. Cek ketersediaan
            secara real-time.
          </Text>

          <View style={styles.heroActions}>
            <TouchableOpacity
              style={[styles.primaryButton, styles.heroButton]}
              activeOpacity={0.8}
              onPress={() => handleTabPress('Katalog')}
            >
              <Text style={styles.primaryButtonText}>
                Lihat Sepeda
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.secondaryButton, styles.heroButton]}
              activeOpacity={0.8}
              onPress={() => handleTabPress('DurasiSewa')}
            >
              <Ionicons
                name="qr-code-outline"
                size={16}
                color={COLORS.textPrimary}
                style={{ marginRight: 6 }}
              />

              <Text style={styles.secondaryButtonText}>
                Scan QR
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.heroStats}>
            <View style={styles.statBox}>
              <View style={styles.statHeader}>
                <Ionicons
                  name="bicycle-outline"
                  size={14}
                  color={COLORS.secondaryDark}
                  style={{ marginRight: 4 }}
                />

                <Text style={styles.statLabel}>
                  Unit
                </Text>
              </View>

              <Text style={styles.statValue}>
                {loading ? 'Memuat...' : `${availableCount} Unit Tersedia`}
              </Text>
            </View>

            <View style={styles.statBox}>
              <View style={styles.statHeader}>
                <Ionicons
                  name="storefront-outline"
                  size={14}
                  color={COLORS.secondaryDark}
                  style={{ marginRight: 4 }}
                />

                <Text style={styles.statLabel}>
                  Metode Sewa
                </Text>
              </View>

              <Text style={styles.statValue}>
                Datang ke Lokasi
              </Text>
            </View>
          </View>
        </View>

        {/* Armada Unggulan */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Armada Unggulan
            </Text>

            <Text style={styles.sectionSubtitle}>
              Unit sepeda dari inventaris Jamal Jepret
            </Text>
          </View>

          <View style={styles.unitCountBadge}>
            <Text style={styles.unitCountText}>
              {loading
                ? 'Memuat...'
                : `${featuredBikes.filter((bike) => bike.status === 'Tersedia').length} Tersedia`}
            </Text>
          </View>
        </View>

        {/* Loading */}
        {loading && (
          <View style={styles.stateContainer}>
            <ActivityIndicator
              size="large"
              color={COLORS.secondaryDark}
            />

            <Text style={styles.stateText}>
              Memuat armada sepeda...
            </Text>
          </View>
        )}

        {/* Error */}
        {!loading && !!errorMessage && (
          <View style={styles.stateContainer}>
            <Ionicons
              name="alert-circle-outline"
              size={36}
              color="#EF4444"
            />

            <Text style={styles.errorText}>
              {errorMessage}
            </Text>

            <TouchableOpacity
              style={styles.retryButton}
              onPress={loadBikes}
            >
              <Text style={styles.retryButtonText}>
                Coba Lagi
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Empty */}
        {!loading && !errorMessage && bikes.length === 0 && (
          <View style={styles.stateContainer}>
            <Ionicons
              name="bicycle-outline"
              size={40}
              color={COLORS.textSecondary}
            />

            <Text style={styles.stateText}>
              Belum ada unit sepeda yang tersedia.
            </Text>
          </View>
        )}

        {/* List Sepeda */}
        {!loading && !errorMessage && (
          <View style={styles.bikeList}>
            {featuredBikes.map((bike) => (
              <BikeCard
                key={bike.id}
                bike={mapBikeToCard(bike)}
              />
            ))}
          </View>
        )}

        {/* Cara Sewa */}
        <HowToRentSection />
      </ScrollView>

      <BottomNavBar
        activeTab={activeTab}
        onTabPress={handleTabPress}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scrollContent: {
    padding: SIZES.large,
    paddingBottom: SIZES.large,
  },

  heroSection: {
    backgroundColor: '#F0F9FF',
    borderRadius: SIZES.radiusLarge,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SIZES.large,
    marginBottom: SIZES.xlarge,
  },

  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0F2FE',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: SIZES.radiusSmall,
    marginBottom: SIZES.medium,
  },

  heroBadgeText: {
    ...FONTS.caption,
    color: COLORS.secondaryDark,
  },

  heroTitle: {
    ...FONTS.headline1,
    color: COLORS.secondaryDark,
    marginBottom: SIZES.small,
  },

  heroSubtitle: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    marginBottom: SIZES.large,
    lineHeight: 20,
  },

  heroButton: {
    minWidth: 0,
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },

  heroActions: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'center',
    width: '100%',
    gap: 12,
    marginBottom: SIZES.large,
  },

  primaryButton: {
    flex: 1,
    minWidth: 0,
    minHeight: 46,
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: SIZES.radiusMedium,
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryButtonText: {
    ...FONTS.labelMedium,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },

  secondaryButton: {
    flex: 1,
    minWidth: 0,
    minHeight: 46,
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: SIZES.radiusMedium,
    alignItems: 'center',
    justifyContent: 'center',
  },

  secondaryButtonText: {
    ...FONTS.labelMedium,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },

  heroStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    width: '100%',
    gap: 12,
  },

  statBox: {
    flex: 1,
    minWidth: 0,
    backgroundColor: COLORS.surface,
    padding: SIZES.medium,
    borderRadius: SIZES.radiusMedium,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 5,
  },

  statLabel: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    textAlign: 'left',
  },

  statValue: {
    ...FONTS.labelMedium,
    color: COLORS.textPrimary,
    textAlign: 'left',
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SIZES.medium,
  },

  sectionTitle: {
    ...FONTS.headline2,
    color: COLORS.secondaryDark,
  },

  sectionSubtitle: {
    ...FONTS.body,
    color: COLORS.textSecondary,
  },

  unitCountBadge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: SIZES.radiusSmall,
  },

  unitCountText: {
    ...FONTS.caption,
    color: COLORS.secondaryDark,
  },

  bikeList: {
    marginBottom: SIZES.medium,
  },

  stateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
    gap: 10,
  },

  stateText: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },

  errorText: {
    ...FONTS.body,
    color: '#DC2626',
    textAlign: 'center',
  },

  retryButton: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SIZES.large,
    paddingVertical: SIZES.medium,
    borderRadius: SIZES.radiusMedium,
  },

  retryButtonText: {
    ...FONTS.labelMedium,
    color: COLORS.textPrimary,
  },
});

export default Beranda;
