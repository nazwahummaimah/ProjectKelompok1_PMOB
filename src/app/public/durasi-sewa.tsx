import { View, Text, StyleSheet } from 'react-native';

export default function DurasiSewaScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Durasi Sewa (Sementara, nanti tinggal ganti pake codingan baru)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#07532C',
  },
});