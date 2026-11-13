
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
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { COLORS, SIZES, FONTS } from '../../constants/theme';

import HeaderApp from '../../components/molecules/HeaderApp';
import PublicBikePreviewCard from '../../components/organisms/PublicBikePreviewCard';
import type { BikeData } from '../../constants/bikes';
import BottomNavBar, {
  TabType,
} from '../../components/molecules/BottomNavBar';

import {
  getBikes,
  Bike,
} from '../../services/bikeService';

type FilterStatus = 'Semua' | 'Tersedia' | 'Sedang Disewa' | 'Perawatan';

const formatRupiah = (value: number): string => {
  return new Intl.NumberFormat('id-ID').format(value);
};

const mapBikeToCard = (bike: Bike): BikeData => ({
  id: bike.id,
  category: bike.category,
  name: bike.name,
  price: formatRupiah(Number(bike.price_per_hour)),
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

  const maintenanceCount = useMemo(
    () => bikes.filter((bike) => bike.status === 'Perawatan').length,
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

  return (
    <SafeAreaView style={styles.container}>
      <HeaderApp />

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
                {loading ? 'Memuat...' : errorMessage ? 'Data belum tersedia' : `${bikes.length} Unit`}
              </Text>
            </View>
          </View>

          <Text style={styles.pageSubtitle}>
            Lihat kategori, tarif, dan status unit di lokasi Jamal Jepret.
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
            accessibilityLabel="Cari sepeda berdasarkan ID, nama, atau kategori"
          />

          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              hitSlop={10}
                style={styles.clearSearchButton}
                accessibilityRole="button"
                accessibilityLabel="Hapus pencarian"
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
              'Perawatan',
            ] as FilterStatus[]
          ).map((item) => {
            const active = filterStatus === item;

            const count =
              item === 'Semua'
                ? bikes.length
                : item === 'Tersedia'
                  ? availableCount
                  : item === 'Sedang Disewa'
                    ? rentedCount
                    : maintenanceCount;

            return (
              <TouchableOpacity
                key={item}
                style={[
                  styles.filterChip,
                  active && styles.filterChipActive,
                ]}
                onPress={() => setFilterStatus(item)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                accessibilityLabel={`Filter ${item}, ${count} unit`}
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
            Penyewaan dilakukan langsung di lokasi Jamal Jepret. Konfirmasikan kondisi unit kepada petugas sebelum memulai penyewaan.
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

        {/* CATALOG LIST: gunakan komponen kartu yang sama dengan Home */}
        {!loading && !errorMessage && (
          <View style={styles.catalogList}>
            {filteredBikes.map((item) => (
              <PublicBikePreviewCard
                key={item.id}
                bike={mapBikeToCard(item)}
                variant="catalog"
              />
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
    minHeight: 44,
    paddingHorizontal: 12,
    borderRadius: SIZES.radiusPill,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  clearSearchButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },

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
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES.radiusMedium,
    marginTop: SIZES.small,
  },

  retryButtonText: {
    ...FONTS.labelMedium,
    color: COLORS.textPrimary,
  },
});

export default Katalog;
