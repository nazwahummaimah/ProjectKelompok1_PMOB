// Shared bottom navigation for public visitors and authenticated users.
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../../constants/theme';

export type TabType = 'Beranda' | 'Katalog' | 'DurasiSewa' | 'Login';
export type UserTabType = 'Beranda' | 'Riwayat' | 'Scan' | 'Profil';

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

type BottomNavBarProps = PublicBottomNavProps | UserBottomNavProps;

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

const BottomNavBar: React.FC<BottomNavBarProps> = (props) => {
  const tabs = props.variant === 'user' ? USER_TABS : PUBLIC_TABS;

  const handlePress = (tabName: string) => {
    if (props.variant === 'user') {
      props.onTabPress(tabName as UserTabType);
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
            style={styles.tabItem}
            activeOpacity={0.6}
            onPress={() => handlePress(tab.name)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={tabLabel}
          >
            {isActive && <View style={styles.activeIndicator} />}
            <Ionicons
              name={(isActive ? tab.activeIcon : tab.icon) as keyof typeof Ionicons.glyphMap}
              size={22}
              color={isActive ? COLORS.secondaryDark : COLORS.textSecondary}
            />
            <Text
              style={[
                styles.tabLabel,
                { color: isActive ? COLORS.secondaryDark : COLORS.textSecondary },
                isActive && styles.activeTabLabel,
              ]}
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
    height: 64,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
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
  activeTabLabel: { fontWeight: '700' },
});

export default BottomNavBar;
