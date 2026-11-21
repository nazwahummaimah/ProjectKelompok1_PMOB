
// components/molecules/BottomNavBar.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS, FONTS } from '../../constants/theme';

// =====================================================
// TYPES
// =====================================================

export type TabType =
  | 'Beranda'
  | 'Katalog'
  | 'DurasiSewa'
  | 'Login';

export type UserTabType =
  | 'Beranda'
  | 'Riwayat'
  | 'Scan'
  | 'Profil';

export type AdminTabType =
  | 'Dashboard'
  | 'Inventaris'
  | 'Transaksi'
  | 'Lainnya';

type PublicBottomNavProps = {
  variant?: 'public';
  activeTab: TabType;
  onTabPress: (tab: TabType) => void;
};

type UserBottomNavProps = {
  variant: 'user';
  activeTab: UserTabType;
  onTabPress: (tab: UserTabType) => void;
};

type AdminBottomNavProps = {
  variant: 'admin';
  activeTab: AdminTabType;
  onTabPress: (tab: AdminTabType) => void;
};

type BottomNavBarProps =
  | PublicBottomNavProps
  | UserBottomNavProps
  | AdminBottomNavProps;

// =====================================================
// TAB CONFIGURATION
// =====================================================

const PUBLIC_TABS = [
  {
    name: 'Beranda',
    icon: 'home-outline',
    activeIcon: 'home',
  },
  {
    name: 'Katalog',
    icon: 'bicycle-outline',
    activeIcon: 'bicycle',
  },
  {
    name: 'DurasiSewa',
    label: 'Scan',
    icon: 'qr-code-outline',
    activeIcon: 'qr-code',
  },
  {
    name: 'Login',
    icon: 'person-outline',
    activeIcon: 'person',
  },
] as const;

const USER_TABS = [
  {
    name: 'Beranda',
    icon: 'home-outline',
    activeIcon: 'home',
  },
  {
    name: 'Riwayat',
    icon: 'receipt-outline',
    activeIcon: 'receipt',
  },
  {
    name: 'Scan',
    icon: 'qr-code-outline',
    activeIcon: 'qr-code',
  },
  {
    name: 'Profil',
    icon: 'person-outline',
    activeIcon: 'person',
  },
] as const;

const ADMIN_TABS = [
  {
    name: 'Dashboard',
    icon: 'grid-outline',
    activeIcon: 'grid',
  },
  {
    name: 'Inventaris',
    icon: 'bicycle-outline',
    activeIcon: 'bicycle',
  },
  {
    name: 'Transaksi',
    icon: 'receipt-outline',
    activeIcon: 'receipt',
  },
  {
    name: 'Lainnya',
    icon: 'ellipsis-horizontal-circle-outline',
    activeIcon: 'ellipsis-horizontal-circle',
  },
] as const;

// =====================================================
// COMPONENT
// =====================================================

const BottomNavBar: React.FC<BottomNavBarProps> = (props) => {
  const insets = useSafeAreaInsets();

  const tabs =
    props.variant === 'user'
      ? USER_TABS
      : props.variant === 'admin'
        ? ADMIN_TABS
        : PUBLIC_TABS;

  const handlePress = (tabName: string) => {
    if (props.variant === 'user') {
      props.onTabPress(tabName as UserTabType);
    } else if (props.variant === 'admin') {
      props.onTabPress(tabName as AdminTabType);
    } else {
      props.onTabPress(tabName as TabType);
    }
  };

  return (
    <View
      style={[
        styles.safeAreaContainer,
        {
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <View style={styles.navContainer}>
        {tabs.map((tab) => {
          const isActive = props.activeTab === tab.name;

          const tabLabel =
            'label' in tab ? tab.label : tab.name;

          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tabItem}
              activeOpacity={0.7}
              onPress={() => handlePress(tab.name)}
              accessibilityRole="button"
              accessibilityState={{
                selected: isActive,
              }}
              accessibilityLabel={tabLabel}
            >
              {isActive && (
                <View style={styles.activeIndicator} />
              )}

              <Ionicons
                name={
                  (isActive
                    ? tab.activeIcon
                    : tab.icon) as keyof typeof Ionicons.glyphMap
                }
                size={22}
                color={
                  isActive
                    ? COLORS.secondaryDark
                    : COLORS.textSecondary
                }
              />

              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isActive
                      ? COLORS.secondaryDark
                      : COLORS.textSecondary,
                  },
                  isActive && styles.activeTabLabel,
                ]}
              >
                {tabLabel}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

// =====================================================
// STYLES
// =====================================================


const styles = StyleSheet.create({
  safeAreaContainer: {
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,

    // Hilangkan efek navbar mengambang
    elevation: 0,
    shadowColor: 'transparent',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0,
    shadowRadius: 0,
  },

  navContainer: {
    flexDirection: 'row',
    height: 64,
    backgroundColor: COLORS.surface,
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },

  activeIndicator: {
    position: 'absolute',
    top: 0,
    width: 28,
    height: 3,
    backgroundColor: COLORS.secondaryDark,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },

  tabLabel: {
    ...FONTS.caption,
    fontSize: 11,
    marginTop: 4,
  },

  activeTabLabel: {
    fontWeight: '700',
  },
});

export default BottomNavBar;
