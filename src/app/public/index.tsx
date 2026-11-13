import React, { useCallback, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';

import { COLORS, SIZES, FONTS } from '../../constants/theme';
import HeaderApp from '../../components/molecules/HeaderApp';
import type { BikeData } from '../../constants/bikes';
import HowToRentSection from '../../components/organisms/HowToRentSection';
import PublicBikePreviewCard from '../../components/organisms/PublicBikePreviewCard';
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

  const availableCount = bikes.filter(
    (bike) => bike.status === 'Tersedia',
  ).length;

  // Batasi pratinjau Home agar katalog lengkap tetap berada di halaman Katalog.
  const homeBikes = bikes.slice(0, 3);

  const mapBikeToCard = (bike: Bike): BikeData => ({
    id: bike.id,
    category: bike.category,
    name: bike.name,
    price: Number(bike.price_per_hour).toLocaleString('id-ID'),
    status: bike.status,
    location: bike.location || 'Lokasi Jamal Jepret',
    address: bike.address || undefined,
    hours: bike.opening_hours || undefined,
    features: bike.features ?? [],
    image: bike.image_url || '',
    tireSize: bike.tire_size || undefined,
    brakes: bike.brakes || undefined,
    transmission: bike.transmission || undefined,
    facilities: bike.facilities || undefined,
    techCondition: bike.technical_condition || undefined,
    extraTags: bike.extra_tags || undefined,
  });

  return (
    <SafeAreaView style={styles.container}>
      <HeaderApp />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ImageBackground
          source={require('../../assets/jamal-jepret-store.jpg')}
          style={styles.heroCard}
          imageStyle={styles.heroImage}
          resizeMode="cover"
          accessibilityLabel="Foto asli area penyewaan sepeda Jamal Jepret"
        >
          <View style={styles.heroOverlay} />
          <View style={styles.heroCopy}>
            <Text style={styles.heroTitle}>
              Jelajahi Cirebon dengan Cara yang Berbeda!
            </Text>
            <Text style={styles.heroSubtitle}>
              Pilih unit, periksa ketersediaannya, lalu datang untuk memulai penyewaan.
            </Text>

            <TouchableOpacity
              style={styles.heroButton}
              activeOpacity={0.82}
              onPress={() => handleTabPress('Katalog')}
              accessibilityRole="button"
              accessibilityLabel="Lihat katalog sepeda"
            >
              <Text style={styles.heroButtonText}>Lihat katalog</Text>
              <Ionicons name="arrow-forward" size={18} color={COLORS.secondaryDark} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.scanAction}
              activeOpacity={0.75}
              onPress={() => handleTabPress('DurasiSewa')}
              accessibilityRole="button"
              accessibilityLabel="Pindai QR sepeda"
            >
              <Ionicons name="qr-code-outline" size={18} color="#FFFFFF" />
              <Text style={styles.scanActionText}>Sudah di lokasi? Pindai QR</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>

        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeadingCopy}>
            <Text style={styles.sectionTitle}>Unit Sepeda</Text>
            <Text style={styles.sectionSubtitle}>
              {loading
                ? 'Memuat unit...'
                : errorMessage
                  ? 'Informasi unit belum tersedia'
                  : `${availableCount} unit tersedia`}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.seeAllButton}
            onPress={() => handleTabPress('Katalog')}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel="Lihat semua sepeda"
          >
            <Text style={styles.seeAllText}>Lihat semua</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.secondaryDark} />
          </TouchableOpacity>
        </View>

        {loading && (
          <View style={styles.stateCard}>
            <ActivityIndicator size="small" color={COLORS.secondaryDark} />
            <Text style={styles.stateText}>Memuat unit sepeda...</Text>
          </View>
        )}

        {!loading && !!errorMessage && (
          <View style={styles.stateCard}>
            <Ionicons name="cloud-offline-outline" size={30} color={COLORS.textSecondary} />
            <Text style={styles.errorText}>{errorMessage}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={loadBikes}
              accessibilityRole="button"
              accessibilityLabel="Muat ulang data sepeda"
            >
              <Text style={styles.retryButtonText}>Coba lagi</Text>
            </TouchableOpacity>
          </View>
        )}

        {!loading && !errorMessage && bikes.length === 0 && (
          <View style={styles.stateCard}>
            <Ionicons name="bicycle-outline" size={34} color={COLORS.textSecondary} />
            <Text style={styles.stateText}>Belum ada unit sepeda yang ditampilkan.</Text>
          </View>
        )}

        {!loading && !errorMessage && homeBikes.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.bikeCarousel}
          >
            {homeBikes.map((bike) => (
              <PublicBikePreviewCard
                key={bike.id}
                bike={mapBikeToCard(bike)}
              />
            ))}
          </ScrollView>
        )}

        
        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeadingCopy}>
            <Text style={styles.sectionTitle}>Cara Menyewa</Text>
            <Text style={styles.sectionSubtitle}>
              Ikuti 4 langkah mudah untuk menyewa sepeda
            </Text>
          </View>
        </View>

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
    paddingTop: SIZES.large,
    paddingHorizontal: SIZES.large,
    paddingBottom: SIZES.large,
  },
  heroCard: {
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: COLORS.secondaryDark,
    borderRadius: 22,
    padding: SIZES.large,
    marginBottom: SIZES.xxlarge,
    minHeight: 310,
  },
  heroImage: {
    borderRadius: 22,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(3, 48, 70, 0.70)',
  },
  heroCopy: {
    width: '100%',
    alignItems: 'flex-start',
  },
  heroEyebrow: {
    ...FONTS.labelMedium,
    color: '#BAE6FD',
    letterSpacing: 1.1,
    marginBottom: SIZES.small,
  },
  heroTitle: {
    ...FONTS.headline1,
    color: '#FFFFFF',
    fontSize: 26,
    lineHeight: 33,
    marginBottom: SIZES.small,
    marginTop: SIZES.medium,
    maxWidth: 330,
  },
  heroSubtitle: {
    ...FONTS.body,
    color: '#F0F9FF',
    lineHeight: 23,
    marginBottom: 64,
    maxWidth: 360,
  },
  heroButton: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    backgroundColor: '#FFFFFF',
    borderRadius: SIZES.radiusMedium,
    paddingHorizontal: SIZES.large,
    paddingVertical: SIZES.medium,
  },
  heroButtonText: {
    ...FONTS.labelMedium,
    color: COLORS.secondaryDark,
  },
  scanAction: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginTop: 18,
    paddingVertical: 7,
  },
  scanActionText: {
    ...FONTS.body,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SIZES.medium,
  },
  sectionHeadingCopy: {
    flex: 1,
    minWidth: 0,
  },
  sectionTitle: {
    ...FONTS.headline2,
    color: COLORS.textPrimary,
  },
  sectionSubtitle: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  seeAllButton: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: SIZES.small,
  },
  seeAllText: {
    ...FONTS.caption,
    color: COLORS.secondaryDark,
    fontWeight: '700',
  },
  bikeCarousel: {
    paddingBottom: SIZES.large,
    paddingRight: SIZES.large,
  },
  stateCard: {
    minHeight: 150,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SIZES.small,
    padding: SIZES.large,
    marginBottom: SIZES.large,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusLarge,
  },
  stateText: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  errorText: {
    ...FONTS.body,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  retryButton: {
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SIZES.large,
    borderRadius: SIZES.radiusMedium,
    backgroundColor: '#E0F2FE',
  },
  retryButtonText: {
    ...FONTS.labelMedium,
    color: COLORS.secondaryDark,
  },
});

export default Beranda;
