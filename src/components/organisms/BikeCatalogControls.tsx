import { ScrollView, StyleSheet, View } from 'react-native';
import { SearchBar } from '../molecules/SearchBar';
import { FilterChip } from '../molecules/FilterChip';

type BikeCatalogControlsProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  activeFilter: string;
  onFilterChange: (value: string) => void;
  filters?: string[];
};

export function BikeCatalogControls({
  searchQuery, onSearchChange, activeFilter, onFilterChange,
  filters = ['Semua', 'Gunung', 'Lipat'],
}: BikeCatalogControlsProps) {
  return (
    <View style={styles.container}>
      <SearchBar value={searchQuery} onChangeText={onSearchChange} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
        {filters.map((filter) => (
          <FilterChip
            key={filter}
            label={filter}
            selected={activeFilter === filter}
            onPress={() => onFilterChange(filter)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  filters: { gap: 8, paddingVertical: 2 },
});
