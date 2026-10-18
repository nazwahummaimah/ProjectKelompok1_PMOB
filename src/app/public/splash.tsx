import { useEffect } from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const COLORS = {
  primary: '#2E7D32',
  primaryDark: '#1B5E20',
  primaryLight: '#E8F5E9',
  background: '#F7F8FA',
  secondary: '#616161',
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
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.primaryLight} />
      <View style={styles.content}>
        <View style={styles.logoWrap}>
          <MaterialCommunityIcons name="bicycle" size={66} color={COLORS.primary} />
        </View>
        <Text style={styles.brandName}>Jamal Jepret</Text>
        <Text style={styles.brandSubtitle}>Penyewaan Sepeda</Text>
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
  logoWrap: {
    width: 120,
    height: 120,
    borderRadius: 36,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  brandName: {
    color: COLORS.primaryDark,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  brandSubtitle: {
    color: COLORS.secondary,
    fontSize: 14,
    marginTop: 5,
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
