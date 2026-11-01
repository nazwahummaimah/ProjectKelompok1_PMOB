// app/public/DetailUnit.tsx
import React from 'react';
import { 
  SafeAreaView, 
  ScrollView, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../constants/theme';
import StatusBadge from '../../components/molecules/StatusBadge';
import FeatureTag from '../../components/molecules/FeatureTag';

const DetailUnit: React.FC = () => {    
  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.iconBtn}>
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

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner Gambar & Badges */}
        <View style={styles.bannerContainer}>
          <View style={styles.verifiedBadge}>
            <Ionicons name="qr-code-outline" size={14} color={COLORS.secondaryDark} style={{ marginRight: 4 }} />
            <Text style={styles.verifiedText}>Terverifikasi QR</Text>
          </View>

          <View style={styles.bannerBottomOverlay}>
            <View style={styles.unitIdTag}>
              <Text style={styles.unitIdText}># Unit B-001</Text>
            </View>
            <View style={styles.unitTitleTag}>
              <Text style={styles.unitTitleText}>Polygon Cascade 4</Text>
            </View>
          </View>
        </View>

        {/* Info Utama Title & Price */}
        <View style={styles.mainInfoRow}>
          <View style={styles.titleCol}>
            <Text style={styles.categoryTitle}>KATEGORI SEPEDA</Text>
            <Text style={styles.mainTitle}>Mountain Bike (MTB)</Text>
            <Text style={styles.subTitle}>Polygon Cascade 4 Series • Rangka Alloy Ringan</Text>
          </View>
          <View style={styles.priceCol}>
            <Text style={styles.priceMeta}>Tarif Sewa Pos</Text>
            <Text style={styles.priceAmount}>
              <Text style={styles.currency}>Rp </Text>25.000<Text style={styles.priceUnit}> / jam</Text>
            </Text>
            <Text style={styles.paymentNote}>Bayar langsung di kasir</Text>
          </View>
        </View>

        {/* Mode Selector Display */}
        <View style={styles.modeContainer}>
          <View style={[styles.modePill, styles.modeActive]}>
            <View style={[styles.dot, { backgroundColor: COLORS.success }]} />
            <Text style={styles.modeActiveText}>Mode: Tersedia</Text>
          </View>
          <View style={styles.modePill}>
            <View style={[styles.dot, { backgroundColor: COLORS.textSecondary }]} />
            <Text style={styles.modeInactiveText}>Mode: Sedang Disewa</Text>
          </View>
        </View>

        {/* Status Operational Box */}
        <View style={styles.operationalBox}>
          <View style={styles.opHeader}>
            <Text style={styles.opLabel}>Status Operasional Unit</Text>
            <StatusBadge status="Tersedia" />
          </View>

          <View style={styles.opContent}>
            <Ionicons name="checkmark-circle-outline" size={24} color={COLORS.success} style={{ marginRight: 10 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.opTitle}>Siap Disewa di Lokasi</Text>
              <Text style={styles.opDesc}>
                Sepeda ini sedang standby dan siap disewa langsung di <Text style={{ fontWeight: 'bold' }}>Pos Stasiun Tugu</Text>. Silakan datangi pos dan konfirmasi ke kasir/petugas armada.
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
              <Text style={styles.cardBoxTitle}>Pos Stasiun Tugu</Text>
            </View>
          </View>
          <Text style={styles.cardBoxAddress}>Jl. Pasar Kembang (Pintu Keluar Selatan, 30m dari loket)</Text>
          <Text style={styles.cardBoxHours}>⏱️ Buka setiap hari: 06:00 - 22:00 WIB</Text>
        </View>

        {/* Card Kondisi Teknis */}
        <View style={styles.cardBox}>
          <View style={styles.cardBoxHeader}>
            <View style={[styles.iconCircle, { backgroundColor: '#DCFCE7' }]}>
              <Ionicons name="checkmark-done-outline" size={18} color={COLORS.success} />
            </View>
            <View>
              <Text style={styles.cardBoxMeta}>Kondisi Teknis Unit</Text>
              <Text style={styles.cardBoxTitle}>Sangat Baik</Text>
            </View>
          </View>
          <Text style={styles.cardBoxAddress}>Servis berkala, rem, serta tekanan ban diperiksa 2 hari lalu oleh mekanik Mas Joko.</Text>
        </View>

        {/* Specs Grid 2x2 */}
        <Text style={styles.specsSubLabel}>Kelengkapan & Fitur Teknis</Text>
        <View style={styles.specsGrid}>
          <View style={styles.specTile}>
            <Ionicons name="options-outline" size={18} color={COLORS.secondaryDark} />
            <View style={{ marginLeft: 8 }}>
              <Text style={styles.specLabel}>Ukuran Ban</Text>
              <Text style={styles.specValue}>27.5 Inch MTB</Text>
            </View>
          </View>

          <View style={styles.specTile}>
            <Ionicons name="disc-outline" size={18} color={COLORS.secondaryDark} />
            <View style={{ marginLeft: 8 }}>
              <Text style={styles.specLabel}>Pengereman</Text>
              <Text style={styles.specValue}>Rem Hidrolik Shimano</Text>
            </View>
          </View>

          <View style={styles.specTile}>
            <Ionicons name="speedometer-outline" size={18} color={COLORS.secondaryDark} />
            <View style={{ marginLeft: 8 }}>
              <Text style={styles.specLabel}>Transmisi</Text>
              <Text style={styles.specValue}>3 × 8 Kecepatan</Text>
            </View>
          </View>

          <View style={styles.specTile}>
            <Ionicons name="shield-checkmark-outline" size={18} color={COLORS.secondaryDark} />
            <View style={{ marginLeft: 8 }}>
              <Text style={styles.specLabel}>Fasilitas Unit</Text>
              <Text style={styles.specValue}>Helm SNI & Kunci</Text>
            </View>
          </View>
        </View>

        {/* Additional Tags */}
        <View style={styles.tagsContainer}>
          <FeatureTag label="✓ Kunci Spiral Baja" />
          <FeatureTag label="✓ Lampu Reflektor Depan-Belakang" />
          <FeatureTag label="✓ Tempat Botol Minum (Bottle Cage)" />
        </View>

        {/* Prosedur Sewa */}
        <View style={styles.procedureBox}>
          <Text style={styles.procedureTitle}>📋 Prosedur Sewa Langsung di Pos</Text>
          <Text style={styles.procedureStep}>1. Tunjukkan KTP / Kartu Identitas asli kepada petugas pos.</Text>
          <Text style={styles.procedureStep}>2. Petugas akan memeriksa kelayakan fisik sepeda di hadapan Anda.</Text>
          <Text style={styles.procedureStep}>3. Pembayaran sewa dilakukan langsung (Tunai / QRIS Semua Bank).</Text>
          <Text style={styles.procedureStep}>4. Sepeda dapat langsung digunakan berkeliling Jogja.</Text>
        </View>
      </ScrollView>

      {/* Sticky Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.outlineBtn} activeOpacity={0.8}>
          <Ionicons name="navigate-outline" size={16} color={COLORS.secondaryDark} style={{ marginRight: 6 }} />
          <Text style={styles.outlineBtnText}>Arah ke Pos Tugu</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.filledBtn} activeOpacity={0.8}>
          <Ionicons name="qr-code-outline" size={16} color={COLORS.textPrimary} style={{ marginRight: 6 }} />
          <Text style={styles.filledBtnText}>Scan Unit Lain</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.large,
    paddingVertical: SIZES.medium,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    ...FONTS.headline3,
    color: COLORS.secondaryDark,
  },
  headerRight: {
    flexDirection: 'row',
  },
  iconBtn: {
    padding: 4,
  },
  scrollContent: {
    padding: SIZES.large,
    paddingBottom: 100,
  },
  bannerContainer: {
    height: 200,
    backgroundColor: '#CBD5E1',
    borderRadius: SIZES.radiusLarge,
    position: 'relative',
    marginBottom: SIZES.large,
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
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SIZES.large,
  },
  procedureBox: {
    backgroundColor: '#F0F9FF',
    borderRadius: SIZES.radiusLarge,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SIZES.large,
  },
  procedureTitle: {
    ...FONTS.labelMedium,
    color: COLORS.secondaryDark,
    marginBottom: SIZES.medium,
  },
  procedureStep: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginBottom: 6,
    lineHeight: 18,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 72,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: 'row',
    paddingHorizontal: SIZES.large,
    alignItems: 'center',
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