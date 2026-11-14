
import React, { useCallback, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import {
  useFocusEffect,
  useLocalSearchParams,
} from 'expo-router';

import AdminPageLayout, {
  adminUi,
} from '../../components/organisms/AdminPageLayout';

import AdminStatusBadge from '../../components/molecules/AdminStatusBadge';

import { useAdmin } from '../../context/AdminContext';

import {
  getTransactionById,
  updatePaymentStatus,
} from '../../services/transactionService';

import {
  confirmRentalHandover,
} from '../../services/rentalHandoverService';

import {
  completeRentalReturn,
} from '../../services/rentalReturnService';

import type {
  TransactionWithItems,
} from '../../services/transactionService';

import type {
  RentalReturnCondition,
  RentalReturnItemInput,
} from '../../services/rentalReturnService';

import { formatRupiah } from '../../constants/adminDemo';

import {
  COLORS,
  FONTS,
  SIZES,
} from '../../constants/theme';

type ReturnFormState = {
  condition: RentalReturnCondition | null;
  note: string;
};

const RETURN_CONDITIONS: RentalReturnCondition[] = [
  'Baik',
  'Rusak ringan',
  'Rusak berat',
];

export default function AdminTransactionDetailScreen() {
  const params = useLocalSearchParams<{ id?: string }>();

  const id = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  // Sinkronisasi data operasional Admin.
  const { refreshData } = useAdmin();

  const [transaction, setTransaction] =
    useState<TransactionWithItems | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [savingPayment, setSavingPayment] = useState(false);
  const [processingHandover, setProcessingHandover] = useState(false);
  const [processingReturn, setProcessingReturn] = useState(false);

  const [returnNotes, setReturnNotes] = useState('');

  const [returnForms, setReturnForms] = useState<
    Record<string, ReturnFormState>
  >({});

  // -----------------------------------------
  // LOAD DETAIL TRANSAKSI
  // -----------------------------------------

  const loadTransaction = useCallback(async () => {
    if (!id) {
      setError('ID transaksi tidak ditemukan.');
      setTransaction(null);
      setLoading(false);
      return;
    }

    try {
      setError('');

      const result = await getTransactionById(id);

      if (!result) {
        setTransaction(null);
        setError('Transaksi tidak ditemukan.');
        return;
      }

      setTransaction(result);

      setReturnForms((previous) => {
        const next = { ...previous };

        result.transaction_items.forEach((item) => {
          if (!next[item.bike_id]) {
            next[item.bike_id] = {
              condition: item.return_condition,
              note: item.return_note ?? '',
            };
          }
        });

        return next;
      });

      if (result.status === 'Selesai') {
        setReturnNotes(result.return_notes ?? '');
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Gagal mengambil detail transaksi.'
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      void loadTransaction();
    }, [loadTransaction])
  );

  // -----------------------------------------
  // PEMBAYARAN
  // -----------------------------------------

  const handleMarkPaid = async () => {
    if (!transaction || savingPayment) return;

    try {
      setSavingPayment(true);

      await updatePaymentStatus(transaction.id, 'Lunas');

      await loadTransaction();

      Alert.alert(
        'Pembayaran Berhasil',
        'Status pembayaran telah diperbarui menjadi Lunas.'
      );
    } catch (err) {
      Alert.alert(
        'Gagal Memperbarui Pembayaran',
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan.'
      );
    } finally {
      setSavingPayment(false);
    }
  };

  const confirmPayment = () => {
    Alert.alert(
      'Konfirmasi Pembayaran',
      'Pastikan pembayaran tunai atau QRIS sudah diterima dan diverifikasi.',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Tandai Lunas',
          onPress: () => {
            void handleMarkPaid();
          },
        },
      ]
    );
  };

  // -----------------------------------------
  // SERAH TERIMA
  // -----------------------------------------

  const handleHandover = async () => {
    if (!transaction || processingHandover) return;

    try {
      setProcessingHandover(true);

      await confirmRentalHandover(transaction.id);

      await refreshData();
      await loadTransaction();

      Alert.alert(
        'Serah Terima Berhasil',
        'Status transaksi menjadi Sedang Berlangsung dan sepeda telah ditandai Sedang Disewa.'
      );
    } catch (err) {
      Alert.alert(
        'Serah Terima Gagal',
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat serah terima.'
      );

      await loadTransaction();
    } finally {
      setProcessingHandover(false);
    }
  };

  const confirmHandover = () => {
    if (!transaction || processingHandover) return;

    if (transaction.status !== 'Menunggu Serah Terima') {
      Alert.alert(
        'Tidak Dapat Diproses',
        'Transaksi tidak lagi menunggu serah terima.'
      );
      return;
    }

    Alert.alert(
      'Konfirmasi Serah Terima',
      `Pastikan seluruh ${transaction.transaction_items.length} sepeda benar-benar telah diserahkan kepada ${transaction.customer_name}.`,
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Ya, Serahkan Sepeda',
          onPress: () => {
            void handleHandover();
          },
        },
      ]
    );
  };

  // -----------------------------------------
  // FORM PENGEMBALIAN
  // -----------------------------------------

  const setBikeCondition = (
    bikeId: string,
    condition: RentalReturnCondition
  ) => {
    setReturnForms((previous) => ({
      ...previous,
      [bikeId]: {
        condition,
        note: previous[bikeId]?.note ?? '',
      },
    }));
  };

  const setBikeReturnNote = (
    bikeId: string,
    note: string
  ) => {
    setReturnForms((previous) => ({
      ...previous,
      [bikeId]: {
        condition: previous[bikeId]?.condition ?? null,
        note,
      },
    }));
  };

  // -----------------------------------------
  // PROSES PENGEMBALIAN
  // -----------------------------------------

  const handleReturn = async () => {
    if (!transaction || processingReturn) return;

    const items: RentalReturnItemInput[] =
      transaction.transaction_items.map((item) => {
        const form = returnForms[item.bike_id];

        return {
          bike_id: item.bike_id,
          return_condition: form?.condition as RentalReturnCondition,
          return_note: form?.note ?? '',
        };
      });

    const missingCondition = items.find(
      (item) => !item.return_condition
    );

    if (missingCondition) {
      Alert.alert(
        'Kondisi Belum Lengkap',
        `Pilih kondisi pengembalian untuk sepeda ${missingCondition.bike_id}.`
      );
      return;
    }

    if (items.length === 0) {
      Alert.alert(
        'Tidak Ada Sepeda',
        'Transaksi ini tidak memiliki sepeda untuk dikembalikan.'
      );
      return;
    }

    try {
      setProcessingReturn(true);

      // 1. Proses pengembalian melalui RPC Supabase.
      // RPC juga membuat catatan maintenance untuk sepeda rusak.
      await completeRentalReturn(
        transaction.id,
        returnNotes,
        items
      );

      // 2. Refresh data AdminContext.
      // Termasuk data sepeda, transaksi, dan maintenance.
      await refreshData();

      // 3. Ambil kembali detail transaksi terbaru.
      await loadTransaction();

      Alert.alert(
        'Pengembalian Berhasil',
        'Transaksi telah selesai. Status sepeda dan data perawatan telah diperbarui sesuai kondisi masing-masing unit.'
      );
    } catch (err) {
      Alert.alert(
        'Pengembalian Gagal',
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat memproses pengembalian.'
      );

      await loadTransaction();
    } finally {
      setProcessingReturn(false);
    }
  };

  const confirmReturn = () => {
    if (!transaction || processingReturn) return;

    Alert.alert(
      'Konfirmasi Pengembalian',
      'Pastikan semua kondisi sepeda sudah diperiksa dan sesuai dengan kondisi fisik saat diterima.',
      [
        {
          text: 'Periksa Lagi',
          style: 'cancel',
        },
        {
          text: 'Ya, Selesaikan Transaksi',
          onPress: () => {
            void handleReturn();
          },
        },
      ]
    );
  };

  // -----------------------------------------
  // LOADING
  // -----------------------------------------

  if (loading) {
    return (
      <AdminPageLayout
        title="Detail Transaksi"
        subtitle="Memuat informasi transaksi..."
        showBack
      >
        <View style={styles.centerState}>
          <ActivityIndicator
            size="large"
            color={COLORS.secondaryDark}
          />

          <Text style={styles.stateText}>
            Mengambil data transaksi...
          </Text>
        </View>
      </AdminPageLayout>
    );
  }

  // -----------------------------------------
  // ERROR
  // -----------------------------------------

  if (error || !transaction) {
    return (
      <AdminPageLayout
        title="Detail Transaksi"
        subtitle="Informasi transaksi"
        showBack
      >
        <View style={adminUi.card}>
          <Ionicons
            name="alert-circle-outline"
            size={36}
            color="#DC2626"
          />

          <Text style={styles.errorText}>
            {error || 'Transaksi tidak ditemukan.'}
          </Text>

          <TouchableOpacity
            style={[adminUi.button, { marginTop: 16 }]}
            onPress={() => {
              setLoading(true);
              void loadTransaction();
            }}
          >
            <Text style={adminUi.buttonText}>
              Coba Lagi
            </Text>
          </TouchableOpacity>
        </View>
      </AdminPageLayout>
    );
  }

  const rentalDate = formatDateTime(transaction.rental_date);
  const estimatedEnd = formatDateTime(transaction.estimated_end);

  const actualReturn = transaction.actual_return_time
    ? formatDateTime(transaction.actual_return_time)
    : null;

  return (
    <AdminPageLayout
      title="Detail Transaksi"
      subtitle={transaction.transaction_code}
      showBack
    >
      {/* IDENTITAS PELANGGAN */}

      <View style={styles.statusHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.customerName}>
            {transaction.customer_name}
          </Text>

          <Text style={styles.customerMeta}>
            {transaction.phone}
          </Text>

          <Text style={styles.customerMeta}>
            {transaction.customer_type}
            {' · '}
            {transaction.user_id
              ? 'Akun terhubung'
              : 'Pelanggan tamu'}
          </Text>
        </View>

        <AdminStatusBadge status={transaction.status} />
      </View>

      {/* DAFTAR SEPEDA */}

      <View style={adminUi.card}>
        <Text style={styles.cardTitle}>
          Unit yang Disewa
        </Text>

        {transaction.transaction_items.length === 0 ? (
          <Text style={styles.emptyText}>
            Tidak ada unit pada transaksi ini.
          </Text>
        ) : (
          transaction.transaction_items.map((item) => (
            <View key={item.id} style={styles.unitRow}>
              <View style={styles.unitIcon}>
                <Ionicons
                  name="bicycle"
                  size={20}
                  color={COLORS.secondaryDark}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.unitName}>
                  {item.bikes?.name ?? 'Sepeda tidak ditemukan'}
                </Text>

                <Text style={styles.meta}>
                  {item.bike_id}
                  {item.bikes?.category
                    ? ` · ${item.bikes.category}`
                    : ''}
                </Text>

                {item.return_condition ? (
                  <Text style={styles.returnCondition}>
                    Kondisi kembali: {item.return_condition}
                  </Text>
                ) : null}

                {item.return_note ? (
                  <Text style={styles.meta}>
                    Catatan: {item.return_note}
                  </Text>
                ) : null}
              </View>

              <AdminStatusBadge
                status={item.bikes?.status ?? 'Tidak diketahui'}
              />
            </View>
          ))
        )}
      </View>

      {/* RINCIAN PENYEWAAN */}

      <View style={adminUi.card}>
        <Text style={styles.cardTitle}>
          Rincian Penyewaan
        </Text>

        <Info
          label="Kode transaksi"
          value={transaction.transaction_code}
        />

        <Info
          label="Tanggal dan waktu sewa"
          value={rentalDate}
        />

        <Info
          label="Estimasi selesai"
          value={estimatedEnd}
        />

        <Info
          label="Durasi"
          value={`${transaction.duration_hours} jam`}
        />

        <Info
          label="Jumlah sepeda"
          value={`${transaction.transaction_items.length} unit`}
        />

        <Info
          label="Kategori pelanggan"
          value={transaction.customer_type}
        />

        <Info
          label="Jenis hari"
          value={transaction.day_type}
        />

        <Info
          label="Tarif per jam"
          value={`${formatRupiah(Number(transaction.hourly_rate))}/unit`}
        />

        <Info
          label="Jaminan"
          value={transaction.guarantee_type}
          last
        />
      </View>

      {/* PEMBAYARAN */}

      <View style={adminUi.card}>
        <Text style={styles.cardTitle}>
          Pembayaran
        </Text>

        <Info
          label="Metode pembayaran"
          value={transaction.payment_method}
        />

        <View style={styles.paymentRow}>
          <Text style={styles.infoLabel}>
            Status pembayaran
          </Text>

          <AdminStatusBadge status={transaction.payment_status} />
        </View>

        <View style={[adminUi.between, styles.totalRow]}>
          <Text style={styles.totalLabel}>
            Total transaksi
          </Text>

          <Text style={styles.totalValue}>
            {formatRupiah(Number(transaction.total))}
          </Text>
        </View>
      </View>

      {/* AKSI PEMBAYARAN */}

      {transaction.status === 'Menunggu Serah Terima' ? (
        <>
          {transaction.payment_status === 'Belum Lunas' ? (
            <TouchableOpacity
              style={adminUi.button}
              disabled={savingPayment || processingHandover}
              onPress={confirmPayment}
            >
              {savingPayment ? (
                <ActivityIndicator color={COLORS.textPrimary} />
              ) : (
                <Text style={adminUi.buttonText}>
                  Konfirmasi Pembayaran Lunas
                </Text>
              )}
            </TouchableOpacity>
          ) : (
            <View style={styles.paidNotice}>
              <Ionicons
                name="checkmark-circle"
                size={19}
                color="#15803D"
              />

              <Text style={styles.paidNoticeText}>
                Pembayaran telah dinyatakan Lunas.
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={adminUi.button}
            disabled={processingHandover || savingPayment}
            onPress={confirmHandover}
          >
            {processingHandover ? (
              <ActivityIndicator color={COLORS.textPrimary} />
            ) : (
              <>
                <Ionicons
                  name="bicycle-outline"
                  size={18}
                  color={COLORS.textPrimary}
                />

                <Text style={adminUi.buttonText}>
                  Konfirmasi Serah Terima
                </Text>
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.helper}>
            Pastikan sepeda benar-benar telah diserahkan kepada
            pelanggan. Status pembayaran dikelola secara terpisah.
          </Text>
        </>
      ) : null}

      {/* FORM PENGEMBALIAN */}

      {transaction.status === 'Sedang Berlangsung' ? (
        <View style={adminUi.card}>
          <Text style={styles.cardTitle}>
            Proses Pengembalian Sepeda
          </Text>

          <Text style={styles.sectionDescription}>
            Periksa kondisi fisik setiap sepeda sebelum menyelesaikan
            transaksi.
          </Text>

          {transaction.transaction_items.map((item, index) => {
            const form = returnForms[item.bike_id];

            return (
              <View
                key={item.id}
                style={styles.returnBikeCard}
              >
                <Text style={styles.returnBikeTitle}>
                  {index + 1}. {item.bikes?.name ?? item.bike_id}
                </Text>

                <Text style={styles.meta}>
                  Kode unit: {item.bike_id}
                </Text>

                <Text style={styles.fieldLabel}>
                  Kondisi sepeda
                </Text>

                <View style={styles.conditionOptions}>
                  {RETURN_CONDITIONS.map((condition) => {
                    const selected = form?.condition === condition;

                    return (
                      <TouchableOpacity
                        key={condition}
                        style={[
                          styles.conditionButton,
                          selected && styles.conditionButtonActive,
                        ]}
                        onPress={() => {
                          setBikeCondition(item.bike_id, condition);
                        }}
                        disabled={processingReturn}
                      >
                        <Text
                          style={[
                            styles.conditionText,
                            selected && styles.conditionTextActive,
                          ]}
                        >
                          {condition}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <Text style={styles.fieldLabel}>
                  Catatan kondisi (opsional)
                </Text>

                <TextInput
                  value={form?.note ?? ''}
                  onChangeText={(value) => {
                    setBikeReturnNote(item.bike_id, value);
                  }}
                  placeholder="Contoh: Rem belakang perlu disetel..."
                  placeholderTextColor="#94A3B8"
                  style={styles.noteInput}
                  multiline
                  editable={!processingReturn}
                  textAlignVertical="top"
                />
              </View>
            );
          })}

          <Text style={styles.fieldLabel}>
            Catatan umum pengembalian (opsional)
          </Text>

          <TextInput
            value={returnNotes}
            onChangeText={setReturnNotes}
            placeholder="Catatan tambahan untuk seluruh transaksi..."
            placeholderTextColor="#94A3B8"
            style={styles.noteInput}
            multiline
            editable={!processingReturn}
            textAlignVertical="top"
          />

          <Text style={styles.returnInfo}>
            Sepeda dengan kondisi Baik akan kembali Tersedia.
            Sepeda dengan kondisi Rusak ringan atau Rusak berat
            akan masuk Perawatan.
          </Text>

          <TouchableOpacity
            style={adminUi.button}
            disabled={processingReturn}
            onPress={confirmReturn}
          >
            {processingReturn ? (
              <ActivityIndicator color={COLORS.textPrimary} />
            ) : (
              <>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={19}
                  color={COLORS.textPrimary}
                />

                <Text style={adminUi.buttonText}>
                  Konfirmasi Pengembalian
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      ) : null}

      {/* INFORMASI PENGEMBALIAN SELESAI */}

      {transaction.status === 'Selesai' ? (
        <View style={adminUi.card}>
          <Text style={styles.cardTitle}>
            Informasi Pengembalian
          </Text>

          <Info
            label="Waktu pengembalian aktual"
            value={actualReturn ?? '-'}
          />

          <Info
            label="Catatan umum pengembalian"
            value={transaction.return_notes || '-'}
            last
          />

          <View style={styles.finished}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color="#15803D"
            />

            <Text style={styles.finishedText}>
              Transaksi telah selesai.
            </Text>
          </View>
        </View>
      ) : null}
    </AdminPageLayout>
  );
}

// -----------------------------------------
// KOMPONEN INFORMASI
// -----------------------------------------

function Info({
  label,
  value,
  last,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View
      style={[
        styles.infoRow,
        last && { borderBottomWidth: 0 },
      ]}
    >
      <Text style={styles.infoLabel}>
        {label}
      </Text>

      <Text style={styles.infoValue}>
        {value}
      </Text>
    </View>
  );
}

// -----------------------------------------
// FORMAT TANGGAL
// -----------------------------------------

function formatDateTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return (
    date.toLocaleString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Jakarta',
    }) + ' WIB'
  );
}

// -----------------------------------------
// STYLES
// -----------------------------------------

const styles = StyleSheet.create({
  centerState: {
    flex: 1,
    minHeight: 220,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },

  stateText: {
    ...FONTS.body,
    color: COLORS.textSecondary,
  },

  errorText: {
    ...FONTS.body,
    color: '#DC2626',
    textAlign: 'center',
    marginTop: 10,
  },

  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    padding: SIZES.large,
    borderRadius: SIZES.radiusLarge,
    marginBottom: SIZES.medium,
    gap: 10,
  },

  customerName: {
    ...FONTS.headline3,
    color: COLORS.secondaryDark,
  },

  customerMeta: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: 3,
  },

  cardTitle: {
    ...FONTS.labelLarge,
    color: COLORS.secondaryDark,
    marginBottom: 10,
  },

  sectionDescription: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    lineHeight: 19,
    marginBottom: 12,
  },

  unitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 9,
  },

  unitIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },

  unitName: {
    ...FONTS.labelMedium,
    color: COLORS.textPrimary,
  },

  meta: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  returnCondition: {
    ...FONTS.caption,
    color: COLORS.secondaryDark,
    marginTop: 4,
    fontWeight: '600',
  },

  emptyText: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingVertical: 12,
  },

  infoRow: {
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  infoLabel: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },

  infoValue: {
    ...FONTS.body,
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginTop: 3,
  },

  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },

  totalRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 13,
    marginTop: 5,
  },

  totalLabel: {
    ...FONTS.labelMedium,
    color: COLORS.textSecondary,
  },

  totalValue: {
    ...FONTS.headline2,
    color: COLORS.secondaryDark,
  },

  paidNotice: {
    padding: 13,
    borderRadius: 12,
    backgroundColor: '#DCFCE7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 10,
  },

  paidNoticeText: {
    ...FONTS.labelMedium,
    color: '#15803D',
  },

  helper: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginTop: 9,
  },

  returnBikeCard: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 13,
    marginTop: 12,
  },

  returnBikeTitle: {
    ...FONTS.labelMedium,
    color: COLORS.textPrimary,
  },

  fieldLabel: {
    ...FONTS.labelMedium,
    color: COLORS.textPrimary,
    marginTop: 12,
    marginBottom: 7,
  },

  conditionOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },

  conditionButton: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 11,
    paddingVertical: 9,
    backgroundColor: '#FFFFFF',
  },

  conditionButtonActive: {
    borderColor: COLORS.secondaryDark,
    backgroundColor: '#E0F2FE',
  },

  conditionText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },

  conditionTextActive: {
    color: COLORS.secondaryDark,
  },

  noteInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 12,
    minHeight: 75,
    color: COLORS.textPrimary,
    ...FONTS.body,
    backgroundColor: '#FFFFFF',
  },

  returnInfo: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    lineHeight: 19,
    marginTop: 13,
    marginBottom: 14,
  },

  finished: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#DCFCE7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 15,
  },

  finishedText: {
    ...FONTS.labelMedium,
    color: '#15803D',
  },
});
