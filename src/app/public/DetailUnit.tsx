// app/public/DetailUnit.tsx
import React, { useEffect, useState } from 'react';
import { 
  SafeAreaView, 
  ScrollView, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Platform,
  StatusBar,
  Image,
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS, SIZES, FONTS } from '../../constants/theme';
import StatusBadge from '../../components/molecules/StatusBadge';
import FeatureTag from '../../components/molecules/FeatureTag';
import BottomNavBar, { TabType } from '../../components/molecules/BottomNavBar';
import { getPublicBikes, PublicBike } from '../../services/bikeService';

const DetailUnit: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const [activeTab, setActiveTab] = useState<TabType>('Katalog');
  const [bike, setBike] = useState<PublicBike | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getPublicBikes()
      .then((items) => { if (active) setBike(items.find((item) => item.id === params.id) ?? null); })
      .catch((error) => { console.error('Detail sepeda:', error); if (active) setBike(null); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [params.id]);

  if (loading) return <SafeAreaView style={styles.container}><ActivityIndicator size="large" color={COLORS.secondaryDark} style={{ flex: 1 }} /></SafeAreaView>;
  if (!bike) return <SafeAreaView style={styles.container}><View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}><Text style={{ color: COLORS.textPrimary, marginBottom: 14 }}>Data sepeda tidak ditemukan.</Text><TouchableOpacity onPress={() => router.back()}><Text style={{ color: COLORS.secondaryDark, fontWeight: '700' }}>Kembali ke Katalog</Text></TouchableOpacity></View></SafeAreaView>;

  const bikeView = {
    ...bike,
    hours: 'Hubungi petugas cabang untuk informasi jam operasional.',
    returnTime: undefined as string | undefined,
    returnLocationNote: undefined as string | undefined,
    tireSize: 'Informasi belum tersedia',
    brakes: 'Informasi belum tersedia',
    transmission: 'Informasi belum tersedia',
    facilities: 'Konfirmasi fasilitas kepada petugas rental.',
    techCondition: bike.description || 'Belum ada catatan kondisi teknis.',
  };
  const isAvailable = bikeView.status === 'Tersedia';
  const isRented = bikeView.status === 'Sedang Disewa';

  const handleTabPress = (tab: TabType) => {
    setActiveTab(tab);
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Top Header dengan Status Bar Fix */}
      <View style={styles.safeHeaderArea}>
        <View style={styles.topHeader}>
          <TouchableOpacity 
            style={styles.iconBtn} 
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={22} color={COLORS.secondaryDark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detail Sepeda</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="share-social-outline" size={20} color={COLORS.secondaryDark} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconBtn, { marginLeft: 8 }]}>
              <Ionicons name="information-circle-outline" size={22} color={COLORS.secondaryDark} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner Gambar & Badges Dinamis */}
        <View style={styles.bannerContainer}>
          <Image source={bikeView.image ? { uri: bikeView.image } : require('../../../assets/images/image-2.jpeg')} style={styles.bannerImage} />
          <View style={styles.verifiedBadge}>
            <Ionicons name="qr-code-outline" size={14} color={COLORS.secondaryDark} style={{ marginRight: 4 }} />
            <Text style={styles.verifiedText}>Terverifikasi QR</Text>
          </View>

          <View style={styles.bannerBottomOverlay}>
            <View style={styles.unitIdTag}>
              <Text style={styles.unitIdText}># {bikeView.id}</Text>
            </View>
            <View style={styles.unitTitleTag}>
              <Text style={styles.unitTitleText}>{bikeView.name}</Text>
            </View>
          </View>
        </View>

        {/* Info Utama Title & Price Dinamis */}
        <View style={styles.mainInfoRow}>
          <View style={styles.titleCol}>
            <Text style={styles.categoryTitle}>KATEGORI SEPEDA</Text>
            <Text style={styles.mainTitle}>{bikeView.category}</Text>
            <Text style={styles.subTitle}>{bikeView.name} Series</Text>
          </View>
          <View style={styles.priceCol}>
            <Text style={styles.priceMeta}>Tarif Sewa Pos</Text>
            <Text style={styles.priceAmount}>
              <Text style={styles.currency}>Rp </Text>{bikeView.price}<Text style={styles.priceUnit}> / jam</Text>
            </Text>
            <Text style={styles.paymentNote}>Bayar langsung di kasir</Text>
          </View>
        </View>

        {/* Mode Selector Display */}
        <View style={styles.modeContainer}>
          <View style={[styles.modePill, isAvailable && styles.modeActive]}>
            <View style={[styles.dot, { backgroundColor: isAvailable ? COLORS.success : COLORS.textSecondary }]} />
            <Text style={isAvailable ? styles.modeActiveText : styles.modeInactiveText}>
              {`Mode: ${bikeView.status}`}
            </Text>
          </View>
        </View>

        {/* Status Operational Box Dinamis */}
        <View style={styles.operationalBox}>
          <View style={styles.opHeader}>
            <Text style={styles.opLabel}>Status Operasional Unit</Text>
            <StatusBadge status={bikeView.status} />
          </View>

          <View style={styles.opContent}>
            <Ionicons 
              name={isAvailable ? "checkmark-circle-outline" : "time-outline"} 
              size={24} 
              color={isAvailable ? COLORS.success : COLORS.warning} 
              style={{ marginRight: 10 }} 
            />
            <View style={{ flex: 1 }}>
              <Text style={[styles.opTitle, !isAvailable && { color: COLORS.warning }]}>
                {isAvailable ? 'Siap Disewa di Lokasi' : isRented ? `Unit Sedang Disewa (~ ${bikeView.returnTime || 'Estimasi belum tersedia'})` : 'Unit sedang dalam perawatan'}
              </Text>
              <Text style={styles.opDesc}>
                {isAvailable
                  ? `Sepeda ini sedang standby dan siap disewa langsung di ${bikeView.location}. Silakan datangi pos dan konfirmasi ke kasir.`
                  : isRented
                    ? `Sepeda ini sedang dalam sesi sewa. ${bikeView.returnLocationNote || 'Informasi waktu kembali dapat dikonfirmasi kepada petugas.'}`
                    : 'Sepeda sedang menjalani pemeriksaan atau perawatan dan belum dapat disewa.'}
              </Text>
            </View>
          </View>

          <View style={styles.opFooter}>
            <Ionicons name="storefront-outline" size={16} color={COLORS.textSecondary} style={{ marginRight: 6 }} />
            <Text style={styles.opFooterText}>Hanya melayani sewa tatap muka (Walk-in direct). Tanpa sistem reservasi online.</Text>
          </View>
        </View>

        {/* Section Spesifikasi & Pos Armada */}
        <Text style={styles.sectionHeaderTitle}>📍 Spesifikasi & Pos Armada</Text>

        {/* Card Pos Pangkalan */}
        <View style={styles.cardBox}>
          <View style={styles.cardBoxHeader}>
            <View style={styles.iconCircle}>
              <Ionicons name="location-outline" size={18} color={COLORS.secondaryDark} />
            </View>
            <View>
              <Text style={styles.cardBoxMeta}>Pos Pangkalan Resmi</Text>
              <Text style={styles.cardBoxTitle}>{bikeView.location}</Text>
            </View>
          </View>
          <Text style={styles.cardBoxAddress}>{bikeView.address || 'Alamat cabang belum tersedia.'}</Text>
          <Text style={styles.cardBoxHours}>⏱️ {bikeView.hours || 'Jam operasional dapat dikonfirmasi kepada petugas cabang.'}</Text>
        </View>

        {/* Card Kondisi Teknis */}
        <View style={styles.cardBox}>
          <View style={styles.cardBoxHeader}>
            <View style={[styles.iconCircle, { backgroundColor: '#DCFCE7' }]}>
              <Ionicons name="checkmark-done-outline" size={18} color={COLORS.success} />
            </View>
            <View>
              <Text style={styles.cardBoxMeta}>Kondisi Teknis Unit</Text>
              <Text style={styles.cardBoxTitle}>Catatan Kondisi</Text>
            </View>
          </View>
          <Text style={styles.cardBoxAddress}>{bikeView.techCondition || 'Belum ada catatan kondisi teknis.'}</Text>
        </View>

        {/* Specs Grid 2x2 Dinamis */}
        <Text style={styles.specsSubLabel}>Kelengkapan & Fitur Teknis</Text>
        <View style={styles.specsGrid}>
          <View style={styles.specTile}>
            <Ionicons name="options-outline" size={18} color={COLORS.secondaryDark} />
            <View style={{ marginLeft: 8, flex: 1 }}>
              <Text style={styles.specLabel}>Ukuran Ban</Text>
              <Text style={styles.specValue}>{bikeView.tireSize || 'Belum diisi'}</Text>
            </View>
          </View>

          <View style={styles.specTile}>
            <Ionicons name="disc-outline" size={18} color={COLORS.secondaryDark} />
            <View style={{ marginLeft: 8, flex: 1 }}>
              <Text style={styles.specLabel}>Pengereman</Text>
              <Text style={styles.specValue}>{bikeView.brakes || 'Belum diisi'}</Text>
            </View>
          </View>

          <View style={styles.specTile}>
            <Ionicons name="speedometer-outline" size={18} color={COLORS.secondaryDark} />
            <View style={{ marginLeft: 8, flex: 1 }}>
              <Text style={styles.specLabel}>Transmisi</Text>
              <Text style={styles.specValue}>{bikeView.transmission || 'Belum diisi'}</Text>
            </View>
          </View>

          <View style={styles.specTile}>
            <Ionicons name="shield-checkmark-outline" size={18} color={COLORS.secondaryDark} />
            <View style={{ marginLeft: 8, flex: 1 }}>
              <Text style={styles.specLabel}>Fasilitas Unit</Text>
              <Text style={styles.specValue}>{bikeView.facilities || 'Belum diisi'}</Text>
            </View>
          </View>
        </View>

        {/* Action Callout Section dalam Scroll View */}
        <View style={styles.actionRowCard}>
          <TouchableOpacity 
            style={styles.outlineBtn} 
            activeOpacity={0.8}
            onPress={() => router.push('/public/' as any)}
          >
            <Ionicons name="navigate-outline" size={16} color={COLORS.secondaryDark} style={{ marginRight: 6 }} />
            <Text style={styles.outlineBtnText}>Arah ke Pos</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.filledBtn} 
            activeOpacity={0.8}
            onPress={() => router.push('/public/durasi-sewa' as any)}
          >
            <Ionicons name="qr-code-outline" size={16} color={COLORS.textPrimary} style={{ marginRight: 6 }} />
            <Text style={styles.filledBtnText}>Scan QR Unit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Replaced dengan Bottom Navigation Bar standar yang lebih berguna */}
      <BottomNavBar activeTab={activeTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  safeHeaderArea: {
    backgroundColor: COLORS.surface,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.large,
    paddingVertical: SIZES.medium,
    height: 56,
  },
  headerTitle: {
    ...FONTS.headline3,
    color: COLORS.secondaryDark,
  },
  headerRight: {
    flexDirection: 'row',
  },
  iconBtn: {
    padding: 6,
  },
  scrollContent: {
    padding: SIZES.large,
    paddingBottom: SIZES.large,
  },
  bannerContainer: {
    height: 200,
    backgroundColor: '#CBD5E1',
    borderRadius: SIZES.radiusLarge,
    position: 'relative',
    marginBottom: SIZES.large,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  verifiedBadge: {
    position: 'absolute',
    top: SIZES.medium,
    right: SIZES.medium,
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: SIZES.radiusPill,
  },
  verifiedText: {
    ...FONTS.caption,
    color: COLORS.secondaryDark,
  },
  bannerBottomOverlay: {
    position: 'absolute',
    bottom: SIZES.medium,
    left: SIZES.medium,
    flexDirection: 'row',
  },
  unitIdTag: {
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: SIZES.radiusSmall,
    marginRight: 6,
  },
  unitIdText: {
    ...FONTS.caption,
    color: COLORS.surface,
  },
  unitTitleTag: {
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: SIZES.radiusSmall,
  },
  unitTitleText: {
    ...FONTS.caption,
    color: COLORS.surface,
  },
  mainInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.large,
  },
  titleCol: {
    flex: 1,
    paddingRight: SIZES.small,
  },
  categoryTitle: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    fontSize: 10,
  },
  mainTitle: {
    ...FONTS.headline2,
    color: COLORS.secondaryDark,
  },
  subTitle: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  priceCol: {
    alignItems: 'flex-end',
  },
  priceMeta: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    fontSize: 10,
  },
  priceAmount: {
    ...FONTS.headline1,
    color: COLORS.textPrimary,
  },
  currency: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  priceUnit: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  paymentNote: {
    ...FONTS.caption,
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  modeContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: SIZES.radiusPill,
    padding: 4,
    marginBottom: SIZES.large,
  },
  modePill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: SIZES.radiusPill,
  },
  modeActive: {
    backgroundColor: COLORS.surface,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  modeActiveText: {
    ...FONTS.caption,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  modeInactiveText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  operationalBox: {
    backgroundColor: '#F0F9FF',
    borderRadius: SIZES.radiusLarge,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SIZES.large,
    marginBottom: SIZES.xlarge,
  },
  opHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  opLabel: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  opContent: {
    flexDirection: 'row',
    marginBottom: SIZES.medium,
  },
  opTitle: {
    ...FONTS.labelMedium,
    color: COLORS.successText,
    marginBottom: 2,
  },
  opDesc: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  opFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SIZES.small,
  },
  opFooterText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    fontSize: 11,
    flex: 1,
  },
  sectionHeaderTitle: {
    ...FONTS.headline3,
    color: COLORS.secondaryDark,
    marginBottom: SIZES.medium,
  },
  cardBox: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLarge,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SIZES.medium,
    marginBottom: SIZES.medium,
  },
  cardBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.small,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: SIZES.radiusPill,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.medium,
  },
  cardBoxMeta: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    fontSize: 10,
  },
  cardBoxTitle: {
    ...FONTS.labelMedium,
    color: COLORS.textPrimary,
  },
  cardBoxAddress: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  cardBoxHours: {
    ...FONTS.caption,
    color: COLORS.secondaryDark,
    marginTop: 4,
  },
  specsSubLabel: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: SIZES.small,
    marginBottom: SIZES.small,
  },
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SIZES.medium,
  },
  specTile: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SIZES.small,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.small,
  },
  specLabel: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    fontSize: 10,
  },
  specValue: {
    ...FONTS.caption,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    fontSize: 11,
  },
  actionRowCard: {
    flexDirection: 'row',
    marginTop: SIZES.medium,
    marginBottom: SIZES.large,
  },
  outlineBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.secondaryDark,
    borderRadius: SIZES.radiusMedium,
    height: 48,
    marginRight: SIZES.small,
    backgroundColor: COLORS.surface,
  },
  outlineBtnText: {
    ...FONTS.labelMedium,
    color: COLORS.secondaryDark,
  },
  filledBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    borderRadius: SIZES.radiusMedium,
    height: 48,
  },
  filledBtnText: {
    ...FONTS.labelMedium,
    color: COLORS.textPrimary,
  },
});

export default DetailUnit;