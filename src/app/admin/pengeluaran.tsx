import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AdminPageLayout, { adminUi } from '../../components/organisms/AdminPageLayout';
import AdminDataState from '../../components/molecules/AdminDataState';
import { useAdmin } from '../../context/AdminContext';
import { ExpenseCategory, formatRupiah } from '../../constants/adminTypes';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

const CATEGORIES: ExpenseCategory[] = ['Perawatan', 'Spare Part', 'Operasional', 'Lainnya'];

const getLocalDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function ExpenseScreen() {
  const {
    expenses,
    bikes,
    addExpense,
    updateExpense,
    loading,
    error,
    refreshData,
  } = useAdmin();

  const [category, setCategory] = useState<ExpenseCategory>('Operasional');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(getLocalDate());
  const [description, setDescription] = useState('');
  const [relatedUnitId, setRelatedUnitId] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const clearForm = () => {
    setAmount('');
    setDate(getLocalDate());
    setDescription('');
    setRelatedUnitId('');
    setEditingId(null);
    setCategory('Operasional');
  };

  const handleAdd = async () => {
    const value = Number.parseInt(amount.replace(/\D/g, ''), 10);

    if (!Number.isFinite(value) || value <= 0) {
      Alert.alert('Nominal belum valid', 'Masukkan nominal pengeluaran lebih dari nol.');
      return;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date.trim())) {
      Alert.alert('Tanggal belum valid', 'Gunakan format YYYY-MM-DD.');
      return;
    }

    if (description.trim().length < 3) {
      Alert.alert('Deskripsi diperlukan', 'Tuliskan keterangan pengeluaran minimal 3 karakter.');
      return;
    }

    const payload = {
      category,
      amount: value,
      date: date.trim(),
      description: description.trim(),
      relatedUnitId: relatedUnitId || undefined,
    };

    try {
      if (editingId) {
        await updateExpense(editingId, payload);
        Alert.alert('Pengeluaran diperbarui', 'Catatan pengeluaran berhasil diperbarui.');
      } else {
        await addExpense(payload);
        Alert.alert('Pengeluaran dicatat', 'Catatan pengeluaran berhasil disimpan.');
      }
      clearForm();
    } catch (saveError: any) {
      Alert.alert(
        'Gagal Menyimpan Pengeluaran',
        saveError?.message ?? 'Silakan coba lagi.',
      );
    }
  };

  const handleEdit = (expense: (typeof expenses)[number]) => {
    setEditingId(expense.id);
    setCategory(expense.category);
    setAmount(String(expense.amount));
    setDate(expense.date);
    setDescription(expense.description);
    setRelatedUnitId(expense.relatedUnitId ?? '');
  };

  return (
    <AdminPageLayout
      title="Pengeluaran"
      subtitle="Catat biaya operasional di luar transaksi penyewaan."
      activeTab="Lainnya"
      showBottomNav
    >
      {loading ? (
        <AdminDataState kind="loading" title="Memuat catatan pengeluaran" />
      ) : null}

      {!loading && error ? (
        <AdminDataState
          kind="error"
          title="Catatan pengeluaran belum dapat dimuat"
          description="Periksa koneksi, lalu coba muat data kembali."
          onRetry={refreshData}
        />
      ) : null}

      {!loading && !error ? (
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total pengeluaran tercatat</Text>
          <Text style={styles.totalValue}>{formatRupiah(total)}</Text>
          <Text style={styles.helper}>Akumulasi dari data pengeluaran yang tersimpan.</Text>
        </View>
      ) : null}

      <View style={adminUi.card}>
        <Text style={styles.cardTitle}>
          {editingId ? 'Edit Pengeluaran' : 'Tambah Pengeluaran'}
        </Text>

        <Text style={styles.label}>Kategori</Text>
        <View style={styles.categoryRow}>
          {CATEGORIES.map((item) => {
            const selected = category === item;

            return (
              <TouchableOpacity
                key={item}
                onPress={() => setCategory(item)}
                style={[adminUi.chip, selected && adminUi.chipActive]}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={`Pilih kategori ${item}`}
              >
                <Text style={[styles.categoryText, selected && styles.categoryActive]}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={[styles.label, styles.fieldLabel]}>Nominal (Rp)</Text>
        <TextInput
          style={adminUi.input}
          value={amount}
          onChangeText={(value) => setAmount(value.replace(/[^0-9]/g, ''))}
          keyboardType="number-pad"
          placeholder="Contoh: 50000"
          placeholderTextColor={COLORS.textSecondary}
          accessibilityLabel="Nominal pengeluaran dalam rupiah"
        />

        <Text style={[styles.label, styles.fieldLabel]}>Tanggal (YYYY-MM-DD)</Text>
        <TextInput
          style={adminUi.input}
          value={date}
          onChangeText={setDate}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={COLORS.textSecondary}
          accessibilityLabel="Tanggal pengeluaran dengan format tahun-bulan-tanggal"
        />

        <Text style={[styles.label, styles.fieldLabel]}>Deskripsi</Text>
        <TextInput
          style={adminUi.input}
          value={description}
          onChangeText={setDescription}
          placeholder="Keterangan pengeluaran"
          placeholderTextColor={COLORS.textSecondary}
          accessibilityLabel="Deskripsi pengeluaran"
        />

        <Text style={[styles.label, styles.fieldLabel]}>Unit terkait (opsional)</Text>
        <View style={styles.categoryRow}>
          {bikes.map((bike) => {
            const selected = relatedUnitId === bike.id;

            return (
              <TouchableOpacity
                key={bike.id}
                onPress={() => setRelatedUnitId(selected ? '' : bike.id)}
                style={[adminUi.chip, selected && adminUi.chipActive]}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={`${selected ? 'Lepas hubungan' : 'Hubungkan'} dengan unit ${bike.id}`}
              >
                <Text style={[styles.categoryText, selected && styles.categoryActive]}>
                  {bike.id}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[adminUi.button, styles.saveButton]}
          onPress={handleAdd}
          accessibilityRole="button"
          accessibilityLabel={editingId ? 'Perbarui catatan pengeluaran' : 'Simpan catatan pengeluaran'}
        >
          <Text style={adminUi.buttonText}>
            {editingId ? 'Perbarui Pengeluaran' : 'Simpan Pengeluaran'}
          </Text>
        </TouchableOpacity>

        {editingId ? (
          <TouchableOpacity
            style={[adminUi.outlineButton, styles.cancelButton]}
            onPress={clearForm}
            accessibilityRole="button"
            accessibilityLabel="Batalkan edit pengeluaran"
          >
            <Text style={adminUi.buttonText}>Batal Edit</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <Text style={adminUi.sectionTitle}>Riwayat Pengeluaran</Text>

      {!loading && !error && expenses.length === 0 ? (
        <AdminDataState
          kind="empty"
          title="Belum ada pengeluaran"
          description="Catatan pengeluaran yang disimpan akan tampil di sini."
        />
      ) : null}

      {!loading && !error
        ? expenses.map((expense) => (
            <View key={expense.id} style={styles.expenseRow}>
              <View style={styles.expenseCopy}>
                <Text style={styles.expenseTitle}>{expense.description}</Text>
                <Text style={styles.helper}>
                  {expense.date} · {expense.category}
                  {expense.relatedUnitId ? ` · ${expense.relatedUnitId}` : ''}
                </Text>
                <Text style={styles.expenseAmount}>{formatRupiah(expense.amount)}</Text>
              </View>
              <TouchableOpacity
                style={styles.editButton}
                accessibilityRole="button"
                accessibilityLabel={`Edit pengeluaran ${expense.description}`}
                onPress={() => handleEdit(expense)}
              >
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
            </View>
          ))
        : null}
    </AdminPageLayout>
  );
}

const styles = StyleSheet.create({
  totalCard: {
    padding: SIZES.large,
    borderRadius: SIZES.radiusLarge,
    backgroundColor: '#E0F2FE',
    marginBottom: SIZES.large,
  },
  totalLabel: {
    ...FONTS.caption,
    color: COLORS.secondaryDark,
  },
  totalValue: {
    ...FONTS.headline1,
    color: COLORS.secondaryDark,
    marginTop: 5,
  },
  helper: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  cardTitle: {
    ...FONTS.labelLarge,
    color: COLORS.secondaryDark,
    marginBottom: 14,
  },
  label: {
    ...FONTS.labelMedium,
    color: COLORS.textPrimary,
    marginBottom: 7,
  },
  fieldLabel: {
    marginTop: 14,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  categoryText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  categoryActive: {
    color: COLORS.secondaryDark,
    fontWeight: '700',
  },
  saveButton: {
    marginTop: 18,
  },
  cancelButton: {
    marginTop: 8,
  },
  expenseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusMedium,
    padding: 13,
    marginBottom: 9,
  },
  expenseCopy: {
    flex: 1,
    minWidth: 0,
  },
  expenseTitle: {
    ...FONTS.labelMedium,
    color: COLORS.textPrimary,
  },
  expenseAmount: {
    ...FONTS.labelMedium,
    color: COLORS.secondaryDark,
    marginTop: 6,
  },
  editButton: {
    minHeight: 44,
    minWidth: 52,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 11,
    borderRadius: 9,
    backgroundColor: '#E0F2FE',
    marginLeft: 8,
  },
  editText: {
    ...FONTS.caption,
    color: COLORS.secondaryDark,
    fontWeight: '700',
  },
});
