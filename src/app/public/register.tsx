
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { COLORS, SIZES, FONTS } from '../../constants/theme';

import BottomNavBar, {
  TabType,
} from '../../components/molecules/BottomNavBar';

import ValidationMessage from '../../components/molecules/ValidationMessage';
import JamalJepretLogo from '../../components/molecules/JamalJepretLogo';

import {
  validateFullName,
  validateEmail,
  validateWhatsApp,
  validateRegistrationPassword,
  validatePasswordConfirmation,
  hasValidationErrors,
} from '../../utils/formValidation';

import { useAuth } from '../../context/AuthContext';

const Register: React.FC = () => {
  const router = useRouter();
  const { signUp } = useAuth();

  // ===================================================
  // STATE
  // ===================================================

  const [activeTab, setActiveTab] = useState<TabType>('Login');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    phone: false,
    password: false,
    confirmPassword: false,
  });

  const [submitted, setSubmitted] = useState(false);

  // ===================================================
  // VALIDATION
  // ===================================================

  const validation = {
    fullName: validateFullName(fullName),
    email: validateEmail(email),
    phone: validateWhatsApp(phone),
    password: validateRegistrationPassword(password),
    confirmPassword: validatePasswordConfirmation(
      confirmPassword,
      password,
    ),
  };

  const showField = (field: keyof typeof touched) =>
    touched[field] || submitted;

  const fieldErrors = {
    fullName: showField('fullName')
      ? validation.fullName
      : undefined,

    email: showField('email')
      ? validation.email
      : undefined,

    phone: showField('phone')
      ? validation.phone
      : undefined,

    password: showField('password')
      ? validation.password
      : undefined,

    confirmPassword: showField('confirmPassword')
      ? validation.confirmPassword
      : undefined,
  };

  const markTouched = (field: keyof typeof touched) => {
    setTouched((current) => ({
      ...current,
      [field]: true,
    }));
  };

  // ===================================================
  // NORMALIZE INDONESIAN PHONE NUMBER
  // ===================================================

  /**
   * Mengubah nomor WhatsApp menjadi format internasional.
   *
   * 081234567890  -> +6281234567890
   * 6281234567890 -> +6281234567890
   * 81234567890   -> +6281234567890
   */
  const normalizePhone = (value: string): string => {
    let digits = value.replace(/\D/g, '');

    if (digits.startsWith('62')) {
      digits = digits.slice(2);
    } else if (digits.startsWith('0')) {
      digits = digits.slice(1);
    }

    return `+62${digits}`;
  };

  // ===================================================
  // REGISTER
  // ===================================================

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setSubmitted(true);

    setTouched({
      fullName: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
    });

    if (hasValidationErrors(validation)) {
      Alert.alert(
        'Periksa Kembali Data',
        'Masih ada kolom yang perlu diperbaiki.',
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const normalizedEmail = email.trim().toLowerCase();
      const normalizedPhone = normalizePhone(phone);

      // Registrasi melalui AuthContext agar alur autentikasi
      // terpusat dan konsisten dengan halaman login.
      const result = await signUp({
        fullName: fullName.trim(),
        email: normalizedEmail,
        phone: normalizedPhone,
        password,
        customerType: 'Umum',
      });

      // =================================================
      // EMAIL VERIFICATION ENABLED
      // =================================================

      if (result.needsEmailConfirmation) {
        Alert.alert(
          'Registrasi Berhasil',
          'Akun berhasil dibuat. Silakan periksa email kamu dan klik tautan verifikasi untuk mengaktifkan akun.',
          [
            {
              text: 'Mengerti',
              onPress: () => {
                router.replace('/public/login' as any);
              },
            },
          ],
        );

        return;
      }

      // =================================================
      // SESSION AVAILABLE
      // =================================================

      Alert.alert(
        'Registrasi Berhasil',
        'Akun berhasil dibuat dan kamu sudah login.',
        [
          {
            text: 'Lanjut',
            onPress: () => {
              router.replace('/user' as any);
            },
          },
        ],
      );
    } catch (error: unknown) {
      console.error('Register error:', error);

      let message =
        'Terjadi kesalahan saat membuat akun. Silakan coba kembali.';

      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();

        if (
          errorMessage.includes('already registered') ||
          errorMessage.includes('user already registered')
        ) {
          message =
            'Email tersebut sudah terdaftar. Silakan gunakan email lain atau masuk ke akun kamu.';
        } else if (errorMessage.includes('invalid email')) {
          message = 'Format email tidak valid.';
        } else if (errorMessage.includes('password')) {
          message =
            'Kata sandi tidak memenuhi persyaratan Supabase.';
        } else if (
          errorMessage.includes('rate limit') ||
          errorMessage.includes('too many requests')
        ) {
          message =
            'Terlalu banyak percobaan registrasi. Silakan coba kembali beberapa saat lagi.';
        } else {
          message = error.message;
        }
      }

      Alert.alert('Registrasi Gagal', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ===================================================
  // BOTTOM NAVIGATION
  // ===================================================

  const handleTabPress = (tab: TabType) => {
    if (isSubmitting) return;

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
        router.push('/public/login' as any);
        break;
    }
  };

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* HEADER */}
      <View style={styles.safeHeaderArea}>
        <View style={styles.topHeader}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            disabled={isSubmitting}
            accessibilityRole="button"
            accessibilityLabel="Kembali"
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color={COLORS.secondaryDark}
            />
          </TouchableOpacity>

          <View style={styles.brandHeader}>
            <View style={{ marginRight: 6 }} accessible accessibilityRole="image" accessibilityLabel="Logo Jamal Jepret">
              <JamalJepretLogo width={130} />
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.pageTitle}>
          Daftar Akun Baru
        </Text>

        <Text style={styles.pageSubtitle}>
          Buat akun untuk mempermudah pencatatan sewa dan
          melihat riwayat penyewaan di Jamal Jepret.
        </Text>

        {/* NAMA LENGKAP */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>
            Nama Lengkap
          </Text>

          <View
            style={[
              styles.inputBox,
              fieldErrors.fullName && styles.inputBoxError,
              showField('fullName') &&
                !validation.fullName &&
                styles.inputBoxValid,
            ]}
          >
            <TextInput
              style={styles.textInput}
              value={fullName}
              onChangeText={(value) => {
                setFullName(value);
                markTouched('fullName');
              }}
              onBlur={() => markTouched('fullName')}
              placeholder="Masukkan nama lengkap"
              placeholderTextColor={COLORS.textSecondary}
              autoCapitalize="words"
              autoCorrect={false}
              editable={!isSubmitting}
            />
          </View>

          <ValidationMessage
            error={fieldErrors.fullName}
            success={
              showField('fullName') && !validation.fullName
                ? 'Nama lengkap valid.'
                : undefined
            }
          />
        </View>

        {/* EMAIL */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>
            Email Aktif
          </Text>

          <View
            style={[
              styles.inputBox,
              fieldErrors.email && styles.inputBoxError,
              showField('email') &&
                !validation.email &&
                styles.inputBoxValid,
            ]}
          >
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                markTouched('email');
              }}
              onBlur={() => markTouched('email')}
              placeholder="contoh@gmail.com"
              placeholderTextColor={COLORS.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isSubmitting}
            />
          </View>

          <ValidationMessage
            error={fieldErrors.email}
            success={
              showField('email') && !validation.email
                ? 'Format email valid.'
                : undefined
            }
          />
        </View>

        {/* WHATSAPP */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>
            Nomor WhatsApp
          </Text>

          <View style={styles.phoneInputRow}>
            <View style={styles.countryCodeBox}>
              <Text style={styles.countryCodeText}>
                +62
              </Text>
            </View>

            <View
              style={[
                styles.inputBox,
                {
                  flex: 1,
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                },
                fieldErrors.phone && styles.inputBoxError,
                showField('phone') &&
                  !validation.phone &&
                  styles.inputBoxValid,
              ]}
            >
              <TextInput
                style={styles.textInput}
                value={phone}
                onChangeText={(value) => {
                  setPhone(value);
                  markTouched('phone');
                }}
                onBlur={() => markTouched('phone')}
                placeholder="812 3456 7890"
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="phone-pad"
                editable={!isSubmitting}
              />
            </View>
          </View>

          {showField('phone') ? (
            <ValidationMessage
              error={fieldErrors.phone}
              success={
                !validation.phone
                  ? 'Nomor WhatsApp valid.'
                  : undefined
              }
            />
          ) : (
            <View style={styles.helperRow}>
              <Ionicons
                name="information-circle-outline"
                size={14}
                color={COLORS.textSecondary}
                style={{ marginRight: 4 }}
              />

              <Text style={styles.helperText}>
                Digunakan petugas Jamal Jepret untuk
                mencocokkan riwayat penyewaan Anda.
              </Text>
            </View>
          )}
        </View>

        {/* PASSWORD */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>
            Kata Sandi
          </Text>

          <View
            style={[
              styles.inputBox,
              fieldErrors.password && styles.inputBoxError,
              showField('password') &&
                !validation.password &&
                styles.inputBoxValid,
            ]}
          >
            <TextInput
              style={styles.textInput}
              value={password}
              onChangeText={(value) => {
                setPassword(value);
                markTouched('password');

                if (confirmPassword.length > 0) {
                  markTouched('confirmPassword');
                }
              }}
              onBlur={() => markTouched('password')}
              placeholder="Masukkan kata sandi"
              placeholderTextColor={COLORS.textSecondary}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isSubmitting}
            />

            <TouchableOpacity
              onPress={() =>
                setShowPassword(!showPassword)
              }
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

          {showField('password') ? (
            <ValidationMessage
              error={fieldErrors.password}
              success={
                !validation.password
                  ? 'Password memenuhi minimal 8 karakter.'
                  : undefined
              }
            />
          ) : (
            <View style={styles.helperRow}>
              <Ionicons
                name="checkmark-circle-outline"
                size={14}
                color={COLORS.success}
                style={{ marginRight: 4 }}
              />

              <Text style={styles.validText}>
                Minimal 8 karakter
              </Text>
            </View>
          )}
        </View>

        {/* KONFIRMASI PASSWORD */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>
            Ulangi Kata Sandi
          </Text>

          <View
            style={[
              styles.inputBox,
              fieldErrors.confirmPassword &&
                styles.inputBoxError,
              showField('confirmPassword') &&
                !validation.confirmPassword &&
                styles.inputBoxValid,
            ]}
          >
            <TextInput
              style={styles.textInput}
              value={confirmPassword}
              onChangeText={(value) => {
                setConfirmPassword(value);
                markTouched('confirmPassword');
              }}
              onBlur={() =>
                markTouched('confirmPassword')
              }
              placeholder="Ulangi kata sandi"
              placeholderTextColor={COLORS.textSecondary}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isSubmitting}
            />

            <TouchableOpacity
              onPress={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              disabled={isSubmitting}
            >
              <Ionicons
                name={
                  showConfirmPassword
                    ? 'eye-outline'
                    : 'eye-off-outline'
                }
                size={20}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {showField('confirmPassword') ? (
            <ValidationMessage
              error={fieldErrors.confirmPassword}
              success={
                !validation.confirmPassword
                  ? 'Kata sandi cocok.'
                  : undefined
              }
            />
          ) : (
            <View style={styles.helperRow}>
              <Ionicons
                name="checkmark-circle-outline"
                size={14}
                color={COLORS.success}
                style={{ marginRight: 4 }}
              />

              <Text style={styles.validText}>
                Kata sandi cocok
              </Text>
            </View>
          )}
        </View>

        {/* REGISTER BUTTON */}
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
              <Text style={styles.submitBtnText}>
                Daftar Akun
              </Text>

              <Ionicons
                name="arrow-forward"
                size={18}
                color={COLORS.textPrimary}
                style={{ marginLeft: 6 }}
              />
            </>
          )}
        </TouchableOpacity>

        {/* LOGIN LINK */}
        <View style={styles.loginRow}>
          <Text style={styles.loginPrompt}>
            Sudah punya akun?{' '}
          </Text>

          <TouchableOpacity
            onPress={() =>
              router.push('/public/login' as any)
            }
            disabled={isSubmitting}
          >
            <Text style={styles.loginLink}>
              Masuk
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* BOTTOM NAVIGATION */}
      <BottomNavBar
        activeTab={activeTab}
        onTabPress={handleTabPress}
      />
    </SafeAreaView>
  );
};

// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  safeHeaderArea: {
    backgroundColor: COLORS.surface,
    paddingTop:
      Platform.OS === 'android'
        ? StatusBar.currentHeight
        : 0,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.large,
    paddingVertical: SIZES.medium,
    height: 56,
  },

  backBtn: {
    padding: 4,
  },

  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: SIZES.medium,
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
    lineHeight: 20,
  },

  inputGroup: {
    marginBottom: SIZES.large,
  },

  inputLabel: {
    ...FONTS.labelMedium,
    color: COLORS.textPrimary,
    marginBottom: SIZES.small,
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

  phoneInputRow: {
    flexDirection: 'row',
  },

  countryCodeBox: {
    height: 48,
    width: 60,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRightWidth: 0,
    borderTopLeftRadius: SIZES.radiusMedium,
    borderBottomLeftRadius: SIZES.radiusMedium,
    justifyContent: 'center',
    alignItems: 'center',
  },

  countryCodeText: {
    ...FONTS.labelMedium,
    color: COLORS.textPrimary,
  },

  helperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },

  helperText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    flex: 1,
    lineHeight: 16,
  },

  validText: {
    ...FONTS.caption,
    color: COLORS.secondaryDark,
  },

  submitBtn: {
    flexDirection: 'row',
    height: 48,
    backgroundColor: COLORS.primaryLight,
    borderRadius: SIZES.radiusMedium,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SIZES.medium,
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

  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SIZES.large,
  },

  loginPrompt: {
    ...FONTS.body,
    color: COLORS.textSecondary,
  },

  loginLink: {
    ...FONTS.body,
    fontWeight: 'bold',
    color: COLORS.secondaryDark,
  },
});

export default Register;