import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import AdminPageLayout, { adminUi } from '../../components/organisms/AdminPageLayout';
import { useAdmin } from '../../context/AdminContext';
import { ExpenseCategory, formatRupiah } from '../../constants/adminDemo';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

const CATEGORIES: ExpenseCategory[] = ['Perawatan', 'Spare Part', 'Operasional', 'Lainnya'];

export default function ExpenseScreen() {
  const { expenses, bikes, addExpense, updateExpense } = useAdmin();
  const [category, setCategory] = useState<ExpenseCategory>('Operasional');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('2026-11-02');
  const [description, setDescription] = useState('');
  const [relatedUnitId, setRelatedUnitId] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const handleAdd = () => {
    const value = Number.parseInt(amount.replace(/\D/g, ''), 10);
    if (!Number.isFinite(value) || value <= 0) { Alert.alert('Nominal belum valid', 'Masukkan nominal pengeluaran lebih dari nol.'); return; }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date.trim())) { Alert.alert('Tanggal belum valid', 'Gunakan format YYYY-MM-DD.'); return; }
    if (description.trim().length < 3) { Alert.alert('Deskripsi diperlukan', 'Tuliskan keterangan pengeluaran minimal 3 karakter.'); return; }
    const payload = { category, amount: value, date: date.trim(), description: description.trim(), relatedUnitId: relatedUnitId || undefined };
    if (editingId) { updateExpense(editingId, payload); Alert.alert('Pengeluaran diperbarui', 'Catatan pengeluaran demo berhasil diperbarui.'); }
    else { addExpense(payload); Alert.alert('Pengeluaran dicatat', 'Data pengeluaran tersimpan pada state demo aplikasi.'); }
    setAmount(''); setDate('2026-11-02'); setDescription(''); setRelatedUnitId(''); setEditingId(null);
  };

  return (
    <AdminPageLayout title="Pengeluaran" subtitle="Catat biaya operasional di luar transaksi penyewaan." activeTab="Lainnya" showBottomNav>
      <View style={styles.totalCard}><Text style={styles.totalLabel}>Total pengeluaran tercatat</Text><Text style={styles.totalValue}>{formatRupiah(total)}</Text><Text style={styles.helper}>Akumulasi dari seluruh data demo.</Text></View>
      <View style={adminUi.card}>
        <Text style={styles.cardTitle}>{editingId ? 'Edit Pengeluaran' : 'Tambah Pengeluaran'}</Text>
        <Text style={styles.label}>Kategori</Text>
        <View style={styles.categoryRow}>{CATEGORIES.map((item) => <TouchableOpacity key={item} onPress={() => setCategory(item)} style={[adminUi.chip, category === item && adminUi.chipActive]}><Text style={[styles.categoryText, category === item && styles.categoryActive]}>{item}</Text></TouchableOpacity>)}</View>
        <Text style={[styles.label, { marginTop: 14 }]}>Nominal (Rp)</Text>
        <TextInput style={adminUi.input} value={amount} onChangeText={(value) => setAmount(value.replace(/[^0-9]/g, ''))} keyboardType="number-pad" placeholder="Contoh: 50000" placeholderTextColor={COLORS.textSecondary} />
        <Text style={[styles.label, { marginTop: 14 }]}>Tanggal (YYYY-MM-DD)</Text>
        <TextInput style={adminUi.input} value={date} onChangeText={setDate} placeholder="2026-11-02" placeholderTextColor={COLORS.textSecondary} />
        <Text style={[styles.label, { marginTop: 14 }]}>Deskripsi</Text>
        <TextInput style={adminUi.input} value={description} onChangeText={setDescription} placeholder="Keterangan pengeluaran" placeholderTextColor={COLORS.textSecondary} />
        <Text style={[styles.label, { marginTop: 14 }]}>Unit terkait (opsional)</Text>
        <View style={styles.categoryRow}>{bikes.map((bike) => <TouchableOpacity key={bike.id} onPress={() => setRelatedUnitId(relatedUnitId === bike.id ? '' : bike.id)} style={[adminUi.chip, relatedUnitId === bike.id && adminUi.chipActive]}><Text style={[styles.categoryText, relatedUnitId === bike.id && styles.categoryActive]}>{bike.id}</Text></TouchableOpacity>)}</View>
        <TouchableOpacity style={[adminUi.button, { marginTop: 18 }]} onPress={handleAdd}><Text style={adminUi.buttonText}>{editingId ? 'Perbarui Pengeluaran' : 'Simpan Pengeluaran'}</Text></TouchableOpacity>
        {editingId ? <TouchableOpacity style={[adminUi.outlineButton, { marginTop: 8 }]} onPress={() => { setEditingId(null); setAmount(''); setDate('2026-11-02'); setDescription(''); setRelatedUnitId(''); }}><Text style={adminUi.buttonText}>Batal Edit</Text></TouchableOpacity> : null}
      </View>
      <Text style={adminUi.sectionTitle}>Riwayat Pengeluaran</Text>
      {expenses.map((expense) => <View key={expense.id} style={styles.expenseRow}><View style={{ flex: 1 }}><Text style={styles.expenseTitle}>{expense.description}</Text><Text style={styles.helper}>{expense.date} · {expense.category}{expense.relatedUnitId ? ` · ${expense.relatedUnitId}` : ''}</Text><Text style={styles.expenseAmount}>{formatRupiah(expense.amount)}</Text></View><TouchableOpacity style={styles.editButton} onPress={() => { setEditingId(expense.id); setCategory(expense.category); setAmount(String(expense.amount)); setDate(expense.date); setDescription(expense.description); setRelatedUnitId(expense.relatedUnitId ?? ''); }}><Text style={styles.editText}>Edit</Text></TouchableOpacity></View>)}
    </AdminPageLayout>
  );
}
const styles = StyleSheet.create({
  totalCard: { padding: SIZES.large, borderRadius: SIZES.radiusLarge, backgroundColor: '#E0F2FE', marginBottom: SIZES.large }, totalLabel: { ...FONTS.caption, color: COLORS.secondaryDark }, totalValue: { ...FONTS.headline1, color: COLORS.secondaryDark, marginTop: 5 }, helper: { ...FONTS.caption, color: COLORS.textSecondary, marginTop: 4 },
  cardTitle: { ...FONTS.labelLarge, color: COLORS.secondaryDark, marginBottom: 14 }, label: { ...FONTS.labelMedium, color: COLORS.textPrimary, marginBottom: 7 }, categoryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 }, categoryText: { ...FONTS.caption, color: COLORS.textSecondary }, categoryActive: { color: COLORS.secondaryDark, fontWeight: '700' },
  expenseRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: SIZES.radiusMedium, padding: 13, marginBottom: 9 }, expenseTitle: { ...FONTS.labelMedium, color: COLORS.textPrimary }, expenseAmount: { ...FONTS.labelMedium, color: COLORS.secondaryDark, marginTop: 6 }, editButton: { paddingHorizontal: 11, paddingVertical: 8, borderRadius: 9, backgroundColor: '#E0F2FE', marginLeft: 8 }, editText: { ...FONTS.caption, color: COLORS.secondaryDark, fontWeight: '700' },
});
