
import React, { useMemo, useState } from 'react';
import {
  Alert,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';

import AdminPageLayout, {
  adminUi,
} from '../../components/organisms/AdminPageLayout';

import { useAdmin } from '../../context/AdminContext';
import { formatRupiah } from '../../constants/adminTypes';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

type ReportPeriod = 'Hari ini' | 'Minggu ini' | 'Bulan ini';

const VALID_PERIODS: ReportPeriod[] = [
  'Hari ini',
  'Minggu ini',
  'Bulan ini',
];

function getDateKey(value: string): string {
  return value ? value.slice(0, 10) : '';
}

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatDate(value: string): string {
  const dateKey = getDateKey(value);
  const parts = dateKey.split('-');

  if (parts.length !== 3) return value;

  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

export default function ReportDetailScreen() {
  const params = useLocalSearchParams<{ period?: string }>();

  const rawPeriod = Array.isArray(params.period)
    ? params.period[0]
    : params.period;

  const period: ReportPeriod = VALID_PERIODS.includes(
    rawPeriod as ReportPeriod,
  )
    ? (rawPeriod as ReportPeriod)
    : 'Bulan ini';

  const { transactions, expenses } = useAdmin();

  const [isGenerating, setIsGenerating] = useState(false);

  const now = new Date();

  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-');

  const weekStartDate = new Date(now);
  weekStartDate.setDate(now.getDate() - 6);

  const weekStart = [
    weekStartDate.getFullYear(),
    String(weekStartDate.getMonth() + 1).padStart(2, '0'),
    String(weekStartDate.getDate()).padStart(2, '0'),
  ].join('-');

  const monthStart = today.slice(0, 7);

  const matchesPeriod = (date: string) => {
    const dateKey = getDateKey(date);

    if (period === 'Hari ini') {
      return dateKey === today;
    }

    if (period === 'Minggu ini') {
      return dateKey >= weekStart && dateKey <= today;
    }

    return dateKey.startsWith(monthStart);
  };

  const transactionRows = useMemo(
    () =>
      transactions.filter(
        (item) =>
          item.paymentStatus === 'Lunas' &&
          matchesPeriod(item.date),
      ),
    [transactions, period, today, weekStart, monthStart],
  );

  const expenseRows = useMemo(
    () => expenses.filter((item) => matchesPeriod(item.date)),
    [expenses, period, today, weekStart, monthStart],
  );

  const income = transactionRows.reduce(
    (sum, item) => sum + Number(item.total || 0),
    0,
  );

  const expenseTotal = expenseRows.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0,
  );

  const operationalDifference = income - expenseTotal;

  const generatePdf = async () => {
  if (isGenerating) return;

  try {
    setIsGenerating(true);

    // Buat HTML laporan menggunakan kode HTML yang sudah ada.
    // Pertahankan seluruh isi HTML laporan sebelumnya.
    const html = `
      <!-- MASUKKAN HTML LAPORAN LAMA DI SINI -->
    `;

    // 1. Generate PDF
    const pdf = await Print.printToFileAsync({
      html,
      base64: false,
    });

    // 2. Pastikan direktori cache tersedia
    if (!FileSystem.cacheDirectory) {
      throw new Error('Direktori cache aplikasi tidak tersedia.');
    }

    // 3. Salin PDF ke cache aplikasi dengan nama file baru
    const fileName = `Laporan-Keuangan-Jamal-Jepret-${Date.now()}.pdf`;

    const destinationUri =
      FileSystem.cacheDirectory + fileName;

    await FileSystem.copyAsync({
      from: pdf.uri,
      to: destinationUri,
    });

    // 4. Pastikan file hasil salinan benar-benar tersedia
    const fileInfo = await FileSystem.getInfoAsync(destinationUri);

    if (!fileInfo.exists) {
      throw new Error('File PDF tidak ditemukan setelah proses penyalinan.');
    }

    // 5. Bagikan file hasil salinan
    const sharingAvailable = await Sharing.isAvailableAsync();

    if (!sharingAvailable) {
      Alert.alert(
        'PDF Berhasil Dibuat',
        `PDF berhasil dibuat di:\n${destinationUri}`,
      );
      return;
    }

    await Sharing.shareAsync(destinationUri, {
      mimeType: 'application/pdf',
      dialogTitle: 'Simpan atau Bagikan Laporan Keuangan',
      UTI: 'com.adobe.pdf',
    });
  } catch (error) {
    console.error('Gagal membuat laporan PDF:', error);

    const message =
      error instanceof Error
        ? error.message
        : 'Terjadi kesalahan yang tidak diketahui.';

    Alert.alert(
      'Gagal Membuat PDF',
      `Laporan PDF belum berhasil dibuat.\n\n${message}`,
    );
  } finally {
    setIsGenerating(false);
  }
};

  return (
    <AdminPageLayout
      title="Detail Laporan"
      subtitle={`Periode: ${period}`}
      showBack
    >
      <View style={styles.summary}>
        <Text style={styles.summaryLabel}>
          SELISIH OPERASIONAL
        </Text>

        <Text style={styles.summaryValue}>
          {formatRupiah(operationalDifference)}
        </Text>
      </View>

      <Text style={adminUi.sectionTitle}>
        Pemasukan · {transactionRows.length} transaksi
      </Text>

      {transactionRows.map((item) => (
        <View key={item.id} style={styles.row}>
          <View style={styles.rowContent}>
            <Text style={styles.rowTitle}>
              {item.customerName}
            </Text>

            <Text style={styles.meta}>
              {item.id} · {formatDate(item.date)}
            </Text>
          </View>

          <Text style={styles.amount}>
            {formatRupiah(item.total)}
          </Text>
        </View>
      ))}

      {transactionRows.length === 0 && (
        <Text style={styles.empty}>
          Tidak ada pemasukan lunas pada periode ini.
        </Text>
      )}

      <Text style={adminUi.sectionTitle}>
        Pengeluaran · {expenseRows.length} catatan
      </Text>

      {expenseRows.map((item) => (
        <View key={item.id} style={styles.row}>
          <View style={styles.rowContent}>
            <Text style={styles.rowTitle}>
              {item.description}
            </Text>

            <Text style={styles.meta}>
              {item.category} · {formatDate(item.date)}
            </Text>
          </View>

          <Text style={styles.expenseAmount}>
            −{formatRupiah(item.amount)}
          </Text>
        </View>
      ))}

      {expenseRows.length === 0 && (
        <Text style={styles.empty}>
          Tidak ada pengeluaran tercatat pada periode ini.
        </Text>
      )}

      <View style={adminUi.card}>
        <Info
          label="Total pemasukan"
          value={formatRupiah(income)}
        />

        <Info
          label="Total pengeluaran"
          value={formatRupiah(expenseTotal)}
        />

        <Info
          label="Selisih operasional"
          value={formatRupiah(operationalDifference)}
          last
        />
      </View>

      <TouchableOpacity
        style={[
          adminUi.button,
          isGenerating && styles.disabledButton,
        ]}
        onPress={generatePdf}
        disabled={isGenerating}
        activeOpacity={0.8}
      >
        {isGenerating ? (
          <>
            <ActivityIndicator
              size="small"
              color={COLORS.textPrimary}
            />
            <Text style={[adminUi.buttonText, { marginLeft: 8 }]}>
              Membuat PDF...
            </Text>
          </>
        ) : (
          <>
            <Ionicons
              name="download-outline"
              size={18}
              color={COLORS.textPrimary}
            />

            <Text style={[adminUi.buttonText, { marginLeft: 8 }]}>
              Unduh Laporan PDF
            </Text>
          </>
        )}
      </TouchableOpacity>

      <Text style={styles.helper}>
        Laporan PDF berisi ringkasan keuangan, rincian pemasukan,
        dan rincian pengeluaran sesuai periode yang dipilih.
      </Text>
    </AdminPageLayout>
  );
}

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
    <View style={[styles.infoRow, last && { borderBottomWidth: 0 }]}>
      <Text style={styles.meta}>{label}</Text>
      <Text style={styles.rowTitle}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  summary: {
    backgroundColor: COLORS.secondaryDark,
    borderRadius: SIZES.radiusLarge,
    padding: SIZES.large,
  },

  summaryLabel: {
    ...FONTS.caption,
    color: '#BAE6FD',
  },

  summaryValue: {
    ...FONTS.headline1,
    color: '#FFFFFF',
    marginTop: 5,
  },

  row: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusMedium,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },

  rowContent: {
    flex: 1,
    minWidth: 0,
  },

  rowTitle: {
    ...FONTS.labelMedium,
    color: COLORS.textPrimary,
  },

  meta: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: 3,
  },

  amount: {
    ...FONTS.labelMedium,
    color: '#15803D',
    flexShrink: 0,
  },

  expenseAmount: {
    ...FONTS.labelMedium,
    color: '#B45309',
    flexShrink: 0,
  },

  empty: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },

  infoRow: {
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  helper: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: 9,
  },

  disabledButton: {
    opacity: 0.6,
  },
});
