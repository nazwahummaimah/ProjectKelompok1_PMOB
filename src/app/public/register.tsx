import { useState } from 'react';
import {
  Alert,
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
import { PrimaryButton } from '../../components/molecules/PrimaryButton';
import { BottomNavigation } from '../../components/organisms/BottomNavigation';
import { RegistrationFormFields } from '../../components/organisms/RegistrationFormFields';

const C = {
  primary: '#16833B',
  primaryDark: '#07532C',
  primaryLight: '#E8F6EC',
  background: '#F7F9F8',
  surface: '#FFFFFF',
  text: '#173B29',
  secondary: '#61766A',
  border: '#E5ECE7',
};

type FormErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const openHome = () => router.push('/public');
  const openDuration = () => router.push('/public/durasi-sewa');
  const openLogin = () => router.push('/public/login');

  const onRegister = () => {
    const nextErrors: FormErrors = {};
    const normalizedEmail = email.trim();

    if (!name.trim()) nextErrors.name = 'Nama lengkap wajib diisi.';
    if (!normalizedEmail) {
      nextErrors.email = 'Email wajib diisi.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      nextErrors.email = 'Masukkan alamat email yang valid.';
    }
    if (!password) nextErrors.password = 'Password wajib diisi.';
    if (!confirmPassword) {
      nextErrors.confirmPassword = 'Konfirmasi password wajib diisi.';
    } else if (confirmPassword !== password) {
      nextErrors.confirmPassword = 'Konfirmasi password tidak sama.';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    Alert.alert(
      'Pendaftaran belum tersedia',
      'Form registrasi belum terhubung ke layanan akun. Data Anda belum dikirim.',
    );
  };

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
              <MaterialCommunityIcons name="account-plus-outline" size={18} color={C.primary} />
              <Text style={styles.heroBadgeText}>Akun pengguna</Text>
            </View>
            <Text style={styles.heroTitle}>Buat Akun</Text>
            <Text style={styles.heroText}>Daftarkan diri untuk menggunakan layanan Jamal Jepret.</Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Registrasi</Text>
            <RegistrationFormFields
              name={name}
              email={email}
              password={password}
              confirmPassword={confirmPassword}
              errors={errors}
              showPassword={showPassword}
              showConfirmPassword={showConfirmPassword}
              onNameChange={setName}
              onEmailChange={setEmail}
              onPasswordChange={setPassword}
              onConfirmPasswordChange={setConfirmPassword}
              onTogglePassword={() => setShowPassword((visible) => !visible)}
              onToggleConfirmPassword={() => setShowConfirmPassword((visible) => !visible)}
            />

            <PrimaryButton title="Daftar" onPress={onRegister} style={styles.primaryButton} />

            <View style={styles.loginPrompt}>
              <Text style={styles.promptText}>Sudah punya akun?</Text>
              <Pressable onPress={openLogin} accessibilityRole="button">
                <Text style={styles.linkText}>Masuk</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={18} color={C.primary} />
            <Text style={styles.infoText}>
              Pastikan email yang digunakan aktif agar informasi akun dapat diterima.
            </Text>
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
  primaryButton: { minHeight: 48, marginTop: 4 },
  loginPrompt: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, marginTop: 18 },
  promptText: { color: C.secondary, fontSize: 13 },
  linkText: { color: C.primary, fontSize: 13, fontWeight: '700' },
  infoBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: '#EEF6EF',
    borderRadius: 14, padding: 14, marginTop: 18, borderWidth: 1, borderColor: '#D6EAD9',
  },
  infoText: { flex: 1, fontSize: 12.5, lineHeight: 20, color: C.secondary },
});