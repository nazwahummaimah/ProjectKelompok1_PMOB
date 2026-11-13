import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../constants/theme';

const STEPS = [
  {
    number: '01',
    title: 'Pilih sepeda',
    description: 'Lihat jenis unit dan status ketersediaannya melalui katalog.',
    image: require('../../assets/images/step1.png'),
  },
  {
    number: '02',
    title: 'Datang ke lokasi',
    description: 'Penyewaan dilakukan langsung di lokasi usaha Jamal Jepret.',
    image: require('../../assets/images/step2.png'),
  },
  {
    number: '03',
    title: 'Selesaikan pencatatan',
    description: 'Petugas mencatat data penyewa, unit, durasi, dan ketentuan jaminan yang berlaku.',
    image: require('../../assets/images/step3.png'),
  },
  {
    number: '04',
    title: 'Mulai bersepeda',
    description: 'Gunakan sepeda setelah proses penyewaan selesai.',
    image: require('../../assets/images/step4.png'),
  },
];

export default function HowToRentSection() {
  return (
    <View style={styles.container}>
      <View style={styles.stepsGrid}>
        {STEPS.map((step) => (
          <View key={step.number} style={styles.stepCard}>
            <View style={styles.illustration}>
                <Image
                  source={step.image}
                  style={styles.illustrationImage}
                  resizeMode="contain"
                />
              <View style={styles.numberBadge}>
                <Text style={styles.numberText}>{step.number}</Text>
              </View>
            </View>

            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepDescription}>{step.description}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.infoBox}>
        <Ionicons name="information-circle-outline" size={19} color={COLORS.secondaryDark} />
        <Text style={styles.infoText}>
          Aplikasi ini menampilkan informasi unit. Penyewaan tetap diselesaikan bersama petugas di lokasi.
        </Text>
      </View>
    </View>
  );
}

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
    width: 40,
    height: 40,
    borderRadius: SIZES.radiusMedium,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.medium,
  },
  headerText: { flex: 1, minWidth: 0 },
  sectionTitle: { ...FONTS.headline3, color: COLORS.textPrimary },
  sectionSubtitle: { ...FONTS.caption, color: COLORS.textSecondary, marginTop: 2 },
  stepsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  stepCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SIZES.small,
    marginBottom: SIZES.medium,
  },
  illustrationImage: {
    width: '100%',
    height: '100%',
  },
  illustration: {
    height: 104,
    borderRadius: SIZES.radiusSmall,
    backgroundColor: '#EAF6FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.medium,
    overflow: 'hidden',
  },
  numberBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    minWidth: 28,
    height: 24,
    paddingHorizontal: 6,
    borderRadius: SIZES.radiusPill,
    backgroundColor: COLORS.secondaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: { ...FONTS.caption, color: '#FFFFFF', fontWeight: '700' },
  stepContent: { flex: 1 },
  stepTitle: { ...FONTS.labelMedium, color: COLORS.textPrimary, marginBottom: 5 },
  stepDescription: { ...FONTS.caption, color: COLORS.textSecondary, lineHeight: 18 },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SIZES.small,
    backgroundColor: '#F0F9FF',
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.medium,
    marginTop: SIZES.small,
  },
  infoText: { ...FONTS.caption, color: COLORS.secondaryDark, flex: 1, lineHeight: 19 },
});
