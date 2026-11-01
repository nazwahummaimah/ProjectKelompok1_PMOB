// app/public/KatalogPublic.tsx
import React, { useState } from 'react';
import { 
  SafeAreaView, 
  ScrollView, 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../constants/theme';
import HeaderApp from '../../components/molecules/HeaderApp';
import StatusBadge from '../../components/molecules/StatusBadge';
import FeatureTag from '../../components/molecules/FeatureTag';
import BottomNavBar from '../../components/molecules/BottomNavBar';

export interface CatalogBikeItem {
  id: string;
  category: string;
  name: string;
  price: string;
  status: 'Tersedia' | 'Sedang Disewa' | 'Perawatan';
  location: string;
  features: string[];
  image: string;
}

const CATALOG_DATA: CatalogBikeItem[] = [
  {
    id: 'ID: B-001',
    category: 'MOUNTAIN BIKE',
    name: 'Polygon Cascade 4',
    price: '25.000',
    status: 'Tersedia',
    location: 'Pos Stasiun Tugu',
    features: ['24 Speed Shimano', 'Pos Stasiun Tugu'],
    image: 'https://via.placeholder.com/400x200',
  },
  {
    id: 'ID: B-003',
    category: 'FOLDING BIKE',
    name: 'Dahon Mariner D8',
    price: '20.000',
    status: 'Sedang Disewa',
    location: 'Pos Alun-alun Kidul',
    features: ['Lipat Praktis', 'Pos Alun-alun Kidul'],
    image: 'https://via.placeholder.com/400x200',
  },
  {
    id: 'ID: B-005',
    category: 'CITY BIKE',
    name: 'Phoenix City Classic',
    price: '15.000',
    status: 'Tersedia',
    location: 'Pos Malioboro',
    features: ['Keranjang + Boncengan', 'Pos Malioboro'],
    image: 'https://via.placeholder.com/400x200',
  },
  {
    id: 'ID: B-014',
    category: 'GRAVEL BIKE',
    name: 'Polygon Bend R2',
    price: '30.000',
    status: 'Sedang Disewa',
    location: 'Pos Stasiun Tugu',
    features: ['Dropbar All-Road', 'Pos Stasiun Tugu'],
    image: 'https://via.placeholder.com/400x200',
  },
  {
    id: 'ID: B-019',
    category: 'ELECTRIC BIKE',
    name: 'Selis E-City',
    price: '35.000',
    status: 'Tersedia',
    location: 'Pos Malioboro',
    features: ['Baterai 36V Pedal-Assist', 'Pos Malioboro'],
    image: 'https://via.placeholder.com/400x200',
  },
];

const KatalogPublic: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Beranda' | 'Katalog' | 'Scan' | 'Login'>('Katalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'Semua' | 'Tersedia' | 'Sedang Disewa'>('Semua');

  return (
    <SafeAreaView style={styles.container}>
      <HeaderApp notificationCount={0} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Title Section */}
        <View style={styles.titleSection}>
          <View style={styles.titleRow}>
            <Text style={styles.pageTitle}>Katalog Sepeda</Text>
            <View style={styles.totalBadge}>
              <Text style={styles.totalBadgeText}>Total 20 Unit</Text>
            </View>
          </View>
          <Text style={styles.pageSubtitle}>
            Eksplorasi armada sepeda siap jalan di seluruh pos terdekat. Akses terbuka untuk semua pelancong & warga.
          </Text>
        </View>

        {/* Search Input Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari ID atau tipe sepeda..."
            placeholderTextColor={COLORS.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filter Chips / Pills */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.filterChip, filterStatus === 'Semua' && styles.filterChipActive]}
            onPress={() => setFilterStatus('Semua')}
          >
            <Text style={[styles.filterChipText, filterStatus === 'Semua' && styles.filterChipTextActive]}>
              Semua <Text style={styles.chipCount}>20</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, filterStatus === 'Tersedia' && styles.filterChipActive]}
            onPress={() => setFilterStatus('Tersedia')}
          >
            <Text style={[styles.filterChipText, filterStatus === 'Tersedia' && styles.filterChipTextActive]}>
              Tersedia <Text style={styles.chipCountSuccess}>14</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, filterStatus === 'Sedang Disewa' && styles.filterChipActive]}
            onPress={() => setFilterStatus('Sedang Disewa')}
          >
            <Text style={[styles.filterChipText, filterStatus === 'Sedang Disewa' && styles.filterChipTextActive]}>
              Sedang Disewa
            </Text>
          </TouchableOpacity>
        </View>

        {/* Notice Box */}
        <View style={styles.noticeBox}>
          <Ionicons name="information-circle-outline" size={18} color={COLORS.textSecondary} style={{ marginRight: 8 }} />
          <Text style={styles.noticeText}>
            Semua unit berstatus publik. Kunjungi pos terdekat atau hubungi Mas Joko di lokasi untuk verifikasi fisik sebelum peminjaman.
          </Text>
        </View>

        {/* Catalog List */}
        <View style={styles.catalogList}>
          {CATALOG_DATA.map((item, index) => (
            <View key={index} style={styles.cardContainer}>
              <View style={styles.imageContainer}>
                <View style={styles.topOverlay}>
                  <View style={styles.idBadge}>
                    <Text style={styles.idText}>{item.id}</Text>
                  </View>
                  <StatusBadge status={item.status} />
                </View>
              </View>

              <View style={styles.cardDetails}>
                <View style={styles.cardHeaderRow}>
                  <View style={styles.titleColumn}>
                    <Text style={styles.categoryText}>{item.category}</Text>
                    <Text style={styles.bikeName}>{item.name}</Text>
                  </View>
                  <View style={styles.priceColumn}>
                    <Text style={styles.tariffLabel}>Tarif referensi</Text>
                    <Text style={styles.priceText}>
                      Rp{item.price} <Text style={styles.perHour}>/ jam</Text>
                    </Text>
                  </View>
                </View>

                <View style={styles.tagsRow}>
                  {item.features.map((feature, fIdx) => (
                    <FeatureTag key={fIdx} label={feature} />
                  ))}
                </View>

                <TouchableOpacity style={styles.detailButton} activeOpacity={0.7}>
                  <Text style={styles.detailButtonText}>Lihat Detail Unit</Text>
                  <Ionicons name="chevron-forward" size={16} color={COLORS.secondaryDark} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <BottomNavBar activeTab={activeTab} onTabPress={setActiveTab} />
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
    backgroundColor: COLORS.secondaryDark,
    color: COLORS.surface,
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
});

export default KatalogPublic;