import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
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
  onPressNotification,
}) => {
  return (
    <View style={styles.safeContainer}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.headerContainer}>
        <View style={styles.brandRow}>
          <View accessible accessibilityRole="image" accessibilityLabel="Logo Jamal Jepret">
            <JamalJepretLogo width={200} />
          </View>
        </View>

        {onPressNotification ? (
          <TouchableOpacity
            style={styles.notificationBtn}
            onPress={onPressNotification}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel={
              notificationCount > 0
                ? `Buka notifikasi, ${notificationCount} belum dibaca`
                : 'Buka notifikasi'
            }
          >
            <Ionicons name="notifications-outline" size={22} color={COLORS.secondaryDark} />
            {notificationCount > 0 ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {notificationCount > 99 ? '99+' : notificationCount}
                </Text>
              </View>
            ) : null}
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    backgroundColor: COLORS.surface,
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
    minHeight: 64,
  },
  brandRow: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
  },
  notificationBtn: {
    position: 'relative',
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SIZES.small,
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 3,
    backgroundColor: COLORS.primaryLight,
    borderRadius: SIZES.radiusPill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
});

export default HeaderApp;
