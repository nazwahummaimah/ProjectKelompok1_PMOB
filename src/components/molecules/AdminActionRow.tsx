import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

interface Props { title: string; subtitle?: string; icon: keyof typeof Ionicons.glyphMap; onPress: () => void; rightText?: string; }
export default function AdminActionRow({ title, subtitle, icon, onPress, rightText }: Props) {
  return (
    <TouchableOpacity style={styles.row} activeOpacity={0.75} onPress={onPress}>
      <View style={styles.iconWrap}><Ionicons name={icon} size={20} color={COLORS.secondaryDark} /></View>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {rightText ? <Text style={styles.rightText}>{rightText}</Text> : <Ionicons name="chevron-forward" size={18} color={COLORS.textSecondary} />}
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: SIZES.radiusMedium, padding: 12, marginBottom: 9 },
  iconWrap: { width: 38, height: 38, borderRadius: 11, backgroundColor: '#E0F2FE', alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  copy: { flex: 1 }, title: { ...FONTS.labelMedium, color: COLORS.textPrimary }, subtitle: { ...FONTS.caption, color: COLORS.textSecondary, marginTop: 2 }, rightText: { ...FONTS.caption, color: COLORS.secondaryDark, fontWeight: '700' },
});
