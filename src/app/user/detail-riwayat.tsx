import React from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import HeaderApp from '../../components/molecules/HeaderApp';
import BottomNavBar, { UserTabType } from '../../components/molecules/BottomNavBar';
import RentalStatusBadge from '../../components/molecules/RentalStatusBadge';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { DEMO_RENTAL_HISTORY } from '../../constants/userDemo';

export default function RentalHistoryDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const rental = DEMO_RENTAL_HISTORY.find((item) => item.id === params.id) || DEMO_RENTAL_HISTORY[0];
  const isOngoing = rental.status === 'Sedang Berlangsung';

  const handleTabPress = (tab: UserTabType) => {
    switch (tab) {
      case 'Beranda': router.push('/user' as any); break;
      case 'Riwayat': router.push('/user/riwayat' as any); break;
      case 'Scan': router.push({ pathname: '/public/durasi-sewa' as any, params: { source: 'user' } }); break;
      case 'Profil': router.push('/user/profil' as any); break;
    }
  };

  const InfoRow = ({ label, value }: { label: string; value?: string }) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || '-'} </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <HeaderApp notificationCount={0} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backLink} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={18} color={COLORS.secondaryDark} />
          <Text style={styles.backText}>Kembali</Text>
        </TouchableOpacity>

        <View style={styles.titleRow}>
          <View style={styles.titleCopy}>
            <Text style={styles.eyebrow}>DETAIL TRANSAKSI</Text>
            <Text style={styles.pageTitle}>Detail Sewa</Text>
            <Text style={styles.transactionId}>{rental.id}</Text>
          </View>
          <RentalStatusBadge status={rental.status} />
        </View>

        <View style={styles.bikeCard}>
          <View style={styles.bikeIcon}><Ionicons name="bicycle" size={34} color={COLORS.secondaryDark} /></View>
          <View style={styles.bikeInfo}>
            <Text style={styles.bikeCategory}>{rental.category}</Text>
            <Text style={styles.bikeName}>{rental.bikeName}</Text>
            <Text style={styles.bikeUnit}>Unit {rental.unitId}</Text>
          </View>
        </View>

        {isOngoing && (
          <View style={styles.notice}>
            <Ionicons name="information-circle-outline" size={19} color={COLORS.secondaryDark} />
            <Text style={styles.noticeText}>Penyewaan ini masih berlangsung. Selesaikan pengembalian langsung kepada petugas di lokasi rental.</Text>
          </View>
        )}

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Informasi Penyewaan</Text>
          <InfoRow label="Tanggal" value={rental.date} />
          <InfoRow label="Waktu mulai" value={rental.startTime} />
          <InfoRow label="Waktu selesai" value={rental.endTime || (isOngoing ? 'Belum dikembalikan' : undefined)} />
          <InfoRow label="Durasi" value={rental.duration} />
          <InfoRow label="Kategori penyewa" value={rental.customerType} />
          <InfoRow label="Tarif" value={rental.hourlyRate} />
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Pembayaran & Jaminan</Text>
          <InfoRow label="Metode pembayaran" value={rental.paymentMethod || 'Menunggu penyelesaian'} />
          <InfoRow label="Status pembayaran" value={rental.paymentStatus || 'Belum dihitung'} />
          <InfoRow label="Jenis jaminan" value={rental.guaranteeType} />
          {!isOngoing && <InfoRow label="Total pembayaran" value={rental.total} />}
        </View>

        {!isOngoing && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Informasi Pengembalian</Text>
            <InfoRow label="Kondisi unit" value={rental.returnCondition} />
            <Text style={styles.returnNote}>{rental.returnNote || 'Tidak ada catatan pengembalian.'}</Text>
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
  backLink: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', marginBottom: SIZES.large, gap: 6 },
  backText: { ...FONTS.labelMedium, color: COLORS.secondaryDark },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: SIZES.large },
  titleCopy: { flex: 1 },
  eyebrow: { ...FONTS.caption, color: COLORS.secondaryDark, fontWeight: '700', letterSpacing: 1.1, marginBottom: 4 },
  pageTitle: { ...FONTS.headline1, color: COLORS.textPrimary },
  transactionId: { ...FONTS.caption, color: COLORS.textSecondary, marginTop: 4 },
  bikeCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: SIZES.radiusLarge, padding: SIZES.large, marginBottom: SIZES.large },
  bikeIcon: { width: 60, height: 60, borderRadius: SIZES.radiusMedium, backgroundColor: '#E0F2FE', justifyContent: 'center', alignItems: 'center', marginRight: SIZES.medium },
  bikeInfo: { flex: 1 },
  bikeCategory: { ...FONTS.caption, color: COLORS.textSecondary, textTransform: 'uppercase' },
  bikeName: { ...FONTS.headline3, color: COLORS.secondaryDark, marginTop: 2 },
  bikeUnit: { ...FONTS.caption, color: COLORS.textSecondary, marginTop: 3 },
  notice: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: '#E0F2FE', borderRadius: SIZES.radiusMedium, padding: SIZES.medium, marginBottom: SIZES.large },
  noticeText: { ...FONTS.caption, color: COLORS.secondaryDark, flex: 1, lineHeight: 18 },
  sectionCard: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: SIZES.radiusLarge, padding: SIZES.large, marginBottom: SIZES.medium },
  sectionTitle: { ...FONTS.headline3, color: COLORS.secondaryDark, marginBottom: SIZES.medium },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', gap: 12 },
  infoLabel: { ...FONTS.body, color: COLORS.textSecondary, flex: 1 },
  infoValue: { ...FONTS.labelMedium, color: COLORS.textPrimary, flex: 1, textAlign: 'right' },
  returnNote: { ...FONTS.caption, color: COLORS.textSecondary, marginTop: SIZES.medium, lineHeight: 18 },
});
