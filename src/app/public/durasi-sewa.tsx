// app/public/durasi-sewa.tsx
import React, { useState } from 'react';
import { 
  SafeAreaView, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Platform,
  StatusBar 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { COLORS, SIZES, FONTS } from '../../constants/theme';
import BottomNavBar, { TabType, UserTabType } from '../../components/molecules/BottomNavBar';

const DurasiSewa: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ source?: string }>();
  const isUserFlow = params.source === 'user';
  const [activeTab, setActiveTab] = useState<TabType>('DurasiSewa');
  const [stateView, setStateView] = useState<'Scan' | 'Sukses' | 'Gagal' | 'Izin'>('Scan');

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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Top Header Dark Bar dengan Safe Area Fix */}
      <View style={styles.safeHeaderArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pindai QR Sepeda</Text>
          <TouchableOpacity style={styles.headerBtn}>
            <Ionicons name="flash-outline" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* State View Switcher Bar */}
        <View style={styles.stateSwitcherBar}>
          <Text style={styles.stateLabel}>State View:</Text>
          <View style={styles.pillsRow}>
            {(['Scan', 'Sukses', 'Gagal', 'Izin'] as const).map((view) => (
              <TouchableOpacity
                key={view}
                style={[styles.statePill, stateView === view && styles.statePillActive]}
                onPress={() => setStateView(view)}
              >
                <Text style={[styles.stateText, stateView === view && styles.stateTextActive]}>
                  {view}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Camera Viewfinder Area */}
      <View style={styles.cameraArea}>
        <View style={styles.scanTargetFrame}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />

          <View style={styles.innerQrFrame}>
            <Ionicons name="qr-code" size={48} color="rgba(56, 189, 248, 0.6)" />
          </View>
        </View>

        <Text style={styles.instructionText}>
          Arahkan kamera ke QR sepeda Mas Joko yang terpasang di stang atau rangka.
        </Text>

        <View style={styles.infoCallout}>
          <Ionicons name="information-circle-outline" size={18} color={COLORS.primaryLight} style={{ marginRight: 8 }} />
          <Text style={styles.infoCalloutText}>
            QR akan langsung membuka halaman info & status unit sepeda.
          </Text>
        </View>
      </View>

      {/* Navigasi Bawah Interaktif */}
      {isUserFlow ? (
        <BottomNavBar variant="user" activeTab="Scan" onTabPress={handleUserTabPress} />
      ) : (
        <BottomNavBar activeTab={activeTab} onTabPress={handleTabPress} />
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
    padding: 6,
  },
  stateSwitcherBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: SIZES.large,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  stateLabel: {
    ...FONTS.caption,
    color: '#94A3B8',
    marginRight: SIZES.small,
  },
  pillsRow: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  statePill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: SIZES.radiusPill,
    backgroundColor: 'transparent',
  },
  statePillActive: {
    backgroundColor: COLORS.primaryLight,
  },
  stateText: {
    ...FONTS.caption,
    color: '#94A3B8',
  },
  stateTextActive: {
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
  cameraArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.xlarge,
  },
  scanTargetFrame: {
    width: 240,
    height: 240,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.xlarge,
  },
  corner: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderColor: COLORS.primaryLight,
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
  innerQrFrame: {
    width: 140,
    height: 140,
    borderRadius: SIZES.radiusMedium,
    borderWidth: 2,
    borderColor: 'rgba(56, 189, 248, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionText: {
    ...FONTS.body,
    color: '#F8FAFC',
    textAlign: 'center',
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
});

export default DurasiSewa;