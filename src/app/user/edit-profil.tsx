
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

  const validation = {
    fullName: validateFullName(fullName),
    phone: validateWhatsApp(phone),
  };

  const show = (field: keyof typeof touched) =>
    touched[field] || submitted;

  // ===================================================
  // SAVE PROFILE
  // ===================================================

  const handleSave = async () => {
    setSubmitted(true);

    setTouched({
      fullName: true,
      phone: true,
    });

    if (validation.fullName || validation.phone) {
      Alert.alert(
        'Periksa Kembali Data',
        'Masih ada kolom yang perlu diperbaiki.',
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
        'Profil Diperbarui',
        'Perubahan profil berhasil disimpan ke database.',
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
          'Terjadi kesalahan ketika menyimpan profil.',
      );
    } finally {
      setSaving(false);
    }
  };

  // ===================================================
  // LOADING
  // ===================================================

  if (profileLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />

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

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
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

        <View style={styles.formCard}>
          {/* FULL NAME */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Nama Lengkap
            </Text>

            <View
              style={[
                styles.inputWrap,
                show('fullName') &&
                  validation.fullName &&
                  styles.inputError,
                show('fullName') &&
                  !validation.fullName &&
                  styles.inputValid,
              ]}
            >
              <Ionicons
                name="person-outline"
                size={19}
                color={COLORS.textSecondary}
              />

              <TextInput
                style={styles.input}
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
                editable={!saving}
              />
            </View>

            <ValidationMessage
              error={
                show('fullName')
                  ? validation.fullName
                  : undefined
              }
              success={
                show('fullName') && !validation.fullName
                  ? 'Nama lengkap valid.'
                  : undefined
              }
            />
          </View>

          {/* EMAIL */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>

            <View
              style={[
                styles.inputWrap,
                styles.disabledInput,
              ]}
            >
              <Ionicons
                name="mail-outline"
                size={19}
                color={COLORS.textSecondary}
              />

              <TextInput
                style={styles.input}
                value={profile.email}
                editable={false}
              />

              <Ionicons
                name="lock-closed-outline"
                size={16}
                color={COLORS.textSecondary}
              />
            </View>

            <Text style={styles.helperText}>
              Email digunakan sebagai identitas login dan
              belum dapat diubah melalui halaman ini.
            </Text>
          </View>

          {/* PHONE */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Nomor WhatsApp
            </Text>

            <View
              style={[
                styles.inputWrap,
                show('phone') &&
                  validation.phone &&
                  styles.inputError,
                show('phone') &&
                  !validation.phone &&
                  styles.inputValid,
              ]}
            >
              <Ionicons
                name="logo-whatsapp"
                size={19}
                color={COLORS.textSecondary}
              />

              <TextInput
                style={styles.input}
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
                placeholder="08xxxxxxxxxx atau +628xxxxxxxxxx"
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="phone-pad"
                editable={!saving}
              />
            </View>

            <ValidationMessage
              error={
                show('phone')
                  ? validation.phone
                  : undefined
              }
              success={
                show('phone') && !validation.phone
                  ? 'Nomor WhatsApp valid.'
                  : undefined
              }
            />
          </View>

          {/* SAVE BUTTON */}
          <TouchableOpacity
            style={[
              styles.saveButton,
              saving && styles.disabledButton,
            ]}
            activeOpacity={0.85}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator
                color={COLORS.textPrimary}
              />
            ) : (
              <>
                <Text style={styles.saveButtonText}>
                  Simpan Perubahan
                </Text>

                <Ionicons
                  name="checkmark-circle-outline"
                  size={19}
                  color={COLORS.textPrimary}
                />
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SIZES.large,
    paddingBottom: SIZES.xxlarge,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SIZES.medium,
  },
  loadingText: {
    ...FONTS.body,
    color: COLORS.textSecondary,
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    marginBottom: SIZES.large,
  },
  backText: {
    ...FONTS.labelMedium,
    color: COLORS.secondaryDark,
  },
  eyebrow: {
    ...FONTS.caption,
    color: COLORS.secondaryDark,
    fontWeight: '700',
    letterSpacing: 1.1,
    marginBottom: 5,
  },
  pageTitle: {
    ...FONTS.headline1,
    color: COLORS.textPrimary,
  },
  pageSubtitle: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    marginTop: 5,
    marginBottom: SIZES.large,
    lineHeight: 21,
  },
  formCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusLarge,
    padding: SIZES.large,
  },
  inputGroup: {
    marginBottom: SIZES.large,
  },
  label: {
    ...FONTS.labelMedium,
    color: COLORS.textPrimary,
    marginBottom: SIZES.small,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 50,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusMedium,
    paddingHorizontal: SIZES.medium,
    backgroundColor: COLORS.surface,
    gap: 10,
  },
  input: {
    flex: 1,
    color: COLORS.textPrimary,
    ...FONTS.body,
    paddingVertical: 12,
  },
  inputError: {
    borderColor: COLORS.accentCritical,
  },
  inputValid: {
    borderColor: COLORS.success,
  },
  disabledInput: {
    backgroundColor: '#F1F5F9',
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