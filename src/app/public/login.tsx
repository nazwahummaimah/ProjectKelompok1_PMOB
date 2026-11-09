import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { COLORS, SIZES, FONTS } from '../../constants/theme';
import BottomNavBar, { TabType } from '../../components/molecules/BottomNavBar';
import ValidationMessage from '../../components/molecules/ValidationMessage';
import {
  validateEmail,
  validateLoginPassword,
  hasValidationErrors,
} from '../../utils/formValidation';

import HeaderApp from '@/components/molecules/HeaderApp';
import { useAuth } from '../../context/AuthContext';

const Login: React.FC = () => {
  const router = useRouter();
  const { signIn } = useAuth();

  const [activeTab, setActiveTab] = useState<TabType>('Login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const [submitted, setSubmitted] = useState(false);

  const emailValidation = validateEmail(email);
  const passwordValidation = validateLoginPassword(password);

  const showEmailValidation = touched.email || submitted;
  const showPasswordValidation = touched.password || submitted;

  const emailError = showEmailValidation
    ? emailValidation
    : undefined;

  const passwordError = showPasswordValidation
    ? passwordValidation
    : undefined;

  const emailValid =
    showEmailValidation && !emailValidation;

  const passwordValid =
    showPasswordValidation && !passwordValidation;

  const handleSubmit = async () => {
    setSubmitted(true);
    setTouched({
      email: true,
      password: true,
    });

    if (
      hasValidationErrors({
        email: emailValidation,
        password: passwordValidation,
      })
    ) {
      return;
    }

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const profile = await signIn(email, password);

      if (profile.role === 'admin') {
        router.replace('/admin' as any);
        return;
      }

      if (profile.role === 'user') {
        router.replace('/user' as any);
        return;
      }

      Alert.alert(
        'Akses Ditolak',
        'Role akun tidak dikenali. Silakan hubungi administrator.',
      );
    } catch (error: any) {
      console.error('Login error:', error);

      let message = 'Terjadi kesalahan. Silakan coba kembali.';

      if (
        error?.message?.toLowerCase().includes('invalid login credentials')
      ) {
        message = 'Email atau kata sandi yang kamu masukkan salah.';
      } else if (
        error?.message?.toLowerCase().includes('email not confirmed')
      ) {
        message = 'Email belum diverifikasi. Silakan periksa kotak masuk email kamu.';
      } else if (
        error?.message?.toLowerCase().includes('profil pengguna tidak ditemukan')
      ) {
        message = error.message;
      } else if (error?.message) {
        message = error.message;
      }

      Alert.alert('Login Gagal', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTabPress = (tab: TabType) => {
    setActiveTab(tab);

    switch (tab) {
      case 'Beranda':
        router.push('/public/' as any);
        break;

      case 'Katalog':
        router.push('/public/katalog' as any);
        break;

      case 'DurasiSewa':
        router.push('/public/durasi-sewa' as any);
        break;

      case 'Login':
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <HeaderApp notificationCount={0} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Masuk ke Akun</Text>

        <Text style={styles.pageSubtitle}>
          Akses riwayat sewa pribadi dan kelola profil Anda.
        </Text>

        {/* EMAIL */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Alamat Email</Text>

          <View
            style={[
              styles.inputBox,
              emailError && styles.inputBoxError,
              emailValid && styles.inputBoxValid,
            ]}
          >
            <Ionicons
              name="mail-outline"
              size={20}
              color={
                emailError
                  ? COLORS.accentCritical
                  : emailValid
                    ? COLORS.success
                    : COLORS.textSecondary
              }
              style={{ marginRight: 10 }}
            />

            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setTouched((current) => ({
                  ...current,
                  email: true,
                }));
              }}
              onBlur={() =>
                setTouched((current) => ({
                  ...current,
                  email: true,
                }))
              }
              placeholder="Masukkan email Anda"
              placeholderTextColor={COLORS.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isSubmitting}
            />
          </View>

          <ValidationMessage
            error={emailError}
            success={emailValid ? 'Format email valid.' : undefined}
          />
        </View>

        {/* PASSWORD */}
        <View style={styles.inputGroup}>
          <View style={styles.labelWithLink}>
            <Text style={styles.inputLabel}>Kata Sandi</Text>

            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  'Lupa Kata Sandi',
                  'Fitur reset kata sandi akan diintegrasikan pada tahap berikutnya.',
                )
              }
              disabled={isSubmitting}
            >
              <Text style={styles.forgotText}>
                Lupa kata sandi?
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={[
              styles.inputBox,
              passwordError && styles.inputBoxError,
              passwordValid && styles.inputBoxValid,
            ]}
          >
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={
                passwordError
                  ? COLORS.accentCritical
                  : passwordValid
                    ? COLORS.success
                    : COLORS.textSecondary
              }
              style={{ marginRight: 10 }}
            />

            <TextInput
              style={styles.textInput}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setTouched((current) => ({
                  ...current,
                  password: true,
                }));
              }}
              onBlur={() =>
                setTouched((current) => ({
                  ...current,
                  password: true,
                }))
              }
              placeholder="Masukkan kata sandi"
              placeholderTextColor={COLORS.textSecondary}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              editable={!isSubmitting}
              onSubmitEditing={handleSubmit}
              returnKeyType="go"
            />

            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              disabled={isSubmitting}
            >
              <Ionicons
                name={
                  showPassword
                    ? 'eye-outline'
                    : 'eye-off-outline'
                }
                size={20}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <ValidationMessage
            error={passwordError}
            success={
              passwordValid
                ? 'Kata sandi sudah diisi.'
                : undefined
            }
          />
        </View>

        {/* LOGIN BUTTON */}
        <TouchableOpacity
          style={[
            styles.submitBtn,
            isSubmitting && styles.submitBtnDisabled,
          ]}
          activeOpacity={0.8}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color={COLORS.textPrimary} />
          ) : (
            <>
              <Text style={styles.submitBtnText}>Masuk</Text>

              <Ionicons
                name="arrow-forward"
                size={18}
                color={COLORS.textPrimary}
                style={{ marginLeft: 6 }}
              />
            </>
          )}
        </TouchableOpacity>

        {/* REGISTER LINK */}
        <View style={styles.registerRow}>
          <Text style={styles.registerPrompt}>
            Belum punya akun?{' '}
          </Text>

          <TouchableOpacity
            onPress={() =>
              router.push('/public/register' as any)
            }
            disabled={isSubmitting}
          >
            <Text style={styles.registerLink}>Daftar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerTagline}>
          <View style={styles.taglineDot} />

          <Text style={styles.taglineText}>
            Rental Sepeda Mas Joko • Sewa sepeda yang mudah,
            cepat, dan jelas.
          </Text>
        </View>
      </ScrollView>

      <BottomNavBar
        activeTab={activeTab}
        onTabPress={handleTabPress}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SIZES.large,
  },
  pageTitle: {
    ...FONTS.headline1,
    color: COLORS.secondaryDark,
    marginBottom: 4,
  },
  pageSubtitle: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    marginBottom: SIZES.xlarge,
  },
  inputGroup: {
    marginBottom: SIZES.large,
  },
  inputLabel: {
    ...FONTS.labelMedium,
    color: COLORS.textPrimary,
    marginBottom: SIZES.small,
  },
  labelWithLink: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotText: {
    ...FONTS.caption,
    color: COLORS.secondaryDark,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SIZES.medium,
  },
  inputBoxError: {
    borderColor: COLORS.accentCritical,
  },
  inputBoxValid: {
    borderColor: COLORS.success,
  },
  textInput: {
    flex: 1,
    ...FONTS.body,
    color: COLORS.textPrimary,
  },
  submitBtn: {
    flexDirection: 'row',
    height: 48,
    backgroundColor: COLORS.primaryLight,
    borderRadius: SIZES.radiusMedium,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.large,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    ...FONTS.labelMedium,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SIZES.xxlarge,
  },
  registerPrompt: {
    ...FONTS.body,
    color: COLORS.textSecondary,
  },
  registerLink: {
    ...FONTS.body,
    fontWeight: 'bold',
    color: COLORS.secondaryDark,
  },
  footerTagline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SIZES.large,
  },
  taglineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primaryLight,
    marginRight: 6,
  },
  taglineText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    fontSize: 11,
  },
});

export default Login;