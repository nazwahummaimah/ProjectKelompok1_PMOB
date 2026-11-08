import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from '../context/AuthContext';
import { AdminProvider } from '../context/AdminContext';
import { UserProfileProvider } from '../context/UserProfileContext';

export const unstable_settings = {
  anchor: 'index',
};

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AdminProvider>
          <UserProfileProvider>
            <Stack
              screenOptions={{
                headerShown: false,
                animation: 'fade',
              }}
            >
              <Stack.Screen name="index" />
              <Stack.Screen name="public" />
              <Stack.Screen name="user" />
              <Stack.Screen name="admin" />
            </Stack>
          </UserProfileProvider>
        </AdminProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}