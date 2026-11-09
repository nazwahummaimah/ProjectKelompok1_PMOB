
import React from 'react';
import { Stack, Redirect } from 'expo-router';
import {
  ActivityIndicator,
  View,
  StyleSheet,
} from 'react-native';

import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../constants/theme';

export default function AdminLayout() {
  const { user, profile, loading } = useAuth();

  if (loading || (user && !profile)) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={COLORS.secondaryDark}
        />
      </View>
    );
  }

  if (!user || !profile) {
    return <Redirect href="/public/login" />;
  }

  if (profile.role !== 'admin') {
    return <Redirect href="/user" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
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

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
});
