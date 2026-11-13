
import React, { useCallback, useEffect, useState } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { COLORS, SIZES, FONTS } from '../../constants/theme';
import StatusBadge from '../../components/molecules/StatusBadge';
import BottomNavBar, {
  TabType,
} from '../../components/molecules/BottomNavBar';
import {
  getBikeById,
  Bike,
} from '../../services/bikeService';

const formatRupiah = (value: number): string => {
  return new Intl.NumberFormat('id-ID').format(value);
};

const DetailUnit: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();

  const [activeTab, setActiveTab] = useState<TabType>('Katalog');
  const [bike, setBike] = useState<Bike | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [imageFailed, setImageFailed] = useState(false);

  const bikeId = Array.isArray(params.id) ? params.id[0] : params.id;

  const loadBike = useCallback(async () => {
    if (!bikeId) {
      setBike(null);
      setErrorMessage('ID sepeda tidak ditemukan.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');
      setImageFailed(false);

      const data = await getBikeById(bikeId);

      setBike(data);
    } catch (error) {
      console.error('Detail unit load error:', error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Gagal memuat detail sepeda.'
      );
    } finally {
      setLoading(false);
    }
  }, [bikeId]);

  useEffect(() => {
    loadBike();
  }, [loadBike]);

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

  const isAvailable = bike?.status === 'Tersedia';
  const canScanUnitQr = isAvailable && Boolean(bike?.qr_code);
  const isRented = bike?.status === 'Sedang Disewa';
  const isMaintenance = bike?.status === 'Perawatan';

  const getOperationalTitle = () => {
    if (isAvailable) return 'Siap Disewa di Lokasi';
    if (isRented) return 'Unit Sedang Disewa';
    if (isMaintenance) return 'Unit Sedang Dalam Perawatan';
    return 'Status Tidak Diketahui';
  };

  const getOperationalDescription = () => {
    if (isAvailable) {
      return 'Sepeda ini tercatat tersedia. Datangi lokasi Jamal Jepret dan konfirmasikan unit kepada petugas.';
    }

    if (isRented) {
      return 'Sepeda ini sedang digunakan dalam sesi penyewaan.';
    }

    if (isMaintenance) {
      return 'Sepeda ini sedang dalam proses perawatan dan belum dapat disewa.';
    }

    return 'Informasi operasional sepeda belum tersedia.';
  };

  const getStatusColor = () => {
    if (isAvailable) return COLORS.success;
    if (isMaintenance) return '#92400E';
    if (isRented) return COLORS.rentedText;
    return COLORS.textSecondary;
  };

  const getStatusIcon = (): keyof typeof Ionicons.glyphMap => {
    if (isAvailable) return 'checkmark-circle-outline';
    if (isMaintenance) return 'construct-outline';
    return 'time-outline';
  };

  // Loading State
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />

        <View style={styles.stateContainer}>
          <ActivityIndicator
            size="large"
            color={COLORS.secondaryDark}
          />
          <Text style={styles.stateText}>
            Memuat detail sepeda...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error State
  if (errorMessage) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />

        <View style={styles.stateContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={44}
            color="#B91C1C"
          />

          <Text style={styles.stateTitle}>
            Gagal Memuat Detail
          </Text>

          <Text style={styles.stateText}>
            {errorMessage}
          </Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadBike}
          >
            <Text style={styles.retryButtonText}>
              Coba Lagi
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>
              Kembali ke Katalog
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Not Found State
  if (!bike) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />

        <View style={styles.stateContainer}>
          <Ionicons
            name="bicycle-outline"
            size={44}
            color={COLORS.textSecondary}
          />

          <Text style={styles.stateTitle}>
            Unit Tidak Ditemukan
          </Text>

          <Text style={styles.stateText}>
            Data sepeda dengan ID {bikeId || '-'} tidak ditemukan.
          </Text>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.replace('/public/katalog' as any)}
          >
            <Text style={styles.backButtonText}>
              Kembali ke Katalog
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Top Header */}
      <View style={styles.safeHeaderArea}>
        <View style={styles.topHeader}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel="Kembali"
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color={COLORS.secondaryDark}
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Detail Sepeda
          </Text>

          <View style={styles.headerRight} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner Gambar & Badges */}
        <View style={styles.bannerContainer}>
          {bike.image_url && !imageFailed ? (
            <Image
              source={{ uri: bike.image_url }}
              style={styles.bannerImage}
              resizeMode="cover"
              onError={() => setImageFailed(true)}
              accessibilityLabel={`Foto ${bike.name}`}
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons
                name="bicycle-outline"
                size={64}
                color="#94A3B8"
              />
              <Text style={styles.placeholderText}>
                Gambar belum tersedia
              </Text>
            </View>
          )}

          <View style={styles.verifiedBadge}>
            <Ionicons
              name="qr-code-outline"
              size={14}
              color={COLORS.secondaryDark}
              style={{ marginRight: 4 }}
            />
            <Text style={styles.verifiedText}>
              {bike.qr_code ? 'QR tersedia' : 'QR belum tersedia'}
            </Text>
          </View>

          <View style={styles.bannerBottomOverlay}>
            <View style={styles.unitIdTag}>
              <Text style={styles.unitIdText}>
                # {bike.id}
              </Text>
            </View>

            <View style={styles.unitTitleTag}>
              <Text style={styles.unitTitleText}>
                {bike.name}
              </Text>
            </View>
          </View>
        </View>

        {/* Info Utama & Harga */}
        <View style={styles.mainInfoRow}>
          <View style={styles.titleCol}>
            <Text style={styles.categoryTitle}>
              Kategori
            </Text>

            <Text style={styles.mainTitle}>
              {bike.category}
            </Text>

          </View>

          <View style={styles.priceCol}>
            <Text style={styles.priceMeta}>
              Tarif Sewa per Jam
            </Text>

            <Text style={styles.priceAmount}>
              <Text style={styles.currency}>Rp </Text>
              {formatRupiah(Number(bike.price_per_hour))}
              <Text style={styles.priceUnit}> / jam</Text>
            </Text>

          </View>
        </View>

        {/* Status Operational */}
        <View style={styles.operationalBox}>
          <View style={styles.opHeader}>
            <Text style={styles.opLabel}>
              Status Operasional Unit
            </Text>

            <StatusBadge status={bike.status} />
          </View>

          <View style={styles.opContent}>
            <Ionicons
              name={getStatusIcon()}
              size={24}
              color={getStatusColor()}
              style={{ marginRight: 10 }}
            />

            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.opTitle,
                  !isAvailable && { color: getStatusColor() },
                ]}
              >
                {getOperationalTitle()}
              </Text>

              <Text style={styles.opDesc}>
                {getOperationalDescription()}
              </Text>
            </View>
          </View>

          <View style={styles.opFooter}>
            <Ionicons
              name="storefront-outline"
              size={16}
              color={COLORS.textSecondary}
              style={{ marginRight: 6 }}
            />

            <Text style={styles.opFooterText}>
              Penyewaan dilakukan langsung di lokasi Jamal Jepret.
            </Text>
          </View>
        </View>

        {/* Informasi lokasi usaha */}
        <Text style={styles.sectionHeaderTitle}>
          Lokasi Penyewaan
        </Text>

        {/* Informasi lokasi usaha */}
        <View style={styles.cardBox}>
          <View style={styles.cardBoxHeader}>
            <View style={styles.iconCircle}>
              <Ionicons
                name="location-outline"
                size={18}
                color={COLORS.secondaryDark}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.cardBoxMeta}>
                Satu lokasi operasional
              </Text>

              <Text style={styles.cardBoxTitle}>
                Jamal Jepret
              </Text>
            </View>
          </View>

          <Text style={styles.cardBoxAddress}>
            Penyewaan diselesaikan bersama petugas di lokasi usaha.
          </Text>
        </View>

        {/* Card Kondisi Teknis */}
        <View style={styles.cardBox}>
          <View style={styles.cardBoxHeader}>
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: '#DCFCE7' },
              ]}
            >
              <Ionicons
                name="checkmark-done-outline"
                size={18}
                color={COLORS.success}
              />
            </View>

            <View>
              <Text style={styles.cardBoxMeta}>
                Kondisi Teknis Unit
              </Text>

              <Text style={styles.cardBoxTitle}>
                {bike.technical_condition || 'Belum diperiksa'}
              </Text>
            </View>
          </View>

          <Text style={styles.cardBoxAddress}>
            {bike.notes || 'Belum ada catatan tambahan untuk unit ini.'}
          </Text>
        </View>

        {/* Specs Grid */}
        <Text style={styles.specsSubLabel}>
          Kelengkapan & Fitur Teknis
        </Text>

        <View style={styles.specsGrid}>
          <View style={styles.specTile}>
            <Ionicons
              name="options-outline"
              size={18}
              color={COLORS.secondaryDark}
            />

            <View style={{ marginLeft: 8, flex: 1 }}>
              <Text style={styles.specLabel}>
                Ukuran Ban
              </Text>

              <Text style={styles.specValue}>
                {bike.tire_size || 'Belum tersedia'}
              </Text>
            </View>
          </View>

          <View style={styles.specTile}>
            <Ionicons
              name="disc-outline"
              size={18}
              color={COLORS.secondaryDark}
            />

            <View style={{ marginLeft: 8, flex: 1 }}>
              <Text style={styles.specLabel}>
                Pengereman
              </Text>

              <Text style={styles.specValue}>
                {bike.brakes || 'Belum tersedia'}
              </Text>
            </View>
          </View>

          <View style={styles.specTile}>
            <Ionicons
              name="speedometer-outline"
              size={18}
              color={COLORS.secondaryDark}
            />

            <View style={{ marginLeft: 8, flex: 1 }}>
              <Text style={styles.specLabel}>
                Transmisi
              </Text>

              <Text style={styles.specValue}>
                {bike.transmission || 'Belum tersedia'}
              </Text>
            </View>
          </View>

          <View style={styles.specTile}>
            <Ionicons
              name="shield-checkmark-outline"
              size={18}
              color={COLORS.secondaryDark}
            />

            <View style={{ marginLeft: 8, flex: 1 }}>
              <Text style={styles.specLabel}>
                Fasilitas Unit
              </Text>

              <Text style={styles.specValue}>
                {bike.facilities || 'Belum tersedia'}
              </Text>
            </View>
          </View>
        </View>

        {/* Features */}
        {!!bike.features?.length && (
          <View style={styles.featuresSection}>
            <Text style={styles.specsSubLabel}>
              Fitur Tambahan
            </Text>

            <View style={styles.featuresRow}>
              {bike.features.map((feature, index) => (
                <View
                  key={`${bike.id}-feature-${index}`}
                  style={styles.featureTag}
                >
                  <Text style={styles.featureTagText}>
                    {feature}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {!!bike.extra_tags?.length && (
          <View style={styles.featuresSection}>
            <Text style={styles.specsSubLabel}>
              Tag Unit
            </Text>

            <View style={styles.featuresRow}>
              {bike.extra_tags.map((tag, index) => (
                <View
                  key={`${bike.id}-tag-${index}`}
                  style={styles.featureTag}
                >
                  <Text style={styles.featureTagText}>
                    {tag}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Action Callout */}
        <View style={styles.actionRowCard}>
          <TouchableOpacity
            style={[
              styles.filledBtn,
              !canScanUnitQr && styles.disabledBtn,
            ]}
            activeOpacity={0.8}
            disabled={!canScanUnitQr}
            accessibilityRole="button"
            accessibilityState={{ disabled: !canScanUnitQr }}
            accessibilityLabel={canScanUnitQr ? 'Pindai QR unit' : !bike.qr_code ? 'Kode QR unit belum tersedia' : 'Unit tidak tersedia untuk disewa'}
            onPress={() =>
              router.push('/public/durasi-sewa' as any)
            }
          >
            <Ionicons
              name="qr-code-outline"
              size={16}
              color={COLORS.textPrimary}
              style={{ marginRight: 6 }}
            />

            <Text style={styles.filledBtnText}>
              {canScanUnitQr ? 'Pindai QR Unit' : !bike.qr_code ? 'QR Belum Tersedia' : 'Unit Tidak Tersedia'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
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
    width: 44,
    height: 44,
  },
  iconBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
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
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E2E8F0',
  },
  placeholderText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: 8,
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
  featuresSection: {
    marginBottom: SIZES.medium,
  },
  featuresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  featureTag: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: SIZES.radiusPill,
    marginRight: 6,
    marginBottom: 6,
  },
  featureTagText: {
    ...FONTS.caption,
    color: COLORS.secondaryDark,
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
  disabledBtn: {
    opacity: 0.45,
  },
  filledBtnText: {
    ...FONTS.labelMedium,
    color: COLORS.textPrimary,
  },
  stateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.large,
    gap: SIZES.medium,
  },
  stateTitle: {
    ...FONTS.headline3,
    color: COLORS.secondaryDark,
    textAlign: 'center',
  },
  stateText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SIZES.large,
    paddingVertical: SIZES.medium,
    borderRadius: SIZES.radiusMedium,
    marginTop: SIZES.small,
  },
  retryButtonText: {
    ...FONTS.labelMedium,
    color: COLORS.textPrimary,
  },
  backButton: {
    paddingHorizontal: SIZES.large,
    paddingVertical: SIZES.small,
  },
  backButtonText: {
    ...FONTS.labelMedium,
    color: COLORS.secondaryDark,
  },
});

export default DetailUnit;