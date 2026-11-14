
import React, { useState } from 'react';
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import AdminPageLayout, {
  adminUi,
} from '../../components/organisms/AdminPageLayout';

import AdminStatusBadge from '../../components/molecules/AdminStatusBadge';
import { useAdmin } from '../../context/AdminContext';
import { MaintenanceType } from '../../constants/adminTypes';
import { supabase } from '../../lib/supabase';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

const TYPES: MaintenanceType[] = [
  'Perbaikan',
  'Servis rutin',
  'Penggantian komponen',
];

export default function MaintenanceScreen() {
  const {
    bikes,
    maintenance,
    startMaintenance,
    completeMaintenance,
    refreshData,
  } = useAdmin();

  const [selectedTypes, setSelectedTypes] = useState<
    Record<string, MaintenanceType>
  >({});

  const [workNotes, setWorkNotes] = useState<
    Record<string, string>
  >({});

  // Form tambah perawatan manual
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedBikeId, setSelectedBikeId] = useState('');
  const [newType, setNewType] =
    useState<MaintenanceType>('Servis rutin');
  const [newNote, setNewNote] = useState('');
  const [saving, setSaving] = useState(false);

  const availableBikes = bikes.filter(
    (bike) => bike.status === 'Tersedia',
  );

  const handleAddMaintenance = async () => {
    if (!selectedBikeId) {
      Alert.alert(
        'Unit Belum Dipilih',
        'Silakan pilih unit sepeda terlebih dahulu.',
      );
      return;
    }

    if (!newNote.trim()) {
      Alert.alert(
        'Catatan Kosong',
        'Silakan isi catatan perawatan terlebih dahulu.',
      );
      return;
    }

    try {
      setSaving(true);

      const { error } = await supabase.rpc(
        'admin_create_maintenance',
        {
          p_bike_id: selectedBikeId,
          p_type: newType,
          p_note: newNote.trim(),
        },
      );

      if (error) {
        throw error;
      }

      await refreshData();

      setShowAddForm(false);
      setSelectedBikeId('');
      setNewType('Servis rutin');
      setNewNote('');

      Alert.alert(
        'Berhasil',
        'Catatan perawatan berhasil ditambahkan. Status unit berubah menjadi Perawatan.',
      );
    } catch (error: any) {
      Alert.alert(
        'Gagal Menambahkan Perawatan',
        error?.message ?? 'Silakan coba lagi.',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminPageLayout
      title="Perawatan Unit"
      subtitle="Kelola unit yang perlu diperbaiki, diservis, dan diperiksa kembali."
      activeTab="Lainnya"
      showBottomNav
    >
      {/* Ringkasan */}
      <View style={styles.summary}>
        <Ionicons
          name="construct-outline"
          size={22}
          color="#B45309"
        />

        <View style={styles.summaryContent}>
          <Text style={styles.summaryValue}>
            {
              bikes.filter(
                (bike) => bike.status === 'Perawatan',
              ).length
            } unit
          </Text>

          <Text style={styles.summaryText}>
            Belum dapat digunakan
          </Text>
        </View>
      </View>

      {/* Tombol tambah perawatan */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAddForm((current) => !current)}
        activeOpacity={0.8}
      >
        <Ionicons
          name={showAddForm ? 'close-circle-outline' : 'add-circle-outline'}
          size={21}
          color="#FFFFFF"
        />

        <Text style={styles.addButtonText}>
          {showAddForm ? 'Tutup Form' : 'Tambah Perawatan'}
        </Text>
      </TouchableOpacity>

      {/* Form tambah perawatan manual */}
      {showAddForm ? (
        <View style={adminUi.card}>
          <Text style={styles.formTitle}>
            Tambah Perawatan Manual
          </Text>

          <Text style={styles.formDescription}>
            Catat servis rutin, perbaikan, atau penggantian komponen unit.
          </Text>

          <Text style={styles.label}>
            Pilih Unit Sepeda
          </Text>

          {availableBikes.length > 0 ? (
            <View style={styles.bikeList}>
              {availableBikes.map((bike) => {
                const isSelected =
                  selectedBikeId === bike.id;

                return (
                  <TouchableOpacity
                    key={bike.id}
                    style={[
                      styles.bikeOption,
                      isSelected && styles.bikeOptionActive,
                    ]}
                    onPress={() => setSelectedBikeId(bike.id)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.bikeOptionContent}>
                      <Text
                        style={[
                          styles.bikeOptionName,
                          isSelected && styles.bikeOptionNameActive,
                        ]}
                      >
                        {bike.name}
                      </Text>

                      <Text style={styles.bikeOptionMeta}>
                        {bike.id} · {bike.category}
                      </Text>
                    </View>

                    <Ionicons
                      name={
                        isSelected
                          ? 'radio-button-on'
                          : 'radio-button-off'
                      }
                      size={21}
                      color={
                        isSelected
                          ? COLORS.secondaryDark
                          : COLORS.textSecondary
                      }
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyBike}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color={COLORS.textSecondary}
              />

              <Text style={styles.emptyBikeText}>
                Tidak ada unit berstatus Tersedia untuk ditambahkan ke perawatan.
              </Text>
            </View>
          )}

          <Text style={styles.label}>
            Jenis Pekerjaan
          </Text>

          <View style={styles.typeRow}>
            {TYPES.map((type) => {
              const isSelected = newType === type;

              return (
                <TouchableOpacity
                  key={type}
                  onPress={() => setNewType(type)}
                  style={[
                    adminUi.chip,
                    isSelected && adminUi.chipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.typeText,
                      isSelected && styles.typeActive,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.label}>
            Catatan Perawatan
          </Text>

          <TextInput
            value={newNote}
            onChangeText={setNewNote}
            style={styles.noteInput}
            multiline
            placeholder="Contoh: Servis rem, pemeriksaan rantai, atau penggantian ban."
            placeholderTextColor={COLORS.textSecondary}
          />

          <TouchableOpacity
            style={[
              adminUi.button,
              styles.saveButton,
              (saving || availableBikes.length === 0) &&
                styles.disabledButton,
            ]}
            onPress={handleAddMaintenance}
            disabled={saving || availableBikes.length === 0}
          >
            {saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={adminUi.buttonText}>
                Simpan Perawatan
              </Text>
            )}
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Daftar perawatan */}
      <Text style={styles.sectionTitle}>
        Daftar Perawatan
      </Text>

      {maintenance.map((item) => {
        const bike = bikes.find(
          (entry) => entry.id === item.unitId,
        );

        return (
          <View key={item.id} style={adminUi.card}>
            {/* Header card */}
            <View style={styles.cardHeader}>
              <Text
                style={styles.recordId}
                numberOfLines={2}
                ellipsizeMode="middle"
              >
                {item.id}
              </Text>

              <View style={styles.badgeContainer}>
                <AdminStatusBadge status={item.status} />
              </View>
            </View>

            <Text style={styles.unitName}>
              {bike?.name ?? item.unitId}
            </Text>

            <Text style={styles.meta}>
              {item.unitId} · {item.date}
            </Text>

            <Text style={styles.note}>
              {item.note}
            </Text>

            {item.status !== 'Selesai' ? (
              <>
                <Text style={styles.label}>
                  Catatan pekerjaan
                </Text>

                <TextInput
                  value={workNotes[item.id] ?? item.note}
                  onChangeText={(value) =>
                    setWorkNotes((current) => ({
                      ...current,
                      [item.id]: value,
                    }))
                  }
                  style={styles.noteInput}
                  multiline
                  placeholder="Catatan pekerjaan perawatan"
                  placeholderTextColor={COLORS.textSecondary}
                />
              </>
            ) : null}

            {item.status === 'Menunggu' ? (
              <>
                <Text style={styles.label}>
                  Jenis pekerjaan
                </Text>

                <View style={styles.typeRow}>
                  {TYPES.map((type) => {
                    const isSelected =
                      (selectedTypes[item.id] ?? item.type) === type;

                    return (
                      <TouchableOpacity
                        key={type}
                        onPress={() =>
                          setSelectedTypes((current) => ({
                            ...current,
                            [item.id]: type,
                          }))
                        }
                        style={[
                          adminUi.chip,
                          isSelected && adminUi.chipActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.typeText,
                            isSelected && styles.typeActive,
                          ]}
                        >
                          {type}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <TouchableOpacity
                  style={[
                    adminUi.button,
                    { marginTop: 13 },
                  ]}
                  onPress={async () => {
                    try {
                      await startMaintenance(
                        item.id,
                        selectedTypes[item.id] ?? item.type,
                        workNotes[item.id] ?? item.note,
                      );
                    } catch (error: any) {
                      Alert.alert(
                        'Gagal Memulai Perawatan',
                        error?.message ?? 'Silakan coba lagi.',
                      );
                    }
                  }}
                >
                  <Text style={adminUi.buttonText}>
                    Mulai Perawatan
                  </Text>
                </TouchableOpacity>
              </>
            ) : null}

            {item.status === 'Sedang Dikerjakan' ? (
              <TouchableOpacity
                style={[
                  adminUi.outlineButton,
                  { marginTop: 12 },
                ]}
                onPress={() =>
                  Alert.alert(
                    'Pemeriksaan Akhir',
                    'Tentukan hasil pemeriksaan setelah pekerjaan selesai.',
                    [
                      {
                        text: 'Belum Layak',
                        onPress: async () => {
                          try {
                            await completeMaintenance(
                              item.id,
                              false,
                            );
                          } catch (error: any) {
                            Alert.alert(
                              'Gagal',
                              error?.message ?? 'Silakan coba lagi.',
                            );
                          }
                        },
                      },
                      {
                        text: 'Layak Digunakan',
                        onPress: async () => {
                          try {
                            await completeMaintenance(
                              item.id,
                              true,
                            );
                          } catch (error: any) {
                            Alert.alert(
                              'Gagal',
                              error?.message ?? 'Silakan coba lagi.',
                            );
                          }
                        },
                      },
                    ],
                  )
                }
              >
                <Text style={adminUi.buttonText}>
                  Selesaikan & Periksa
                </Text>
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
        <View style={adminUi.card}>
          <Text style={styles.meta}>
            Belum ada catatan perawatan.
          </Text>
        </View>
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

  summaryContent: {
    flex: 1,
    minWidth: 0,
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

  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.secondaryDark,
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: SIZES.radiusLarge,
    marginBottom: SIZES.large,
  },

  addButtonText: {
    ...FONTS.labelMedium,
    color: '#FFFFFF',
  },

  formTitle: {
    ...FONTS.labelLarge,
    color: COLORS.textPrimary,
  },

  formDescription: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: 5,
    lineHeight: 19,
  },

  sectionTitle: {
    ...FONTS.labelLarge,
    color: COLORS.textPrimary,
    marginBottom: 12,
  },

  bikeList: {
    gap: 8,
  },

  bikeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 12,
    backgroundColor: COLORS.surface,
  },

  bikeOptionActive: {
    borderColor: COLORS.secondaryDark,
    backgroundColor: '#F0F9FF',
  },

  bikeOptionContent: {
    flex: 1,
    minWidth: 0,
    marginRight: 10,
  },

  bikeOptionName: {
    ...FONTS.labelMedium,
    color: COLORS.textPrimary,
  },

  bikeOptionNameActive: {
    color: COLORS.secondaryDark,
  },

  bikeOptionMeta: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: 3,
  },

  emptyBike: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 10,
  },

  emptyBikeText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    flex: 1,
    lineHeight: 19,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    width: '100%',
  },

  recordId: {
    ...FONTS.caption,
    color: COLORS.secondaryDark,
    fontWeight: '700',
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
  },

  badgeContainer: {
    flexShrink: 0,
    maxWidth: '100%',
    alignItems: 'flex-end',
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

  saveButton: {
    marginTop: 16,
  },

  disabledButton: {
    opacity: 0.5,
  },

  completedText: {
    ...FONTS.caption,
    color: '#15803D',
    marginTop: 12,
  },
});
