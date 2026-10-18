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
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const COLORS = {
  primary: '#2E7D32',
  primaryDark: '#1B5E20',
  primaryLight: '#E8F5E9',
  background: '#F7F8FA',
  surface: '#FFFFFF',
  textPrimary: '#212121',
  textSecondary: '#616161',
  border: '#E0E0E0',
  muted: '#9AA3A0',
  shadow: 'rgba(22, 65, 35, 0.12)',
  navInactive: '#87969E',
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

    if (!name.trim()) {
      nextErrors.name = 'Nama lengkap wajib diisi.';
    }
    if (!normalizedEmail) {
      nextErrors.email = 'Email wajib diisi.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      nextErrors.email = 'Masukkan alamat email yang valid.';
    }
    if (!password) {
      nextErrors.password = 'Password wajib diisi.';
    }
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
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

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
            <View style={styles.logoWrap}>
              <MaterialCommunityIcons name="bicycle" size={34} color={COLORS.primary} />
            </View>
            <View>
              <Text style={styles.brandName}>Jamal Jepret</Text>
              <Text style={styles.brandSub}>Penyewaan Sepeda</Text>
            </View>
          </View>

          <View style={styles.heroCard}>
            <View style={styles.heroBadge}>
              <MaterialCommunityIcons name="account-plus-outline" size={18} color={COLORS.primary} />
              <Text style={styles.heroBadgeText}>Akun pengguna</Text>
            </View>
            <Text style={styles.heroTitle}>Buat Akun</Text>
            <Text style={styles.heroText}>
              Daftarkan diri untuk menggunakan layanan Jamal Jepret.
            </Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Registrasi</Text>

            <FormField
              label="Nama lengkap"
              icon="person-outline"
              value={name}
              onChangeText={setName}
              placeholder="Masukkan nama lengkap"
              error={errors.name}
              autoCapitalize="words"
            />

            <FormField
              label="Email"
              icon="mail-outline"
              value={email}
              onChangeText={setEmail}
              placeholder="nama@email.com"
              error={errors.email}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <FormField
              label="Password"
              icon="lock-closed-outline"
              value={password}
              onChangeText={setPassword}
              placeholder="Buat password"
              error={errors.password}
              secureTextEntry={!showPassword}
              trailingIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
              onTrailingPress={() => setShowPassword((visible) => !visible)}
            />

            <FormField
              label="Konfirmasi password"
              icon="lock-closed-outline"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Ulangi password"
              error={errors.confirmPassword}
              secureTextEntry={!showConfirmPassword}
              trailingIcon={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
              onTrailingPress={() => setShowConfirmPassword((visible) => !visible)}
            />

            <Pressable
              style={styles.primaryButton}
              onPress={onRegister}
              accessibilityRole="button"
            >
              <Text style={styles.primaryButtonText}>Daftar</Text>
            </Pressable>

            <View style={styles.loginPrompt}>
              <Text style={styles.promptText}>Sudah punya akun?</Text>
              <Pressable onPress={openLogin} accessibilityRole="button">
                <Text style={styles.linkText}>Masuk</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={18} color={COLORS.primary} />
            <Text style={styles.infoText}>
              Pastikan email yang digunakan aktif agar informasi akun dapat diterima.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.bottomNav}>
        <BottomNavItem icon="home" label="Home" onPress={openHome} />
        <BottomNavItem icon="scan-outline" label="Durasi Sewa" onPress={openDuration} />
        <BottomNavItem
          icon="person-circle-outline"
          label="Login"
          active
          onPress={openLogin}
        />
      </View>
    </SafeAreaView>
  );
}

function FormField({
  label,
  icon,
  value,
  onChangeText,
  placeholder,
  error,
  autoCapitalize = 'none',
  keyboardType = 'default',
  secureTextEntry = false,
  trailingIcon,
  onTrailingPress,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  error?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address';
  secureTextEntry?: boolean;
  trailingIcon?: keyof typeof Ionicons.glyphMap;
  onTrailingPress?: () => void;
}) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrap, error && styles.inputWrapError]}>
        <Ionicons name={icon} size={18} color={COLORS.textSecondary} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.muted}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          style={styles.input}
        />
        {trailingIcon && onTrailingPress ? (
          <Pressable
            onPress={onTrailingPress}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={secureTextEntry ? 'Tampilkan password' : 'Sembunyikan password'}
          >
            <Ionicons name={trailingIcon} size={18} color={COLORS.textSecondary} />
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

function BottomNavItem({
  icon,
  label,
  active = false,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.bottomNavItem}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      <Ionicons
        name={icon}
        size={23}
        color={active ? COLORS.primary : COLORS.navInactive}
      />
      <Text style={[styles.bottomNavLabel, active && styles.bottomNavLabelActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  topBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 18,
  },
  logoWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D7E8DB',
  },
  brandName: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: 0.2,
  },
  brandSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  heroCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 3,
    marginBottom: 20,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  heroBadgeText: {
    color: COLORS.primaryDark,
    fontSize: 11,
    fontWeight: '700',
  },
  heroTitle: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 14,
  },
  heroText: {
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.textSecondary,
    marginTop: 10,
  },
  formCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 3,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 18,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: '#FBFCFB',
    gap: 10,
  },
  inputWrapError: {
    borderColor: '#C62828',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
    paddingVertical: 2,
  },
  errorText: {
    color: '#C62828',
    fontSize: 12,
    marginTop: 5,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  loginPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginTop: 18,
  },
  promptText: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  linkText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#EEF6EF',
    borderRadius: 14,
    padding: 14,
    marginTop: 18,
    borderWidth: 1,
    borderColor: '#D6EAD9',
  },
  infoText: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 20,
    color: COLORS.textSecondary,
  },
  bottomNav: {
    height: 65,
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: '#EDF1EE',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  bottomNavItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  bottomNavLabel: {
    color: COLORS.navInactive,
    fontSize: 10,
    fontWeight: '600',
  },
  bottomNavLabelActive: {
    color: COLORS.primary,
    fontWeight: '800',
  },
});
