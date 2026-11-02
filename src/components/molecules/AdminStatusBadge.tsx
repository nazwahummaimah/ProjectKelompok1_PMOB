import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../../constants/theme';

type StatusValue = 'Tersedia' | 'Sedang Disewa' | 'Perawatan' | 'Menunggu Serah Terima' | 'Sedang Berlangsung' | 'Selesai' | 'Lunas' | 'Belum Lunas' | 'Menunggu' | 'Sedang Dikerjakan';

export default function AdminStatusBadge({ status }: { status: StatusValue | string }) {
  const success = ['Tersedia', 'Selesai', 'Lunas'].includes(status);
  const warning = ['Perawatan', 'Menunggu', 'Menunggu Serah Terima', 'Belum Lunas'].includes(status);
  const info = ['Sedang Disewa', 'Sedang Berlangsung', 'Sedang Dikerjakan'].includes(status);
  const backgroundColor = success ? '#DCFCE7' : warning ? '#FEF3C7' : info ? '#E0F2FE' : '#F1F5F9';
  const color = success ? '#15803D' : warning ? '#B45309' : info ? '#0369A1' : COLORS.textSecondary;
  return <View style={[styles.badge, { backgroundColor }]}><Text style={[styles.text, { color }]}>{status}</Text></View>;
}

const styles = StyleSheet.create({
  badge: { alignSelf: 'flex-start', borderRadius: 999, paddingHorizontal: 9, paddingVertical: 5 },
  text: { ...FONTS.caption, fontSize: 10, fontWeight: '700' },
});
