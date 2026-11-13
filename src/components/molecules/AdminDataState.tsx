import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

type AdminDataStateProps = {
  kind: 'loading' | 'error' | 'empty';
  title: string;
  description?: string;
  onRetry?: () => void | Promise<void>;
};

const ICONS = {
  error: 'alert-circle-outline',
  empty: 'file-tray-outline',
} as const;

export default function AdminDataState({
  kind,
  title,
  description,
  onRetry,
}: AdminDataStateProps) {
  return (
    <View style={styles.container}>
      {kind === 'loading' ? (
        <ActivityIndicator size="small" color={COLORS.secondaryDark} />
      ) : (
        <Ionicons
          name={ICONS[kind]}
          size={28}
          color={kind === 'error' ? '#B91C1C' : COLORS.textSecondary}
        />
      )}

      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}

      {kind === 'error' && onRetry ? (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Coba muat data kembali"
          style={styles.retryButton}
          onPress={() => { void onRetry(); }}
          activeOpacity={0.75}
        >
          <Ionicons name="refresh-outline" size={16} color={COLORS.secondaryDark} />
          <Text style={styles.retryText}>Coba lagi</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusLarge,
    paddingHorizontal: SIZES.large,
    paddingVertical: SIZES.xlarge,
    marginBottom: SIZES.large,
  },
  title: {
    ...FONTS.labelLarge,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginTop: SIZES.small,
  },
  description: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: SIZES.small,
  },
  retryButton: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SIZES.large,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusMedium,
    marginTop: SIZES.medium,
  },
  retryText: {
    ...FONTS.labelMedium,
    color: COLORS.secondaryDark,
    marginLeft: SIZES.small,
  },
});
