// components/molecules/BottomNavBar.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../constants/theme';

interface BottomNavBarProps {
  activeTab: 'Beranda' | 'Katalog' | 'Scan' | 'Login';
  onTabPress: (tab: 'Beranda' | 'Katalog' | 'Scan' | 'Login') => void;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, onTabPress }) => {
  const tabs = [
    { name: 'Beranda', icon: 'home-outline', activeIcon: 'home' },
    { name: 'Katalog', icon: 'bicycle-outline', activeIcon: 'bicycle' },
    { name: 'Scan', icon: 'qr-code-outline', activeIcon: 'qr-code' },
    { name: 'Login', icon: 'person-outline', activeIcon: 'person' },
  ] as const;

  return (
    <View style={styles.navContainer}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.name;
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tabItem}
            activeOpacity={0.8}
            onPress={() => onTabPress(tab.name as any)}
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
                isActive && { fontWeight: 'bold' },
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
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: '100%',
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    width: 24,
    height: 3,
    backgroundColor: COLORS.secondaryDark,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
  tabLabel: {
    ...FONTS.caption,
    fontSize: 11,
    marginTop: 2,
  },
});

export default BottomNavBar;