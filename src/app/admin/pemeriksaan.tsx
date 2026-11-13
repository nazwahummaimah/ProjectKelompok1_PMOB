import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AdminPageLayout, { adminUi } from '../../components/organisms/AdminPageLayout';
import AdminDataState from '../../components/molecules/AdminDataState';
import { useAdmin } from '../../context/AdminContext';
import { ReturnCondition } from '../../constants/adminTypes';
import { COLORS, FONTS } from '../../constants/theme';

const CONDITIONS: ReturnCondition[] = ['Baik', 'Rusak ringan', 'Rusak berat'];

export default function InspectionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const {
    transactions,
    bikes,
    completeReturn,
    loading,
    error,
    refreshData,
  } = useAdmin();

  const transaction =
    transactions.find(
      (item) => item.id === id && item.status === 'Sedang Berlangsung',
    ) ??
    (!id
      ? transactions.find((item) => item.status === 'Sedang Berlangsung')
      : undefined);

  const [conditions, setConditions] = useState<Record<string, ReturnCondition>>({});
  const [notes, setNotes] = useState('');

  if (loading) {
    return (
      <AdminPageLayout title="Pemeriksaan Unit" showBack>
        <AdminDataState kind="loading" title="Memuat data pemeriksaan" />
      </AdminPageLayout>
    );
  }

  if (error) {
    return (
      <AdminPageLayout title="Pemeriksaan Unit" showBack>
        <AdminDataState
          kind="error"
          title="Data pemeriksaan belum dapat dimuat"
          description="Periksa koneksi, lalu coba muat data kembali."
          onRetry={refreshData}
        />
      </AdminPageLayout>
    );
  }

  if (!transaction) {
    return (
      <AdminPageLayout
        title="Pemeriksaan Unit"
        subtitle="Tidak ada transaksi aktif untuk diperiksa."
        showBack
      >
        <AdminDataState
          kind="empty"
          title="Transaksi tidak ditemukan"
          description="Pilih pemeriksaan dari transaksi pengembalian yang masih aktif."
        />
      </AdminPageLayout>
    );
  }

  const units = bikes.filter((bike) => transaction.unitIds.includes(bike.id));

  if (units.length === 0) {
    return (
      <AdminPageLayout
        title="Pemeriksaan Unit"
        subtitle={`Transaksi ${transaction.id}`}
        showBack
      >
        <AdminDataState
          kind="empty"
          title="Unit tidak ditemukan"
          description="Tidak ada unit sepeda yang cocok dengan transaksi ini. Pemeriksaan belum dapat disimpan."
        />
      </AdminPageLayout>
    );
  }

  const handleFinish = () => {
    const finalConditions = Object.fromEntries(
      units.map((unit) => [unit.id, conditions[unit.id] ?? 'Baik']),
    ) as Record<string, ReturnCondition>;
    const hasDamage = Object.values(finalConditions).some(
      (condition) => condition !== 'Baik',
    );

    Alert.alert(
      'Konfirmasi Pemeriksaan',
      hasDamage
        ? 'Ada unit yang ditandai mengalami kerusakan. Periksa kembali pilihan sebelum menyelesaikan.'
        : 'Semua unit ditandai dalam kondisi baik. Selesaikan pemeriksaan?',
      [
        { text: 'Periksa Lagi', style: 'cancel' },
        {
          text: 'Selesaikan',
          onPress: async () => {
            try {
              await completeReturn(transaction.id, finalConditions, notes.trim());
              router.replace('/admin/transaksi' as any);
            } catch (saveError: any) {
              Alert.alert(
                'Gagal Menyimpan Pemeriksaan',
                saveError?.message ?? 'Silakan coba lagi.',
              );
            }
          },
        },
      ],
    );
  };

  return (
    <AdminPageLayout
      title="Pemeriksaan Unit"
      subtitle={`Transaksi ${transaction.id}. Pilih kondisi untuk setiap sepeda.`}
      showBack
    >
      <View style={styles.notice}>
        <Text style={styles.noticeText}>
          Status unit tidak berubah sebelum pemeriksaan disimpan.
        </Text>
      </View>

      {units.map((unit) => (
        <View key={unit.id} style={adminUi.card}>
          <Text style={styles.unitId}>{unit.id}</Text>
          <Text style={styles.unitName}>{unit.name}</Text>
          <Text style={styles.label}>Kondisi setelah dikembalikan</Text>

          <View style={styles.choiceRow}>
            {CONDITIONS.map((condition) => {
              const selected = (conditions[unit.id] ?? 'Baik') === condition;

              return (
                <TouchableOpacity
                  key={condition}
                  onPress={() =>
                    setConditions((current) => ({
                      ...current,
                      [unit.id]: condition,
                    }))
                  }
                  style={[adminUi.chip, selected && adminUi.chipActive]}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selected }}
                  accessibilityLabel={`${unit.name}: ${condition}`}
                >
                  <Text style={[styles.choiceText, selected && styles.choiceActive]}>
                    {condition}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ))}

      <View style={adminUi.card}>
        <Text style={styles.label}>Catatan pemeriksaan (opsional)</Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          accessibilityLabel="Catatan pemeriksaan"
          style={[adminUi.input, styles.multiline]}
          placeholder="Contoh: rem belakang perlu penyetelan."
          placeholderTextColor={COLORS.textSecondary}
          multiline
          textAlignVertical="top"
        />
        <Text style={styles.helper}>
          Tandai kondisi sesuai hasil pemeriksaan fisik setiap unit.
        </Text>
      </View>

      <TouchableOpacity
        style={adminUi.button}
        onPress={handleFinish}
        accessibilityRole="button"
        accessibilityLabel="Simpan pemeriksaan dan selesaikan pengembalian"
      >
        <Text style={adminUi.buttonText}>Simpan Pemeriksaan & Selesaikan</Text>
      </TouchableOpacity>
    </AdminPageLayout>
  );
}

const styles = StyleSheet.create({
  notice: {
    backgroundColor: '#E0F2FE',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  noticeText: {
    ...FONTS.caption,
    color: COLORS.secondaryDark,
  },
  unitId: {
    ...FONTS.caption,
    color: COLORS.secondaryDark,
    fontWeight: '700',
  },
  unitName: {
    ...FONTS.labelLarge,
    color: COLORS.textPrimary,
    marginTop: 3,
    marginBottom: 14,
  },
  label: {
    ...FONTS.labelMedium,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  choiceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  choiceText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  choiceActive: {
    color: COLORS.secondaryDark,
    fontWeight: '700',
  },
  multiline: {
    minHeight: 90,
    paddingTop: 12,
  },
  helper: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginTop: 10,
  },
});
