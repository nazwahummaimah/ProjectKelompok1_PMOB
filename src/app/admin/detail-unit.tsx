import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AdminPageLayout, { adminUi } from '../../components/organisms/AdminPageLayout';
import AdminStatusBadge from '../../components/molecules/AdminStatusBadge';
import { useAdmin } from '../../context/AdminContext';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

export default function AdminUnitDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { bikes } = useAdmin();
  const bike = bikes.find((item) => item.id === id) ?? bikes[0];
  if (!bike) return <AdminPageLayout title="Detail Unit" subtitle="Data unit belum tersedia." showBack><View style={adminUi.card}><Text style={styles.helper}>Unit tidak ditemukan atau belum ada data sepeda di database.</Text></View><TouchableOpacity style={adminUi.button} onPress={() => router.push('/admin/form-unit' as any)}><Text style={adminUi.buttonText}>Tambah Unit</Text></TouchableOpacity></AdminPageLayout>;

  return (
    <AdminPageLayout title="Detail Unit" subtitle="Informasi inventaris dan kondisi operasional sepeda." showBack>
      <View style={styles.hero}>
        <View style={styles.bikeIcon}><Ionicons name="bicycle" size={48} color={COLORS.secondaryDark} /></View>
        <Text style={styles.unitId}>{bike.id}</Text>
        <Text style={styles.name}>{bike.name}</Text>
        <Text style={styles.category}>{bike.category}</Text>
        <View style={{ marginTop: 10 }}><AdminStatusBadge status={bike.status} /></View>
      </View>
      <View style={adminUi.card}>
        <Text style={styles.cardTitle}>Informasi Unit</Text>
        <InfoRow label="Kode QR" value={bike.qrCode} />
        <InfoRow label="Lokasi" value={bike.branchName ?? 'Lokasi belum diatur'} />
        <InfoRow label="Alamat Cabang" value={bike.branchAddress ?? '-'} />
        <InfoRow label="Kategori" value={bike.category} />
        <InfoRow label="Status operasional" value={bike.status} />
        <InfoRow label="Catatan" value={bike.notes} last />
      </View>
      <View style={adminUi.card}>
        <View style={adminUi.row}><Ionicons name="qr-code-outline" size={20} color={COLORS.secondaryDark} /><Text style={[styles.cardTitle, { marginLeft: 8, marginBottom: 0 }]}>Identitas QR Unit</Text></View>
        <View style={styles.qrBox}><Ionicons name="qr-code" size={72} color={COLORS.secondaryDark} /><Text style={styles.qrCode}>{bike.qrCode}</Text><Text style={styles.helper}>Representasi QR untuk prototipe frontend.</Text></View>
      </View>
      <TouchableOpacity style={adminUi.button} onPress={() => router.push(`/admin/form-unit?id=${bike.id}` as any)}>
        <Ionicons name="create-outline" size={18} color={COLORS.textPrimary} /><Text style={[adminUi.buttonText, { marginLeft: 7 }]}>Edit Data Unit</Text>
      </TouchableOpacity>
      {bike.status === 'Perawatan' ? <TouchableOpacity style={[adminUi.outlineButton, { marginTop: 10 }]} onPress={() => router.push('/admin/perawatan' as any)}><Text style={adminUi.buttonText}>Buka Perawatan</Text></TouchableOpacity> : null}
    </AdminPageLayout>
  );
}

function InfoRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return <View style={[styles.infoRow, last && { borderBottomWidth: 0, paddingBottom: 0 }]}><Text style={styles.infoLabel}>{label}</Text><Text style={styles.infoValue}>{value}</Text></View>;
}
const styles = StyleSheet.create({
  hero: { backgroundColor: '#E0F2FE', borderRadius: SIZES.radiusLarge, padding: 22, alignItems: 'center', marginBottom: SIZES.medium },
  bikeIcon: { width: 94, height: 94, borderRadius: 26, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  unitId: { ...FONTS.caption, color: COLORS.secondaryDark, fontWeight: '700' }, name: { ...FONTS.headline2, color: COLORS.textPrimary, marginTop: 4, textAlign: 'center' }, category: { ...FONTS.body, color: COLORS.textSecondary, marginTop: 2 },
  cardTitle: { ...FONTS.labelLarge, color: COLORS.secondaryDark, marginBottom: 12 },
  infoRow: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border }, infoLabel: { ...FONTS.caption, color: COLORS.textSecondary }, infoValue: { ...FONTS.body, color: COLORS.textPrimary, fontWeight: '600', marginTop: 3 },
  qrBox: { alignItems: 'center', padding: 16, marginTop: 10, backgroundColor: '#F8FAFC', borderRadius: SIZES.radiusMedium }, qrCode: { ...FONTS.labelMedium, color: COLORS.secondaryDark, marginTop: 8 }, helper: { ...FONTS.caption, color: COLORS.textSecondary, marginTop: 4, textAlign: 'center' },
});
