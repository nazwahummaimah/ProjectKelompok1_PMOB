// app/public/SplashScreenPublic.tsx
import React, { useEffect, useRef } from 'react';
import { 
  SafeAreaView, 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  Animated 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../constants/theme';

interface SplashScreenProps {
  onFinish?: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  // Animasi Fade-In & Scale Up untuk Logo
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Timer simulasi berpindah ke halaman utama (misal 2.5 detik)
    const timer = setTimeout(() => {
      if (onFinish) {
        onFinish();
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, onFinish]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Container Tengah untuk Logo & Brand */}
      <Animated.View 
        style={[
          styles.contentContainer, 
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
        ]}
      >
        {/* Logo Icon Box (Sesuai screen_logo.png) */}
        <View style={styles.logoCard}>
          <Ionicons name="bicycle" size={64} color={COLORS.secondaryDark} />
        </View>

        {/* Brand Text Header */}
        <View style={styles.textContainer}>
          <Text style={styles.brandTitleMain}>MAS JOKO</Text>
          <Text style={styles.brandTitleSub}>RENTAL SEPEDA</Text>
          <Text style={styles.taglineText}>Mudah • Cepat • Jelas</Text>
        </View>
      </Animated.View>

      {/* Area Bawah: Loading Indicator & Footer Badge */}
      <View style={styles.footerContainer}>
        <ActivityIndicator size="small" color={COLORS.secondaryDark} style={styles.spinner} />
        
        <View style={styles.footerBadge}>
          <Ionicons name="location-outline" size={14} color={COLORS.secondaryDark} style={{ marginRight: 4 }} />
          <Text style={styles.footerBadgeText}>Pos Rental Sepeda Resmi • Jogja</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background, // Canvas #F8FAFC
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.xxlarge,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.large,
  },
  logoCard: {
    width: 120,
    height: 120,
    borderRadius: 28,
    backgroundColor: COLORS.primaryLight, // #38BDF8
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.large,
    shadowColor: COLORS.secondaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  textContainer: {
    alignItems: 'center',
  },
  brandTitleMain: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.secondaryDark, // #075985
    letterSpacing: 1.5,
  },
  brandTitleSub: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0284C7',
    letterSpacing: 2,
    marginTop: -2,
    marginBottom: SIZES.small,
  },
  taglineText: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  footerContainer: {
    alignItems: 'center',
    paddingBottom: SIZES.large,
  },
  spinner: {
    marginBottom: SIZES.medium,
  },
  footerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: SIZES.radiusPill,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  footerBadgeText: {
    ...FONTS.caption,
    color: COLORS.secondaryDark,
    fontWeight: '600',
  },
});

export default SplashScreen;