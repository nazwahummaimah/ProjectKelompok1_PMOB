// Shared bottom navigation for public visitors and authenticated users.
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../../constants/theme';

export type TabType = 'Beranda' | 'Katalog' | 'DurasiSewa' | 'Login';
export type UserTabType = 'Beranda' | 'Riwayat' | 'Scan' | 'Profil';
export type AdminTabType = 'Dashboard' | 'Inventaris' | 'Transaksi' | 'Lainnya';

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

type BottomNavBarProps = PublicBottomNavProps | UserBottomNavProps | AdminBottomNavProps;

const PUBLIC_TABS = [
  { name: 'Beranda', icon: 'home-outline', activeIcon: 'home' },
  { name: 'Katalog', icon: 'bicycle-outline', activeIcon: 'bicycle' },
  { name: 'DurasiSewa', label: 'Scan', icon: 'qr-code-outline', activeIcon: 'qr-code' },
  { name: 'Login', icon: 'person-outline', activeIcon: 'person' },
] as const;

const USER_TABS = [
  { name: 'Beranda', icon: 'home-outline', activeIcon: 'home' },
  { name: 'Riwayat', icon: 'receipt-outline', activeIcon: 'receipt' },
  { name: 'Scan', icon: 'qr-code-outline', activeIcon: 'qr-code' },
  { name: 'Profil', icon: 'person-outline', activeIcon: 'person' },
] as const;

const ADMIN_TABS = [
  { name: 'Dashboard', icon: 'grid-outline', activeIcon: 'grid' },
  { name: 'Inventaris', icon: 'bicycle-outline', activeIcon: 'bicycle' },
  { name: 'Transaksi', icon: 'receipt-outline', activeIcon: 'receipt' },
  { name: 'Lainnya', icon: 'ellipsis-horizontal-circle-outline', activeIcon: 'ellipsis-horizontal-circle' },
] as const;

const BottomNavBar: React.FC<BottomNavBarProps> = (props) => {
  const tabs = props.variant === 'user' ? USER_TABS : props.variant === 'admin' ? ADMIN_TABS : PUBLIC_TABS;

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
        const tabLabel = 'label' in tab ? tab.label : tab.name;
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tabButton}
            activeOpacity={0.8}
            onPress={() => handlePress(tab.name)}
            hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={tabLabel}
          >
            <View style={[styles.tabContent, isActive && styles.activeTabContent]}>
              <Ionicons
                name={(isActive ? tab.activeIcon : tab.icon) as keyof typeof Ionicons.glyphMap}
                size={21}
                color={isActive ? COLORS.secondaryDark : COLORS.textSecondary}
              />
              <Text
                style={[
                  styles.tabLabel,
                  { color: isActive ? COLORS.secondaryDark : COLORS.textSecondary },
                  isActive && styles.activeTabLabel,
                ]}
                numberOfLines={1}
              >
                {tabLabel}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    flexDirection: 'row',
    minHeight: 72,
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: COLORS.surface,
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
  },
  tabButton: {
    flex: 1,
    minWidth: 0,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  tabContent: {
    width: '92%',
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    overflow: 'hidden',
    paddingHorizontal: 3,
    paddingVertical: 5,
  },
  activeTabContent: {
    backgroundColor: '#E0F2FE',
  },
  tabLabel: {
    ...FONTS.caption,
    fontSize: 11,
    marginTop: 3,
    textAlign: 'center',
  },
  activeTabLabel: { fontWeight: '700' },
});

export default BottomNavBar;
