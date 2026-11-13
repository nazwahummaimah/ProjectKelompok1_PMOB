import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
  const [imageFailed, setImageFailed] = useState(false);
  const isAvailable = bike.status === 'Tersedia';
  const hasImage = Boolean(bike.image) && !imageFailed;

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
      accessibilityRole="button"
      accessibilityLabel={`Lihat detail sepeda ${bike.name}, status ${bike.status}`}
      accessibilityHint="Membuka informasi lengkap unit sepeda"
    >
      <View style={styles.imageContainer}>
        {hasImage ? (
          <Image
            source={{ uri: bike.image }}
            style={styles.image}
            resizeMode="cover"
            onError={() => setImageFailed(true)}
            accessibilityLabel={`Foto ${bike.name}`}
          />
        ) : (
          <View style={styles.imageFallback}>
            <Ionicons name="bicycle-outline" size={48} color={COLORS.textSecondary} />
            <Text style={styles.imageFallbackText}>Foto unit belum tersedia</Text>
          </View>
        )}

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
            <Text style={styles.nameText} numberOfLines={2}>{bike.name}</Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Tarif</Text>
            <Text style={styles.priceText}>
              Rp {bike.price}<Text style={styles.priceUnit}>/jam</Text>
            </Text>
          </View>
        </View>

        {bike.features.length > 0 ? (
          <View style={styles.featuresRow}>
            {bike.features.map((feature, index) => (
              <FeatureTag key={`${bike.id}-${index}`} label={feature} />
            ))}
          </View>
        ) : null}

        {isAvailable ? (
          <View style={styles.footerRow}>
            <Ionicons name="storefront-outline" size={15} color={COLORS.secondaryDark} />
            <Text style={styles.footerText}>Penyewaan diproses di lokasi Jamal Jepret</Text>
          </View>
        ) : null}
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
  image: { width: '100%', height: '100%' },
  imageFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E2E8F0',
    gap: SIZES.small,
  },
  imageFallbackText: { ...FONTS.caption, color: COLORS.textSecondary },
  topBadges: {
    position: 'absolute',
    top: SIZES.medium,
    left: SIZES.medium,
    right: SIZES.medium,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  unitIdBadge: {
    backgroundColor: 'rgba(15, 23, 42, 0.78)',
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: SIZES.radiusSmall,
  },
  unitIdText: { ...FONTS.caption, color: COLORS.surface, fontSize: 11 },
  detailsContainer: { padding: SIZES.large },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SIZES.small,
  },
  headerLeft: { flex: 1, minWidth: 0, paddingRight: SIZES.small },
  categoryText: { ...FONTS.caption, color: COLORS.textSecondary, fontSize: 11 },
  nameText: { ...FONTS.headline2, color: COLORS.textPrimary, marginTop: 2 },
  priceContainer: { alignItems: 'flex-end', maxWidth: '44%' },
  priceLabel: { ...FONTS.caption, color: COLORS.textSecondary, fontSize: 11 },
  priceText: { ...FONTS.labelLarge, color: COLORS.textPrimary, textAlign: 'right' },
  priceUnit: { ...FONTS.caption, color: COLORS.textSecondary, fontWeight: 'normal' },
  featuresRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: SIZES.small },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.small,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SIZES.medium,
    marginTop: SIZES.medium,
  },
  footerText: { ...FONTS.caption, color: COLORS.secondaryDark, flex: 1 },
});

export default BikeCard;
