import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BrandLogo } from '../../components/molecules/BrandLogo';
import { FormField } from '../../components/molecules/FormField';
import { PrimaryButton } from '../../components/molecules/PrimaryButton';
import { BottomNavigation } from '../../components/organisms/BottomNavigation';

const C = {
  primary: '#16833B',
  primaryDark: '#07532C',
  primaryLight: '#E8F6EC',
  background: '#F7F9F8',
  surface: '#FFFFFF',
  text: '#173B29',
  secondary: '#61766A',
  border: '#E5ECE7',
  muted: '#87988E',
};

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const onLogin = () => {
    // Placeholder: integrasi layanan login akan ditambahkan pada tahap berikutnya.
  };

  const openHome = () => router.push('/public');
  const openDuration = () => router.push('/public/durasi-sewa');
  const openLogin = () => router.push('/public/login');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topBrand}>
            <BrandLogo title="Jamal Jepret" subtitle="Penyewaan Sepeda" iconSize={34} />
          </View>

          <View style={styles.heroCard}>
            <View style={styles.heroBadge}>
              <MaterialCommunityIcons name="shield-check" size={18} color={C.primary} />
              <Text style={styles.heroBadgeText}>Akun pengguna</Text>
            </View>
            <Text style={styles.heroTitle}>Masuk untuk melihat perjalananmu!</Text>
            <Text style={styles.heroText}>
              Kelola riwayat sewa, cek status unit, dan akses layanan cabang dengan cepat.
            </Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Login</Text>
            <FormField
              label="Nomor HP / Email"
              icon="person-outline"
              value={phone}
              onChangeText={setPhone}
              placeholder="08xxxxxxxxxx atau email"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <View style={styles.passwordGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Password</Text>
                <Pressable onPress={() => {}} accessibilityRole="button">
                  <Text style={styles.linkText}>Lupa password?</Text>
                </Pressable>
              </View>
              <FormField
                label=""
                icon="lock-closed-outline"
                value={password}
                onChangeText={setPassword}
                placeholder="Masukkan password"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                trailingIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                onTrailingPress={() => setShowPassword((value) => !value)}
              />
            </View>

            <PrimaryButton title="Masuk" onPress={onLogin} style={styles.primaryButton} />

            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>atau</Text>
              <View style={styles.divider} />
            </View>

            <PrimaryButton
              title="Daftar akun baru"
              icon="person-add-outline"
              outlined
              onPress={() => router.push('/public/register')}
              style={styles.secondaryButton}
            />
          </View>

          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={18} color={C.primary} />
            <Text style={styles.infoText}>Buat akun untuk mulai menggunakan layanan Jamal Jepret.</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <BottomNavigation
        activeTab="login"
        onHomePress={openHome}
        onDurationPress={openDuration}
        onLoginPress={openLogin}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: C.background },
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 30 },
  topBrand: { marginBottom: 18 },
  heroCard: {
    backgroundColor: C.surface, borderRadius: 20, padding: 18,
    borderWidth: 1, borderColor: C.border, marginBottom: 20,
    shadowColor: '#164123', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08, shadowRadius: 18, elevation: 3,
  },
  heroBadge: {
    alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: C.primaryLight, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999,
  },
  heroBadgeText: { color: C.primaryDark, fontSize: 11, fontWeight: '700' },
  heroTitle: { fontSize: 28, lineHeight: 34, fontWeight: '800', color: C.text, marginTop: 14 },
  heroText: { fontSize: 14, lineHeight: 22, color: C.secondary, marginTop: 10 },
  formCard: {
    backgroundColor: C.surface, borderRadius: 20, padding: 20,
    borderWidth: 1, borderColor: C.border,
    shadowColor: '#164123', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08, shadowRadius: 18, elevation: 3,
  },
  formTitle: { fontSize: 24, fontWeight: '700', color: C.text, marginBottom: 18 },
  passwordGroup: { marginTop: 0 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  label: { fontSize: 13, fontWeight: '700', color: C.text, marginBottom: 6 },
  linkText: { color: C.primary, fontSize: 12, fontWeight: '600' },
  primaryButton: { minHeight: 48, marginTop: 4 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 18 },
  divider: { flex: 1, height: 1, backgroundColor: C.border },
  dividerText: { fontSize: 12, color: C.secondary, paddingHorizontal: 12 },
  secondaryButton: { minHeight: 48, backgroundColor: C.primaryLight },
  infoBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: '#EEF6EF',
    borderRadius: 14, padding: 14, marginTop: 18, borderWidth: 1, borderColor: '#D6EAD9',
  },
  infoText: { flex: 1, fontSize: 12.5, lineHeight: 20, color: C.secondary },
});