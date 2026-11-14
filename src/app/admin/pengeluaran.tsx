
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import AdminPageLayout, {
  adminUi,
} from '../../components/organisms/AdminPageLayout';

import { useAdmin } from '../../context/AdminContext';

import {
  ExpenseCategory,
  formatRupiah,
} from '../../constants/adminTypes';

import {
  COLORS,
  FONTS,
  SIZES,
} from '../../constants/theme';

const CATEGORIES: ExpenseCategory[] = [
  'Perawatan',
  'Spare Part',
  'Operasional',
  'Lainnya',
];

const getLocalDate = () => {
  const now = new Date();

  return `${now.getFullYear()}-${String(
    now.getMonth() + 1,
  ).padStart(2, '0')}-${String(
    now.getDate(),
  ).padStart(2, '0')}`;
};

const isValidDate = (value: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split('-').map(Number);

  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};

type CategoryFilter = 'Semua' | ExpenseCategory;

const FILTERS: CategoryFilter[] = [
  'Semua',
  ...CATEGORIES,
];

export default function ExpenseScreen() {
  const {
    expenses,
    bikes,
    addExpense,
    updateExpense,
  } = useAdmin();

  const [category, setCategory] =
    useState<ExpenseCategory>('Operasional');

  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(getLocalDate());
  const [description, setDescription] = useState('');
  const [relatedUnitId, setRelatedUnitId] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [activeFilter, setActiveFilter] =
    useState<CategoryFilter>('Semua');

  // Total seluruh pengeluaran.
  const total = useMemo(
    () =>
      expenses.reduce(
        (sum, expense) => sum + expense.amount,
        0,
      ),
    [expenses],
  );

  // Total pengeluaran bulan berjalan.
  const monthlyTotal = useMemo(() => {
    const now = new Date();

    const currentMonth = `${now.getFullYear()}-${String(
      now.getMonth() + 1,
    ).padStart(2, '0')}`;

    return expenses
      .filter((expense) =>
        expense.date.startsWith(currentMonth),
      )
      .reduce(
        (sum, expense) => sum + expense.amount,
        0,
      );
  }, [expenses]);

  // Filter riwayat berdasarkan kategori.
  const filteredExpenses = useMemo(() => {
    if (activeFilter === 'Semua') {
      return expenses;
    }

    return expenses.filter(
      (expense) => expense.category === activeFilter,
    );
  }, [expenses, activeFilter]);

  const resetForm = () => {
    setCategory('Operasional');
    setAmount('');
    setDate(getLocalDate());
    setDescription('');
    setRelatedUnitId('');
    setEditingId(null);
  };

  const handleAdd = async () => {
    if (saving) return;

    const value = Number.parseInt(
      amount.replace(/\D/g, ''),
      10,
    );

    if (!Number.isFinite(value) || value <= 0) {
      Alert.alert(
        'Nominal Belum Valid',
        'Masukkan nominal pengeluaran lebih dari nol.',
      );
      return;
    }

    if (!isValidDate(date.trim())) {
      Alert.alert(
        'Tanggal Belum Valid',
        'Masukkan tanggal yang benar dengan format YYYY-MM-DD.',
      );
      return;
    }

    if (description.trim().length < 3) {
      Alert.alert(
        'Deskripsi Diperlukan',
        'Tuliskan keterangan pengeluaran minimal 3 karakter.',
      );
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
      setSaving(true);

      if (editingId) {
        await updateExpense(editingId, payload);

        Alert.alert(
          'Pengeluaran Diperbarui',
          'Catatan pengeluaran berhasil diperbarui.',
        );
      } else {
        await addExpense(payload);

        Alert.alert(
          'Pengeluaran Dicatat',
          'Data pengeluaran berhasil disimpan.',
        );
      }

      resetForm();
    } catch (error: any) {
      Alert.alert(
        'Gagal Menyimpan Pengeluaran',
        error?.message ?? 'Silakan coba lagi.',
      );
    } finally {
      setSaving(false);
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
      subtitle="Catat dan kelola biaya operasional di luar transaksi penyewaan."
      activeTab="Lainnya"
      showBottomNav
    >
      {/* RINGKASAN PENGELUARAN */}
      <View style={styles.totalCard}>
        <View style={styles.totalHeader}>
          <View style={styles.totalIcon}>
            <Ionicons
              name="wallet-outline"
              size={22}
              color={COLORS.secondaryDark}
            />
          </View>

          <Text style={styles.totalLabel}>
            Total seluruh pengeluaran
          </Text>
        </View>

        <Text style={styles.totalValue}>
          {formatRupiah(total)}
        </Text>

        <View style={styles.summaryDivider} />

        <View style={styles.summaryBottom}>
          <View>
            <Text style={styles.monthlyLabel}>
              Pengeluaran bulan ini
            </Text>

            <Text style={styles.monthlyValue}>
              {formatRupiah(monthlyTotal)}
            </Text>
          </View>

          <View style={styles.countBadge}>
            <Text style={styles.countValue}>
              {expenses.length}
            </Text>

            <Text style={styles.countLabel}>
              Catatan
            </Text>
          </View>
        </View>
      </View>

      {/* FORM TAMBAH / EDIT */}
      <View style={adminUi.card}>
        <View style={styles.formHeader}>
          <Text style={styles.cardTitle}>
            {editingId
              ? 'Edit Pengeluaran'
              : 'Tambah Pengeluaran'}
          </Text>

          {editingId ? (
            <View style={styles.editBadge}>
              <Text style={styles.editBadgeText}>
                Mode Edit
              </Text>
            </View>
          ) : null}
        </View>

        {/* KATEGORI */}
        <Text style={styles.label}>
          Kategori Pengeluaran
        </Text>

        <View style={styles.categoryRow}>
          {CATEGORIES.map((item) => {
            const selected = category === item;

            return (
              <TouchableOpacity
                key={item}
                onPress={() => setCategory(item)}
                style={[
                  adminUi.chip,
                  selected && adminUi.chipActive,
                ]}
                disabled={saving}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selected && styles.categoryActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* NOMINAL */}
        <Text style={styles.label}>
          Nominal Pengeluaran (Rp)
        </Text>

        <TextInput
          style={adminUi.input}
          value={amount}
          onChangeText={(value) =>
            setAmount(value.replace(/[^0-9]/g, ''))
          }
          keyboardType="number-pad"
          placeholder="Contoh: 50000"
          placeholderTextColor={COLORS.textSecondary}
          editable={!saving}
        />

        {amount ? (
          <Text style={styles.amountPreview}>
            {formatRupiah(Number(amount))}
          </Text>
        ) : null}

        {/* TANGGAL */}
        <Text style={styles.label}>
          Tanggal Pengeluaran
        </Text>

        <TextInput
          style={adminUi.input}
          value={date}
          onChangeText={setDate}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={COLORS.textSecondary}
          editable={!saving}
        />

        <Text style={styles.inputHelper}>
          Gunakan format tahun-bulan-tanggal.
        </Text>

        {/* DESKRIPSI */}
        <Text style={styles.label}>
          Deskripsi
        </Text>

        <TextInput
          style={[
            adminUi.input,
            styles.descriptionInput,
          ]}
          value={description}
          onChangeText={setDescription}
          placeholder="Contoh: Pembelian oli dan servis sepeda."
          placeholderTextColor={COLORS.textSecondary}
          multiline
          textAlignVertical="top"
          editable={!saving}
        />

        {/* UNIT TERKAIT */}
        <Text style={styles.label}>
          Unit Terkait (Opsional)
        </Text>

        <Text style={styles.inputHelper}>
          Pilih unit jika pengeluaran berhubungan dengan sepeda tertentu.
        </Text>

        <View style={styles.categoryRow}>
          {bikes.map((bike) => {
            const selected = relatedUnitId === bike.id;

            return (
              <TouchableOpacity
                key={bike.id}
                onPress={() =>
                  setRelatedUnitId(
                    selected ? '' : bike.id,
                  )
                }
                style={[
                  adminUi.chip,
                  selected && adminUi.chipActive,
                ]}
                disabled={saving}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selected && styles.categoryActive,
                  ]}
                >
                  {bike.id}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* TOMBOL SIMPAN */}
        <TouchableOpacity
          style={[
            adminUi.button,
            styles.submitButton,
            saving && styles.disabledButton,
          ]}
          onPress={handleAdd}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={adminUi.buttonText}>
              {editingId
                ? 'Perbarui Pengeluaran'
                : 'Simpan Pengeluaran'}
            </Text>
          )}
        </TouchableOpacity>

        {editingId ? (
          <TouchableOpacity
            style={[
              adminUi.outlineButton,
              styles.cancelButton,
            ]}
            onPress={resetForm}
            disabled={saving}
          >
            <Text style={adminUi.buttonText}>
              Batal Edit
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* RIWAYAT PENGELUARAN */}
      <Text style={adminUi.sectionTitle}>
        Riwayat Pengeluaran
      </Text>

      <Text style={styles.historyCount}>
        {filteredExpenses.length} catatan pengeluaran
      </Text>

      {/* FILTER KATEGORI */}
      <View style={styles.filterRow}>
        {FILTERS.map((item) => {
          const selected = activeFilter === item;

          return (
            <TouchableOpacity
              key={item}
              onPress={() => setActiveFilter(item)}
              style={[
                styles.filterChip,
                selected && styles.filterChipActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  selected && styles.filterTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* DAFTAR PENGELUARAN */}
      {filteredExpenses.length > 0 ? (
        filteredExpenses.map((expense) => (
          <View
            key={expense.id}
            style={styles.expenseRow}
          >
            <View style={styles.expenseIcon}>
              <Ionicons
                name="receipt-outline"
                size={20}
                color={COLORS.secondaryDark}
              />
            </View>

            <View style={styles.expenseContent}>
              <Text style={styles.expenseTitle}>
                {expense.description}
              </Text>

              <Text style={styles.helper}>
                {expense.date}
              </Text>

              <View style={styles.expenseMeta}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>
                    {expense.category}
                  </Text>
                </View>

                {expense.relatedUnitId ? (
                  <Text style={styles.unitMeta}>
                    {expense.relatedUnitId}
                  </Text>
                ) : null}
              </View>

              <Text style={styles.expenseAmount}>
                {formatRupiah(expense.amount)}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEdit(expense)}
              disabled={saving}
            >
              <Ionicons
                name="create-outline"
                size={17}
                color={COLORS.secondaryDark}
              />

              <Text style={styles.editText}>
                Edit
              </Text>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Ionicons
            name="receipt-outline"
            size={34}
            color={COLORS.textSecondary}
          />

          <Text style={styles.emptyTitle}>
            Belum Ada Pengeluaran
          </Text>

          <Text style={styles.emptyDescription}>
            {activeFilter === 'Semua'
              ? 'Catatan pengeluaran yang berhasil disimpan akan muncul di sini.'
              : `Belum ada catatan pengeluaran kategori ${activeFilter}.`}
          </Text>
        </View>
      )}
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

  totalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },

  totalIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  totalLabel: {
    ...FONTS.caption,
    color: COLORS.secondaryDark,
  },

  totalValue: {
    ...FONTS.headline1,
    color: COLORS.secondaryDark,
    marginTop: 9,
  },

  summaryDivider: {
    height: 1,
    backgroundColor: '#BAE6FD',
    marginVertical: 15,
  },

  summaryBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  monthlyLabel: {
    ...FONTS.caption,
    color: COLORS.secondaryDark,
  },

  monthlyValue: {
    ...FONTS.labelLarge,
    color: COLORS.secondaryDark,
    marginTop: 4,
  },

  countBadge: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },

  countValue: {
    ...FONTS.labelLarge,
    color: COLORS.secondaryDark,
  },

  countLabel: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },

  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    flexWrap: 'wrap',
    gap: 8,
  },

  cardTitle: {
    ...FONTS.labelLarge,
    color: COLORS.secondaryDark,
  },

  editBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 7,
  },

  editBadgeText: {
    ...FONTS.caption,
    color: '#92400E',
    fontWeight: '700',
  },

  label: {
    ...FONTS.labelMedium,
    color: COLORS.textPrimary,
    marginTop: 14,
    marginBottom: 7,
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

  amountPreview: {
    ...FONTS.caption,
    color: COLORS.secondaryDark,
    marginTop: 6,
  },

  inputHelper: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },

  descriptionInput: {
    minHeight: 75,
    paddingTop: 11,
    textAlignVertical: 'top',
  },

  submitButton: {
    marginTop: 18,
  },

  cancelButton: {
    marginTop: 8,
  },

  disabledButton: {
    opacity: 0.55,
  },

  historyCount: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: -7,
    marginBottom: 12,
  },

  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginBottom: 14,
  },

  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },

  filterChipActive: {
    backgroundColor: COLORS.secondaryDark,
    borderColor: COLORS.secondaryDark,
  },

  filterText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },

  filterTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  expenseRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusMedium,
    padding: 13,
    marginBottom: 9,
  },

  expenseIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  expenseContent: {
    flex: 1,
    minWidth: 0,
  },

  expenseTitle: {
    ...FONTS.labelMedium,
    color: COLORS.textPrimary,
  },

  helper: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: 4,
  },

  expenseMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 7,
    marginTop: 7,
  },

  categoryBadge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },

  categoryBadgeText: {
    ...FONTS.caption,
    color: COLORS.secondaryDark,
  },

  unitMeta: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },

  expenseAmount: {
    ...FONTS.labelMedium,
    color: COLORS.secondaryDark,
    marginTop: 8,
  },

  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 8,
    borderRadius: 9,
    backgroundColor: '#E0F2FE',
    marginLeft: 7,
  },

  editText: {
    ...FONTS.caption,
    color: COLORS.secondaryDark,
    fontWeight: '700',
  },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusLarge,
    padding: 25,
  },

  emptyTitle: {
    ...FONTS.labelLarge,
    color: COLORS.textPrimary,
    marginTop: 12,
  },

  emptyDescription: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 6,
  },
});
