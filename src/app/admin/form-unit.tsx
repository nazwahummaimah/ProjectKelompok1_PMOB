import React, { useEffect, useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AdminPageLayout, { adminUi } from '../../components/organisms/AdminPageLayout';
import { useAdmin } from '../../context/AdminContext';
import { AdminBike } from '../../constants/adminTypes';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

export default function AdminUnitFormScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { bikes, addBike, updateBike } = useAdmin();
  const existing = bikes.find((item) => item.id === id);
  const [name, setName] = useState(existing?.name ?? '');
  const [category, setCategory] = useState<AdminBike['category']>(existing?.category ?? 'Mountain Bike (MTB)');
  const [notes, setNotes] = useState(existing?.notes ?? '');

  useEffect(() => {
    if (existing) { setName(existing.name); setCategory(existing.category); setNotes(existing.notes); }
  }, [existing?.id]);

  const handleSave = async () => {
    if (name.trim().length < 3) { Alert.alert('Periksa Nama Unit', 'Nama sepeda minimal 3 karakter.'); return; }
    if (existing) {
      try {
        await updateBike(existing.id, { name: name.trim(), category, notes: notes.trim() || 'Belum ada catatan.' });
      } catch (error: any) { Alert.alert('Gagal Menyimpan', error?.message ?? 'Terjadi kesalahan.'); return; }
      Alert.alert('Berhasil', 'Data unit diperbarui.', [{ text: 'OK', onPress: () => router.replace(`/admin/detail-unit?id=${existing.id}` as any) }]);
    } else {
      let bike: AdminBike;
      try { bike = await addBike({ name: name.trim(), category, notes: notes.trim() || 'Belum ada catatan.' }); }
      catch (error: any) { Alert.alert('Gagal Menyimpan', error?.message ?? 'Terjadi kesalahan.'); return; }
      Alert.alert('Berhasil', `${bike.id} berhasil ditambahkan dengan status Tersedia.`, [{ text: 'Lihat Unit', onPress: () => router.replace(`/admin/detail-unit?id=${bike.id}` as any) }]);
    }
  };

  return (
    <AdminPageLayout title={existing ? 'Edit Unit' : 'Tambah Unit'} subtitle="Lengkapi informasi dasar sepeda. Status operasional dikelola melalui alur transaksi dan perawatan." showBack>
      <View style={adminUi.card}>
        <Text style={styles.label}>Nama Sepeda *</Text>
        <TextInput style={adminUi.input} value={name} onChangeText={setName} placeholder="Contoh: Polygon Cascade 4" placeholderTextColor={COLORS.textSecondary} />
        <Text style={[styles.label, { marginTop: 16 }]}>Kategori *</Text>
        <View style={styles.choiceRow}>
          {(['Mountain Bike (MTB)', 'Folding Bike'] as const).map((item) => <TouchableOpacity key={item} onPress={() => setCategory(item)} style={[adminUi.chip, category === item && adminUi.chipActive]}><Text style={[styles.choiceText, category === item && styles.choiceActive]}>{item}</Text></TouchableOpacity>)}
        </View>
        <Text style={[styles.label, { marginTop: 16 }]}>Catatan Kondisi</Text>
        <TextInput style={[adminUi.input, styles.multiline]} value={notes} onChangeText={setNotes} placeholder="Tambahkan catatan unit (opsional)" placeholderTextColor={COLORS.textSecondary} multiline textAlignVertical="top" />
        {existing ? <View style={styles.statusInfo}><Text style={styles.statusInfoText}>Status saat ini: {existing.status}. Status tidak diubah dari formulir inventaris.</Text></View> : <View style={styles.statusInfo}><Text style={styles.statusInfoText}>Unit baru otomatis dibuat dengan status Tersedia.</Text></View>}
      </View>
      <TouchableOpacity style={adminUi.button} onPress={handleSave}><Text style={adminUi.buttonText}>Simpan Data Unit</Text></TouchableOpacity>
    </AdminPageLayout>
  );
}
const styles = StyleSheet.create({
  label: { ...FONTS.labelMedium, color: COLORS.textPrimary, marginBottom: 7 },
  choiceRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, choiceText: { ...FONTS.caption, color: COLORS.textSecondary }, choiceActive: { color: COLORS.secondaryDark, fontWeight: '700' },
  multiline: { minHeight: 100, paddingTop: 12 },
  statusInfo: { backgroundColor: '#F0F9FF', padding: 12, borderRadius: SIZES.radiusMedium, marginTop: 16 }, statusInfoText: { ...FONTS.caption, color: COLORS.secondaryDark, lineHeight: 18 },
});
