// app/public/LoginPublic.tsx
import React, { useState } from 'react';
import { 
  SafeAreaView, 
  ScrollView, 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../constants/theme';
import BottomNavBar from '../../components/molecules/BottomNavBar';

const Login: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Beranda' | 'Katalog' | 'Scan' | 'Login'>('Login');
  const [email, setEmail] = useState('pelanggan.contoh@domain');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState(true); // Simulasi error seperti pada gambar

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.closeBtn}>
          <Ionicons name="close-outline" size={24} color={COLORS.secondaryDark} />
        </TouchableOpacity>
        <View style={styles.brandTitleRow}>
          <Ionicons name="bicycle-outline" size={20} color={COLORS.secondaryDark} style={{ marginRight: 6 }} />
          <Text style={styles.brandTitle}>Rental Sepeda Mas Joko</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Brand Icon Badge */}
        <View style={styles.logoBadge}>
          <Ionicons name="bicycle" size={32} color={COLORS.secondaryDark} />
        </View>

        {/* Heading */}
        <Text style={styles.pageTitle}>Masuk ke Akun</Text>
        <Text style={styles.pageSubtitle}>Akses riwayat sewa pribadi dan kelola profil Anda.</Text>

        {/* Input Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Alamat Email</Text>
          <View style={[styles.inputBox, emailError && styles.inputBoxError]}>
            <Ionicons name="mail-outline" size={20} color={emailError ? COLORS.accentCritical : COLORS.textSecondary} style={{ marginRight: 10 }} />
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
              placeholder="Masukkan email Anda"
              placeholderTextColor={COLORS.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          {emailError && (
            <View style={styles.errorRow}>
              <Ionicons name="information-circle-outline" size={14} color={COLORS.accentCritical} style={{ marginRight: 4 }} />
              <Text style={styles.errorText}>Format email tidak valid atau belum terdaftar</Text>
            </View>
          )}
        </View>

        {/* Input Password */}
        <View style={styles.inputGroup}>
          <View style={styles.labelWithLink}>
            <Text style={styles.inputLabel}>Kata Sandi</Text>
            <TouchableOpacity>
              <Text style={styles.forgotText}>Lupa kata sandi?</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputBox}>
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.textSecondary} style={{ marginRight: 10 }} />
            <TextInput
              style={styles.textInput}
              value={password}
              onChangeText={setPassword}
              placeholder="Masukkan kata sandi"
              placeholderTextColor={COLORS.textSecondary}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Primary Action Button */}
        <TouchableOpacity style={styles.submitBtn} activeOpacity={0.8}>
          <Text style={styles.submitBtnText}>Masuk</Text>
          <Ionicons name="arrow-forward" size={18} color={COLORS.textPrimary} style={{ marginLeft: 6 }} />
        </TouchableOpacity>

        {/* System Info Box */}
        <View style={styles.infoBox}>
          <Ionicons name="shield-checkmark-outline" size={18} color={COLORS.secondaryDark} style={{ marginRight: 8 }} />
          <Text style={styles.infoBoxText}>
            Sistem akan otomatis mengarahkan ke dashboard pelanggan atau admin sesuai hak akses akun.
          </Text>
        </View>

        {/* Bottom Link to Register */}
        <View style={styles.registerRow}>
          <Text style={styles.registerPrompt}>Belum punya akun? </Text>
          <TouchableOpacity>
            <Text style={styles.registerLink}>Daftar</Text>
          </TouchableOpacity>
        </View>

        {/* Tagline Footer */}
        <View style={styles.footerTagline}>
          <View style={styles.taglineDot} />
          <Text style={styles.taglineText}>
            Rental Sepeda Mas Joko • Sewa sepeda yang mudah, cepat, dan jelas.
          </Text>
        </View>
      </ScrollView>

      <BottomNavBar activeTab={activeTab} onTabPress={setActiveTab} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.large,
    paddingVertical: SIZES.medium,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  closeBtn: {
    padding: 4,
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: SIZES.medium,
  },
  brandTitle: {
    ...FONTS.headline3,
    color: COLORS.secondaryDark,
  },
  scrollContent: {
    padding: SIZES.large,
  },
  logoBadge: {
    width: 56,
    height: 56,
    borderRadius: SIZES.radiusMedium,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.large,
  },
  pageTitle: {
    ...FONTS.headline1,
    color: COLORS.secondaryDark,
    marginBottom: 4,
  },
  pageSubtitle: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    marginBottom: SIZES.xlarge,
  },
  inputGroup: {
    marginBottom: SIZES.large,
  },
  inputLabel: {
    ...FONTS.labelMedium,
    color: COLORS.textPrimary,
    marginBottom: SIZES.small,
  },
  labelWithLink: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotText: {
    ...FONTS.caption,
    color: COLORS.secondaryDark,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SIZES.medium,
  },
  inputBoxError: {
    borderColor: COLORS.accentCritical,
  },
  textInput: {
    flex: 1,
    ...FONTS.body,
    color: COLORS.textPrimary,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  errorText: {
    ...FONTS.caption,
    color: COLORS.accentCritical,
  },
  submitBtn: {
    flexDirection: 'row',
    height: 48,
    backgroundColor: COLORS.primaryLight,
    borderRadius: SIZES.radiusMedium,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.large,
  },
  submitBtnText: {
    ...FONTS.labelMedium,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#F0F9FF',
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.medium,
    alignItems: 'flex-start',
    marginBottom: SIZES.xlarge,
  },
  infoBoxText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SIZES.xxlarge,
  },
  registerPrompt: {
    ...FONTS.body,
    color: COLORS.textSecondary,
  },
  registerLink: {
    ...FONTS.body,
    fontWeight: 'bold',
    color: COLORS.secondaryDark,
  },
  footerTagline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SIZES.large,
  },
  taglineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primaryLight,
    marginRight: 6,
  },
  taglineText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    fontSize: 11,
  },
});

export default Login;