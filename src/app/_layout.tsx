import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

<<<<<<< HEAD
import { AuthProvider } from '../context/AuthContext';
=======
>>>>>>> 8e11d31070a99647ff703eaa542824a5f5cc1ce8
import { AdminProvider } from '../context/AdminContext';
import { UserProfileProvider } from '../context/UserProfileContext';
import { AuthProvider } from '../context/AuthContext';

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