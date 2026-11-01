// components/molecules/StatusBadge.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES, FONTS } from '../../constants/theme';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const isAvailable = status.toLowerCase() === 'tersedia';
  return (
    <View style={[
      styles.badgeContainer,
      { backgroundColor: isAvailable ? COLORS.successBg : COLORS.rentedBg }
    ]}>
      <View style={[
        styles.dot,
        { backgroundColor: isAvailable ? COLORS.success : COLORS.primaryLight }
      ]} />
      <Text style={[
        styles.badgeText,
        { color: isAvailable ? COLORS.successText : COLORS.rentedText }
      ]}>
        {status}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: SIZES.radiusPill,
    height: 28,
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
  }
});

export default StatusBadge;