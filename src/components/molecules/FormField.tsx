import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TextInput, View, Pressable, TextInputProps } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

type FormFieldProps = TextInputProps & {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  error?: string;
  trailingIcon?: keyof typeof Ionicons.glyphMap;
  onTrailingPress?: () => void;
};

export function FormField({
  label, icon, error, trailingIcon, onTrailingPress, style, ...inputProps
}: FormFieldProps) {
  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrap, error && styles.inputError]}>
        <Ionicons name={icon} size={18} color={COLORS.textSecondary} />
        <TextInput
          {...inputProps}
          style={[styles.input, style]}
          placeholderTextColor={COLORS.textSecondary}
        />
        {trailingIcon ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Tampilkan atau sembunyikan password"
            hitSlop={8}
            onPress={onTrailingPress}>
            <Ionicons name={trailingIcon} size={19} color={COLORS.textSecondary} />
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  group: { gap: 7, marginBottom: SIZES.large },
  label: { ...FONTS.labelMedium, color: COLORS.textPrimary },
  inputWrap: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.small,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusMedium,
    backgroundColor: COLORS.surface,
    paddingHorizontal: SIZES.medium,
  },
  inputError: { borderColor: COLORS.accentCritical },
  input: { flex: 1, minWidth: 0, color: COLORS.textPrimary, ...FONTS.body, paddingVertical: 11 },
  error: { color: COLORS.accentCritical, ...FONTS.caption },
});
