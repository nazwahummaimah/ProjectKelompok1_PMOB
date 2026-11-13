// components/molecules/StatusBadge.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES, FONTS } from '../../constants/theme';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const normalizedStatus = status.trim().toLowerCase();
  const isAvailable = normalizedStatus === 'tersedia';
  const isRented = normalizedStatus === 'sedang disewa';
  const isMaintenance = normalizedStatus === 'perawatan';

  const palette = isAvailable
    ? { background: COLORS.successBg, foreground: COLORS.successText, dot: COLORS.success }
    : isRented
      ? { background: COLORS.rentedBg, foreground: COLORS.rentedText, dot: COLORS.primaryLight }
      : isMaintenance
        ? { background: '#FEF3C7', foreground: '#92400E', dot: COLORS.warning }
        : { background: '#F1F5F9', foreground: '#475569', dot: '#64748B' };

  return (
    <View
      style={[styles.badgeContainer, { backgroundColor: palette.background }]}
      accessible
      accessibilityRole="text"
      accessibilityLabel={`Status unit: ${status}`}
    >
      <View style={[styles.dot, { backgroundColor: palette.dot }]} />
      <Text style={[styles.badgeText, { color: palette.foreground }]}>
        {status}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badgeContainer: {
    minHeight: 28,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: SIZES.radiusPill,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  badgeText: {
    ...FONTS.caption,
    fontWeight: 'bold',
  },
});

export default StatusBadge;