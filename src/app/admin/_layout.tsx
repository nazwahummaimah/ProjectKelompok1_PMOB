
import React from 'react';
<<<<<<< HEAD
import { Stack, Redirect } from 'expo-router';
import {
  ActivityIndicator,
  View,
  StyleSheet,
} from 'react-native';

import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../constants/theme';
=======
import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
>>>>>>> 8e11d31070a99647ff703eaa542824a5f5cc1ce8

export default function AdminLayout() {
  const { user, profile, loading } = useAuth();

<<<<<<< HEAD
  if (loading || (user && !profile)) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={COLORS.secondaryDark}
        />
=======
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
>>>>>>> 8e11d31070a99647ff703eaa542824a5f5cc1ce8
      </View>
    );
  }

<<<<<<< HEAD
  if (!user || !profile) {
    return <Redirect href="/public/login" />;
  }

  if (profile.role !== 'admin') {
=======
  if (!user) {
    return <Redirect href="/public/login" />;
  }

  if (profile?.role !== 'admin') {
>>>>>>> 8e11d31070a99647ff703eaa542824a5f5cc1ce8
    return <Redirect href="/user" />;
  }

  return (
<<<<<<< HEAD
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
=======
    <Stack screenOptions={{ headerShown: false }}>
>>>>>>> 8e11d31070a99647ff703eaa542824a5f5cc1ce8
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