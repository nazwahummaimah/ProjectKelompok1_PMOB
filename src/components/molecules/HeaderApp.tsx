// components/molecules/HeaderApp.tsx
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Platform, 
  StatusBar 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/theme';
import JamalJepretLogo from './JamalJepretLogo';

interface HeaderAppProps {
  notificationCount?: number;
  onPressNotification?: () => void;
}

const HeaderApp: React.FC<HeaderAppProps> = ({ 
  notificationCount = 0, 
  onPressNotification 
}) => {
  return (
    <View style={styles.safeContainer}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.headerContainer}>
        <View style={styles.brandRow}>
          <JamalJepretLogo width={145} />
        </View>

        <TouchableOpacity 
          style={styles.notificationBtn} 
          onPress={onPressNotification}
          activeOpacity={0.7}
        >
          <Ionicons name="notifications-outline" size={22} color={COLORS.secondaryDark} />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{notificationCount}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    backgroundColor: COLORS.surface,
    // Menambahkan padding khusus Android agar tidak tertutup notch/kamera
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.large,
    paddingVertical: 8,
    height: 64,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  notificationBtn: {
    position: 'relative',
    padding: 6,
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
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