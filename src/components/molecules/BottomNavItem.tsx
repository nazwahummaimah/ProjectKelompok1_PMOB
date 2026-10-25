import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text } from 'react-native';

type BottomNavItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active?: boolean;
  onPress: () => void;
};

export function BottomNavItem({
  icon, label, active = false, onPress,
}: BottomNavItemProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={styles.item}>
      <Ionicons name={icon} size={23} color={active ? '#16833B' : '#87988E'} />
      <Text style={[styles.label, active && styles.activeLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: { flex: 1, minHeight: 54, alignItems: 'center', justifyContent: 'center', gap: 4 },
  label: { color: '#87988E', fontSize: 11, fontWeight: '500' },
  activeLabel: { color: '#16833B', fontWeight: '700' },
});
