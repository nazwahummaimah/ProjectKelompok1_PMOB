
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

  // Membuat dan membuka dialog cetak laporan PDF
  const generatePdf = async () => {
    if (isGenerating) return;

    try {
      setIsGenerating(true);

      const transactionTableRows =
        transactionRows.length > 0
          ? transactionRows
              .map(
                (item, index) => `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${escapeHtml(item.id)}</td>
                    <td>${escapeHtml(item.customerName)}</td>
                    <td>${escapeHtml(formatDate(item.date))}</td>
                    <td class="income">
                      ${escapeHtml(formatRupiah(Number(item.total || 0)))}
                    </td>
                  </tr>
                `,
              )
              .join('')
          : `
              <tr>
                <td colspan="5" class="empty">
                  Tidak ada pemasukan lunas pada periode ini.
                </td>
              </tr>
            `;

      const expenseTableRows =
        expenseRows.length > 0
          ? expenseRows
              .map(
                (item, index) => `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${escapeHtml(item.description)}</td>
                    <td>${escapeHtml(item.category)}</td>
                    <td>${escapeHtml(formatDate(item.date))}</td>
                    <td class="expense">
                      ${escapeHtml(formatRupiah(Number(item.amount || 0)))}
                    </td>
                  </tr>
                `,
              )
              .join('')
          : `
              <tr>
                <td colspan="5" class="empty">
                  Tidak ada pengeluaran pada periode ini.
                </td>
              </tr>
            `;

      const generatedAt = new Date().toLocaleString('id-ID', {
        dateStyle: 'long',
        timeStyle: 'short',
      });

      const html = `
        <!DOCTYPE html>
        <html lang="id">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />

            <title>Laporan Keuangan Jamal Jepret</title>

            <style>
              * {
                box-sizing: border-box;
              }

              body {
                font-family: Arial, Helvetica, sans-serif;
                color: #1e293b;
                margin: 32px;
                font-size: 11px;
              }

              .header {
                border-bottom: 3px solid #0f766e;
                padding-bottom: 16px;
                margin-bottom: 24px;
              }

              .brand {
                font-size: 23px;
                font-weight: bold;
                color: #0f766e;
                margin: 0 0 6px;
              }

              .subtitle {
                color: #64748b;
                margin: 0;
                font-size: 11px;
              }

              .report-title {
                margin-top: 22px;
                font-size: 18px;
                font-weight: bold;
              }

              .period {
                color: #475569;
                margin-top: 6px;
              }

              .summary {
                display: flex;
                gap: 10px;
                margin: 20px 0 28px;
              }

              .summary-item {
                flex: 1;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                padding: 12px;
              }

              .summary-label {
                color: #64748b;
                font-size: 10px;
                margin-bottom: 8px;
              }

              .summary-value {
                font-size: 13px;
                font-weight: bold;
              }

              .income-value {
                color: #15803d;
              }

              .expense-value {
                color: #b45309;
              }

              .difference-value {
                color: #0f766e;
              }

              h2 {
                font-size: 14px;
                margin: 24px 0 10px;
                color: #0f172a;
              }

              table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 18px;
              }

              th {
                background: #f1f5f9;
                color: #334155;
                text-align: left;
                font-weight: bold;
              }

              th, td {
                border: 1px solid #e2e8f0;
                padding: 9px 7px;
                vertical-align: top;
              }

              .income {
                color: #15803d;
                font-weight: bold;
                white-space: nowrap;
              }

              .expense {
                color: #b45309;
                font-weight: bold;
                white-space: nowrap;
              }

              .empty {
                text-align: center;
                color: #64748b;
                padding: 16px;
              }

              .total-box {
                border: 1px solid #cbd5e1;
                border-radius: 8px;
                padding: 14px;
                margin-top: 24px;
              }

              .total-row {
                display: flex;
                justify-content: space-between;
                padding: 7px 0;
                border-bottom: 1px solid #e2e8f0;
              }

              .total-row:last-child {
                border-bottom: none;
                font-weight: bold;
                font-size: 13px;
                padding-top: 12px;
              }

              .footer {
                margin-top: 32px;
                padding-top: 12px;
                border-top: 1px solid #e2e8f0;
                color: #64748b;
                font-size: 9px;
                text-align: center;
              }

              @page {
                size: A4;
                margin: 15mm;
              }

              @media print {
                body {
                  margin: 0;
                }

                tr {
                  page-break-inside: avoid;
                }
              }
            </style>
          </head>

          <body>
            <div class="header">
              <p class="brand">JAMAL JEPRET</p>
              <p class="subtitle">Sistem Penyewaan Sepeda</p>

              <div class="report-title">Laporan Keuangan</div>
              <div class="period">
                Periode: ${escapeHtml(period)}
              </div>
              <div class="period">
                Tanggal dibuat: ${escapeHtml(generatedAt)}
              </div>
            </div>

            <div class="summary">
              <div class="summary-item">
                <div class="summary-label">Total Pemasukan</div>
                <div class="summary-value income-value">
                  ${escapeHtml(formatRupiah(income))}
                </div>
              </div>

              <div class="summary-item">
                <div class="summary-label">Total Pengeluaran</div>
                <div class="summary-value expense-value">
                  ${escapeHtml(formatRupiah(expenseTotal))}
                </div>
              </div>

              <div class="summary-item">
                <div class="summary-label">Selisih Operasional</div>
                <div class="summary-value difference-value">
                  ${escapeHtml(formatRupiah(operationalDifference))}
                </div>
              </div>
            </div>

            <h2>
              Rincian Pemasukan (${transactionRows.length} transaksi)
            </h2>

            <table>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>ID Transaksi</th>
                  <th>Pelanggan</th>
                  <th>Tanggal</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>
                ${transactionTableRows}
              </tbody>
            </table>

            <h2>
              Rincian Pengeluaran (${expenseRows.length} catatan)
            </h2>

            <table>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Deskripsi</th>
                  <th>Kategori</th>
                  <th>Tanggal</th>
                  <th>Jumlah</th>
                </tr>
              </thead>

              <tbody>
                ${expenseTableRows}
              </tbody>
            </table>

            <div class="total-box">
              <div class="total-row">
                <span>Total Pemasukan</span>
                <span class="income-value">
                  ${escapeHtml(formatRupiah(income))}
                </span>
              </div>

              <div class="total-row">
                <span>Total Pengeluaran</span>
                <span class="expense-value">
                  ${escapeHtml(formatRupiah(expenseTotal))}
                </span>
              </div>

              <div class="total-row">
                <span>Selisih Operasional</span>
                <span class="difference-value">
                  ${escapeHtml(formatRupiah(operationalDifference))}
                </span>
              </div>
            </div>

            <div class="footer">
              Laporan ini dibuat secara otomatis oleh sistem Jamal Jepret.
            </div>
          </body>
        </html>
      `;

      // Langsung buka dialog cetak Android.
      // Tidak membuat URI file untuk dibaca atau disalin secara manual.
      await Print.printAsync({
        html,
      });
    } catch (error) {
      console.error('Gagal membuka laporan PDF:', error);

      const message =
        error instanceof Error
          ? error.message
          : 'Terjadi kesalahan yang tidak diketahui.';

      Alert.alert(
        'Gagal Membuka Laporan',
        `Laporan belum berhasil dibuka.\n\n${message}`,
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
              Membuka laporan...
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
        Setelah laporan terbuka, pilih Save as PDF atau Simpan
        sebagai PDF pada dialog cetak untuk menyimpan laporan
        ke perangkat.
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