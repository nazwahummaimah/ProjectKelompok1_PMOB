import { Pressable, StyleSheet, Text } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

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
      accessibilityLabel={`Filter ${label}`}
      onPress={onPress}
      style={[styles.chip, selected && styles.selectedChip]}
    >
      <Text style={[styles.label, selected && styles.selectedLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderRadius: SIZES.radiusMedium,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  selectedChip: {
    backgroundColor: '#E0F2FE',
    borderColor: '#7DD3FC',
  },
  label: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  selectedLabel: {
    color: COLORS.secondaryDark,
    fontWeight: '700',
  },
});
