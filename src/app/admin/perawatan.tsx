import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AdminPageLayout, { adminUi } from '../../components/organisms/AdminPageLayout';
import AdminStatusBadge from '../../components/molecules/AdminStatusBadge';
import AdminDataState from '../../components/molecules/AdminDataState';
import { useAdmin } from '../../context/AdminContext';
import { MaintenanceType } from '../../constants/adminTypes';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

const TYPES: MaintenanceType[] = ['Perbaikan', 'Servis rutin', 'Penggantian komponen'];

export default function MaintenanceScreen() {
  const {
    bikes,
    maintenance,
    startMaintenance,
    completeMaintenance,
    loading,
    error,
    refreshData,
  } = useAdmin();
  const [selectedTypes, setSelectedTypes] = useState<Record<string, MaintenanceType>>({});
  const [workNotes, setWorkNotes] = useState<Record<string, string>>({});

  const handleStart = async (item: (typeof maintenance)[number]) => {
    try {
      await startMaintenance(
        item.id,
        selectedTypes[item.id] ?? item.type,
        workNotes[item.id] ?? item.note,
      );
    } catch (saveError: any) {
      Alert.alert(
        'Gagal Memulai Perawatan',
        saveError?.message ?? 'Silakan coba lagi.',
      );
    }
  };

  const handleComplete = (itemId: string) => {
    Alert.alert(
      'Pemeriksaan Akhir',
      'Tentukan hasil pemeriksaan setelah pekerjaan selesai.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Belum Layak',
          onPress: async () => {
            try {
              await completeMaintenance(itemId, false);
            } catch (saveError: any) {
              Alert.alert('Gagal', saveError?.message ?? 'Silakan coba lagi.');
            }
          },
        },
        {
          text: 'Layak Digunakan',
          onPress: async () => {
            try {
              await completeMaintenance(itemId, true);
            } catch (saveError: any) {
              Alert.alert('Gagal', saveError?.message ?? 'Silakan coba lagi.');
            }
          },
        },
      ],
    );
  };

  return (
    <AdminPageLayout
      title="Perawatan Unit"
      subtitle="Kelola unit yang perlu diperbaiki, diservis, dan diperiksa kembali."
      activeTab="Lainnya"
      showBottomNav
    >
      {loading ? (
        <AdminDataState kind="loading" title="Memuat data perawatan" />
      ) : null}

      {!loading && error ? (
        <AdminDataState
          kind="error"
          title="Data perawatan belum dapat dimuat"
          description="Periksa koneksi, lalu coba muat data kembali."
          onRetry={refreshData}
        />
      ) : null}

      {!loading && !error ? (
        <>
          <View style={styles.summary}>
            <Ionicons name="construct-outline" size={22} color="#B45309" />
            <View style={styles.summaryCopy}>
              <Text style={styles.summaryValue}>
                {bikes.filter((bike) => bike.status === 'Perawatan').length} unit
              </Text>
              <Text style={styles.summaryText}>Belum dapat digunakan</Text>
            </View>
          </View>

          {maintenance.map((item) => {
            const bike = bikes.find((entry) => entry.id === item.unitId);
            const selectedType = selectedTypes[item.id] ?? item.type;

            return (
              <View key={item.id} style={adminUi.card}>
                <View style={adminUi.between}>
                  <Text style={styles.recordId}>{item.id}</Text>
                  <AdminStatusBadge status={item.status} />
                </View>

                <Text style={styles.unitName}>{bike?.name ?? item.unitId}</Text>
                <Text style={styles.meta}>{item.unitId} · {item.date}</Text>
                <Text style={styles.note}>{item.note}</Text>

                {item.status !== 'Selesai' ? (
                  <>
                    <Text style={styles.label}>Catatan pekerjaan</Text>
                    <TextInput
                      value={workNotes[item.id] ?? item.note}
                      onChangeText={(value) =>
                        setWorkNotes((current) => ({ ...current, [item.id]: value }))
                      }
                      style={styles.noteInput}
                      multiline
                      accessibilityLabel={`Catatan pekerjaan untuk ${item.unitId}`}
                      placeholder="Catatan pekerjaan perawatan"
                      placeholderTextColor={COLORS.textSecondary}
                    />
                  </>
                ) : null}

                {item.status === 'Menunggu' ? (
                  <>
                    <Text style={styles.label}>Jenis pekerjaan</Text>
                    <View style={styles.typeRow}>
                      {TYPES.map((type) => {
                        const selected = selectedType === type;

                        return (
                          <TouchableOpacity
                            key={type}
                            onPress={() =>
                              setSelectedTypes((current) => ({ ...current, [item.id]: type }))
                            }
                            style={[adminUi.chip, selected && adminUi.chipActive]}
                            accessibilityRole="button"
                            accessibilityState={{ selected }}
                            accessibilityLabel={`Pilih ${type} untuk ${item.unitId}`}
                          >
                            <Text style={[styles.typeText, selected && styles.typeActive]}>
                              {type}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                    <TouchableOpacity
                      style={[adminUi.button, styles.startButton]}
                      onPress={() => void handleStart(item)}
                      accessibilityRole="button"
                      accessibilityLabel={`Mulai perawatan ${item.unitId}`}
                    >
                      <Text style={adminUi.buttonText}>Mulai Perawatan</Text>
                    </TouchableOpacity>
                  </>
                ) : null}

                {item.status === 'Sedang Dikerjakan' ? (
                  <TouchableOpacity
                    style={[adminUi.outlineButton, styles.completeButton]}
                    onPress={() => handleComplete(item.id)}
                    accessibilityRole="button"
                    accessibilityLabel={`Selesaikan dan periksa ${item.unitId}`}
                  >
                    <Text style={adminUi.buttonText}>Selesaikan & Periksa</Text>
                  </TouchableOpacity>
                ) : null}

                {item.status === 'Selesai' ? (
                  <Text style={styles.completedText}>
                    Pekerjaan ditutup. Status akhir unit mengikuti hasil pemeriksaan.
                  </Text>
                ) : null}
              </View>
            );
          })}

          {maintenance.length === 0 ? (
            <AdminDataState
              kind="empty"
              title="Belum ada catatan perawatan"
              description="Catatan perawatan unit akan tampil di sini."
            />
          ) : null}
        </>
      ) : null}
    </AdminPageLayout>
  );
}

const styles = StyleSheet.create({
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    padding: SIZES.large,
    borderRadius: SIZES.radiusLarge,
    marginBottom: SIZES.large,
  },
  summaryCopy: {
    flex: 1,
    marginLeft: 10,
  },
  summaryValue: {
    ...FONTS.labelLarge,
    color: '#92400E',
  },
  summaryText: {
    ...FONTS.caption,
    color: '#B45309',
    marginTop: 2,
  },
  recordId: {
    ...FONTS.caption,
    color: COLORS.secondaryDark,
    fontWeight: '700',
  },
  unitName: {
    ...FONTS.labelLarge,
    color: COLORS.textPrimary,
    marginTop: 6,
  },
  meta: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  note: {
    ...FONTS.body,
    color: COLORS.textPrimary,
    marginTop: 10,
    lineHeight: 20,
  },
  label: {
    ...FONTS.labelMedium,
    color: COLORS.textPrimary,
    marginTop: 14,
    marginBottom: 8,
  },
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  typeText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  typeActive: {
    color: COLORS.secondaryDark,
    fontWeight: '700',
  },
  noteInput: {
    minHeight: 64,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    padding: 10,
    color: COLORS.textPrimary,
    ...FONTS.body,
    textAlignVertical: 'top',
  },
  startButton: {
    marginTop: 13,
  },
  completeButton: {
    marginTop: 12,
  },
  completedText: {
    ...FONTS.caption,
    color: '#15803D',
    marginTop: 12,
  },
});
