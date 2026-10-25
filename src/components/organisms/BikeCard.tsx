import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export type Bike = {
  id: string;
  name: string;
  type: 'Gunung' | 'Lipat';
  branch: string;
  image: string;
  available: boolean;
};

type BikeCardProps = {
  bike: Bike;
  onPress?: () => void;
};

export function BikeCard({ bike, onPress }: BikeCardProps) {
  const Container = onPress ? Pressable : View;

  return (
    <Container {...(onPress ? { onPress } : {})} style={styles.card}>
      <Image source={{ uri: bike.image }} style={styles.image} resizeMode="cover" />
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.id}>{bike.id}</Text>
          <View style={[styles.status, bike.available ? styles.available : styles.unavailable]}>
            <Text style={[styles.statusText, !bike.available && styles.unavailableText]}>
              {bike.available ? 'Tersedia' : 'Disewa'}
            </Text>
          </View>
        </View>
        <Text style={styles.name}>{bike.name}</Text>
        <View style={styles.typeRow}>
          <MaterialCommunityIcons name="bicycle" size={15} color="#61766A" />
          <Text style={styles.type}>{bike.type}</Text>
        </View>
        <Text style={styles.branch}>{bike.branch}</Text>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1, minWidth: 0, overflow: 'hidden', backgroundColor: '#FFFFFF',
    borderRadius: 14, borderWidth: 1, borderColor: '#E5ECE7',
  },
  image: { width: '100%', height: 125, backgroundColor: '#F1FAF3' },
  content: { padding: 11, gap: 6 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 4 },
  id: { color: '#61766A', fontSize: 10, fontWeight: '700' },
  status: { borderRadius: 10, paddingHorizontal: 7, paddingVertical: 3 },
  available: { backgroundColor: '#E8F6EC' },
  unavailable: { backgroundColor: '#FDECEA' },
  statusText: { color: '#16833B', fontSize: 10, fontWeight: '700' },
  unavailableText: { color: '#C62828' },
  name: { color: '#173B29', fontSize: 14, fontWeight: '700' },
  typeRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  type: { color: '#61766A', fontSize: 12 },
  branch: { color: '#87988E', fontSize: 11 },
});
