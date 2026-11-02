import React, { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import HeaderApp from '../../components/molecules/HeaderApp';
import BottomNavBar, { UserTabType } from '../../components/molecules/BottomNavBar';
import RentalHistoryCard from '../../components/organisms/RentalHistoryCard';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { useUserRentalHistory } from '../../hooks/use-user-rental-history';

type HistoryFilter = 'Semua' | 'Sedang Berlangsung' | 'Selesai';

export default function RentalHistoryScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<HistoryFilter>('Semua');
  const { history } = useUserRentalHistory();

  const filteredRentals = useMemo(
    () => filter === 'Semua' ? history : history.filter((rental) => rental.status === filter),
    [history, filter],
  );

  const handleTabPress = (tab: UserTabType) => {
    switch (tab) {
      case 'Beranda': router.push('/user' as any); break;
      case 'Riwayat': break;
      case 'Scan': router.push({ pathname: '/public/durasi-sewa' as any, params: { source: 'user' } }); break;
      case 'Profil': router.push('/user/profil' as any); break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <HeaderApp notificationCount={0} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.titleSection}>
          <Text style={styles.eyebrow}>AKTIVITAS AKUN</Text>
          <Text style={styles.pageTitle}>Riwayat Sewa</Text>
          <Text style={styles.pageSubtitle}>Semua aktivitas penyewaan sepeda yang terhubung dengan akunmu.</Text>
        </View>

        <View style={styles.summaryStrip}>
          <View style={styles.summaryCell}>
            <Text style={styles.summaryValue}>{history.length}</Text>
            <Text style={styles.summaryLabel}>Ditampilkan</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryCell}>
            <Text style={styles.summaryValue}>{history.filter((r) => r.status === 'Sedang Berlangsung').length}</Text>
            <Text style={styles.summaryLabel}>Berlangsung</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryCell}>
            <Text style={styles.summaryValue}>{history.filter((r) => r.status === 'Selesai').length}</Text>
            <Text style={styles.summaryLabel}>Selesai</Text>
          </View>
        </View>

        <View style={styles.filterRow}>
          {(['Semua', 'Sedang Berlangsung', 'Selesai'] as HistoryFilter[]).map((option) => {
            const selected = filter === option;
            return (
              <TouchableOpacity
                key={option}
                style={[styles.filterChip, selected && styles.filterChipActive]}
                onPress={() => setFilter(option)}
                activeOpacity={0.8}
              >
                <Text style={[styles.filterText, selected && styles.filterTextActive]}>
                  {option === 'Sedang Berlangsung' ? 'Berlangsung' : option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Daftar Penyewaan</Text>
          <Text style={styles.listCount}>{filteredRentals.length} transaksi</Text>
        </View>

        {filteredRentals.length > 0 ? filteredRentals.map((rental) => (
          <RentalHistoryCard
            key={rental.id}
            rental={rental}
            onPress={() => router.push({ pathname: '/user/detail-riwayat' as any, params: { id: rental.id } })}
          />
        )) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}><Ionicons name="receipt-outline" size={28} color={COLORS.secondaryDark} /></View>
            <Text style={styles.emptyTitle}>Belum ada riwayat</Text>
            <Text style={styles.emptyDescription}>Transaksi dengan status ini akan muncul di sini.</Text>
          </View>
        )}
      </ScrollView>
      <BottomNavBar variant="user" activeTab="Riwayat" onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: SIZES.large, paddingBottom: SIZES.large },
  titleSection: { marginBottom: SIZES.large },
  eyebrow: { ...FONTS.caption, color: COLORS.secondaryDark, fontWeight: '700', letterSpacing: 1.1, marginBottom: 5 },
  pageTitle: { ...FONTS.headline1, color: COLORS.textPrimary },
  pageSubtitle: { ...FONTS.body, color: COLORS.textSecondary, marginTop: 5, lineHeight: 21 },
  summaryStrip: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: SIZES.radiusMedium, paddingVertical: SIZES.medium, marginBottom: SIZES.large },
  summaryCell: { flex: 1, alignItems: 'center' },
  summaryValue: { ...FONTS.headline2, color: COLORS.secondaryDark },
  summaryLabel: { ...FONTS.caption, color: COLORS.textSecondary, marginTop: 2 },
  summaryDivider: { width: 1, height: 30, backgroundColor: COLORS.border },
  filterRow: { flexDirection: 'row', gap: 7, marginBottom: SIZES.large },
  filterChip: { paddingVertical: 9, paddingHorizontal: 12, borderRadius: SIZES.radiusPill, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface },
  filterChipActive: { backgroundColor: COLORS.secondaryDark, borderColor: COLORS.secondaryDark },
  filterText: { ...FONTS.caption, color: COLORS.textSecondary, fontWeight: '600' },
  filterTextActive: { color: COLORS.surface },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SIZES.medium },
  listTitle: { ...FONTS.headline3, color: COLORS.secondaryDark },
  listCount: { ...FONTS.caption, color: COLORS.textSecondary },
  emptyState: { alignItems: 'center', backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: SIZES.radiusLarge, padding: SIZES.xxlarge },
  emptyIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#E0F2FE', alignItems: 'center', justifyContent: 'center', marginBottom: SIZES.medium },
  emptyTitle: { ...FONTS.labelLarge, color: COLORS.textPrimary },
  emptyDescription: { ...FONTS.caption, color: COLORS.textSecondary, textAlign: 'center', marginTop: 5 },
});
