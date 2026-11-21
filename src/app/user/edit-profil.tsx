
import React, { useState } from 'react';

import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import HeaderApp from '../../components/molecules/HeaderApp';
import ValidationMessage from '../../components/molecules/ValidationMessage';

import { COLORS, FONTS, SIZES } from '../../constants/theme';

import {
  validateFullName,
  validateWhatsApp,
} from '../../utils/formValidation';

import { useUserProfile } from '../../context/UserProfileContext';

export default function EditUserProfileScreen() {
  const router = useRouter();

  const {
    profile,
    updateProfile,
    loading: profileLoading,
  } = useUserProfile();

  const [fullName, setFullName] = useState(profile.fullName);
  const [phone, setPhone] = useState(profile.phone);

  const [touched, setTouched] = useState({
    fullName: false,
    phone: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  const fullNameError =
    touched.fullName || submitted
      ? validateFullName(fullName)
      : undefined;

  const phoneError =
    touched.phone || submitted
      ? validateWhatsApp(phone)
      : undefined;

  const fullNameValid =
    (touched.fullName || submitted) &&
    !validateFullName(fullName);

  const phoneValid =
    (touched.phone || submitted) &&
    !validateWhatsApp(phone);

  const handleSave = async () => {
    setSubmitted(true);

    setTouched({
      fullName: true,
      phone: true,
    });

    const nameValidation = validateFullName(fullName);
    const phoneValidation = validateWhatsApp(phone);

    if (nameValidation || phoneValidation) {
      Alert.alert(
        'Periksa Kembali Data',
        'Masih ada data profil yang perlu diperbaiki.',
      );
      return;
    }

    if (saving) return;

    try {
      setSaving(true);

      await updateProfile({
        fullName: fullName.trim(),
        phone: phone.trim(),
      });

      Alert.alert(
        'Berhasil',
        'Profil berhasil diperbarui.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ],
      );
    } catch (error: any) {
      console.error('Update profile error:', error);

      Alert.alert(
        'Gagal Memperbarui Profil',
        error?.message ||
          'Terjadi kesalahan saat memperbarui profil. Silakan coba kembali.',
      );
    } finally {
      setSaving(false);
    }
  };

  if (profileLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />

        <HeaderApp notificationCount={0} />

        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={COLORS.secondaryDark}
          />

          <Text style={styles.loadingText}>
            Memuat profil...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <HeaderApp notificationCount={0} />

      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        bottomOffset={30}
        extraKeyboardSpace={30}
      >
        <TouchableOpacity
          style={styles.backLink}
          onPress={() => router.back()}
          disabled={saving}
        >
          <Ionicons
            name="arrow-back"
            size={18}
            color={COLORS.secondaryDark}
          />

          <Text style={styles.backText}>
            Kembali ke Profil
          </Text>
        </TouchableOpacity>

        <Text style={styles.eyebrow}>
          PENGATURAN AKUN
        </Text>

        <Text style={styles.pageTitle}>
          Edit Profil
        </Text>

        <Text style={styles.pageSubtitle}>
          Perbarui nama dan nomor WhatsApp yang terhubung
          dengan riwayat penyewaanmu.
        </Text>

        {/* NAMA LENGKAP */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>
            Nama Lengkap
          </Text>

          <View
            style={[
              styles.inputBox,
              fullNameError && styles.inputBoxError,
              fullNameValid && styles.inputBoxValid,
            ]}
          >
            <Ionicons
              name="person-outline"
              size={20}
              color={
                fullNameError
                  ? COLORS.accentCritical
                  : fullNameValid
                    ? COLORS.success
                    : COLORS.textSecondary
              }
              style={styles.inputIcon}
            />

            <TextInput
              style={styles.textInput}
              value={fullName}
              onChangeText={(value) => {
                setFullName(value);

                setTouched((current) => ({
                  ...current,
                  fullName: true,
                }));
              }}
              onBlur={() =>
                setTouched((current) => ({
                  ...current,
                  fullName: true,
                }))
              }
              placeholder="Masukkan nama lengkap"
              placeholderTextColor={COLORS.textSecondary}
              autoCapitalize="words"
              autoCorrect={false}
              editable={!saving}
              returnKeyType="next"
            />
          </View>

          <ValidationMessage
            error={fullNameError}
            success={
              fullNameValid
                ? 'Nama lengkap valid.'
                : undefined
            }
          />
        </View>

        {/* NOMOR WHATSAPP */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>
            Nomor WhatsApp
          </Text>

          <View
            style={[
              styles.inputBox,
              phoneError && styles.inputBoxError,
              phoneValid && styles.inputBoxValid,
            ]}
          >
            <Ionicons
              name="call-outline"
              size={20}
              color={
                phoneError
                  ? COLORS.accentCritical
                  : phoneValid
                    ? COLORS.success
                    : COLORS.textSecondary
              }
              style={styles.inputIcon}
            />

            <TextInput
              style={styles.textInput}
              value={phone}
              onChangeText={(value) => {
                setPhone(value);

                setTouched((current) => ({
                  ...current,
                  phone: true,
                }));
              }}
              onBlur={() =>
                setTouched((current) => ({
                  ...current,
                  phone: true,
                }))
              }
              placeholder="Contoh: 081234567890"
              placeholderTextColor={COLORS.textSecondary}
              keyboardType="phone-pad"
              editable={!saving}
              returnKeyType="done"
            />
          </View>

          <ValidationMessage
            error={phoneError}
            success={
              phoneValid
                ? 'Nomor WhatsApp valid.'
                : undefined
            }
          />

          <Text style={styles.helperText}>
            Gunakan nomor WhatsApp aktif agar petugas dapat
            menghubungi kamu jika diperlukan.
          </Text>
        </View>

        {/* EMAIL */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>
            Email
          </Text>

          <View style={[styles.inputBox, styles.disabledInput]}>
            <Ionicons
              name="mail-outline"
              size={20}
              color={COLORS.textSecondary}
              style={styles.inputIcon}
            />

            <TextInput
              style={[styles.textInput, styles.disabledText]}
              value={profile.email}
              editable={false}
              placeholder="Email akun"
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>

          <Text style={styles.helperText}>
            Email tidak dapat diubah melalui halaman ini.
          </Text>
        </View>

        {/* SAVE BUTTON */}
        <TouchableOpacity
          style={[
            styles.saveButton,
            saving && styles.disabledButton,
          ]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.8}
        >
          {saving ? (
            <>
              <ActivityIndicator
                size="small"
                color={COLORS.textPrimary}
              />

              <Text style={styles.saveButtonText}>
                Menyimpan...
              </Text>
            </>
          ) : (
            <>
              <Ionicons
                name="save-outline"
                size={18}
                color={COLORS.textPrimary}
              />

              <Text style={styles.saveButtonText}>
                Simpan Perubahan
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* CANCEL BUTTON */}
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
          disabled={saving}
        >
          <Text style={styles.cancelButtonText}>
            Batal
          </Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    padding: SIZES.large,
    paddingBottom: 56,
    flexGrow: 1,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.large,
  },

  loadingText: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    marginTop: SIZES.medium,
  },

  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.large,
  },

  backText: {
    ...FONTS.labelMedium,
    color: COLORS.secondaryDark,
    marginLeft: 6,
  },

  eyebrow: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    letterSpacing: 1,
    marginBottom: SIZES.small,
  },

  pageTitle: {
    ...FONTS.headline1,
    color: COLORS.secondaryDark,
    marginBottom: 6,
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
    minHeight: 48,
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

  inputIcon: {
    marginRight: 10,
  },

  textInput: {
    flex: 1,
    ...FONTS.body,
    color: COLORS.textPrimary,
    paddingVertical: 10,
  },

  disabledInput: {
    backgroundColor: COLORS.background,
  },

  disabledText: {
    color: COLORS.textSecondary,
  },

  helperText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: 6,
    lineHeight: 17,
  },

  saveButton: {
    minHeight: 50,
    borderRadius: SIZES.radiusMedium,
    backgroundColor: COLORS.primaryLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: SIZES.small,
  },

  saveButtonText: {
    ...FONTS.labelMedium,
    color: COLORS.textPrimary,
  },

  disabledButton: {
    opacity: 0.6,
  },

  cancelButton: {
    alignItems: 'center',
    paddingVertical: SIZES.medium,
    marginTop: SIZES.small,
  },

  cancelButtonText: {
    ...FONTS.labelMedium,
    color: COLORS.textSecondary,
  },
});
