
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import HeaderApp from '../../components/molecules/HeaderApp';
import BottomNavBar, {
  UserTabType,
} from '../../components/molecules/BottomNavBar';

import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';

const formatMemberSince = (value?: string | null) => {
  if (!value) return 'Pengguna Jamal Jepret';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Pengguna Jamal Jepret';
  }

  return date.toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
  });
};

export default function UserProfileScreen() {
  const router = useRouter();

  const {
    user,
    profile,
    loading,
    signOut,
  } = useAuth();

  const handleTabPress = (tab: UserTabType) => {
    switch (tab) {
      case 'Beranda':
        router.push('/user' as any);
        break;

      case 'Riwayat':
        router.push('/user/riwayat' as any);
        break;

      case 'Scan':
        router.push({
          pathname: '/public/durasi-sewa',
          params: { source: 'user' },
        } as any);
        break;

      case 'Profil':
        break;
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Keluar dari akun?',
      'Kamu akan keluar dari akun dan kembali ke halaman login.',
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
            } catch (error) {
              Alert.alert(
                'Logout Gagal',
                error instanceof Error
                  ? error.message
                  : 'Terjadi kesalahan saat keluar.',
              );
            }
          },
        },
      ],
    );
  };

  // Loading AuthContext
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />

        <View style={styles.centerState}>
          <ActivityIndicator
            size="large"
            color={COLORS.secondaryDark}
          />

          <Text style={styles.stateText}>
            Memuat informasi profil...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Pengguna belum login atau profil belum tersedia.
  if (!user || !profile) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />

        <View style={styles.centerState}>
          <Ionicons
            name="person-circle-outline"
            size={56}
            color={COLORS.textSecondary}
          />

          <Text style={styles.emptyTitle}>
            Data Profil Tidak Ditemukan
          </Text>

          <Text style={styles.stateText}>
            Silakan login kembali untuk melihat informasi akun.
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() =>
              router.replace('/public/login' as any)
            }
          >
            <Text style={styles.primaryButtonText}>
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const fullName = profile.full_name || 'Nama belum diisi';
  const email = profile.email || user.email || '-';
  const phone = profile.phone || 'Nomor WhatsApp belum diisi';
  const customerType = profile.customer_type || 'Belum ditentukan';
  const memberSince = formatMemberSince(profile.created_at);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <HeaderApp notificationCount={0} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Profil */}
        <View style={styles.titleSection}>
          <Text style={styles.eyebrow}>
            AKUN SAYA
          </Text>

          <Text style={styles.pageTitle}>
            Profil
          </Text>

          <Text style={styles.pageSubtitle}>
            Kelola informasi akun dan data kontakmu.
          </Text>
        </View>

        {/* Kartu Profil */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Ionicons
              name="person"
              size={34}
              color={COLORS.secondaryDark}
            />
          </View>

          <Text style={styles.fullName}>
            {fullName}
          </Text>

          <Text style={styles.email}>
            {email}
          </Text>

          <View style={styles.memberBadge}>
            <Ionicons
              name="ribbon-outline"
              size={14}
              color={COLORS.secondaryDark}
            />

            <Text style={styles.memberText}>
              Pengguna sejak {memberSince}
            </Text>
          </View>
        </View>

        {/* Informasi Pribadi */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Informasi Pribadi
            </Text>

            <TouchableOpacity
              style={styles.editButton}
              onPress={() =>
                router.push('/user/edit-profil' as any)
              }
            >
              <Ionicons
                name="create-outline"
                size={15}
                color={COLORS.secondaryDark}
              />

              <Text style={styles.editText}>
                Edit
              </Text>
            </TouchableOpacity>
          </View>

          {/* Nama */}
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons
                name="person-outline"
                size={18}
                color={COLORS.secondaryDark}
              />
            </View>

            <View style={styles.infoCopy}>
              <Text style={styles.infoLabel}>
                Nama Lengkap
              </Text>

              <Text style={styles.infoValue}>
                {fullName}
              </Text>
            </View>
          </View>

          {/* Email */}
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons
                name="mail-outline"
                size={18}
                color={COLORS.secondaryDark}
              />
            </View>

            <View style={styles.infoCopy}>
              <Text style={styles.infoLabel}>
                Email
              </Text>

              <Text style={styles.infoValue}>
                {email}
              </Text>
            </View>
          </View>

          {/* Nomor WhatsApp */}
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons
                name="logo-whatsapp"
                size={18}
                color={COLORS.secondaryDark}
              />
            </View>

            <View style={styles.infoCopy}>
              <Text style={styles.infoLabel}>
                Nomor WhatsApp
              </Text>

              <Text style={styles.infoValue}>
                {phone}
              </Text>
            </View>
          </View>

          {/* Kategori Penyewa */}
          <View style={[styles.infoRow, styles.lastInfoRow]}>
            <View style={styles.infoIcon}>
              <Ionicons
                name="school-outline"
                size={18}
                color={COLORS.secondaryDark}
              />
            </View>

            <View style={styles.infoCopy}>
              <Text style={styles.infoLabel}>
                Kategori Penyewa
              </Text>

              <Text style={styles.infoValue}>
                {customerType}
              </Text>
            </View>
          </View>
        </View>

        {/* Menu Riwayat */}
        <TouchableOpacity
          style={styles.menuRow}
          onPress={() =>
            router.push('/user/riwayat' as any)
          }
        >
          <View style={styles.menuIcon}>
            <Ionicons
              name="receipt-outline"
              size={19}
              color={COLORS.secondaryDark}
            />
          </View>

          <Text style={styles.menuText}>
            Riwayat Penyewaan
          </Text>

          <Ionicons
            name="chevron-forward"
            size={18}
            color={COLORS.textSecondary}
          />
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity
          style={[styles.menuRow, styles.logoutRow]}
          onPress={handleLogout}
        >
          <View style={[styles.menuIcon, styles.logoutIcon]}>
            <Ionicons
              name="log-out-outline"
              size={19}
              color={COLORS.accentCritical}
            />
          </View>

          <Text style={styles.logoutText}>
            Keluar dari Akun
          </Text>

          <Ionicons
            name="chevron-forward"
            size={18}
            color={COLORS.textSecondary}
          />
        </TouchableOpacity>

        <Text style={styles.versionText}>
          Jamal_Jepret • Versi Demo
        </Text>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavBar
        variant="user"
        activeTab="Profil"
        onTabPress={handleTabPress}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scrollContent: {
    padding: SIZES.large,
    paddingBottom: SIZES.large,
  },

  titleSection: {
    marginBottom: SIZES.large,
  },

  eyebrow: {
    ...FONTS.caption,
    color: COLORS.secondaryDark,
    fontWeight: '700',
    letterSpacing: 1.1,
    marginBottom: 5,
  },

  pageTitle: {
    ...FONTS.headline1,
    color: COLORS.textPrimary,
  },

  pageSubtitle: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    marginTop: 4,
  },

  profileCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusLarge,
    alignItems: 'center',
    padding: SIZES.xlarge,
    marginBottom: SIZES.large,
  },

  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.medium,
  },

  fullName: {
    ...FONTS.headline2,
    color: COLORS.secondaryDark,
    textAlign: 'center',
  },

  email: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    marginTop: 3,
    textAlign: 'center',
  },

  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#E0F2FE',
    borderRadius: SIZES.radiusPill,
    paddingHorizontal: 11,
    paddingVertical: 6,
    marginTop: SIZES.medium,
  },

  memberText: {
    ...FONTS.caption,
    color: COLORS.secondaryDark,
    fontWeight: '600',
  },

  sectionCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusLarge,
    padding: SIZES.large,
    marginBottom: SIZES.medium,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },

  sectionTitle: {
    ...FONTS.headline3,
    color: COLORS.secondaryDark,
  },

  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },

  editText: {
    ...FONTS.caption,
    color: COLORS.secondaryDark,
    fontWeight: '700',
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.medium,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },

  lastInfoRow: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },

  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F0F9FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.medium,
  },

  infoCopy: {
    flex: 1,
  },

  infoLabel: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },

  infoValue: {
    ...FONTS.labelMedium,
    color: COLORS.textPrimary,
    marginTop: 2,
  },

  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.medium,
    marginBottom: SIZES.small,
  },

  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.medium,
  },

  menuText: {
    ...FONTS.labelMedium,
    color: COLORS.textPrimary,
    flex: 1,
  },

  logoutRow: {
    marginTop: SIZES.small,
  },

  logoutIcon: {
    backgroundColor: '#FEE2E2',
  },

  logoutText: {
    ...FONTS.labelMedium,
    color: COLORS.accentCritical,
    flex: 1,
  },

  versionText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SIZES.large,
  },

  centerState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  stateText: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 21,
  },

  emptyTitle: {
    ...FONTS.headline3,
    color: COLORS.secondaryDark,
    marginTop: 12,
    textAlign: 'center',
  },

  primaryButton: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: SIZES.radiusMedium,
    marginTop: 20,
  },

  primaryButtonText: {
    ...FONTS.labelMedium,
    color: COLORS.textPrimary,
  },
});
