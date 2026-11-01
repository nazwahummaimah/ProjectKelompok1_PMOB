// components/molecules/BottomNavBar.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../constants/theme';

export type TabType = 'Beranda' | 'Katalog' | 'DurasiSewa' | 'Login';

interface BottomNavBarProps {
  activeTab: TabType;
  onTabPress: (tab: TabType) => void;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, onTabPress }) => {
  const tabs = [
    { name: 'Beranda' as TabType, icon: 'home-outline', activeIcon: 'home' },
    { name: 'Katalog' as TabType, icon: 'bicycle-outline', activeIcon: 'bicycle' },
    { name: 'DurasiSewa' as TabType, icon: 'qr-code-outline', activeIcon: 'qr-code' },
    { name: 'Login' as TabType, icon: 'person-outline', activeIcon: 'person' },
  ];

  return (
    <View style={styles.navContainer}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.name;
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tabItem}
            activeOpacity={0.6}
            onPress={() => onTabPress(tab.name)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {isActive && <View style={styles.activeIndicator} />}
            <Ionicons
              name={(isActive ? tab.activeIcon : tab.icon) as any}
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
              {tab.name}
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
  activeTabLabel: {
    fontWeight: '700',
  },
});

export default BottomNavBar;