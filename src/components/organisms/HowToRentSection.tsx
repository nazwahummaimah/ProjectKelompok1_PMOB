// components/organisms/HowToRentSection.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../constants/theme';

const STEPS = [
  {
    num: '1',
    title: 'Pilih sepeda',
    desc: 'Cek ketersediaan langsung di aplikasi atau pos terdekat.',
  },
  {
    num: '2',
    title: 'Datang ke lokasi',
    desc: 'Kunjungi pos rental Mas Joko (Stasiun Tugu, Malioboro, Titik Nol).',
  },
  {
    num: '3',
    title: 'Selesaikan transaksi',
    desc: 'Scan QR atau tunjukkan identitas fisik (KTP/SIM) ke petugas kasir.',
  },
  {
    num: '4',
    title: 'Gunakan sepeda',
    desc: 'Mulai bersepeda keliling kota Jogja dengan nyaman dan aman.',
  },
];

const HowToRentSection: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerRow}>
        <View style={styles.iconCircle}>
          <Ionicons name="bicycle" size={18} color={COLORS.secondaryDark} />
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={styles.sectionTitle}>Cara Sewa</Text>
          <Text style={styles.sectionSubtitle}>Proses cepat tanpa antre rumit</Text>
        </View>
      </View>

      {/* Numbered Steps */}
      <View style={styles.stepsList}>
        {STEPS.map((step, index) => (
          <View key={index} style={styles.stepItem}>
            <View style={styles.numberBadge}>
              <Text style={styles.numberText}>{step.num}</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepDesc}>{step.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Info Callout Box */}
      <View style={styles.infoBox}>
        <Ionicons name="information-circle-outline" size={20} color={COLORS.secondaryDark} style={styles.infoIcon} />
        <Text style={styles.infoText}>
          Penyewaan langsung di lokasi (walk-in). Tanpa reservasi online yang rumit. Cukup datang dan gowes!
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLarge,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SIZES.large,
    marginBottom: SIZES.large,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.large,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: SIZES.radiusPill,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.medium,
  },
  headerTextContainer: {
    flex: 1,
  },
  sectionTitle: {
    ...FONTS.headline3,
    color: COLORS.secondaryDark,
  },
  sectionSubtitle: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  stepsList: {
    marginBottom: SIZES.medium,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: SIZES.medium,
  },
  numberBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.medium,
    marginTop: 2,
  },
  numberText: {
    ...FONTS.caption,
    fontWeight: 'bold',
    color: COLORS.secondaryDark,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    ...FONTS.labelMedium,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  stepDesc: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#F0F9FF',
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.medium,
    alignItems: 'flex-start',
  },
  infoIcon: {
    marginRight: SIZES.small,
    marginTop: 2,
  },
  infoText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
});

export default HowToRentSection;