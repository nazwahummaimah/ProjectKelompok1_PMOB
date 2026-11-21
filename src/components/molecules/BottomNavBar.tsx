import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../../constants/theme';

// Navigation types
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

// Props
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

// Tab configuration
type TabConfig<T extends string> = {
  name: T;
  label?: string;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
};

// Public navigation
const PUBLIC_TABS: TabConfig<TabType>[] = [
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
];

// User navigation
const USER_TABS: TabConfig<UserTabType>[] = [
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
];

// Admin navigation
const ADMIN_TABS: TabConfig<AdminTabType>[] = [
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
];

const BottomNavBar: React.FC<BottomNavBarProps> = (props) => {
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
    <View style={styles.navContainer}>
      {tabs.map((tab) => {
        const isActive = props.activeTab === tab.name;
        const tabLabel = tab.label ?? tab.name;

        return (
          <TouchableOpacity
            key={tab.name}
            style={[
              styles.tabItem,
              isActive && styles.activeTabItem,
            ]}
            activeOpacity={0.7}
            onPress={() => handlePress(tab.name)}
            hitSlop={{
              top: 8,
              bottom: 8,
              left: 4,
              right: 4,
            }}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={tabLabel}
          >
            <Ionicons
              name={isActive ? tab.activeIcon : tab.icon}
              size={22}
              color={
                isActive
                  ? COLORS.primaryActive
                  : COLORS.textSecondaryStrong
              }
            />

            <Text
              style={[
                styles.tabLabel,
                {
                  color: isActive
                    ? COLORS.primaryActive
                    : COLORS.textSecondaryStrong,
                },
                isActive && styles.activeTabLabel,
              ]}
              numberOfLines={1}
            >
              {tabLabel}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    flexDirection: 'row',
    height: 68,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderStrong,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 8,
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },

  tabItem: {
    flex: 1,
    minWidth: 0,
    minHeight: 48,
    marginHorizontal: 4,
    paddingVertical: 5,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  activeTabItem: {
    backgroundColor: COLORS.primaryActiveBackground,
  },

  tabLabel: {
    ...FONTS.caption,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 4,
  },

  activeTabLabel: {
    fontWeight: '700',
  },
});

export default BottomNavBar;
