
import React from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import AdminPageLayout from '../../components/organisms/AdminPageLayout';
import AdminActionRow from '../../components/molecules/AdminActionRow';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';

export default function AdminMoreScreen() {
  const router = useRouter();
  const { signOut } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Keluar dari akun Admin?',
      'Kamu akan kembali ke halaman login. Pastikan perubahan yang sedang dikerjakan sudah selesai.',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Keluar',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              router.replace('/public/login' as any);
            } catch (error: any) {
              Alert.alert(
                'Logout Gagal',
                error?.message || 'Terjadi kesalahan saat logout.',
              );
            }
          },
        },
      ],
    );
  };

  return (
    <AdminPageLayout
      title="Menu Lainnya"
      subtitle="Akses modul operasional dan laporan tambahan."
      activeTab="Lainnya"
      showBottomNav
    >
      <AdminActionRow
        title="Perawatan Unit"
        subtitle="Pekerjaan servis, perbaikan, dan pemeriksaan akhir."
        icon="construct-outline"
        onPress={() => router.push('/admin/perawatan' as any)}
      />

      <AdminActionRow
        title="Pengeluaran"
        subtitle="Catat biaya perawatan dan operasional."
        icon="wallet-outline"
        onPress={() => router.push('/admin/pengeluaran' as any)}
      />

      <AdminActionRow
        title="Keuangan & Laporan"
        subtitle="Ringkasan pemasukan, pengeluaran, dan selisih operasional."
        icon="bar-chart-outline"
        onPress={() => router.push('/admin/keuangan' as any)}
      />

      <AdminActionRow
        title="Inventaris Sepeda"
        subtitle="Kelola data dan status unit."
        icon="bicycle-outline"
        onPress={() => router.push('/admin/inventaris' as any)}
      />

      <AdminActionRow
        title="Daftar Transaksi"
        subtitle="Lihat semua transaksi penyewaan."
        icon="receipt-outline"
        onPress={() => router.push('/admin/transaksi' as any)}
      />

      <TouchableOpacity
        style={styles.logoutRow}
        activeOpacity={0.75}
        onPress={handleLogout}
        accessibilityRole="button"
        accessibilityLabel="Keluar dari akun Admin"
      >
        <View style={styles.logoutIconWrap}>
          <Ionicons
            name="log-out-outline"
            size={20}
            color={COLORS.accentCritical}
          />
        </View>

        <View style={styles.logoutCopy}>
          <Text style={styles.logoutTitle}>
            Keluar dari Akun
          </Text>
          <Text style={styles.logoutSubtitle}>
            Kembali ke halaman login Admin.
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={18}
          color={COLORS.textSecondary}
        />
      </TouchableOpacity>
    </AdminPageLayout>
  );
}

const styles = StyleSheet.create({
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: SIZES.radiusMedium,
    padding: 12,
    marginTop: SIZES.large,
    marginBottom: SIZES.medium,
  },
  logoutIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },
  logoutCopy: {
    flex: 1,
  },
  logoutTitle: {
    ...FONTS.labelMedium,
    color: COLORS.accentCritical,
  },
  logoutSubtitle: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});