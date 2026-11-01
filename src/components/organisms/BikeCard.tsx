// components/organisms/BikeCard.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SIZES, FONTS } from '../../constants/theme';
import StatusBadge from '../molecules/StatusBadge';
import FeatureTag from '../molecules/FeatureTag';
import { BikeData } from '../../constants/bikes';

interface BikeCardProps {
  bike: BikeData;
}

const BikeCard: React.FC<BikeCardProps> = ({ bike }) => {
  const router = useRouter();
  const isAvailable = bike.status.toLowerCase() === 'tersedia';

  // Handler klik kartu -> Pindah ke detail membawa parameter ID
  const handlePressCard = () => {
    router.push({
      pathname: '/public/DetailUnit' as any,
      params: { id: bike.id },
    });
  };

  return (
    <TouchableOpacity 
      style={styles.cardContainer} 
      activeOpacity={0.85}
      onPress={handlePressCard}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: bike.image }} style={styles.image} />
        <View style={styles.topBadges}>
          <View style={styles.unitIdBadge}>
            <Text style={styles.unitIdText}>{bike.id}</Text>
          </View>
          <StatusBadge status={bike.status} />
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Text style={styles.categoryText}>{bike.category}</Text>
            <Text style={styles.nameText}>{bike.name}</Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Tarif</Text>
            <Text style={styles.priceText}>
              Rp {bike.price}<Text style={styles.priceUnit}>/jam</Text>
            </Text>
          </View>
        </View>

        <View style={styles.locationRow}>
          <Text style={styles.locationText}>
            {isAvailable ? `📍 ${bike.location}` : `⏱️ Estimasi kembali ~ ${bike.returnTime}`}
          </Text>
        </View>

        <View style={styles.featuresRow}>
          {bike.features.map((feature, index) => (
            <FeatureTag key={index} label={feature} />
          ))}
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>
            {isAvailable ? '⏱️ Sewa langsung di lokasi pos' : `⏱️ ${bike.returnLocationNote || 'Kembali sore ini'}`}
          </Text>
          <Text style={[
            styles.availabilityText, 
            { color: isAvailable ? COLORS.secondaryDark : COLORS.textSecondary }
          ]}>
            {isAvailable ? 'Tersedia di Pos' : 'Tidak Tersedia'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLarge,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SIZES.large,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 180,
    width: '100%',
    backgroundColor: '#E2E8F0',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  topBadges: {
    position: 'absolute',
    top: SIZES.medium,
    left: SIZES.medium,
    right: SIZES.medium,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  unitIdBadge: {
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: SIZES.radiusSmall,
  },
  unitIdText: {
    ...FONTS.caption,
    color: COLORS.surface,
    fontSize: 11,
  },
  detailsContainer: {
    padding: SIZES.large,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SIZES.small,
  },
  headerLeft: {
    flex: 1,
    paddingRight: SIZES.small,
  },
  categoryText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    fontSize: 11,
    textTransform: 'uppercase',
  },
  nameText: {
    ...FONTS.headline2,
    color: COLORS.secondaryDark,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    fontSize: 11,
  },
  priceText: {
    ...FONTS.labelLarge,
    color: COLORS.textPrimary,
  },
  priceUnit: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    fontWeight: 'normal',
  },
  locationRow: {
    marginBottom: SIZES.medium,
  },
  locationText: {
    ...FONTS.body,
    color: COLORS.textSecondary,
  },
  featuresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SIZES.medium,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SIZES.medium,
  },
  footerText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  availabilityText: {
    ...FONTS.caption,
    fontWeight: 'bold',
  }
});

export default BikeCard;