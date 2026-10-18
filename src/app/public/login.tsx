import { useState } from 'react';
import {
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
  secondary: '#F9A825',
  background: '#F7F8FA',
  surface: '#FFFFFF',
  textPrimary: '#212121',
  textSecondary: '#616161',
  border: '#E0E0E0',
  muted: '#9AA3A0',
  shadow: 'rgba(22, 65, 35, 0.12)',
  navInactive: '#87969E',
};

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const onLogin = () => {
    // Placeholder untuk logic login di tahap berikutnya.
  };

  const openHome = () => router.push('/public');
  const openDuration = () => router.push('/public/durasi-sewa');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
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
              <MaterialCommunityIcons name="shield-check" size={18} color={COLORS.primary} />
              <Text style={styles.heroBadgeText}>Akun pengguna</Text>
            </View>
            <Text style={styles.heroTitle}>Masuk untuk mulai sewa</Text>
            <Text style={styles.heroText}>
              Kelola riwayat sewa, cek status unit, dan akses layanan cabang dengan cepat.
            </Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Login</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nomor HP / Email</Text>
              <View style={styles.inputWrap}>
                <Ionicons name="person-outline" size={18} color={COLORS.textSecondary} />
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="08xxxxxxxxxx"
                  placeholderTextColor={COLORS.muted}
                  autoCapitalize="none"
                  keyboardType="default"
                  style={styles.input}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Password</Text>
                <Pressable onPress={() => {}}>
                  <Text style={styles.linkText}>Lupa password?</Text>
                </Pressable>
              </View>

              <View style={styles.inputWrap}>
                <Ionicons name="lock-closed-outline" size={18} color={COLORS.textSecondary} />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Masukkan password"
                  placeholderTextColor={COLORS.muted}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  style={styles.input}
                />
                <Pressable
                  onPress={() => setShowPassword((value) => !value)}
                  hitSlop={8}
                  accessibilityRole="button"
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={18}
                    color={COLORS.textSecondary}
                  />
                </Pressable>
              </View>
            </View>

            <Pressable
              style={styles.primaryButton}
              onPress={onLogin}
              accessibilityRole="button"
            >
              <Text style={styles.primaryButtonText}>Masuk</Text>
            </Pressable>

            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>atau</Text>
              <View style={styles.divider} />
            </View>

            <Pressable style={styles.secondaryButton} accessibilityRole="button">
              <MaterialCommunityIcons name="account-plus-outline" size={18} color={COLORS.primary} />
              <Text style={styles.secondaryButtonText}>Daftar akun baru</Text>
            </Pressable>
          </View>

          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={18} color={COLORS.primary} />
            <Text style={styles.infoText}>
              Untuk registrasi, silakan datang langsung ke cabang atau hubungi petugas Jamal Jepret.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.bottomNav}>
        <BottomNavItem
          icon="home"
          label="Home"
          onPress={openHome}
        />
        <BottomNavItem
          icon="scan-outline"
          label="Durasi Sewa"
          onPress={openDuration}
        />
        <BottomNavItem
          icon="person-circle-outline"
          label="Login"
          active
          onPress={() => {}}
        />
      </View>
    </SafeAreaView>
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
    >
      <Ionicons
        name={icon}
        size={23}
        color={active ? COLORS.primary : COLORS.navInactive}
      />
      <Text
        style={[
          styles.bottomNavLabel,
          active && styles.bottomNavLabelActive,
        ]}
      >
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
    marginBottom: 18,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
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
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
    paddingVertical: 2,
  },
  linkText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    paddingHorizontal: 12,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    minHeight: 48,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 15,
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
    color: '#819099',
    fontSize: 10,
    fontWeight: '600',
  },
  bottomNavLabelActive: {
      color: COLORS.primary,
    fontWeight: '800',
  },
});