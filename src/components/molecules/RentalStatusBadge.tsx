import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES, FONTS } from '../../constants/theme';
import type { RentalHistoryStatus } from '../../constants/userTypes';

interface RentalStatusBadgeProps {
  status: RentalHistoryStatus;
}

const RentalStatusBadge: React.FC<RentalStatusBadgeProps> = ({ status }) => {
  const isOngoing = status === 'Sedang Berlangsung';
  const isPending = status === 'Menunggu Serah Terima';
  const stateStyle = isOngoing ? styles.ongoing : isPending ? styles.pending : styles.completed;
  const dotColor = isOngoing ? COLORS.primaryLight : isPending ? COLORS.warning : COLORS.success;
  const textColor = isOngoing ? COLORS.rentedText : isPending ? '#92400E' : COLORS.successText;
  return (
    <View style={[styles.container, stateStyle]}>
      <View style={[styles.dot, { backgroundColor: dotColor }]} />
      <Text style={[styles.label, { color: textColor }]}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: SIZES.radiusPill,
  },
  ongoing: { backgroundColor: COLORS.rentedBg },
  pending: { backgroundColor: '#FEF3C7' },
  completed: { backgroundColor: COLORS.successBg },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  label: { ...FONTS.caption, fontWeight: '700' },
});

export default RentalStatusBadge;
