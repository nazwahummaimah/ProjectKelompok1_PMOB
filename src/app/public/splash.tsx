
import { useEffect } from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { BrandLogo } from '../../components/molecules/BrandLogo';

const COLORS = {
  primary: '#2E7D32',
  primaryLight: '#E8F5E9',
  white: '#FFFFFF',
};

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace('/public');
    }, 1500);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.content}>
        <BrandLogo
          title="Jamal Jepret"
          subtitle="Penyewaan Sepeda"
          layout="vertical"
          size="large"
          iconSize={66}
        />

        <ActivityIndicator
          size="small"
          color={COLORS.primary}
          style={styles.loadingIndicator}
          accessibilityLabel="Memuat aplikasi"
        />
      </View>

      <Text style={styles.footer}>JELAJAHI DENGAN NYAMAN</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryLight,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  loadingIndicator: {
    marginTop: 32,
  },
  footer: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.6,
    marginBottom: 22,
  },
});
