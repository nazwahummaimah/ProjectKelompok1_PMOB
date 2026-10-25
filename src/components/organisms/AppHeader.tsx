import { StyleSheet, View } from 'react-native';
import { BrandLogo } from '../molecules/BrandLogo';

type AppHeaderProps = {
  title?: string;
  subtitle?: string;
};

export function AppHeader({
  title = 'Jamal Jepret Perjuangan',
  subtitle = 'Penyewaan Sepeda',
}: AppHeaderProps) {
  return (
    <View style={styles.container}>
      <BrandLogo title={title} subtitle={subtitle} iconSize={35} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 18, paddingVertical: 14, backgroundColor: '#FFFFFF',
    borderBottomWidth: 1, borderBottomColor: '#E5ECE7',
  },
});
