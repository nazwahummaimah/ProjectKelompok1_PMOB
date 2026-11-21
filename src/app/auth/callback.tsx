
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AuthCallbackScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ActivityIndicator size="large" color="#16A34A" />

        <Text style={styles.title}>
          Menyelesaikan autentikasi
        </Text>

        <Text style={styles.description}>
          Mohon tunggu, kami sedang menghubungkan akun Google
          dengan Jamal Jepret.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  title: {
    marginTop: 24,
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  description: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 22,
    color: '#6B7280',
    textAlign: 'center',
  },
});
