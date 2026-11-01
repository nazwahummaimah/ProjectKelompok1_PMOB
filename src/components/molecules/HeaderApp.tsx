// components/molecules/HeaderApp.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../constants/theme';

interface HeaderAppProps {
  notificationCount?: number;
  onPressNotification?: () => void;
}

const HeaderApp: React.FC<HeaderAppProps> = ({ 
  notificationCount = 0, 
  onPressNotification 
}) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.brandRow}>
        <View style={styles.logoIcon}>
          <Ionicons name="bicycle" size={20} color={COLORS.secondaryDark} />
        </View>
        <Text style={styles.brandTitle}>Rental Sepeda Mas Joko</Text>
      </View>

      <TouchableOpacity style={styles.notificationBtn} onPress={onPressNotification}>
        <Ionicons name="notifications-outline" size={22} color={COLORS.secondaryDark} />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{notificationCount}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.large,
    paddingVertical: SIZES.medium,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.small,
  },
  brandTitle: {
    ...FONTS.headline3,
    color: COLORS.secondaryDark,
  },
  notificationBtn: {
    position: 'relative',
    padding: 4,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusPill,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
  },
});

export default HeaderApp;