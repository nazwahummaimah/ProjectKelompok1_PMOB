
import { useCallback, useEffect, useState } from 'react';

import {
  getMyRentalHistory,
} from '../services/userRentalHistoryService';

import type {
  TransactionWithItems,
} from '../services/transactionService';

export function useUserRentalHistory() {
  const [history, setHistory] = useState<TransactionWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadHistory = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError('');

      const result = await getMyRentalHistory();

      setHistory(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Gagal mengambil riwayat penyewaan.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  const summary = {
    total: history.length,
    ongoing: history.filter(
      (item) => item.status === 'Sedang Berlangsung'
    ).length,
    completed: history.filter(
      (item) => item.status === 'Selesai'
    ).length,
    pending: history.filter(
      (item) => item.status === 'Menunggu Serah Terima'
    ).length,
  };

  return {
    history,
    summary,
    loading,
    refreshing,
    error,
    refresh: () => loadHistory(true),
  };
}
