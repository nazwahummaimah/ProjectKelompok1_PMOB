import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES, FONTS } from '../../constants/theme';
import type { RentalHistoryStatus } from '../../constants/userDemo';

interface RentalStatusBadgeProps {
  status: RentalHistoryStatus;
}

const RentalStatusBadge: React.FC<RentalStatusBadgeProps> = ({ status }) => {
  const isOngoing = status === 'Sedang Berlangsung';
  return (
    <View style={[styles.container, isOngoing ? styles.ongoing : styles.completed]}>
      <View style={[styles.dot, { backgroundColor: isOngoing ? COLORS.primaryLight : COLORS.success }]} />
      <Text style={[styles.label, { color: isOngoing ? COLORS.rentedText : COLORS.successText }]}>{status}</Text>
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
  completed: { backgroundColor: COLORS.successBg },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  label: { ...FONTS.caption, fontWeight: '700' },
});

export default RentalStatusBadge;
