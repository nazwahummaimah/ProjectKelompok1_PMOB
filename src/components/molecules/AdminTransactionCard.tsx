import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AdminTransaction, formatRupiah } from '../../constants/adminDemo';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import AdminStatusBadge from './AdminStatusBadge';

export default function AdminTransactionCard({ transaction, onPress }: { transaction: AdminTransaction; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.78} style={styles.card}>
      <View style={styles.topRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.id}>{transaction.id}</Text>
          <Text style={styles.date}>{transaction.date} · {transaction.startTime}</Text>
        </View>
        <AdminStatusBadge status={transaction.status} />
      </View>
      <View style={styles.middleRow}>
        <View style={styles.avatar}><Ionicons name="person-outline" size={19} color={COLORS.secondaryDark} /></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{transaction.customerName}</Text>
          <Text style={styles.meta}>{transaction.phone} · {transaction.unitIds.length} unit</Text>
        </View>
        <Text style={styles.amount}>{formatRupiah(transaction.total)}</Text>
      </View>
      <View style={styles.bottomRow}>
        <Text style={styles.payment}>{transaction.paymentMethod} · {transaction.paymentStatus}</Text>
        <Ionicons name="chevron-forward" size={17} color={COLORS.textSecondary} />
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: SIZES.radiusLarge, padding: SIZES.large, marginBottom: SIZES.medium },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  id: { ...FONTS.labelMedium, color: COLORS.secondaryDark }, date: { ...FONTS.caption, color: COLORS.textSecondary, marginTop: 3 },
  middleRow: { flexDirection: 'row', alignItems: 'center', marginTop: SIZES.medium },
  avatar: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#E0F2FE', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  name: { ...FONTS.labelMedium, color: COLORS.textPrimary }, meta: { ...FONTS.caption, color: COLORS.textSecondary, marginTop: 2 }, amount: { ...FONTS.labelMedium, color: COLORS.textPrimary },
  bottomRow: { borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 10, marginTop: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  payment: { ...FONTS.caption, color: COLORS.textSecondary },
});
