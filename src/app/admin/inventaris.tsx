import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AdminPageLayout, { adminUi } from '../../components/organisms/AdminPageLayout';
import AdminStatusBadge from '../../components/molecules/AdminStatusBadge';
import { useAdmin } from '../../context/AdminContext';
import { AdminBikeStatus } from '../../constants/adminDemo';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

const FILTERS: Array<'Semua' | AdminBikeStatus> = ['Semua', 'Tersedia', 'Sedang Disewa', 'Perawatan'];

export default function AdminInventoryScreen() {
  const router = useRouter();
  const { bikes } = useAdmin();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('Semua');
  const filtered = useMemo(() => bikes.filter((bike) => {
    const matchesStatus = filter === 'Semua' || bike.status === filter;
    const q = query.trim().toLowerCase();
    const matchesQuery = !q || bike.id.toLowerCase().includes(q) || bike.name.toLowerCase().includes(q);
    return matchesStatus && matchesQuery;
  }), [bikes, filter, query]);

  return (
    <AdminPageLayout title="Inventaris" subtitle="Kelola data setiap unit sepeda di satu lokasi rental." activeTab="Inventaris" showBottomNav>
      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={19} color={COLORS.textSecondary} />
        <TextInput value={query} onChangeText={setQuery} placeholder="Cari nama atau kode unit" placeholderTextColor={COLORS.textSecondary} style={styles.searchInput} />
        {query.length > 0 ? <TouchableOpacity onPress={() => setQuery('')}><Ionicons name="close-circle" size={18} color={COLORS.textSecondary} /></TouchableOpacity> : null}
      </View>
      <View style={styles.filterRow}>
        {FILTERS.map((item) => (
          <TouchableOpacity key={item} onPress={() => setFilter(item)} style={[adminUi.chip, filter === item && adminUi.chipActive]}>
            <Text style={[styles.filterText, filter === item && styles.filterTextActive]}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={[adminUi.between, { marginBottom: SIZES.medium }]}>
        <View><Text style={styles.count}>{filtered.length} unit</Text><Text style={styles.helper}>Dari {bikes.length} total unit</Text></View>
        <TouchableOpacity style={adminUi.button} onPress={() => router.push('/admin/form-unit' as any)}>
          <Ionicons name="add" size={18} color={COLORS.textPrimary} /><Text style={adminUi.buttonText}>Tambah</Text>
        </TouchableOpacity>
      </View>
      {filtered.map((bike) => (
        <TouchableOpacity key={bike.id} style={styles.bikeCard} activeOpacity={0.8} onPress={() => router.push(`/admin/detail-unit?id=${bike.id}` as any)}>
          <View style={styles.bikeIcon}><Ionicons name="bicycle" size={24} color={COLORS.secondaryDark} /></View>
          <View style={styles.bikeInfo}>
            <View style={styles.bikeTop}><Text style={styles.unitId}>{bike.id}</Text><AdminStatusBadge status={bike.status} /></View>
            <Text style={styles.bikeName}>{bike.name}</Text>
            <Text style={styles.category}>{bike.category}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={COLORS.textSecondary} />
        </TouchableOpacity>
      ))}
      {filtered.length === 0 ? <View style={styles.empty}><Ionicons name="bicycle-outline" size={28} color={COLORS.textSecondary} /><Text style={styles.emptyTitle}>Unit tidak ditemukan</Text><Text style={styles.helper}>Coba kata kunci atau filter lain.</Text></View> : null}
    </AdminPageLayout>
  );
}

const styles = StyleSheet.create({
  searchWrap: { flexDirection: 'row', alignItems: 'center', gap: 9, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface, borderRadius: SIZES.radiusMedium, paddingHorizontal: 12, minHeight: 46, marginBottom: 12 },
  searchInput: { flex: 1, color: COLORS.textPrimary, ...FONTS.body, paddingVertical: 8 },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: SIZES.large },
  filterText: { ...FONTS.caption, color: COLORS.textSecondary }, filterTextActive: { color: COLORS.secondaryDark, fontWeight: '700' },
  count: { ...FONTS.labelLarge, color: COLORS.textPrimary }, helper: { ...FONTS.caption, color: COLORS.textSecondary, marginTop: 2 },
  bikeCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: SIZES.radiusLarge, borderWidth: 1, borderColor: COLORS.border, padding: 12, marginBottom: 10 },
  bikeIcon: { width: 48, height: 48, borderRadius: 14, backgroundColor: '#E0F2FE', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  bikeInfo: { flex: 1 }, bikeTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 7 },
  unitId: { ...FONTS.caption, color: COLORS.secondaryDark, fontWeight: '700' }, bikeName: { ...FONTS.labelMedium, color: COLORS.textPrimary, marginTop: 4 }, category: { ...FONTS.caption, color: COLORS.textSecondary, marginTop: 2 },
  empty: { alignItems: 'center', padding: 30, backgroundColor: COLORS.surface, borderRadius: SIZES.radiusLarge, borderWidth: 1, borderColor: COLORS.border }, emptyTitle: { ...FONTS.labelMedium, color: COLORS.textPrimary, marginTop: 8 },
});
