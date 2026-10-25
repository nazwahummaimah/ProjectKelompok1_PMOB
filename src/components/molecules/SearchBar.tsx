import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TextInput, View } from 'react-native';

type SearchBarProps = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
};

export function SearchBar({
  value, onChangeText, placeholder = 'Cari sepeda...',
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="search-outline" size={19} color="#61766A" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#87988E"
        autoCapitalize="none"
        returnKeyType="search"
        accessibilityLabel="Cari sepeda"
        style={styles.input}
      />
      {value.length > 0 ? (
        <Ionicons name="close-circle" size={18} color="#87988E" />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 46, flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 14, borderRadius: 12, backgroundColor: '#FFFFFF',
    borderWidth: 1, borderColor: '#E5ECE7',
  },
  input: { flex: 1, color: '#173B29', fontSize: 14, paddingVertical: 10 },
});
