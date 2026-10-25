import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TextInput, View, Pressable, TextInputProps } from 'react-native';

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
        <Ionicons name={icon} size={18} color="#61766A" />
        <TextInput
          {...inputProps}
          style={[styles.input, style]}
          placeholderTextColor="#87988E"
        />
        {trailingIcon ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Tampilkan atau sembunyikan password"
            hitSlop={8}
            onPress={onTrailingPress}>
            <Ionicons name={trailingIcon} size={19} color="#61766A" />
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  group: { gap: 7, marginBottom: 16 },
  label: { color: '#212121', fontSize: 13, fontWeight: '700' },
  inputWrap: {
    minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 12,
    backgroundColor: '#FFFFFF', paddingHorizontal: 13,
  },
  inputError: { borderColor: '#C62828' },
  input: { flex: 1, minWidth: 0, color: '#212121', fontSize: 14, paddingVertical: 11 },
  error: { color: '#C62828', fontSize: 12 },
});
