import React from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import HeaderApp from '../../components/molecules/HeaderApp';
import BottomNavBar, { UserTabType } from '../../components/molecules/BottomNavBar';
import RentalStatusBadge from '../../components/molecules/RentalStatusBadge';
import RentalHistoryCard from '../../components/organisms/RentalHistoryCard';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { useUserRentalHistory } from '../../hooks/use-user-rental-history';
import { useUserProfile } from '../../context/UserProfileContext';

export default function UserHomeScreen() {
  const router = useRouter();
  const { profile } = useUserProfile();
  const { history, summary } = useUserRentalHistory();
  const activeRental = history.find((item) => item.status === 'Sedang Berlangsung');
  const recentRentals = history.filter((item) => item.status === 'Selesai').slice(0, 2);

  const handleTabPress = (tab: UserTabType) => {
    switch (tab) {
      case 'Beranda':
        break;
      case 'Riwayat':
        router.push('/user/riwayat' as any);
        break;
      case 'Scan':
        router.push({ pathname: '/public/durasi-sewa' as any, params: { source: 'user' } });
        break;
      case 'Profil':
        router.push('/user/profil' as any);
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <HeaderApp notificationCount={0} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeSection}>
          <View style={styles.welcomeCopy}>
            <Text style={styles.eyebrow}>DASHBOARD PENGGUNA</Text>
            <Text style={styles.pageTitle}>Halo, {(profile?.full_name ?? 'Pengguna').split(' ')[0]}!</Text>
            <Text style={styles.pageSubtitle}>Siap untuk perjalanan berikutnya?</Text>
          </View>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={25} color={COLORS.secondaryDark} />
          </View>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <View style={[styles.summaryIcon, { backgroundColor: '#E0F2FE' }]}>
              <Ionicons name="bicycle-outline" size={19} color={COLORS.secondaryDark} />
            </View>
            <Text style={styles.summaryValue}>{summary.total}</Text>
            <Text style={styles.summaryLabel}>Total Sewa</Text>
          </View>
          <View style={styles.summaryCard}>
            <View style={[styles.summaryIcon, { backgroundColor: '#DBEAFE' }]}>
              <Ionicons name="time-outline" size={19} color="#0369A1" />
            </View>
            <Text style={styles.summaryValue}>{summary.ongoing}</Text>
            <Text style={styles.summaryLabel}>Berlangsung</Text>
          </View>
          <View style={styles.summaryCard}>
            <View style={[styles.summaryIcon, { backgroundColor: '#DCFCE7' }]}>
              <Ionicons name="checkmark-circle-outline" size={19} color={COLORS.success} />
            </View>
            <Text style={styles.summaryValue}>{summary.completed}</Text>
            <Text style={styles.summaryLabel}>Selesai</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Penyewaan Aktif</Text>
            <Text style={styles.sectionSubtitle}>Pantau sepeda yang sedang kamu gunakan</Text>
          </View>
        </View>

        {activeRental ? (
          <TouchableOpacity
            style={styles.activeCard}
            activeOpacity={0.85}
            onPress={() => router.push({ pathname: '/user/detail-riwayat' as any, params: { id: activeRental.id } })}
          >
            <View style={styles.activeCardTop}>
              <Text style={styles.transactionId}>{activeRental.id}</Text>
              <RentalStatusBadge status={activeRental.status} />
            </View>
            <View style={styles.activeBikeRow}>
              <View style={styles.activeBikeIcon}>
                <Ionicons name="bicycle" size={30} color={COLORS.secondaryDark} />
              </View>
              <View style={styles.activeBikeInfo}>
                <Text style={styles.activeBikeName}>{activeRental.bikeName}</Text>
                <Text style={styles.activeBikeUnit}>Unit {activeRental.unitId} • {activeRental.category}</Text>
              </View>
            </View>
            <View style={styles.activeDivider} />
            <View style={styles.activeInfoRow}>
              <View style={styles.activeInfoItem}>
                <Text style={styles.infoLabel}>Mulai sewa</Text>
                <Text style={styles.infoValue}>{activeRental.startTime}</Text>
              </View>
              <View style={styles.activeInfoItem}>
                <Text style={styles.infoLabel}>Durasi berjalan</Text>
                <Text style={styles.infoValue}>{activeRental.duration}</Text>
              </View>
            </View>
            <View style={styles.detailLinkRow}>
              <Text style={styles.detailLink}>Lihat detail penyewaan</Text>
              <Ionicons name="arrow-forward" size={16} color={COLORS.secondaryDark} />
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.emptyActiveCard}>
            <Ionicons name="bicycle-outline" size={28} color={COLORS.textSecondary} />
            <Text style={styles.emptyTitle}>Belum ada penyewaan aktif</Text>
            <Text style={styles.emptyText}>Riwayat penyewaan yang sedang berjalan akan muncul di sini.</Text>
          </View>
        )}

        <View style={[styles.sectionHeader, styles.recentHeader]}>
          <View>
            <Text style={styles.sectionTitle}>Riwayat Terbaru</Text>
            <Text style={styles.sectionSubtitle}>Lihat kembali penyewaan sebelumnya</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/user/riwayat' as any)} style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>Lihat Semua</Text>
            <Ionicons name="chevron-forward" size={15} color={COLORS.secondaryDark} />
          </TouchableOpacity>
        </View>

        {recentRentals.map((rental) => (
          <RentalHistoryCard
            key={rental.id}
            rental={rental}
            onPress={() => router.push({ pathname: '/user/detail-riwayat' as any, params: { id: rental.id } })}
          />
        ))}
      </ScrollView>
      <BottomNavBar variant="user" activeTab="Beranda" onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: SIZES.large, paddingBottom: SIZES.large },
  welcomeSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SIZES.large },
  welcomeCopy: { flex: 1 },
  eyebrow: { ...FONTS.caption, color: COLORS.secondaryDark, fontWeight: '700', letterSpacing: 1.1, marginBottom: 5 },
  pageTitle: { ...FONTS.headline1, color: COLORS.textPrimary },
  pageSubtitle: { ...FONTS.body, color: COLORS.textSecondary, marginTop: 3 },
  avatarCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#E0F2FE', alignItems: 'center', justifyContent: 'center', marginLeft: SIZES.medium },
  summaryRow: { flexDirection: 'row', gap: SIZES.small, marginBottom: SIZES.xlarge },
  summaryCard: { flex: 1, minHeight: 112, borderRadius: SIZES.radiusMedium, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, padding: SIZES.medium },
  summaryIcon: { width: 32, height: 32, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 7 },
  summaryValue: { ...FONTS.headline2, color: COLORS.textPrimary },
  summaryLabel: { ...FONTS.caption, color: COLORS.textSecondary, marginTop: 1 },
  sectionHeader: { marginBottom: SIZES.medium },
  sectionTitle: { ...FONTS.headline3, color: COLORS.secondaryDark },
  sectionSubtitle: { ...FONTS.caption, color: COLORS.textSecondary, marginTop: 3 },
  activeCard: { backgroundColor: COLORS.surface, borderRadius: SIZES.radiusLarge, borderWidth: 1, borderColor: '#BAE6FD', padding: SIZES.large, marginBottom: SIZES.xlarge },
  activeCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  transactionId: { ...FONTS.labelMedium, color: COLORS.textPrimary },
  activeBikeRow: { flexDirection: 'row', alignItems: 'center', marginTop: SIZES.large },
  activeBikeIcon: { width: 54, height: 54, borderRadius: SIZES.radiusMedium, backgroundColor: '#E0F2FE', alignItems: 'center', justifyContent: 'center', marginRight: SIZES.medium },
  activeBikeInfo: { flex: 1 },
  activeBikeName: { ...FONTS.headline3, color: COLORS.secondaryDark },
  activeBikeUnit: { ...FONTS.caption, color: COLORS.textSecondary, marginTop: 3 },
  activeDivider: { height: 1, backgroundColor: COLORS.border, marginVertical: SIZES.large },
  activeInfoRow: { flexDirection: 'row', gap: SIZES.large },
  activeInfoItem: { flex: 1 },
  infoLabel: { ...FONTS.caption, color: COLORS.textSecondary },
  infoValue: { ...FONTS.labelMedium, color: COLORS.textPrimary, marginTop: 3 },
  detailLinkRow: { marginTop: SIZES.large, paddingTop: SIZES.medium, borderTopWidth: 1, borderTopColor: COLORS.border, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailLink: { ...FONTS.labelMedium, color: COLORS.secondaryDark },
  emptyActiveCard: { backgroundColor: COLORS.surface, borderRadius: SIZES.radiusLarge, borderWidth: 1, borderColor: COLORS.border, padding: SIZES.xlarge, alignItems: 'center', marginBottom: SIZES.xlarge },
  emptyTitle: { ...FONTS.labelLarge, color: COLORS.textPrimary, marginTop: SIZES.small },
  emptyText: { ...FONTS.caption, color: COLORS.textSecondary, textAlign: 'center', marginTop: 4 },
  recentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  viewAllButton: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  viewAllText: { ...FONTS.caption, fontWeight: '700', color: COLORS.secondaryDark },
});
