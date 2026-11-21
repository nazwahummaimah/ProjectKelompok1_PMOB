
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';

type GoogleSignInButtonProps = {
  disabled?: boolean;
};

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  disabled = false,
}) => {
  const router = useRouter();
  const { signInWithGoogle } = useAuth();

  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    if (isLoading || disabled) return;

    try {
      setIsLoading(true);

      const profile = await signInWithGoogle();

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
    } catch (error: unknown) {
      console.error('Google sign-in error:', error);

      const message =
        error instanceof Error ? error.message : '';

      if (message === 'LOGIN_GOOGLE_CANCELLED') {
        // Pengguna membatalkan login.
        // Tidak perlu menampilkan pesan error.
        return;
      }

      Alert.alert(
        'Login Google Gagal',
        message ||
          'Terjadi kesalahan saat login menggunakan Google. Silakan coba kembali.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const buttonDisabled = disabled || isLoading;

  return (
    <View style={styles.container}>
      <View style={styles.separatorRow}>
        <View style={styles.separatorLine} />
        <Text style={styles.separatorText}>ATAU</Text>
        <View style={styles.separatorLine} />
      </View>

      <TouchableOpacity
        style={[
          styles.googleButton,
          buttonDisabled && styles.disabledButton,
        ]}
        activeOpacity={0.8}
        onPress={handleGoogleSignIn}
        disabled={buttonDisabled}
      >
        {isLoading ? (
          <ActivityIndicator
            size="small"
            color={COLORS.textPrimary}
          />
        ) : (
          <>
            <Ionicons
              name="logo-google"
              size={20}
              color="#4285F4"
              style={styles.googleIcon}
            />

            <Text style={styles.googleButtonText}>
              Lanjutkan dengan Google
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: SIZES.large,
  },

  separatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },

  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },

  separatorText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginHorizontal: SIZES.medium,
  },

  googleButton: {
    flexDirection: 'row',
    height: 48,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },

  googleIcon: {
    marginRight: 10,
  },

  googleButtonText: {
    ...FONTS.labelMedium,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },

  disabledButton: {
    opacity: 0.6,
  },
});

export default GoogleSignInButton;