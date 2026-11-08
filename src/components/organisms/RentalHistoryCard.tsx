import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../constants/theme';
import type { RentalHistoryRecord } from '../../constants/userTypes';
import RentalStatusBadge from '../molecules/RentalStatusBadge';

interface RentalHistoryCardProps {
  rental: RentalHistoryRecord;
  onPress: () => void;
}

const RentalHistoryCard: React.FC<RentalHistoryCardProps> = ({ rental, onPress }) => {
  const isOngoing = rental.status === 'Sedang Berlangsung';
  const isPending = rental.status === 'Menunggu Serah Terima';

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.82} onPress={onPress}>
      <View style={styles.topRow}>
        <View style={styles.transactionMeta}>
          <Text style={styles.transactionId}>{rental.id}</Text>
          <Text style={styles.date}>{rental.date}</Text>
        </View>
        <RentalStatusBadge status={rental.status} />
      </View>

      <View style={styles.divider} />

      <View style={styles.bikeRow}>
        <View style={styles.bikeIcon}>
          <Ionicons name="bicycle" size={25} color={COLORS.secondaryDark} />
        </View>
        <View style={styles.bikeInfo}>
          <Text style={styles.bikeName}>{rental.bikeName}</Text>
          <Text style={styles.unitId}>Unit {rental.unitId} • {rental.category}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={COLORS.textSecondary} />
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.inlineInfo}>
          <Ionicons name="time-outline" size={15} color={COLORS.textSecondary} />
          <Text style={styles.bottomText}>{rental.duration}</Text>
        </View>
        <Text style={[styles.amount, (isOngoing || isPending) && styles.ongoingAmount]}>
          {isOngoing ? 'Sedang berjalan' : isPending ? 'Menunggu serah terima' : rental.total || 'Lihat detail'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLarge,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SIZES.large,
    marginBottom: SIZES.medium,
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 },
  transactionMeta: { flex: 1 },
  transactionId: { ...FONTS.labelMedium, color: COLORS.textPrimary },
  date: { ...FONTS.caption, color: COLORS.textSecondary, marginTop: 3 },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: SIZES.medium },
  bikeRow: { flexDirection: 'row', alignItems: 'center' },
  bikeIcon: {
    width: 46, height: 46, borderRadius: SIZES.radiusMedium,
    backgroundColor: '#E0F2FE', alignItems: 'center', justifyContent: 'center', marginRight: SIZES.medium,
  },
  bikeInfo: { flex: 1 },
  bikeName: { ...FONTS.labelLarge, color: COLORS.secondaryDark },
  unitId: { ...FONTS.caption, color: COLORS.textSecondary, marginTop: 2 },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: SIZES.medium },
  inlineInfo: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  bottomText: { ...FONTS.caption, color: COLORS.textSecondary },
  amount: { ...FONTS.labelMedium, color: COLORS.textPrimary },
  ongoingAmount: { color: COLORS.secondaryDark, fontSize: 12 },
});

export default RentalHistoryCard;
