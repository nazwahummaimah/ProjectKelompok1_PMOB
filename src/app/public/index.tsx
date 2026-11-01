// app/public/BerandaPublic.tsx
import React, { useState } from 'react';
import { 
  SafeAreaView, 
  ScrollView, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  StatusBar,
  Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // Navigasi Expo Router
import { COLORS, SIZES, FONTS } from '../../constants/theme';
import HeaderApp from '../../components/molecules/HeaderApp';
import BikeCard from '../../components/organisms/BikeCard';
import type { BikeData } from '../../constants/bikes';
import HowToRentSection from '../../components/organisms/HowToRentSection';
import PosRentalSection from '../../components/organisms/PosRentalSection';
import BottomNavBar, { TabType } from '../../components/molecules/BottomNavBar';

const DUMMY_BIKES: BikeData[] = [
  {
    id: 'Unit B-001',
    category: 'MOUNTAIN BIKE MTB',
    name: 'Polygon Cascade 4',
    price: '20.000',
    status: 'Tersedia',
    location: 'Pos Stasiun Tugu (Jl. Pasar Kembang)',
    features: ['24 Speed Shimano', 'Helm Gratis', 'Rem Hidrolik'],
    image: 'https://via.placeholder.com/400x200',
  },
  {
    id: 'Unit B-008',
    category: 'CITY BIKE KERANJANG',
    name: 'Phoenix City 26',
    price: '15.000',
    status: 'Tersedia',
    location: 'Pos Malioboro (Depan Mall)',
    features: ['Keranjang Depan', 'Kunci Ganda', 'Lampu Dinamo'],
    image: 'https://via.placeholder.com/400x200',
  },
  {
    id: 'Unit B-012',
    category: 'ROAD BIKE TOURING',
    name: 'United Inertia',
    price: '25.000',
    status: 'Sedang Disewa',
    location: 'Pos Stasiun Tugu',
    features: ['Ringan & Cepat', 'Dropbar Ergonomis'],
    returnTime: '15:30 WIB',
    returnLocationNote: 'Kembali sore ini di Pos Tugu',
    image: 'https://via.placeholder.com/400x200',
  },
];

const Beranda: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('Beranda');

  // Handler Klik Tab Bottom Navigation
  const handleTabPress = (tab: TabType) => {
    setActiveTab(tab);
    
    // Navigasi rute Expo Router sesuai tab yang diklik
    switch (tab) {
      case 'Beranda':
        // Tetap di halaman beranda
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header App Bar dengan Safe Area Notch Fix */}
      <HeaderApp notificationCount={0} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Hero Card Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>📍 Pos Resmi Jogja</Text>
          </View>
          <Text style={styles.heroTitle}>Sewa Sepeda Lebih Mudah</Text>
          <Text style={styles.heroSubtitle}>
            Jelajahi armada sepeda yang siap pakai langsung di lokasi pos rental Mas Joko. Cek ketersediaan secara real-time.
          </Text>
          
          <View style={styles.heroActions}>
            <TouchableOpacity 
              style={styles.secondaryButton} 
              activeOpacity={0.8}
              onPress={() => handleTabPress('Katalog')}
            >
              <Text style={styles.primaryButtonText}>Lihat Sepeda</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.secondaryButton} 
              activeOpacity={0.8}
              onPress={() => handleTabPress('DurasiSewa')}
            >
              <Ionicons name="qr-code-outline" size={16} color={COLORS.textPrimary} style={{ marginRight: 6 }} />
              <Text style={styles.secondaryButtonText}>Scan QR</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.heroStats}>
            <View style={styles.statBox}>
              <View style={styles.statHeader}>
                <Ionicons name="location-outline" size={14} color={COLORS.secondaryDark} style={{ marginRight: 4 }} />
                <Text style={styles.statLabel}>Lokasi Aktif</Text>
              </View>
              <Text style={styles.statValue}>3 Pos Rental</Text>
            </View>
            <View style={styles.statBox}>
              <View style={styles.statHeader}>
                <Ionicons name="storefront-outline" size={14} color={COLORS.secondaryDark} style={{ marginRight: 4 }} />
                <Text style={styles.statLabel}>Metode Sewa</Text>
              </View>
              <Text style={styles.statValue}>Walk-in Langsung</Text>
            </View>
          </View>
        </View>

        {/* Section Armada Unggulan */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Armada Unggulan</Text>
            <Text style={styles.sectionSubtitle}>Siap jalan hari ini</Text>
          </View>
          <View style={styles.unitCountBadge}>
            <Text style={styles.unitCountText}>3 Unit Tersedia</Text>
          </View>
        </View>

        {/* List Card Sepeda */}
        <View style={styles.bikeList}>
          {DUMMY_BIKES.map((bike, index) => (
            <BikeCard key={index} bike={bike} />
          ))}
        </View>

        {/* Section Cara Sewa */}
        <HowToRentSection />

        {/* Section Pos Rental Mas Joko */}
        <PosRentalSection />

      </ScrollView>

      {/* Bottom Navigation Interaktif */}
      <BottomNavBar activeTab={activeTab} onTabPress={handleTabPress} />
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
  heroActions: {
    flexDirection: 'row',
    marginBottom: SIZES.large,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 12,
    borderRadius: SIZES.radiusMedium,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.small,
  },
  primaryButtonText: {
    ...FONTS.labelMedium,
    color: COLORS.textPrimary,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 12,
    borderRadius: SIZES.radiusMedium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    ...FONTS.labelMedium,
    color: COLORS.textPrimary,
  },
  heroStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.surface,
    padding: SIZES.medium,
    borderRadius: SIZES.radiusMedium,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statLabel: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  statValue: {
    ...FONTS.labelMedium,
    color: COLORS.textPrimary,
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
});

export default Beranda;