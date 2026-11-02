import React from 'react';
import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="inventaris" />
      <Stack.Screen name="detail-unit" />
      <Stack.Screen name="form-unit" />
      <Stack.Screen name="transaksi" />
      <Stack.Screen name="buat-transaksi" />
      <Stack.Screen name="detail-transaksi" />
      <Stack.Screen name="pengembalian" />
      <Stack.Screen name="pemeriksaan" />
      <Stack.Screen name="perawatan" />
      <Stack.Screen name="pengeluaran" />
      <Stack.Screen name="keuangan" />
      <Stack.Screen name="detail-laporan" />
      <Stack.Screen name="lainnya" />
    </Stack>
  );
}
