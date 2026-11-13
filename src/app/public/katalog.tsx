
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { COLORS, SIZES, FONTS } from '../../constants/theme';

import HeaderApp from '../../components/molecules/HeaderApp';
import StatusBadge from '../../components/molecules/StatusBadge';
import FeatureTag from '../../components/molecules/FeatureTag';
import BottomNavBar, {
  TabType,
} from '../../components/molecules/BottomNavBar';

import {
  getBikes,
  Bike,
} from '../../services/bikeService';

type FilterStatus = 'Semua' | 'Tersedia' | 'Sedang Disewa';

const formatRupiah = (value: number): string => {
  return new Intl.NumberFormat('id-ID').format(value);
};

const Katalog: React.FC = () => {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabType>('Katalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] =
    useState<FilterStatus>('Semua');

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
      console.error('Katalog load error:', error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Gagal memuat katalog sepeda.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBikes();
  }, [loadBikes]);

  const availableCount = useMemo(
    () => bikes.filter((bike) => bike.status === 'Tersedia').length,
    [bikes]
  );

  const rentedCount = useMemo(
    () => bikes.filter((bike) => bike.status === 'Sedang Disewa').length,
    [bikes]
  );

  const filteredBikes = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();

    return bikes.filter((bike) => {
      const matchesSearch =
        !keyword ||
        bike.id.toLowerCase().includes(keyword) ||
        bike.name.toLowerCase().includes(keyword) ||
        bike.category.toLowerCase().includes(keyword);

      const matchesStatus =
        filterStatus === 'Semua' ||
        bike.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [bikes, searchQuery, filterStatus]);

  const handleTabPress = (tab: TabType) => {
    setActiveTab(tab);

    switch (tab) {
      case 'Beranda':
        router.push('/public/' as any);
        break;

      case 'Katalog':
        break;

      case 'DurasiSewa':
        router.push('/public/durasi-sewa' as any);
        break;

      case 'Login':
        router.push('/public/login' as any);
        break;
    }
  };

  const getBikeFeatures = (bike: Bike): string[] => {
    const features = bike.features ?? [];
    const result = [...features];

    if (bike.location && !result.includes(bike.location)) {
      result.push(bike.location);
    }

    return result.slice(0, 4);
  };

  const openBikeDetail = (bikeId: string) => {
    router.push({
      pathname: '/public/DetailUnit' as any,
      params: { id: bikeId },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderApp notificationCount={0} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.titleSection}>
          <View style={styles.titleRow}>
            <Text style={styles.pageTitle}>
              Katalog Sepeda
            </Text>

            <View style={styles.totalBadge}>
              <Text style={styles.totalBadgeText}>
                Total {bikes.length} Unit
              </Text>
            </View>
          </View>

          <Text style={styles.pageSubtitle}>
            Eksplorasi armada sepeda siap jalan di seluruh pos
            penyewaan Jamal Jepret.
          </Text>
        </View>

        {/* SEARCH */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={20}
            color={COLORS.textSecondary}
            style={styles.searchIcon}
          />

          <TextInput
            style={styles.searchInput}
            placeholder="Cari ID atau tipe sepeda..."
            placeholderTextColor={COLORS.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              hitSlop={10}
            >
              <Ionicons
                name="close-circle"
                size={19}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* FILTER */}
        <View style={styles.filterRow}>
          {(
            [
              'Semua',
              'Tersedia',
              'Sedang Disewa',
            ] as FilterStatus[]
          ).map((item) => {
            const active = filterStatus === item;

            const count =
              item === 'Semua'
                ? bikes.length
                : item === 'Tersedia'
                  ? availableCount
                  : rentedCount;

            return (
              <TouchableOpacity
                key={item}
                style={[
                  styles.filterChip,
                  active && styles.filterChipActive,
                ]}
                onPress={() => setFilterStatus(item)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    active && styles.filterChipTextActive,
                  ]}
                >
                  {item}{' '}
                  <Text style={styles.chipCount}>
                    {count}
                  </Text>
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* NOTICE */}
        <View style={styles.noticeBox}>
          <Ionicons
            name="information-circle-outline"
            size={18}
            color={COLORS.textSecondary}
            style={{ marginRight: 8 }}
          />

          <Text style={styles.noticeText}>
            Semua unit berstatus publik. Kunjungi pos terdekat
            atau hubungi petugas di lokasi untuk verifikasi fisik
            sebelum peminjaman.
          </Text>
        </View>

        {/* LOADING */}
        {loading && (
          <View style={styles.stateContainer}>
            <ActivityIndicator
              size="large"
              color={COLORS.secondaryDark}
            />

            <Text style={styles.stateText}>
              Memuat katalog sepeda...
            </Text>
          </View>
        )}

        {/* ERROR */}
        {!loading && !!errorMessage && (
          <View style={styles.stateContainer}>
            <Ionicons
              name="alert-circle-outline"
              size={36}
              color={COLORS.error}
            />

            <Text style={styles.stateText}>
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

        {/* EMPTY DATABASE */}
        {!loading &&
          !errorMessage &&
          bikes.length === 0 && (
            <View style={styles.stateContainer}>
              <Ionicons
                name="bicycle-outline"
                size={44}
                color={COLORS.textSecondary}
              />

              <Text style={styles.emptyTitle}>
                Belum Ada Unit Sepeda
              </Text>

              <Text style={styles.stateText}>
                Saat ini belum ada unit sepeda yang terdaftar
                dalam katalog. Silakan kunjungi kembali nanti.
              </Text>
            </View>
          )}

        {/* FILTER EMPTY */}
        {!loading &&
          !errorMessage &&
          bikes.length > 0 &&
          filteredBikes.length === 0 && (
            <View style={styles.stateContainer}>
              <Ionicons
                name="search-outline"
                size={40}
                color={COLORS.textSecondary}
              />

              <Text style={styles.emptyTitle}>
                Sepeda Tidak Ditemukan
              </Text>

              <Text style={styles.stateText}>
                Tidak ada unit yang sesuai dengan pencarian
                atau filter.
              </Text>
            </View>
          )}

        {/* CATALOG LIST */}
        {!loading && !errorMessage && (
          <View style={styles.catalogList}>
            {filteredBikes.map((item) => (
              <View
                key={item.id}
                style={styles.cardContainer}
              >
                {/* BIKE IMAGE */}
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => openBikeDetail(item.id)}
                >
                  <View style={styles.imageContainer}>
                    {item.image_url ? (
                      <Image
                        source={{ uri: item.image_url }}
                        style={styles.bikeImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.imageFallback}>
                        <Ionicons
                          name="bicycle"
                          size={54}
                          color="#94A3B8"
                        />

                        <Text style={styles.imageFallbackText}>
                          Foto belum tersedia
                        </Text>
                      </View>
                    )}

                    {/* IMAGE OVERLAY */}
                    <View style={styles.imageOverlay} />

                    {/* TOP BADGES */}
                    <View style={styles.topOverlay}>
                      <View style={styles.idBadge}>
                        <Text style={styles.idText}>
                          ID: {item.id}
                        </Text>
                      </View>

                      <StatusBadge status={item.status} />
                    </View>

                    {/* IMAGE CAPTION */}
                    <View style={styles.imageCaption}>
                      <Text
                        style={styles.imageCaptionName}
                        numberOfLines={1}
                      >
                        {item.name}
                      </Text>

                      <Text style={styles.imageCaptionCategory}>
                        {item.category}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>

                {/* CARD DETAILS */}
                <View style={styles.cardDetails}>
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.titleColumn}>
                      <Text style={styles.categoryText}>
                        {item.category}
                      </Text>

                      <Text style={styles.bikeName}>
                        {item.id}
                      </Text>
                    </View>

                    <View style={styles.priceColumn}>
                      <Text style={styles.tariffLabel}>
                        Tarif referensi
                      </Text>

                      <Text style={styles.priceText}>
                        Rp{formatRupiah(
                          Number(item.price_per_hour)
                        )}
                        <Text style={styles.perHour}>
                          {' '}/ jam
                        </Text>
                      </Text>
                    </View>
                  </View>

                  {/* FEATURES */}
                  <View style={styles.tagsRow}>
                    {getBikeFeatures(item).map(
                      (feature, index) => (
                        <FeatureTag
                          key={`${item.id}-${index}`}
                          label={feature}
                        />
                      )
                    )}
                  </View>

                  {/* DETAIL BUTTON */}
                  <TouchableOpacity
                    style={styles.detailButton}
                    activeOpacity={0.7}
                    onPress={() => openBikeDetail(item.id)}
                  >
                    <Text style={styles.detailButtonText}>
                      Lihat Detail Unit
                    </Text>

                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color={COLORS.secondaryDark}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
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
  },

  titleSection: {
    marginBottom: SIZES.large,
  },

  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },

  pageTitle: {
    ...FONTS.headline1,
    color: COLORS.secondaryDark,
  },

  pageSubtitle: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },

  totalBadge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: SIZES.radiusSmall,
  },

  totalBadgeText: {
    ...FONTS.caption,
    color: COLORS.secondaryDark,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusMedium,
    paddingHorizontal: SIZES.medium,
    height: 48,
    marginBottom: SIZES.medium,
  },

  searchIcon: {
    marginRight: SIZES.small,
  },

  searchInput: {
    flex: 1,
    ...FONTS.body,
    color: COLORS.textPrimary,
  },

  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SIZES.medium,
    gap: 7,
  },

  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: SIZES.radiusPill,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  filterChipActive: {
    backgroundColor: '#E0F2FE',
    borderColor: COLORS.primaryLight,
  },

  filterChipText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },

  filterChipTextActive: {
    color: COLORS.secondaryDark,
    fontWeight: 'bold',
  },

  chipCount: {
    color: COLORS.secondaryDark,
    fontSize: 10,
    fontWeight: 'bold',
  },

  noticeBox: {
    flexDirection: 'row',
    backgroundColor: '#F0F9FF',
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.medium,
    marginBottom: SIZES.large,
    alignItems: 'flex-start',
  },

  noticeText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    flex: 1,
    lineHeight: 18,
  },

  catalogList: {
    marginBottom: SIZES.large,
  },

  cardContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLarge,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SIZES.large,
    overflow: 'hidden',
  },

  imageContainer: {
    height: 205,
    backgroundColor: '#CBD5E1',
    position: 'relative',
    overflow: 'hidden',
  },

  bikeImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },

  imageFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E2E8F0',
  },

  imageFallbackText: {
    ...FONTS.caption,
    color: '#64748B',
    marginTop: 8,
  },

  imageOverlay: {
    ...StyleSheet.absoluteFill ,
    backgroundColor: 'rgba(15, 23, 42, 0.10)',
  },

  topOverlay: {
    position: 'absolute',
    top: SIZES.medium,
    left: SIZES.medium,
    right: SIZES.medium,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  idBadge: {
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: SIZES.radiusSmall,
  },

  idText: {
    ...FONTS.caption,
    color: COLORS.surface,
    fontWeight: '700',
  },

  imageCaption: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: SIZES.large,
    paddingVertical: 13,
    backgroundColor: 'rgba(15, 23, 42, 0.52)',
  },

  imageCaptionName: {
    ...FONTS.labelLarge,
    color: '#FFFFFF',
    fontWeight: '700',
  },

  imageCaptionCategory: {
    ...FONTS.caption,
    color: '#E2E8F0',
    marginTop: 2,
  },

  cardDetails: {
    padding: SIZES.large,
  },

  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.medium,
  },

  titleColumn: {
    flex: 1,
    paddingRight: SIZES.small,
  },

  categoryText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
  },

  bikeName: {
    ...FONTS.headline3,
    color: COLORS.secondaryDark,
  },

  priceColumn: {
    alignItems: 'flex-end',
  },

  tariffLabel: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    fontSize: 10,
  },

  priceText: {
    ...FONTS.headline3,
    color: COLORS.textPrimary,
  },

  perHour: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    fontWeight: 'normal',
  },

  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SIZES.medium,
  },

  detailButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SIZES.medium,
  },

  detailButtonText: {
    ...FONTS.labelMedium,
    color: COLORS.secondaryDark,
  },

  stateContainer: {
    padding: SIZES.large,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SIZES.small,
  },

  stateText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },

  emptyTitle: {
    ...FONTS.headline3,
    color: COLORS.secondaryDark,
    textAlign: 'center',
  },

  retryButton: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SIZES.large,
    paddingVertical: SIZES.small,
    borderRadius: SIZES.radiusMedium,
    marginTop: SIZES.small,
  },

  retryButtonText: {
    ...FONTS.labelMedium,
    color: COLORS.textPrimary,
  },
});

export default Katalog;
