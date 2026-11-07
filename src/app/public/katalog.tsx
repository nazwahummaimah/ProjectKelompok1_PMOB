
import React, { useEffect, useState } from 'react';
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
import {
  getPublicBikes,
  PublicBike,
} from '../../services/bikeService';


const Katalog: React.FC = () => {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabType>('Katalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<
    'Semua' | 'Tersedia' | 'Sedang Disewa'
  >('Semua');

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

  // Pencarian dan filter data sepeda
  const filteredBikes = bikes.filter((bike) => {
    const keyword = searchQuery.toLowerCase();

    const matchesSearch =
      bike.name.toLowerCase().includes(keyword) ||
      bike.id.toLowerCase().includes(keyword) ||
      bike.category.toLowerCase().includes(keyword);

    const matchesStatus =
      filterStatus === 'Semua' ||
      bike.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Menghitung jumlah sepeda berdasarkan status
  const totalBikes = bikes.length;
  const availableBikes = bikes.filter(
    (item) => item.status === 'Tersedia'
  ).length;

  return (
    <SafeAreaView style={styles.container}>
      <HeaderApp notificationCount={0} />

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
                Total {totalBikes} Unit
              </Text>
            </View>
          </View>

          <Text style={styles.pageSubtitle}>
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

          <TextInput
            style={styles.searchInput}
            placeholder="Cari ID atau tipe sepeda..."
            placeholderTextColor={COLORS.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filter Chips */}
        <View style={styles.filterRow}>
          <TouchableOpacity
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
              Semua <Text style={styles.chipCount}>{totalBikes}</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              filterStatus === 'Tersedia' && styles.filterChipActive,
            ]}
            onPress={() => setFilterStatus('Tersedia')}
          >
            <Text
              style={[
                styles.filterChipText,
                filterStatus === 'Tersedia' &&
                  styles.filterChipTextActive,
              ]}
            >
              Tersedia{' '}
              <Text style={styles.chipCountSuccess}>
                {availableBikes}
              </Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              filterStatus === 'Sedang Disewa' &&
                styles.filterChipActive,
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
              Sedang Disewa
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

          <Text style={styles.noticeText}>
            Semua unit berstatus publik. Kunjungi pos terdekat atau
            hubungi petugas di lokasi untuk verifikasi fisik sebelum
            peminjaman.
          </Text>
        </View>

        {/* Catalog List */}
        <View style={styles.catalogList}>
          {loading ? (
            <View style={styles.messageContainer}>
              <ActivityIndicator
                size="large"
                color={COLORS.secondaryDark}
              />
              <Text style={styles.messageText}>
                Memuat katalog sepeda...
              </Text>
            </View>
          ) : error ? (
            <View style={styles.messageContainer}>
              <Ionicons
                name="alert-circle-outline"
                size={32}
                color={COLORS.error}
              />

              <Text style={styles.errorText}>{error}</Text>

              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => {
                  setError(null);
                  setLoading(true);

                  getPublicBikes()
                    .then((result) => {
                      setBikes(result);
                    })
                    .catch((err: unknown) => {
                      setError(
                        err instanceof Error
                          ? err.message
                          : 'Gagal memuat katalog sepeda.'
                      );
                    })
                    .finally(() => setLoading(false));
                }}
              >
                <Text style={styles.retryButtonText}>Coba Lagi</Text>
              </TouchableOpacity>
            </View>
          ) : filteredBikes.length === 0 ? (
            <View style={styles.messageContainer}>
              <Ionicons
                name="bicycle-outline"
                size={36}
                color={COLORS.textSecondary}
              />

              <Text style={styles.messageText}>
                {bikes.length === 0
                  ? 'Belum ada data sepeda.'
                  : 'Sepeda yang kamu cari tidak ditemukan.'}
              </Text>
            </View>
          ) : (
            filteredBikes.map((item) => (
              <View key={item.id} style={styles.cardContainer}>
                {/* Image Section */}
                <View style={styles.imageContainer}>
                  <View style={styles.topOverlay}>
                    <View style={styles.idBadge}>
                      <Text style={styles.idText}>{item.id}</Text>
                    </View>

                    <StatusBadge status={item.status} />
                  </View>
                </View>

                {/* Bike Details */}
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
                        Rp{item.price}{' '}
                        <Text style={styles.perHour}>/ jam</Text>
                      </Text>
                    </View>
                  </View>

                  {/* Bike Features */}
                  <View style={styles.tagsRow}>
                    {item.features.map((feature, fIdx) => (
                      <FeatureTag
                        key={`${item.id}-feature-${fIdx}`}
                        label={feature}
                      />
                    ))}
                  </View>

                  {/* Detail Button */}
                  <TouchableOpacity
                    style={styles.detailButton}
                    activeOpacity={0.7}
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
            ))
          )}
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

  messageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },

  messageText: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },

  errorText: {
    ...FONTS.body,
    color: COLORS.error,
    textAlign: 'center',
  },

  retryButton: {
    backgroundColor: COLORS.secondaryDark,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: SIZES.radiusMedium,
  },

  retryButtonText: {
    ...FONTS.caption,
    color: COLORS.surface,
    fontWeight: 'bold',
  },
});

export default Katalog;
