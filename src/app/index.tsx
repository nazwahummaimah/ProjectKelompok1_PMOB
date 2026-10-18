
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const C = {
  green: '#16833B',
  darkGreen: '#07532C',
  deepGreen: '#064426',
  lightGreen: '#E8F6EC',
  paleGreen: '#F1FAF3',
  white: '#FFFFFF',
  secondary: '#61766A',
};

export default function SplashScreen() {
  const router = useRouter();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const loadingAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const entranceAnimation = Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 50,
        useNativeDriver: true,
      }),
      Animated.timing(loadingAnim, {
        toValue: 1,
        duration: 2500,
        useNativeDriver: false,
      }),
    ]);

    entranceAnimation.start();

    const timer = setTimeout(() => {
      router.replace('/public');
    }, 3000);

    return () => {
      clearTimeout(timer);
      entranceAnimation.stop();
    };
  }, [fadeAnim, scaleAnim, loadingAnim, router]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={C.paleGreen}
      />

      <View style={styles.container}>
        <View style={styles.decorCircleTop} />
        <View style={styles.decorCircleBottom} />

        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.logoOuter}>
            <View style={styles.logoInner}>
              <MaterialCommunityIcons
                name="bicycle"
                size={76}
                color={C.green}
              />
            </View>
          </View>

          <Text style={styles.brandName}>Jamal Jepret</Text>
          <Text style={styles.brandLocation}>PERJUANGAN</Text>

          <View style={styles.divider} />

          <Text style={styles.tagline}>
            Temukan pengalaman{'\n'}bersepeda yang menyenangkan
          </Text>

          <View style={styles.features}>
            <View style={styles.featureItem}>
              <MaterialCommunityIcons
                name="bike-fast"
                size={19}
                color={C.green}
              />
              <Text style={styles.featureText}>Pilihan Sepeda</Text>
            </View>

            <View style={styles.featureDot} />

            <View style={styles.featureItem}>
              <MaterialCommunityIcons
                name="cash-check"
                size={19}
                color={C.green}
              />
              <Text style={styles.featureText}>Tarif Terjangkau</Text>
            </View>
          </View>
        </Animated.View>

        <View style={styles.bottom}>
          <View style={styles.loadingTrack}>
            <Animated.View
              style={[
                styles.loadingBar,
                {
                  width: loadingAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>

          <Text style={styles.loadingText}>
            Menyiapkan pengalaman bersepeda...
          </Text>

          <Text style={styles.copyright}>
            © 2026 Jamal Jepret Perjuangan
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: C.paleGreen,
  },
  container: {
    flex: 1,
    backgroundColor: C.paleGreen,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    paddingHorizontal: 24,
  },
  decorCircleTop: {
    position: 'absolute',
    width: 290,
    height: 290,
    borderRadius: 145,
    backgroundColor: '#E2F3E6',
    top: -125,
    right: -115,
  },
  decorCircleBottom: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#E2F3E6',
    bottom: -105,
    left: -105,
  },
  content: {
    alignItems: 'center',
    width: '100%',
    marginBottom: 35,
  },
  logoOuter: {
    width: 148,
    height: 148,
    borderRadius: 74,
    backgroundColor: '#D5EFD9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 27,
  },
  logoInner: {
    width: 118,
    height: 118,
    borderRadius: 59,
    backgroundColor: C.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#C6E7CE',
  },
  brandName: {
    fontSize: 31,
    fontWeight: '900',
    color: C.deepGreen,
    letterSpacing: -0.7,
  },
  brandLocation: {
    fontSize: 12,
    fontWeight: '800',
    color: C.green,
    letterSpacing: 5,
    marginTop: 7,
  },
  divider: {
    width: 55,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#A7D8B4',
    marginVertical: 22,
  },
  tagline: {
    fontSize: 16,
    lineHeight: 25,
    color: C.secondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  features: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 28,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featureText: {
    color: C.darkGreen,
    fontSize: 11,
    fontWeight: '700',
  },
  featureDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#A7C8AF',
  },
  bottom: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    alignItems: 'center',
  },
  loadingTrack: {
    width: 150,
    height: 4,
    backgroundColor: '#D8EBDD',
    borderRadius: 4,
    overflow: 'hidden',
  },
  loadingBar: {
    height: '100%',
    backgroundColor: C.green,
    borderRadius: 4,
  },
  loadingText: {
    fontSize: 11,
    color: C.secondary,
    marginTop: 12,
  },
  copyright: {
    fontSize: 10,
    color: '#8AA092',
    marginTop: 18,
  },
});
