import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../constants/theme';
import type { TransactionWithItems } from '../../services/transactionService';
import RentalStatusBadge from '../molecules/RentalStatusBadge';

interface RentalHistoryCardProps {
  rental: TransactionWithItems;
  onPress: () => void;
}

const formatDate = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';

  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  });
};

const formatRupiah = (value: number): string =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);

const RentalHistoryCard: React.FC<RentalHistoryCardProps> = ({ rental, onPress }) => {
  const isOngoing = rental.status === 'Sedang Berlangsung';
  const isPending = rental.status === 'Menunggu Serah Terima';
  const items = rental.transaction_items ?? [];
  const firstBike = items[0]?.bikes;
  const additionalUnits = Math.max(0, items.length - 1);
  const bikeName = firstBike?.name ?? 'Sepeda';
  const bikeLabel = additionalUnits > 0
    ? `${bikeName} +${additionalUnits} unit`
    : bikeName;
  const bikeIds = items.map((item) => item.bike_id).join(', ');

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.82}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Detail transaksi ${rental.transaction_code}`}
    >
      <View style={styles.topRow}>
        <View style={styles.transactionMeta}>
          <Text style={styles.transactionId}>{rental.transaction_code}</Text>
          <Text style={styles.date}>{formatDate(rental.rental_date)}</Text>
        </View>
        <RentalStatusBadge status={rental.status} />
      </View>

      <View style={styles.divider} />

      <View style={styles.bikeRow}>
        <View style={styles.bikeIcon}>
          <Ionicons name="bicycle" size={25} color={COLORS.secondaryDark} />
        </View>
        <View style={styles.bikeInfo}>
          <Text style={styles.bikeName}>{bikeLabel}</Text>
          <Text style={styles.unitId}>
            {items.length} unit{items.length === 1 ? '' : 's'}{bikeIds ? ` · ${bikeIds}` : ''}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={COLORS.textSecondary} />
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.inlineInfo}>
          <Ionicons name="time-outline" size={15} color={COLORS.textSecondary} />
          <Text style={styles.bottomText}>{rental.duration_hours} jam</Text>
        </View>
        <Text style={[styles.amount, (isOngoing || isPending) && styles.ongoingAmount]}>
          {isOngoing
            ? 'Sedang berlangsung'
            : isPending
              ? 'Menunggu serah terima'
              : formatRupiah(Number(rental.total))}
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
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: SIZES.medium, gap: SIZES.small },
  inlineInfo: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  bottomText: { ...FONTS.caption, color: COLORS.textSecondary },
  amount: { ...FONTS.labelMedium, color: COLORS.textPrimary, flexShrink: 1, textAlign: 'right' },
  ongoingAmount: { color: COLORS.secondaryDark, fontSize: 12 },
});

export default RentalHistoryCard;
