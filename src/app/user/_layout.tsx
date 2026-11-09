
import React from 'react';
import { Stack, Redirect } from 'expo-router';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../constants/theme';

export default function UserLayout() {
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

  if (profile.role !== 'user') {
    return <Redirect href="/admin" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="riwayat" />
      <Stack.Screen name="detail-riwayat" />
      <Stack.Screen name="profil" />
      <Stack.Screen name="edit-profil" />
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