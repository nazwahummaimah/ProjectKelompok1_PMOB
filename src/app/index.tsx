import React, { useEffect } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import JamalJepretLogo from '../components/molecules/JamalJepretLogo';
import { COLORS, SIZES } from '../constants/theme';

export default function SplashScreen() {
  useEffect(() => {
    const timer = setTimeout(() => router.replace('/public'), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View accessible accessibilityRole="image" accessibilityLabel="Logo Jamal Jepret">
          <JamalJepretLogo width={210} />
        </View>
      </View>
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={COLORS.secondaryDark} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.xxlarge,
  },
  content: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SIZES.large,
  },
  footer: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: SIZES.large,
  },
});
