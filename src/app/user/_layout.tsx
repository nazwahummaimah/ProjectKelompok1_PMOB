import React from 'react';
import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function UserLayout() {
  const { user, profile, loading } = useAuth();
  if (loading) return <View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator size="large" /></View>;
  if (!user) return <Redirect href="/public/login" />;
  if (profile?.role === 'admin') return <Redirect href="/admin" />;
  if (!profile) return <Redirect href="/public/login" />;

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="riwayat" />
      <Stack.Screen name="detail-riwayat" />
      <Stack.Screen name="profil" />
      <Stack.Screen name="edit-profil" />
    </Stack>
  );
}
