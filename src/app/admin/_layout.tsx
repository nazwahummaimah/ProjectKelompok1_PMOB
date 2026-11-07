import React from 'react';
import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/public/login" />;
  }

  if (profile?.role !== 'admin') {
    return <Redirect href="/user" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
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
