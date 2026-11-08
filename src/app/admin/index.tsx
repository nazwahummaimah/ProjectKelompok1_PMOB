import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AdminPageLayout, { adminUi } from '../../components/organisms/AdminPageLayout';
import AdminMetricCard from '../../components/molecules/AdminMetricCard';
import AdminActionRow from '../../components/molecules/AdminActionRow';
import AdminTransactionCard from '../../components/molecules/AdminTransactionCard';
import { useAdmin } from '../../context/AdminContext';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

export default function AdminDashboardScreen() {
  const router = useRouter();
  const { bikes, transactions, error, loading } = useAdmin();
  const available = bikes.filter((item) => item.status === 'Tersedia').length;
  const rented = bikes.filter((item) => item.status === 'Sedang Disewa').length;
  const maintenance = bikes.filter((item) => item.status === 'Perawatan').length;
  const activeTransactions = transactions.filter((item) => item.status === 'Sedang Berlangsung' || item.status === 'Menunggu Serah Terima');
  const currentDate = new Date();
  const today = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;

  return (
    <AdminPageLayout title="Dashboard" subtitle="Ringkasan operasional Rental Sepeda Jamal_Jepret." activeTab="Dashboard" showBottomNav>
      {error ? <View style={styles.dataError}><Text style={styles.dataErrorTitle}>Data Supabase belum berhasil dimuat</Text><Text style={styles.dataErrorText}>{error}</Text></View> : null}
      {loading ? <Text style={styles.dataLoading}>Memuat data operasional...</Text> : null}
      <View style={styles.welcomeCard}>
        <View style={styles.welcomeIcon}><Ionicons name="speedometer-outline" size={23} color={COLORS.secondaryDark} /></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.welcomeEyebrow}>PANEL ADMIN</Text>
          <Text style={styles.welcomeTitle}>Selamat bertugas!</Text>
          <Text style={styles.welcomeText}>Pantau armada dan transaksi dari satu tempat.</Text>
        </View>
      </View>

      <Text style={adminUi.sectionTitle}>Ringkasan Inventaris</Text>
      <View style={styles.metricGrid}>
        <AdminMetricCard label="Total unit" value={bikes.length} icon="bicycle-outline" />
        <AdminMetricCard label="Tersedia" value={available} icon="checkmark-circle-outline" tone="green" />
      </View>
      <View style={[styles.metricGrid, { marginTop: 10 }]}>
        <AdminMetricCard label="Disewa" value={rented} icon="time-outline" tone="blue" />
        <AdminMetricCard label="Perawatan" value={maintenance} icon="construct-outline" tone="orange" />
      </View>

      <View style={adminUi.between}>
        <Text style={adminUi.sectionTitle}>Operasional Hari Ini</Text>
        <Text style={styles.dateText}>{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
      </View>
      <View style={adminUi.card}>
        <View style={adminUi.between}>
          <View style={styles.operationItem}>
            <Text style={styles.operationValue}>{activeTransactions.length}</Text>
            <Text style={styles.operationLabel}>Transaksi aktif</Text>
          </View>
          <View style={styles.verticalDivider} />
          <View style={styles.operationItem}>
            <Text style={styles.operationValue}>{transactions.filter((item) => item.status === 'Selesai' && item.date === today).length}</Text>
            <Text style={styles.operationLabel}>Selesai hari ini</Text>
          </View>
        </View>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction} onPress={() => router.push('/admin/buat-transaksi' as any)}>
            <Ionicons name="add-circle-outline" size={19} color={COLORS.secondaryDark} />
            <Text style={styles.quickActionText}>Buat transaksi</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={() => router.push('/admin/form-unit' as any)}>
            <Ionicons name="bicycle-outline" size={19} color={COLORS.secondaryDark} />
            <Text style={styles.quickActionText}>Tambah unit</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={adminUi.sectionTitle}>Perlu Ditindaklanjuti</Text>
      <AdminActionRow title="Pengembalian sepeda" subtitle="Periksa transaksi yang sedang berlangsung." icon="return-up-back-outline" onPress={() => router.push('/admin/transaksi?filter=active' as any)} rightText={String(rented)} />
      <AdminActionRow title="Unit dalam perawatan" subtitle="Lihat unit yang belum layak digunakan." icon="construct-outline" onPress={() => router.push('/admin/perawatan' as any)} rightText={String(maintenance)} />

      <View style={adminUi.between}>
        <Text style={adminUi.sectionTitle}>Transaksi Terbaru</Text>
        <TouchableOpacity onPress={() => router.push('/admin/transaksi' as any)}><Text style={styles.seeAll}>Lihat semua</Text></TouchableOpacity>
      </View>
      {transactions.slice(0, 2).map((transaction) => (
        <AdminTransactionCard key={transaction.id} transaction={transaction} onPress={() => router.push(`/admin/detail-transaksi?id=${transaction.id}` as any)} />
      ))}
    </AdminPageLayout>
  );
}

const styles = StyleSheet.create({
  dataError: { backgroundColor: '#FEE2E2', borderRadius: 12, padding: 12, marginBottom: 12 },
  dataErrorTitle: { ...FONTS.labelMedium, color: '#991B1B' },
  dataErrorText: { ...FONTS.caption, color: '#991B1B', marginTop: 4 },
  dataLoading: { ...FONTS.caption, color: COLORS.textSecondary, marginBottom: 10 },
  welcomeCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E0F2FE', padding: SIZES.large, borderRadius: SIZES.radiusLarge },
  welcomeIcon: { width: 46, height: 46, borderRadius: 14, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  welcomeEyebrow: { ...FONTS.caption, color: COLORS.secondaryDark, letterSpacing: 1 },
  welcomeTitle: { ...FONTS.headline3, color: COLORS.secondaryDark, marginTop: 2 },
  welcomeText: { ...FONTS.caption, color: COLORS.textSecondary, marginTop: 3 },
  metricGrid: { flexDirection: 'row', gap: 10 },
  dateText: { ...FONTS.caption, color: COLORS.textSecondary, marginTop: SIZES.large },
  operationItem: { flex: 1, alignItems: 'center', paddingVertical: 4 },
  operationValue: { ...FONTS.headline1, color: COLORS.secondaryDark },
  operationLabel: { ...FONTS.caption, color: COLORS.textSecondary, marginTop: 3 },
  verticalDivider: { width: 1, backgroundColor: COLORS.border, marginHorizontal: 12 },
  quickActions: { flexDirection: 'row', gap: 10, marginTop: 16, paddingTop: 14, borderTopWidth: 1, borderTopColor: COLORS.border },
  quickAction: { flex: 1, minHeight: 40, borderRadius: 10, backgroundColor: '#F0F9FF', flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center' },
  quickActionText: { ...FONTS.caption, color: COLORS.secondaryDark, fontWeight: '700' },
  seeAll: { ...FONTS.labelMedium, color: COLORS.secondaryDark, marginTop: SIZES.large },
});
