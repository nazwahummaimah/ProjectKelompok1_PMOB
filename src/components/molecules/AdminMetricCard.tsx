import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

interface Props { label: string; value: string | number; icon: keyof typeof Ionicons.glyphMap; tone?: 'blue' | 'green' | 'orange' | 'red'; }
export default function AdminMetricCard({ label, value, icon, tone = 'blue' }: Props) {
  const palettes = {
    blue: { bg: '#E0F2FE', icon: '#075985' },
    green: { bg: '#DCFCE7', icon: '#15803D' },
    orange: { bg: '#FEF3C7', icon: '#B45309' },
    red: { bg: '#FEE2E2', icon: '#B91C1C' },
  };
  return (
    <View style={styles.card}>
      <View style={[styles.iconWrap, { backgroundColor: palettes[tone].bg }]}>
        <Ionicons name={icon} size={18} color={palettes[tone].icon} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  card: { flex: 1, minWidth: 0, backgroundColor: COLORS.surface, borderRadius: SIZES.radiusLarge, padding: 12, borderWidth: 1, borderColor: COLORS.border },
  iconWrap: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  value: { ...FONTS.headline2, color: COLORS.textPrimary },
  label: { ...FONTS.caption, color: COLORS.textSecondary, marginTop: 2 },
});
