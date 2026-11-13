
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { COLORS, SIZES, FONTS } from '../../constants/theme';
import BottomNavBar, {
  TabType,
  UserTabType,
} from '../../components/molecules/BottomNavBar';
import { getPublicBikeQrInfo } from '../../services/publicBikeQrService';

const DurasiSewa: React.FC = () => {
  const router = useRouter();
  const [isFocused, setIsFocused] = useState(false);
  const params = useLocalSearchParams<{ source?: string }>();
  const isUserFlow = params.source === 'user';

  const [permission, requestPermission] = useCameraPermissions();
  const [activeTab, setActiveTab] = useState<TabType>('DurasiSewa');
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [scanError, setScanError] = useState('');
  const scannedRef = useRef(false);

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      scannedRef.current = false;
      setProcessing(false);
      setTorchEnabled(false);
      setScanError('');

      return () => {
        setIsFocused(false);
        scannedRef.current = false;
        setProcessing(false);
        setTorchEnabled(false);
        setScanError('');
      };
    }, [])
  );

  const handleBarcodeScanned = async ({
    data,
  }: {
    data: string;
    type: string;
  }) => {
    if (scannedRef.current || processing) return;

    scannedRef.current = true;
    setProcessing(true);
    setScanError('');

    try {
      const bike = await getPublicBikeQrInfo(data);

      router.push({
        pathname: '/public/hasil-scan',
        params: {
          bikeId: bike.bike_id,
          source: isUserFlow ? 'user' : 'public',
        },
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'QR Code tidak dapat dibaca.';

      setScanError(message);
      setProcessing(false);
      scannedRef.current = false;
    }
  };

  const handleTabPress = (tab: TabType) => {
    setActiveTab(tab);

    switch (tab) {
      case 'Beranda':
        router.push('/public/' as any);
        break;
      case 'Katalog':
        router.push('/public/katalog' as any);
        break;
      case 'DurasiSewa':
        break;
      case 'Login':
        router.push('/public/login' as any);
        break;
    }
  };

  const handleUserTabPress = (tab: UserTabType) => {
    switch (tab) {
      case 'Beranda':
        router.push('/user' as any);
        break;
      case 'Riwayat':
        router.push('/user/riwayat' as any);
        break;
      case 'Scan':
        break;
      case 'Profil':
        router.push('/user/profil' as any);
        break;
    }
  };

  const resetScanner = () => {
    scannedRef.current = false;
    setProcessing(false);
    setScanError('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.safeHeaderArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Kembali"
          >
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Pindai QR Sepeda</Text>

          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => setTorchEnabled((value) => !value)}
            disabled={!permission?.granted || !isFocused}
            accessibilityRole="button"
            accessibilityLabel={torchEnabled ? 'Matikan lampu kamera' : 'Nyalakan lampu kamera'}
            accessibilityState={{ disabled: !permission?.granted || !isFocused, checked: torchEnabled }}
          >
            <Ionicons
              name={torchEnabled ? 'flash' : 'flash-outline'}
              size={22}
              color={torchEnabled ? '#FACC15' : '#FFFFFF'}
            />
          </TouchableOpacity>
        </View>
      </View>

      {!permission ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={COLORS.primaryLight} />
          <Text style={styles.stateText}>Memeriksa izin kamera...</Text>
        </View>
      ) : !permission.granted ? (
        <View style={styles.centerState}>
          <Ionicons
            name="camera-outline"
            size={54}
            color={COLORS.primaryLight}
          />
          <Text style={styles.stateTitle}>Izin Kamera Dibutuhkan</Text>
          <Text style={styles.stateText}>
            Izinkan akses kamera agar aplikasi dapat memindai QR Code sepeda.
          </Text>

          <TouchableOpacity
            style={styles.permissionButton}
            onPress={() => {
              if (permission.canAskAgain) {
                void requestPermission();
              } else {
                void Linking.openSettings();
              }
            }}
            accessibilityRole="button"
            accessibilityLabel={permission.canAskAgain ? 'Izinkan akses kamera' : 'Buka pengaturan aplikasi'}
          >
            <Text style={styles.permissionButtonText}>
              {permission.canAskAgain ? 'Izinkan Kamera' : 'Buka Pengaturan'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : !isFocused ? (
        <View style={styles.centerState}>
          <Text style={styles.stateText}>Kamera dijeda.</Text>
        </View>
      ) : (
        <View style={styles.cameraArea}>
          <View style={styles.cameraFrame}>
            <CameraView
              style={StyleSheet.absoluteFill}
              facing="back"
              enableTorch={torchEnabled}
              onBarcodeScanned={
                scannedRef.current || processing
                  ? undefined
                  : handleBarcodeScanned
              }
              barcodeScannerSettings={{
                barcodeTypes: ['qr'],
              }}
            />

            <View pointerEvents="none" style={styles.overlay}>
              <View style={styles.scanTargetFrame}>
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
              </View>
            </View>

            {processing && (
              <View style={styles.processingOverlay}>
                <ActivityIndicator size="large" color="#FFFFFF" />
                <Text style={styles.processingText}>
                  Membaca informasi sepeda...
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.instructionText}>
            Arahkan kamera ke QR Code yang terpasang pada stang atau rangka
            sepeda.
          </Text>

          {scanError ? (
            <View style={styles.errorBox}>
              <Ionicons
                name="alert-circle-outline"
                size={20}
                color="#FCA5A5"
              />
              <Text style={styles.errorText}>{scanError}</Text>
              <TouchableOpacity
                onPress={resetScanner}
                style={styles.retryButton}
                accessibilityRole="button"
                accessibilityLabel="Pindai QR sekali lagi"
              >
                <Text style={styles.retryText}>Coba Lagi</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.infoCallout}>
              <Ionicons
                name="information-circle-outline"
                size={18}
                color={COLORS.primaryLight}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.infoCalloutText}>
                Pindai QR untuk melihat detail dan status unit sepeda.
              </Text>
            </View>
          )}
        </View>
      )}

      {isUserFlow ? (
        <BottomNavBar
          variant="user"
          activeTab="Scan"
          onTabPress={handleUserTabPress}
        />
      ) : (
        <BottomNavBar
          activeTab={activeTab}
          onTabPress={handleTabPress}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  safeHeaderArea: {
    backgroundColor: '#1E293B',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.large,
    paddingVertical: SIZES.medium,
    height: 56,
  },
  headerTitle: {
    ...FONTS.headline3,
    color: '#FFFFFF',
  },
  headerBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  cameraArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.large,
  },
  cameraFrame: {
    width: '100%',
    maxWidth: 280,
    aspectRatio: 280 / 340,
    overflow: 'hidden',
    borderRadius: 20,
    backgroundColor: '#020617',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanTargetFrame: {
    width: 230,
    height: 230,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 34,
    height: 34,
    borderColor: '#38BDF8',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 12,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 12,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 12,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 12,
  },
  processingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.82)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  processingText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  instructionText: {
    ...FONTS.body,
    color: '#F8FAFC',
    textAlign: 'center',
    marginTop: SIZES.xlarge,
    marginBottom: SIZES.large,
    lineHeight: 22,
  },
  infoCallout: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: SIZES.radiusMedium,
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: SIZES.large,
    paddingVertical: SIZES.medium,
  },
  infoCalloutText: {
    ...FONTS.caption,
    color: '#94A3B8',
    flex: 1,
  },
  centerState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  stateTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 18,
    marginBottom: 8,
  },
  stateText: {
    color: '#CBD5E1',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 21,
    marginTop: 12,
  },
  permissionButton: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  errorBox: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#7F1D1D',
    borderRadius: 12,
    padding: 14,
  },
  errorText: {
    color: '#FEE2E2',
    flex: 1,
    fontSize: 12,
  },
  retryButton: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '700',
    padding: 4,
  },
});

export default DurasiSewa;
