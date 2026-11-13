
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
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';

type MenuItemProps = {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  onPress: () => void;
};

function MenuItem({
  title,
  subtitle,
  icon,
  iconColor,
  onPress,
}: MenuItemProps) {
  return (
    <TouchableOpacity
      style={styles.menuItem}
      activeOpacity={0.75}
      onPress={onPress}
      accessibilityRole="button"
    >
      <View style={styles.menuIcon}>
        <Ionicons
          name={icon}
          size={21}
          color={iconColor}
        />
      </View>

      <View style={styles.menuCopy}>
        <Text style={styles.menuTitle}>
          {title}
        </Text>

        <Text style={styles.menuSubtitle}>
          {subtitle}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={19}
        color={COLORS.textSecondary}
      />
    </TouchableOpacity>
  );
}

export default function AdminMoreScreen() {
  const router = useRouter();
  const { signOut, profile } = useAuth();

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
                error?.message ||
                  'Terjadi kesalahan saat logout.',
              );
            }
          },
        },
      ],
    );
  };

  const adminName = profile?.full_name || 'Admin Jamal Jepret';
  const adminEmail = profile?.email || '-';

  return (
    <AdminPageLayout
      title="Menu Lainnya"
      subtitle="Pengaturan akun dan operasional rental."
      activeTab="Lainnya"
      showBottomNav
    >
      {/* PROFIL ADMIN */}
      <TouchableOpacity
        style={styles.profileCard}
        activeOpacity={0.8}
        onPress={() =>
          router.push('/admin/edit-profil' as any)
        }
      >
        <View style={styles.avatar}>
          <Ionicons
            name="person"
            size={27}
            color={COLORS.secondaryDark}
          />
        </View>

        <View style={styles.profileInfo}>
          <Text style={styles.profileEyebrow}>
            AKUN ADMIN
          </Text>

          <Text style={styles.profileName}>
            {adminName}
          </Text>

          <Text style={styles.profileEmail}>
            {adminEmail}
          </Text>

          <View style={styles.editProfileLabel}>
            <Text style={styles.editProfileText}>
              Edit Profil
            </Text>

            <Ionicons
              name="arrow-forward"
              size={14}
              color={COLORS.secondaryDark}
            />
          </View>
        </View>

        <Ionicons
          name="chevron-forward"
          size={19}
          color={COLORS.secondaryDark}
        />
      </TouchableOpacity>

      {/* OPERASIONAL */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          OPERASIONAL
        </Text>

        <View style={styles.menuCard}>
          <MenuItem
            title="Perawatan Unit"
            subtitle="Kelola servis, perbaikan, dan kondisi sepeda."
            icon="construct-outline"
            iconColor="#0369A1"
            onPress={() =>
              router.push('/admin/perawatan' as any)
            }
          />

          <View style={styles.divider} />

          <MenuItem
            title="Pengeluaran"
            subtitle="Catat biaya perawatan dan operasional."
            icon="wallet-outline"
            iconColor="#B45309"
            onPress={() =>
              router.push('/admin/pengeluaran' as any)
            }
          />
        </View>
      </View>

      {/* LAPORAN */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          LAPORAN
        </Text>

        <View style={styles.menuCard}>
          <MenuItem
            title="Keuangan & Laporan"
            subtitle="Ringkasan pemasukan, pengeluaran, dan selisih operasional."
            icon="bar-chart-outline"
            iconColor="#15803D"
            onPress={() =>
              router.push('/admin/keuangan' as any)
            }
          />
        </View>
      </View>

      {/* LOGOUT */}
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
            size={21}
            color={COLORS.accentCritical}
          />
        </View>

        <View style={styles.logoutCopy}>
          <Text style={styles.logoutTitle}>
            Keluar dari Akun
          </Text>

          <Text style={styles.logoutSubtitle}>
            Keluar dari akun Admin Jamal Jepret.
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={19}
          color={COLORS.textSecondary}
        />
      </TouchableOpacity>

      <Text style={styles.footer}>
        Jamal Jepret Admin
      </Text>
    </AdminPageLayout>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    borderRadius: SIZES.radiusLarge,
    padding: SIZES.medium,
    marginBottom: SIZES.large,
    gap: 12,
  },

  avatar: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  profileInfo: {
    flex: 1,
  },

  profileEyebrow: {
    ...FONTS.caption,
    color: COLORS.secondaryDark,
    fontWeight: '700',
    letterSpacing: 1,
  },

  profileName: {
    ...FONTS.labelLarge,
    color: COLORS.textPrimary,
    marginTop: 3,
  },

  profileEmail: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  editProfileLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 8,
  },

  editProfileText: {
    ...FONTS.labelMedium,
    color: COLORS.secondaryDark,
  },

  section: {
    marginBottom: SIZES.large,
  },

  sectionTitle: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: SIZES.small,
    marginLeft: 2,
  },

  menuCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusLarge,
    paddingHorizontal: SIZES.medium,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    gap: 12,
  },

  menuIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  menuCopy: {
    flex: 1,
  },

  menuTitle: {
    ...FONTS.labelMedium,
    color: COLORS.textPrimary,
  },

  menuSubtitle: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: 3,
    lineHeight: 17,
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  },

  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: SIZES.radiusLarge,
    padding: SIZES.medium,
    marginTop: SIZES.small,
    gap: 12,
  },

  logoutIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
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
    marginTop: 3,
  },

  footer: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SIZES.medium,
    marginBottom: SIZES.medium,
  },
});
