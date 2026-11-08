
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';


import { COLORS, SIZES, FONTS } from '../../constants/theme';
import HeaderApp from '../../components/molecules/HeaderApp';
import StatusBadge from '../../components/molecules/StatusBadge';
import FeatureTag from '../../components/molecules/FeatureTag';
import BottomNavBar, { TabType } from '../../components/molecules/BottomNavBar';
import { getBikes, Bike } from '../../services/bikeService';

type FilterStatus = 'Semua' | 'Tersedia' | 'Sedang Disewa';

const formatRupiah = (value: number): string => {
  return new Intl.NumberFormat('id-ID').format(value);
};

const Katalog: React.FC = () => {
  const router = useRouter();


  const [activeTab, setActiveTab] = useState<TabType>('Katalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('Semua');

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

  const [bikes, setBikes] = useState<PublicBike[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mengambil data sepeda dari Supabase
  useEffect(() => {
    const loadBikes = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await getPublicBikes();

        // Menyesuaikan hasil service dengan tipe data katalog
        setBikes(result);
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : 'Terjadi kesalahan saat mengambil data sepeda.';

        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadBikes();
  }, []);

  // Navigasi Bottom Navigation
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

  return (
    <SafeAreaView style={styles.container}>
      <HeaderApp notificationCount={0} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Title Section */}
        <View style={styles.titleSection}>
          <View style={styles.titleRow}>
            <Text style={styles.pageTitle}>Katalog Sepeda</Text>


            <View style={styles.totalBadge}>
              <Text style={styles.totalBadgeText}>
                Total {bikes.length} Unit
              </Text>
            </View>
          </View>


          <Text style={styles.pageSubtitle}>
            Eksplorasi armada sepeda siap jalan di seluruh pos terdekat.
            Akses terbuka untuk semua pelancong & warga.
            Eksplorasi armada sepeda siap jalan di seluruh pos terdekat.
            Akses terbuka untuk semua pelancong & warga.
          </Text>
        </View>

        {/* Search Input Bar */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={20}
            color={COLORS.textSecondary}
            style={styles.searchIcon}
          />

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
        </View>

        {/* Filter Chips */}
        {/* Filter Chips */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[
              styles.filterChip,
              filterStatus === 'Semua' && styles.filterChipActive,
            ]}
            style={[
              styles.filterChip,
              filterStatus === 'Semua' && styles.filterChipActive,
            ]}
            onPress={() => setFilterStatus('Semua')}
          >
            <Text
              style={[
                styles.filterChipText,
                filterStatus === 'Semua' && styles.filterChipTextActive,
              ]}
            >
              Semua <Text style={styles.chipCount}>{bikes.length}</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              filterStatus === 'Tersedia' && styles.filterChipActive,
            ]}
            style={[
              styles.filterChip,
              filterStatus === 'Tersedia' && styles.filterChipActive,
            ]}
            onPress={() => setFilterStatus('Tersedia')}
          >
            <Text
              style={[
                styles.filterChipText,
                filterStatus === 'Tersedia' && styles.filterChipTextActive,
              ]}
            >
              Tersedia{' '}
              <Text style={styles.chipCountSuccess}>
                {availableCount}
              </Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              filterStatus === 'Sedang Disewa' && styles.filterChipActive,
            ]}
            onPress={() => setFilterStatus('Sedang Disewa')}
          >
            <Text
              style={[
                styles.filterChipText,
                filterStatus === 'Sedang Disewa' &&
                  styles.filterChipTextActive,
              ]}
            >
              Sedang Disewa{' '}
              <Text style={styles.chipCount}>{rentedCount}</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Notice Box */}
        <View style={styles.noticeBox}>
          <Ionicons
            name="information-circle-outline"
            size={18}
            color={COLORS.textSecondary}
            style={{ marginRight: 8 }}
          />

          <Ionicons
            name="information-circle-outline"
            size={18}
            color={COLORS.textSecondary}
            style={{ marginRight: 8 }}
          />

          <Text style={styles.noticeText}>
            Semua unit berstatus publik. Kunjungi pos terdekat atau hubungi
            petugas di lokasi untuk verifikasi fisik sebelum peminjaman.
          </Text>
        </View>

        {/* Loading */}
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

        {/* Error */}
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

        {/* Empty Database */}
        {!loading && !errorMessage && bikes.length === 0 && (
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
              Saat ini belum ada unit sepeda yang terdaftar dalam katalog.
              Silakan kunjungi kembali nanti.
            </Text>
          </View>
        )}

        {/* Search / Filter Empty */}
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
                Tidak ada unit yang sesuai dengan pencarian atau filter.
              </Text>
            </View>
          )}

        {/* Catalog List */}
        {!loading && !errorMessage && (
          <View style={styles.catalogList}>
            {filteredBikes.map((item) => (
              <View key={item.id} style={styles.cardContainer}>
                <View style={styles.imageContainer}>
                  <View style={styles.topOverlay}>
                    <View style={styles.idBadge}>
                      <Text style={styles.idText}>
                        ID: {item.id}
                      </Text>
                    </View>

                    <StatusBadge status={item.status} />
                  </View>
                </View>

                <View style={styles.cardDetails}>
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.titleColumn}>
                      <Text style={styles.categoryText}>
                        {item.category}
                      </Text>

                      <Text style={styles.bikeName}>
                        {item.name}
                      </Text>
                    </View>

                    <View style={styles.priceColumn}>
                      <Text style={styles.tariffLabel}>
                        Tarif referensi
                      </Text>

                      <Text style={styles.priceText}>
                        Rp{formatRupiah(Number(item.price_per_hour))}
                        <Text style={styles.perHour}> / jam</Text>
                      </Text>
                    </View>
                  </View>

                  <View style={styles.tagsRow}>
                    {getBikeFeatures(item).map((feature, index) => (
                      <FeatureTag
                        key={`${item.id}-${index}`}
                        label={feature}
                      />
                    ))}
                  </View>

                  <TouchableOpacity
                    style={styles.detailButton}
                    activeOpacity={0.7}
                    onPress={() =>
                      router.push({
                    onPress={() =>
                      router.push({
                        pathname: '/public/DetailUnit' as any,
                        params: { id: item.id },
                      })
                    }
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
    marginBottom: SIZES.medium,
  },

  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: SIZES.radiusPill,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
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

  chipCountSuccess: {
    color: COLORS.success,
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
    height: 160,
    backgroundColor: '#CBD5E1',
    position: 'relative',
  },

  topOverlay: {
    position: 'absolute',
    top: SIZES.medium,
    left: SIZES.medium,
    right: SIZES.medium,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  idBadge: {
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: SIZES.radiusSmall,
  },

  idText: {
    ...FONTS.caption,
    color: COLORS.surface,
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
