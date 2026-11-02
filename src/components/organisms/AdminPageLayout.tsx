import React, { ReactNode } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import BottomNavBar, { AdminTabType } from '../molecules/BottomNavBar';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

interface AdminPageLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  activeTab?: AdminTabType;
  showBottomNav?: boolean;
  showBack?: boolean;
  rightLabel?: string;
  onRightPress?: () => void;
  scroll?: boolean;
}

export default function AdminPageLayout({
  title, subtitle, children, activeTab = 'Dashboard', showBottomNav = false,
  showBack = false, rightLabel, onRightPress, scroll = true,
}: AdminPageLayoutProps) {
  const router = useRouter();
  const handleTabPress = (tab: AdminTabType) => {
    const routes: Record<AdminTabType, string> = {
      Dashboard: '/admin', Inventaris: '/admin/inventaris', Transaksi: '/admin/transaksi', Lainnya: '/admin/lainnya',
    };
    router.push(routes[tab] as any);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
      <View style={styles.header}>
        {showBack ? (
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()} accessibilityLabel="Kembali">
            <Ionicons name="arrow-back" size={22} color={COLORS.secondaryDark} />
          </TouchableOpacity>
        ) : (
          <View style={styles.headerMark}>
            <Ionicons name="shield-checkmark" size={18} color={COLORS.secondaryDark} />
          </View>
        )}
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerEyebrow}>JAMAL_JEPRET · ADMIN</Text>
          <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
        </View>
        {rightLabel ? (
          <TouchableOpacity onPress={onRightPress} style={styles.headerAction}>
            <Text style={styles.headerActionText}>{rightLabel}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      {scroll ? (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          {children}
        </ScrollView>
      ) : (
        <View style={styles.content}>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          {children}
        </View>
      )}
      {showBottomNav ? <BottomNavBar variant="admin" activeTab={activeTab} onTabPress={handleTabPress} /> : null}
      </View>
    </SafeAreaView>
  );
}

export const adminUi = StyleSheet.create({
  sectionTitle: { ...FONTS.headline3, color: COLORS.secondaryDark, marginTop: SIZES.large, marginBottom: SIZES.medium },
  card: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: SIZES.radiusLarge, padding: SIZES.large, marginBottom: SIZES.medium },
  row: { flexDirection: 'row', alignItems: 'center' },
  between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  muted: { ...FONTS.caption, color: COLORS.textSecondary },
  body: { ...FONTS.body, color: COLORS.textPrimary },
  label: { ...FONTS.caption, color: COLORS.textSecondary, marginBottom: 6 },
  input: { minHeight: 46, borderWidth: 1, borderColor: COLORS.border, borderRadius: SIZES.radiusMedium, backgroundColor: COLORS.surface, paddingHorizontal: 12, color: COLORS.textPrimary, ...FONTS.body },
  button: { minHeight: 46, backgroundColor: COLORS.primaryLight, borderRadius: SIZES.radiusMedium, alignItems: 'center', justifyContent: 'center', paddingHorizontal: SIZES.large, flexDirection: 'row' },
  buttonText: { ...FONTS.labelMedium, color: COLORS.textPrimary },
  outlineButton: { minHeight: 44, borderRadius: SIZES.radiusMedium, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center', paddingHorizontal: SIZES.large, flexDirection: 'row' },
  chip: { borderWidth: 1, borderColor: COLORS.border, borderRadius: SIZES.radiusPill, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: COLORS.surface },
  chipActive: { borderColor: COLORS.secondaryDark, backgroundColor: '#E0F2FE' },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: SIZES.medium },
});

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.surface },
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SIZES.large, paddingVertical: 12, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerMark: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#E0F2FE', alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  backButton: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#E0F2FE', alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  headerTextWrap: { flex: 1 },
  headerEyebrow: { ...FONTS.caption, fontSize: 9, letterSpacing: 1, color: COLORS.textSecondary },
  headerTitle: { ...FONTS.labelLarge, color: COLORS.secondaryDark, marginTop: 1 },
  headerAction: { paddingHorizontal: 10, paddingVertical: 8 },
  headerActionText: { ...FONTS.labelMedium, color: COLORS.secondaryDark },
  content: { padding: SIZES.large, paddingBottom: 28, flexGrow: 1, backgroundColor: COLORS.background },
  subtitle: { ...FONTS.body, color: COLORS.textSecondary, marginBottom: SIZES.large, lineHeight: 20 },
});
