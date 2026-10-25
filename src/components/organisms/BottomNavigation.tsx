import { StyleSheet, View } from 'react-native';
import { BottomNavItem } from '../molecules/BottomNavItem';

type TabName = 'home' | 'duration' | 'login';

type BottomNavigationProps = {
  activeTab: TabName;
  onHomePress: () => void;
  onDurationPress: () => void;
  onLoginPress: () => void;
};

export function BottomNavigation({
  activeTab, onHomePress, onDurationPress, onLoginPress,
}: BottomNavigationProps) {
  return (
    <View style={styles.container}>
      <BottomNavItem icon="home-outline" label="Home" active={activeTab === 'home'} onPress={onHomePress} />
      <BottomNavItem icon="scan-outline" label="Durasi Sewa" active={activeTab === 'duration'} onPress={onDurationPress} />
      <BottomNavItem icon="person-circle-outline" label="Login" active={activeTab === 'login'} onPress={onLoginPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', backgroundColor: '#FFFFFF',
    borderTopWidth: 1, borderTopColor: '#E5ECE7',
    paddingHorizontal: 12, paddingTop: 5, paddingBottom: 4,
  },
});
