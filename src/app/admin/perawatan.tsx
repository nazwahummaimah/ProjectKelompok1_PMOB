import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AdminPageLayout, { adminUi } from '../../components/organisms/AdminPageLayout';
import AdminStatusBadge from '../../components/molecules/AdminStatusBadge';
import { useAdmin } from '../../context/AdminContext';
import { MaintenanceType } from '../../constants/adminDemo';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

const TYPES: MaintenanceType[] = ['Perbaikan', 'Servis rutin', 'Penggantian komponen'];

export default function MaintenanceScreen() {
  const { bikes, maintenance, startMaintenance, completeMaintenance } = useAdmin();
  const [selectedTypes, setSelectedTypes] = useState<Record<string, MaintenanceType>>({});
  const [workNotes, setWorkNotes] = useState<Record<string, string>>({});
  return (
    <AdminPageLayout title="Perawatan Unit" subtitle="Kelola unit yang perlu diperbaiki, diservis, dan diperiksa kembali." activeTab="Lainnya" showBottomNav>
      <View style={styles.summary}><Ionicons name="construct-outline" size={22} color="#B45309" /><View style={{ flex: 1, marginLeft: 10 }}><Text style={styles.summaryValue}>{bikes.filter((bike) => bike.status === 'Perawatan').length} unit</Text><Text style={styles.summaryText}>Belum dapat digunakan</Text></View></View>
      {maintenance.map((item) => {
        const bike = bikes.find((entry) => entry.id === item.unitId);
        return (
          <View key={item.id} style={adminUi.card}>
            <View style={adminUi.between}><Text style={styles.recordId}>{item.id}</Text><AdminStatusBadge status={item.status} /></View>
            <Text style={styles.unitName}>{bike?.name ?? item.unitId}</Text>
            <Text style={styles.meta}>{item.unitId} · {item.date}</Text>
            <Text style={styles.note}>{item.note}</Text>
            {item.status !== 'Selesai' ? <><Text style={styles.label}>Catatan pekerjaan</Text><TextInput value={workNotes[item.id] ?? item.note} onChangeText={(value) => setWorkNotes((current) => ({ ...current, [item.id]: value }))} style={styles.noteInput} multiline placeholder="Catatan pekerjaan perawatan" placeholderTextColor={COLORS.textSecondary} /></> : null}
            {item.status === 'Menunggu' ? <>
              <Text style={styles.label}>Jenis pekerjaan</Text>
              <View style={styles.typeRow}>{TYPES.map((type) => <TouchableOpacity key={type} onPress={() => setSelectedTypes((current) => ({ ...current, [item.id]: type }))} style={[adminUi.chip, (selectedTypes[item.id] ?? item.type) === type && adminUi.chipActive]}><Text style={[styles.typeText, (selectedTypes[item.id] ?? item.type) === type && styles.typeActive]}>{type}</Text></TouchableOpacity>)}</View>
              <TouchableOpacity style={[adminUi.button, { marginTop: 13 }]} onPress={() => startMaintenance(item.id, selectedTypes[item.id] ?? item.type, workNotes[item.id] ?? item.note)}><Text style={adminUi.buttonText}>Mulai Perawatan</Text></TouchableOpacity>
            </> : null}
            {item.status === 'Sedang Dikerjakan' ? <TouchableOpacity style={[adminUi.outlineButton, { marginTop: 12 }]} onPress={() => Alert.alert('Pemeriksaan Akhir', 'Tentukan hasil pemeriksaan setelah pekerjaan selesai.', [
              { text: 'Belum Layak', onPress: () => completeMaintenance(item.id, false) },
              { text: 'Layak Digunakan', onPress: () => completeMaintenance(item.id, true) },
            ])}><Text style={adminUi.buttonText}>Selesaikan & Periksa</Text></TouchableOpacity> : null}
            {item.status === 'Selesai' ? <Text style={styles.completedText}>Pekerjaan ditutup. Status akhir unit mengikuti hasil pemeriksaan.</Text> : null}
          </View>
        );
      })}
      {maintenance.length === 0 ? <View style={adminUi.card}><Text style={styles.meta}>Belum ada catatan perawatan.</Text></View> : null}
    </AdminPageLayout>
  );
}
const styles = StyleSheet.create({
  summary: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF3C7', padding: SIZES.large, borderRadius: SIZES.radiusLarge, marginBottom: SIZES.large }, summaryValue: { ...FONTS.labelLarge, color: '#92400E' }, summaryText: { ...FONTS.caption, color: '#B45309', marginTop: 2 },
  recordId: { ...FONTS.caption, color: COLORS.secondaryDark, fontWeight: '700' }, unitName: { ...FONTS.labelLarge, color: COLORS.textPrimary, marginTop: 6 }, meta: { ...FONTS.caption, color: COLORS.textSecondary, marginTop: 2 }, note: { ...FONTS.body, color: COLORS.textPrimary, marginTop: 10, lineHeight: 20 }, label: { ...FONTS.labelMedium, color: COLORS.textPrimary, marginTop: 14, marginBottom: 8 },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 }, typeText: { ...FONTS.caption, color: COLORS.textSecondary }, typeActive: { color: COLORS.secondaryDark, fontWeight: '700' }, noteInput: { minHeight: 64, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, backgroundColor: COLORS.surface, padding: 10, color: COLORS.textPrimary, ...FONTS.body, textAlignVertical: 'top' }, completedText: { ...FONTS.caption, color: '#15803D', marginTop: 12 },
});
