import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../constants/theme';

type PosRentalSectionProps = {
  address?: string | null;
  openingHours?: string | null;
  contact?: string | null;
};

/** Renders only confirmed business details. Empty or unconfirmed details stay hidden. */
const PosRentalSection: React.FC<PosRentalSectionProps> = ({
  address,
  openingHours,
  contact,
}) => {
  const hasDetails = Boolean(address || openingHours || contact);
  if (!hasDetails) return null;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Ionicons name="storefront-outline" size={20} color={COLORS.secondaryDark} />
        <Text style={styles.title}>Lokasi Jamal Jepret</Text>
      </View>
      {address ? <DetailRow icon="location-outline" label={address} /> : null}
      {openingHours ? <DetailRow icon="time-outline" label={openingHours} /> : null}
      {contact ? <DetailRow icon="call-outline" label={contact} /> : null}
    </View>
  );
};

function DetailRow({ icon, label }: { icon: 'location-outline' | 'time-outline' | 'call-outline'; label: string }) {
  return (
    <View style={styles.detailRow}>
      <Ionicons name={icon} size={17} color={COLORS.textSecondary} />
      <Text style={styles.detailText}>{label}</Text>
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
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: SIZES.small, marginBottom: SIZES.medium },
  title: { ...FONTS.headline3, color: COLORS.textPrimary },
  detailRow: { flexDirection: 'row', alignItems: 'flex-start', gap: SIZES.small, paddingVertical: 6 },
  detailText: { ...FONTS.body, color: COLORS.textPrimary, flex: 1 },
});

export default PosRentalSection;
