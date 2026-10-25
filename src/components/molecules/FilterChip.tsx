import { Pressable, StyleSheet, Text } from 'react-native';

type FilterChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function FilterChip({ label, selected, onPress }: FilterChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.chip, selected && styles.selectedChip]}>
      <Text style={[styles.label, selected && styles.selectedLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 15, paddingVertical: 9, borderRadius: 20,
    borderWidth: 1, borderColor: '#E5ECE7', backgroundColor: '#FFFFFF',
  },
  selectedChip: { backgroundColor: '#16833B', borderColor: '#16833B' },
  label: { color: '#61766A', fontSize: 13, fontWeight: '600' },
  selectedLabel: { color: '#FFFFFF' },
});
