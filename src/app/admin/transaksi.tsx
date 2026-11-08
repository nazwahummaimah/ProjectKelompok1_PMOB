
import React, {
  useCallback,
  useMemo,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';

import {
  useLocalSearchParams,
  useRouter,
  useFocusEffect,
} from 'expo-router';

import { Ionicons } from '@expo/vector-icons';

import AdminPageLayout, {
  adminUi,
} from '../../components/organisms/AdminPageLayout';

import AdminStatusBadge from '../../components/molecules/AdminStatusBadge';

import {
  COLORS,
  FONTS,
  SIZES,
} from '../../constants/theme';

import {
  formatRupiah,
} from '../../constants/adminDemo';

import {
  getTransactions,
  Transaction,
} from '../../services/transactionService';

/* =========================================================
   FILTER
========================================================= */

const FILTERS = [
  'Semua',
  'Menunggu Serah Terima',
  'Sedang Berlangsung',
  'Selesai',
] as const;

type Filter = (typeof FILTERS)[number];

/* =========================================================
   HELPERS
========================================================= */

function formatTransactionDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatTransactionTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }) + ' WIB';
}

/* =========================================================
   TRANSACTION CARD
========================================================= */

function TransactionCard({
  transaction,
  onPress,
}: {
  transaction: Transaction;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.78}
      style={styles.card}
    >
      {/* TOP ROW */}

      <View style={styles.topRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.id}>
            {transaction.transaction_code}
          </Text>

          <Text style={styles.date}>
            {formatTransactionDate(transaction.rental_date)}
            {' · '}
            {formatTransactionTime(transaction.rental_date)}
          </Text>
        </View>

        <AdminStatusBadge status={transaction.status} />
      </View>

      {/* CUSTOMER */}

      <View style={styles.middleRow}>
        <View style={styles.avatar}>
          <Ionicons
            name="person-outline"
            size={19}
            color={COLORS.secondaryDark}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.name}>
            {transaction.customer_name}
          </Text>

          <Text style={styles.meta}>
            {transaction.phone}
          </Text>

          <Text style={styles.meta}>
            {transaction.customer_type}
            {' · '}
            {transaction.duration_hours} jam
          </Text>
        </View>

        <Text style={styles.amount}>
          {formatRupiah(Number(transaction.total))}
        </Text>
      </View>

      {/* PAYMENT */}

      <View style={styles.bottomRow}>
        <Text style={styles.payment}>
          {transaction.payment_method}
          {' · '}
          {transaction.payment_status}
        </Text>

        <Ionicons
          name="chevron-forward"
          size={17}
          color={COLORS.textSecondary}
        />
      </View>
    </TouchableOpacity>
  );
}

/* =========================================================
   SCREEN
========================================================= */

export default function AdminTransactionListScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    filter?: string;
  }>();

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [filter, setFilter] = useState<Filter>(
    params.filter === 'active'
      ? 'Sedang Berlangsung'
      : 'Semua'
  );

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  /* =========================================================
     LOAD TRANSACTIONS
  ========================================================= */

  const loadTransactions = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setErrorMessage('');

        const result = await getTransactions();

        setTransactions(result);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Gagal mengambil data transaksi.';

        setErrorMessage(message);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  /* =========================================================
     REFRESH WHEN SCREEN FOCUSED
  ========================================================= */

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [loadTransactions])
  );

  /* =========================================================
     FILTER TRANSACTIONS
  ========================================================= */

  const filtered = useMemo(() => {
    if (filter === 'Semua') {
      return transactions;
    }

    return transactions.filter(
      (item) => item.status === filter
    );
  }, [transactions, filter]);

  /* =========================================================
     SUMMARY
  ========================================================= */

  const totalTransactions = transactions.length;

  /* =========================================================
     NAVIGATION
  ========================================================= */

  const openTransactionDetail = (id: string) => {
    router.push(
      `/admin/detail-transaksi?id=${id}` as any
    );
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <AdminPageLayout
      title="Transaksi"
      subtitle="Pantau penyewaan, pembayaran, dan pengembalian sepeda."
      activeTab="Transaksi"
      showBottomNav
      rightLabel="+ Buat"
      onRightPress={() =>
        router.push('/admin/buat-transaksi' as any)
      }
    >
      {/* SUMMARY */}

      <View style={styles.summary}>
        <Text style={styles.summaryValue}>
          {totalTransactions}
        </Text>

        <Text style={styles.summaryLabel}>
          Total transaksi tercatat
        </Text>
      </View>

      {/* FILTERS */}

      <View style={styles.filters}>
        {FILTERS.map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => setFilter(item)}
            style={[
              adminUi.chip,
              filter === item && adminUi.chipActive,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                filter === item && styles.filterActive,
              ]}
            >
              {item === 'Menunggu Serah Terima'
                ? 'Menunggu'
                : item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* REFRESH BUTTON */}

      <TouchableOpacity
        style={styles.refreshButton}
        onPress={() => loadTransactions(true)}
        disabled={refreshing || loading}
      >
        {refreshing ? (
          <ActivityIndicator
            size="small"
            color={COLORS.secondaryDark}
          />
        ) : (
          <Ionicons
            name="refresh-outline"
            size={17}
            color={COLORS.secondaryDark}
          />
        )}

        <Text style={styles.refreshText}>
          {refreshing ? 'Memperbarui...' : 'Perbarui transaksi'}
        </Text>
      </TouchableOpacity>

      {/* LOADING */}

      {loading ? (
        <View style={styles.stateContainer}>
          <ActivityIndicator
            size="large"
            color={COLORS.secondaryDark}
          />

          <Text style={styles.stateText}>
            Memuat data transaksi...
          </Text>
        </View>
      ) : null}

      {/* ERROR */}

      {!loading && errorMessage ? (
        <View style={adminUi.card}>
          <Ionicons
            name="alert-circle-outline"
            size={30}
            color="#DC2626"
          />

          <Text style={styles.errorText}>
            {errorMessage}
          </Text>

          <TouchableOpacity
            style={adminUi.outlineButton}
            onPress={() => loadTransactions()}
          >
            <Text style={styles.retryText}>
              Coba Lagi
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* TRANSACTION LIST */}

      {!loading && !errorMessage && filtered.length > 0
        ? filtered.map((item) => (
            <TransactionCard
              key={item.id}
              transaction={item}
              onPress={() => openTransactionDetail(item.id)}
            />
          ))
        : null}

      {/* EMPTY STATE */}

      {!loading && !errorMessage && filtered.length === 0 ? (
        <View style={adminUi.card}>
          <Ionicons
            name="receipt-outline"
            size={34}
            color={COLORS.textSecondary}
          />

          <Text style={styles.empty}>
            Belum ada transaksi pada kategori ini.
          </Text>
        </View>
      ) : null}
    </AdminPageLayout>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  summary: {
    backgroundColor: '#E0F2FE',
    borderRadius: SIZES.radiusLarge,
    padding: SIZES.large,
    marginBottom: SIZES.large,
  },

  summaryValue: {
    ...FONTS.headline1,
    color: COLORS.secondaryDark,
  },

  summaryLabel: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: 3,
  },

  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginBottom: SIZES.medium,
  },

  filterText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },

  filterActive: {
    color: COLORS.secondaryDark,
    fontWeight: '700',
  },

  card: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusLarge,
    padding: SIZES.large,
    marginBottom: SIZES.medium,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },

  id: {
    ...FONTS.labelMedium,
    color: COLORS.secondaryDark,
  },

  date: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: 3,
  },

  middleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.medium,
  },

  avatar: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  name: {
    ...FONTS.labelMedium,
    color: COLORS.textPrimary,
  },

  meta: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  amount: {
    ...FONTS.labelMedium,
    color: COLORS.textPrimary,
  },

  bottomRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 10,
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  payment: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },

  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    gap: 6,
    marginBottom: SIZES.medium,
  },

  refreshText: {
    ...FONTS.caption,
    color: COLORS.secondaryDark,
    fontWeight: '600',
  },

  stateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 35,
    gap: 10,
  },

  stateText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },

  errorText: {
    ...FONTS.body,
    color: '#DC2626',
    textAlign: 'center',
    marginVertical: 12,
  },

  retryText: {
    ...FONTS.labelMedium,
    color: COLORS.secondaryDark,
  },

  empty: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 10,
  },
});
