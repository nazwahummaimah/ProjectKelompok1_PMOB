import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AdminPageLayout, { adminUi } from '../../components/organisms/AdminPageLayout';
import AdminTransactionCard from '../../components/molecules/AdminTransactionCard';
import { useAdmin } from '../../context/AdminContext';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

const FILTERS = ['Semua', 'Menunggu Serah Terima', 'Sedang Berlangsung', 'Selesai'] as const;
type Filter = (typeof FILTERS)[number];

export default function AdminTransactionListScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ filter?: string }>();
  const { transactions } = useAdmin();
  const [filter, setFilter] = useState<Filter>(params.filter === 'active' ? 'Sedang Berlangsung' : 'Semua');
  const filtered = useMemo(() => filter === 'Semua' ? transactions : transactions.filter((item) => item.status === filter), [transactions, filter]);

  return (
    <AdminPageLayout title="Transaksi" subtitle="Pantau penyewaan, pembayaran, dan pengembalian sepeda." activeTab="Transaksi" showBottomNav rightLabel="+ Buat" onRightPress={() => router.push('/admin/buat-transaksi' as any)}>
      <View style={styles.summary}><Text style={styles.summaryValue}>{transactions.length}</Text><Text style={styles.summaryLabel}>Total transaksi tercatat</Text></View>
      <View style={styles.filters}>
        {FILTERS.map((item) => <TouchableOpacity key={item} onPress={() => setFilter(item)} style={[adminUi.chip, filter === item && adminUi.chipActive]}><Text style={[styles.filterText, filter === item && styles.filterActive]}>{item === 'Menunggu Serah Terima' ? 'Menunggu' : item}</Text></TouchableOpacity>)}
      </View>
      {filtered.map((item) => <AdminTransactionCard key={item.id} transaction={item} onPress={() => router.push(`/admin/detail-transaksi?id=${item.id}` as any)} />)}
      {filtered.length === 0 ? <View style={adminUi.card}><Text style={styles.empty}>Belum ada transaksi pada kategori ini.</Text></View> : null}
    </AdminPageLayout>
  );
}
const styles = StyleSheet.create({
  summary: { backgroundColor: '#E0F2FE', borderRadius: SIZES.radiusLarge, padding: SIZES.large, marginBottom: SIZES.large }, summaryValue: { ...FONTS.headline1, color: COLORS.secondaryDark }, summaryLabel: { ...FONTS.caption, color: COLORS.textSecondary, marginTop: 3 },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: SIZES.large }, filterText: { ...FONTS.caption, color: COLORS.textSecondary }, filterActive: { color: COLORS.secondaryDark, fontWeight: '700' }, empty: { ...FONTS.body, color: COLORS.textSecondary, textAlign: 'center' },
});
