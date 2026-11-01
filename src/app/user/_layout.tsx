import React from 'react';
import { Stack } from 'expo-router';
import { UserProfileProvider } from '../../context/UserProfileContext';

export default function UserLayout() {
  return (
    <UserProfileProvider>
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="riwayat" />
        <Stack.Screen name="detail-riwayat" />
        <Stack.Screen name="profil" />
        <Stack.Screen name="edit-profil" />
      </Stack>
    </UserProfileProvider>
  );
}
