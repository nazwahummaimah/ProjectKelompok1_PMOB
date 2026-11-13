
import React, { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import AdminPageLayout from '../../components/organisms/AdminPageLayout';
import ValidationMessage from '../../components/molecules/ValidationMessage';

import { COLORS, FONTS, SIZES } from '../../constants/theme';

import {
  validateFullName,
  validateWhatsApp,
} from '../../utils/formValidation';

import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

export default function AdminEditProfileScreen() {
  const router = useRouter();

  const {
    user,
    profile,
    loading: authLoading,
    refreshProfile,
  } = useAuth();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  const [touched, setTouched] = useState({
    fullName: false,
    phone: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  // ===================================================
  // SYNC DATA PROFIL
  // ===================================================

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
    }
  }, [profile]);

  // ===================================================
  // VALIDATION
  // ===================================================

  const validation = {
    fullName: validateFullName(fullName),
    phone: validateWhatsApp(phone),
  };

  const show = (field: keyof typeof touched) =>
    touched[field] || submitted;

  const markTouched = (
    field: keyof typeof touched,
  ) => {
    setTouched((current) => ({
      ...current,
      [field]: true,
    }));
  };

  // ===================================================
  // SAVE PROFILE
  // ===================================================

  const handleSave = async () => {
    if (saving) return;

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

    if (!user || !profile) {
      Alert.alert(
        'Profil Tidak Ditemukan',
        'Silakan login kembali atau coba muat ulang halaman.',
      );
      return;
    }

    try {
      setSaving(true);

      const updatedData = {
        full_name: fullName.trim(),
        phone: phone.trim(),
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .update(updatedData)
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      // Sinkronisasi profil pada AuthContext.
      await refreshProfile();

      Alert.alert(
        'Profil Berhasil Diperbarui',
        'Perubahan nama dan nomor WhatsApp Admin berhasil disimpan.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ],
      );
    } catch (error: unknown) {
      console.error('Admin update profile error:', error);

      Alert.alert(
        'Gagal Memperbarui Profil',
        error instanceof Error
          ? error.message
          : 'Terjadi kesalahan ketika menyimpan profil.',
      );
    } finally {
      setSaving(false);
    }
  };

  // ===================================================
  // LOADING
  // ===================================================

  if (authLoading) {
    return (
      <AdminPageLayout
        title="Edit Profil"
        subtitle="Perbarui informasi akun Admin."
        activeTab="Lainnya"
        showBottomNav
        showBack
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={COLORS.secondaryDark}
          />

          <Text style={styles.loadingText}>
            Memuat profil Admin...
          </Text>
        </View>
      </AdminPageLayout>
    );
  }

  // ===================================================
  // PROFILE NOT FOUND
  // ===================================================

  if (!user || !profile) {
    return (
      <AdminPageLayout
        title="Edit Profil"
        subtitle="Perbarui informasi akun Admin."
        activeTab="Lainnya"
        showBottomNav
        showBack
      >
        <View style={styles.stateContainer}>
          <Ionicons
            name="person-circle-outline"
            size={52}
            color={COLORS.textSecondary}
          />

          <Text style={styles.stateTitle}>
            Profil Tidak Ditemukan
          </Text>

          <Text style={styles.helperText}>
            Data profil Admin belum tersedia. Silakan
            coba kembali atau login ulang.
          </Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={async () => {
              try {
                await refreshProfile();
              } catch (error) {
                Alert.alert(
                  'Gagal Memuat Profil',
                  error instanceof Error
                    ? error.message
                    : 'Terjadi kesalahan.',
                );
              }
            }}
          >
            <Text style={styles.retryButtonText}>
              Coba Muat Ulang
            </Text>
          </TouchableOpacity>
        </View>
      </AdminPageLayout>
    );
  }

  // ===================================================
  // MAIN SCREEN
  // ===================================================

  return (
    <AdminPageLayout
      title="Edit Profil"
      subtitle="Perbarui informasi akun Admin Jamal Jepret."
      activeTab="Lainnya"
      showBottomNav
      showBack
    >
      {/* INFORMASI AKUN */}
      <View style={styles.accountCard}>
        <View style={styles.avatar}>
          <Ionicons
            name="person"
            size={30}
            color={COLORS.secondaryDark}
          />
        </View>

        <View style={styles.accountInfo}>
          <Text style={styles.accountLabel}>
            AKUN ADMIN
          </Text>

          <Text style={styles.accountName}>
            {profile.full_name}
          </Text>

          <Text style={styles.accountEmail}>
            {profile.email}
          </Text>
        </View>
      </View>

      {/* FORM */}
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>
          Informasi Pribadi
        </Text>

        <Text style={styles.formSubtitle}>
          Pastikan informasi kontak Admin selalu aktif
          dan dapat dihubungi.
        </Text>

        {/* NAMA LENGKAP */}
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
              onChangeText={setFullName}
              onBlur={() => markTouched('fullName')}
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
          <Text style={styles.label}>
            Email
          </Text>

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
              selectTextOnFocus={false}
            />

            <Ionicons
              name="lock-closed-outline"
              size={16}
              color={COLORS.textSecondary}
            />
          </View>

          <Text style={styles.helperText}>
            Email merupakan identitas login Admin dan
            tidak dapat diubah melalui halaman ini.
          </Text>
        </View>

        {/* NOMOR WHATSAPP */}
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
              onChangeText={setPhone}
              onBlur={() => markTouched('phone')}
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
    </AdminPageLayout>
  );
}

// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    minHeight: 250,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SIZES.medium,
  },

  loadingText: {
    ...FONTS.body,
    color: COLORS.textSecondary,
  },

  stateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.large,
    minHeight: 250,
  },

  stateTitle: {
    ...FONTS.headline3,
    color: COLORS.textPrimary,
    marginTop: SIZES.medium,
    textAlign: 'center',
  },

  helperText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: 6,
    lineHeight: 18,
  },

  retryButton: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SIZES.large,
    paddingVertical: SIZES.medium,
    borderRadius: SIZES.radiusMedium,
    marginTop: SIZES.large,
  },

  retryButtonText: {
    ...FONTS.labelMedium,
    color: COLORS.textPrimary,
  },

  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    borderRadius: SIZES.radiusLarge,
    padding: SIZES.medium,
    marginBottom: SIZES.large,
    gap: 12,
  },

  avatar: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  accountInfo: {
    flex: 1,
  },

  accountLabel: {
    ...FONTS.caption,
    color: COLORS.secondaryDark,
    fontWeight: '700',
    letterSpacing: 1,
  },

  accountName: {
    ...FONTS.labelLarge,
    color: COLORS.textPrimary,
    marginTop: 3,
  },

  accountEmail: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: 3,
  },

  formCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusLarge,
    padding: SIZES.large,
    marginBottom: SIZES.large,
  },

  formTitle: {
    ...FONTS.headline3,
    color: COLORS.textPrimary,
  },

  formSubtitle: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginTop: 5,
    marginBottom: SIZES.large,
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
