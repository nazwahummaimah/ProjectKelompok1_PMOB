// components/organisms/PosRentalSection.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../constants/theme';

const POS_LOCATIONS = [
  {
    name: 'Pos 1: Stasiun Tugu',
    address: 'Pintu Timur - Jl. Margo Utomo',
    hours: '06.00 - 22.00',
  },
  {
    name: 'Pos 2: Kawasan Malioboro',
    address: 'Samping Hotel Mutiara',
    hours: '06.00 - 22.00',
  },
  {
    name: 'Pos 3: Titik Nol KM',
    address: 'Depan Gedung Bank Indonesia',
    hours: '06.00 - 21.00',
  },
];

const PosRentalSection: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Ionicons name="business-outline" size={20} color={COLORS.secondaryDark} style={{ marginRight: 8 }} />
        <Text style={styles.title}>Pos Rental Mas Joko</Text>
      </View>

      <View style={styles.posList}>
        {POS_LOCATIONS.map((pos, index) => (
          <View 
            key={index} 
            style={[
              styles.posItem, 
              index < POS_LOCATIONS.length - 1 && styles.borderBottom
            ]}
          >
            <View style={styles.posInfo}>
              <Text style={styles.posName}>{pos.name}</Text>
              <Text style={styles.posAddress}>{pos.address}</Text>
            </View>
            <View style={styles.hoursBadge}>
              <Text style={styles.hoursText}>{pos.hours}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F0F9FF',
    borderRadius: SIZES.radiusLarge,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SIZES.large,
    marginBottom: SIZES.large,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  title: {
    ...FONTS.headline3,
    color: COLORS.secondaryDark,
  },
  posList: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    paddingHorizontal: SIZES.medium,
  },
  posItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.medium,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  posInfo: {
    flex: 1,
    paddingRight: SIZES.small,
  },
  posName: {
    ...FONTS.labelMedium,
    color: COLORS.textPrimary,
  },
  posAddress: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  hoursBadge: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: SIZES.radiusSmall,
  },
  hoursText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    fontSize: 11,
  },
});

export default PosRentalSection;