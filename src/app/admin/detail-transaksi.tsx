import React from 'react';
import { Alert, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AdminPageLayout, { adminUi } from '../../components/organisms/AdminPageLayout';
import AdminStatusBadge from '../../components/molecules/AdminStatusBadge';
import { useAdmin } from '../../context/AdminContext';
import { formatRupiah } from '../../constants/adminDemo';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

export default function AdminTransactionDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { transactions, bikes, markTransactionPaid, confirmHandover } = useAdmin();
  const transaction = transactions.find((item) => item.id === id) ?? transactions[0];
  const transactionBikes = bikes.filter((bike) => transaction.unitIds.includes(bike.id));

  const handover = () => Alert.alert('Konfirmasi Serah Terima', 'Pastikan pembayaran sudah Lunas dan unit benar-benar diserahkan kepada pelanggan. Waktu sewa mulai dihitung setelah konfirmasi ini.', [
    { text: 'Batal', style: 'cancel' },
    { text: 'Konfirmasi', onPress: () => { confirmHandover(transaction.id); Alert.alert('Serah terima berhasil', 'Status unit berubah menjadi Sedang Disewa.'); } },
  ]);

  return (
    <AdminPageLayout title="Detail Transaksi" subtitle={transaction.id} showBack>
      <View style={styles.statusHeader}>
        <View style={{ flex: 1 }}><Text style={styles.customerName}>{transaction.customerName}</Text><Text style={styles.customerMeta}>{transaction.phone} · {transaction.customerType}</Text></View>
        <AdminStatusBadge status={transaction.status} />
      </View>
      <View style={adminUi.card}>
        <Text style={styles.cardTitle}>Unit yang Disewa</Text>
        {transactionBikes.map((bike) => <View key={bike.id} style={styles.unitRow}><View style={styles.unitIcon}><Ionicons name="bicycle" size={20} color={COLORS.secondaryDark} /></View><View style={{ flex: 1 }}><Text style={styles.unitName}>{bike.name}</Text><Text style={styles.meta}>{bike.id} · {bike.category}</Text></View><AdminStatusBadge status={bike.status} /></View>)}
      </View>
      <View style={adminUi.card}>
        <Text style={styles.cardTitle}>Rincian Penyewaan</Text>
        <Info label="Tanggal transaksi" value={transaction.date} />
        <Info label="Mulai sewa" value={transaction.startTime} />
        <Info label="Estimasi selesai" value={transaction.estimatedEnd} />
        <Info label="Durasi" value={`${transaction.durationHours} jam`} />
        <Info label="Kategori pelanggan" value={transaction.customerType} />
        <Info label="Jenis hari" value={transaction.dayType} />
        <Info label="Tarif per jam" value={`${formatRupiah(transaction.hourlyRate)}/unit`} />
        <Info label="Jaminan" value={transaction.guaranteeType} last />
      </View>
      <View style={adminUi.card}>
        <Text style={styles.cardTitle}>Pembayaran</Text>
        <Info label="Metode" value={transaction.paymentMethod} />
        <View style={styles.paymentRow}><Text style={styles.infoLabel}>Status pembayaran</Text><AdminStatusBadge status={transaction.paymentStatus} /></View>
        <View style={[adminUi.between, styles.totalRow]}><Text style={styles.totalLabel}>Total transaksi</Text><Text style={styles.totalValue}>{formatRupiah(transaction.total)}</Text></View>
      </View>
      {transaction.status === 'Menunggu Serah Terima' ? (
        <>
          {transaction.paymentStatus === 'Belum Lunas' ? <TouchableOpacity style={adminUi.button} onPress={() => Alert.alert('Konfirmasi Pembayaran', 'Pastikan pembayaran tunai/QRIS sudah diterima dan diverifikasi secara manual.', [{ text: 'Batal', style: 'cancel' }, { text: 'Tandai Lunas', onPress: () => markTransactionPaid(transaction.id) }])}><Text style={adminUi.buttonText}>Konfirmasi Pembayaran Lunas</Text></TouchableOpacity> : null}
          <TouchableOpacity disabled={transaction.paymentStatus !== 'Lunas'} style={[adminUi.button, { marginTop: 10, opacity: transaction.paymentStatus === 'Lunas' ? 1 : 0.45 }]} onPress={handover}><Ionicons name="bicycle-outline" size={18} color={COLORS.textPrimary} /><Text style={[adminUi.buttonText, { marginLeft: 7 }]}>Konfirmasi Serah Terima</Text></TouchableOpacity>
          <Text style={styles.helper}>Unit baru berubah menjadi Sedang Disewa setelah serah terima dikonfirmasi.</Text>
        </>
      ) : null}
      {transaction.status === 'Sedang Berlangsung' ? <TouchableOpacity style={adminUi.button} onPress={() => router.push(`/admin/pengembalian?id=${transaction.id}` as any)}><Ionicons name="return-up-back-outline" size={18} color={COLORS.textPrimary} /><Text style={[adminUi.buttonText, { marginLeft: 7 }]}>Proses Pengembalian</Text></TouchableOpacity> : null}
      {transaction.status === 'Selesai' ? <View style={styles.finished}><Ionicons name="checkmark-circle" size={20} color="#15803D" /><Text style={styles.finishedText}>Transaksi telah selesai.</Text></View> : null}
    </AdminPageLayout>
  );
}
function Info({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return <View style={[styles.infoRow, last && { borderBottomWidth: 0 }]}><Text style={styles.infoLabel}>{label}</Text><Text style={styles.infoValue}>{value}</Text></View>;
}
const styles = StyleSheet.create({
  statusHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#E0F2FE', padding: SIZES.large, borderRadius: SIZES.radiusLarge, marginBottom: SIZES.medium, gap: 10 },
  customerName: { ...FONTS.headline3, color: COLORS.secondaryDark }, customerMeta: { ...FONTS.caption, color: COLORS.textSecondary, marginTop: 3 },
  cardTitle: { ...FONTS.labelLarge, color: COLORS.secondaryDark, marginBottom: 10 },
  unitRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 9, borderTopWidth: 1, borderTopColor: COLORS.border, gap: 9 }, unitIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#E0F2FE', alignItems: 'center', justifyContent: 'center' }, unitName: { ...FONTS.labelMedium, color: COLORS.textPrimary }, meta: { ...FONTS.caption, color: COLORS.textSecondary, marginTop: 2 },
  infoRow: { paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: COLORS.border }, infoLabel: { ...FONTS.caption, color: COLORS.textSecondary }, infoValue: { ...FONTS.body, color: COLORS.textPrimary, fontWeight: '600', marginTop: 3 },
  paymentRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  totalRow: { borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 13, marginTop: 5 }, totalLabel: { ...FONTS.labelMedium, color: COLORS.textSecondary }, totalValue: { ...FONTS.headline2, color: COLORS.secondaryDark }, helper: { ...FONTS.caption, color: COLORS.textSecondary, lineHeight: 17, marginTop: 9 },
  finished: { padding: 14, borderRadius: 12, backgroundColor: '#DCFCE7', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }, finishedText: { ...FONTS.labelMedium, color: '#15803D' },
});
