import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import type { BikeData } from '../../constants/bikes';
import StatusBadge from '../molecules/StatusBadge';
import FeatureTag from '../molecules/FeatureTag';

interface PublicBikePreviewCardProps {
  bike: BikeData;
  variant?: 'preview' | 'catalog';
}

const PublicBikePreviewCard: React.FC<PublicBikePreviewCardProps> = ({
  bike,
  variant = 'preview',
}) => {
  const router = useRouter();
  const [imageFailed, setImageFailed] = useState(false);
  const hasImage = Boolean(bike.image) && !imageFailed;
  const isCatalog = variant === 'catalog';
  const visibleFeatures = (bike.features ?? []).filter(Boolean).slice(0, 3);

  const handlePress = () => {
    router.push({
      pathname: '/public/DetailUnit' as any,
      params: { id: bike.id },
    });
  };

  return (
    <TouchableOpacity
      style={[styles.card, isCatalog && styles.catalogCard]}
      activeOpacity={0.9}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`Lihat detail ${bike.name}, status ${bike.status}`}
      accessibilityHint="Membuka informasi lengkap unit sepeda"
    >
      <View style={[styles.imageContainer, isCatalog && styles.catalogImageContainer]}>
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
            <View style={styles.fallbackIconCircle}>
              <Ionicons name="bicycle-outline" size={46} color={COLORS.secondaryDark} />
            </View>
            <Text style={styles.imageFallbackText}>Foto belum tersedia</Text>
          </View>
        )}

        <View style={styles.imageOverlay}>
          <Text style={styles.unitId}>{bike.id}</Text>
          <StatusBadge status={bike.status} />
        </View>
      </View>

      <View style={[styles.details, isCatalog && styles.catalogDetails]}>
        <View style={styles.nameBlock}>
          <Text style={styles.category} numberOfLines={1}>
            {bike.category}
          </Text>
          <Text
            style={[styles.name, isCatalog && styles.catalogName]}
            numberOfLines={isCatalog ? 2 : 1}
          >
            {bike.name}
          </Text>
        </View>

        {isCatalog && visibleFeatures.length > 0 ? (
          <View style={styles.featuresRow}>
            {visibleFeatures.map((feature, index) => (
              <FeatureTag key={`${bike.id}-${index}`} label={feature} />
            ))}
          </View>
        ) : null}

        <View style={[styles.pricePanel, isCatalog && styles.catalogPricePanel]}>
          <View style={styles.priceBlock}>
            <Text style={styles.priceEyebrow}>Mulai dari</Text>
            <View style={styles.priceRow}>
              <Text style={[styles.price, isCatalog && styles.catalogPrice]}>
                Rp {bike.price}
              </Text>
              <Text style={styles.priceUnit}>/ jam</Text>
            </View>
          </View>

          {isCatalog ? (
            <View style={styles.detailButton}>
              <Text style={styles.detailButtonText}>Lihat Detail</Text>
              <Ionicons name="chevron-forward" size={17} color={COLORS.surface} />
            </View>
          ) : (
            <View style={styles.previewDetailButton}>
              <Ionicons name="arrow-forward" size={19} color={COLORS.surface} />
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 244,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: SIZES.medium,
    overflow: 'hidden',
  },
  catalogCard: {
    width: '100%',
    marginRight: 0,
    marginBottom: SIZES.large,
  },
  imageContainer: {
    height: 148,
    width: '100%',
    backgroundColor: '#EAF6FE',
  },
  catalogImageContainer: {
    height: 196,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SIZES.small,
    backgroundColor: '#EAF6FE',
  },
  fallbackIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.82)',
  },
  imageFallbackText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  imageOverlay: {
    position: 'absolute',
    top: SIZES.small,
    left: SIZES.small,
    right: SIZES.small,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SIZES.small,
  },
  unitId: {
    ...FONTS.caption,
    color: COLORS.surface,
    overflow: 'hidden',
    backgroundColor: 'rgba(15, 23, 42, 0.78)',
    borderRadius: SIZES.radiusSmall,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontWeight: '700',
  },
  details: {
    padding: SIZES.medium,
  },
  catalogDetails: {
    padding: SIZES.large,
  },
  nameBlock: {
    minHeight: 48,
  },
  category: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  name: {
    ...FONTS.labelLarge,
    color: COLORS.textPrimary,
    marginTop: 3,
  },
  catalogName: {
    ...FONTS.headline3,
    marginTop: 4,
  },
  featuresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: SIZES.medium,
  },
  pricePanel: {
    minHeight: 62,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SIZES.small,
    backgroundColor: '#EAF6FE',
    borderRadius: SIZES.radiusMedium,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    marginTop: SIZES.medium,
  },
  catalogPricePanel: {
    minHeight: 76,
    marginTop: SIZES.large,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.medium,
  },
  priceBlock: {
    flex: 1,
    minWidth: 0,
  },
  priceEyebrow: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'nowrap',
    gap: 3,
  },
  price: {
    ...FONTS.labelMedium,
    color: COLORS.secondaryDark,
    fontWeight: '800',
  },
  catalogPrice: {
    ...FONTS.headline3,
    color: COLORS.secondaryDark,
  },
  priceUnit: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  previewDetailButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.secondaryDark,
  },
  detailButton: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: SIZES.medium,
    borderRadius: SIZES.radiusPill,
    backgroundColor: COLORS.secondaryDark,
  },
  detailButtonText: {
    ...FONTS.caption,
    color: COLORS.surface,
    fontWeight: '700',
  },
});

export default PublicBikePreviewCard;
