// app/public/Register.tsx
import React, { useState } from 'react';
import { 
  SafeAreaView, 
  ScrollView, 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity,
  Platform,
  StatusBar 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, SIZES, FONTS } from '../../constants/theme';
import BottomNavBar, { TabType } from '../../components/molecules/BottomNavBar';

const Register: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('Login');
  
  const [fullName, setFullName] = useState('Budi Santoso');
  const [email, setEmail] = useState('budi.santoso@gmail.com');
  const [phone, setPhone] = useState('813 9876 5432');
  const [password, setPassword] = useState('12345678');
  const [confirmPassword, setConfirmPassword] = useState('12345678');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleTabPress = (tab: TabType) => {
    setActiveTab(tab);
    switch (tab) {
      case 'Beranda':
        router.push('/public/' as any);
        break;
      case 'Katalog':
        router.push('/public/katalog' as any);
        break;
      case 'DurasiSewa':
        router.push('/public/durasi-sewa' as any);
        break;
      case 'Login':
        router.push('/public/login' as any);
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} translucent={false} />

      {/* Top Header dengan Safe Area Status Bar Fix */}
      <View style={styles.safeHeaderArea}>
        <View style={styles.topHeader}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={COLORS.secondaryDark} />
          </TouchableOpacity>
          <View style={styles.brandHeader}>
            <Ionicons name="bicycle-outline" size={20} color={COLORS.secondaryDark} style={{ marginRight: 6 }} />
            <Text style={styles.brandHeaderText}>Mas Joko Rental</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <Text style={styles.pageTitle}>Daftar Akun Baru</Text>
        <Text style={styles.pageSubtitle}>
          Buat akun untuk mempermudah pencatatan sewa dan riwayat transaksi di pos Mas Joko.
        </Text>

        {/* Input Nama Lengkap */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Nama Lengkap</Text>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.textInput}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Masukkan nama lengkap"
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>
        </View>

        {/* Input Email Aktif */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email Aktif</Text>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
              placeholder="contoh@gmail.com"
              placeholderTextColor={COLORS.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Input Nomor WhatsApp */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Nomor WhatsApp</Text>
          <View style={styles.phoneInputRow}>
            <View style={styles.countryCodeBox}>
              <Text style={styles.countryCodeText}>+62</Text>
            </View>
            <View style={[styles.inputBox, { flex: 1, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }]}>
              <TextInput
                style={styles.textInput}
                value={phone}
                onChangeText={setPhone}
                placeholder="812 3456 7890"
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="phone-pad"
              />
            </View>
          </View>
          <View style={styles.helperRow}>
            <Ionicons name="information-circle-outline" size={14} color={COLORS.textSecondary} style={{ marginRight: 4 }} />
            <Text style={styles.helperText}>Digunakan petugas pos rental untuk mencocokkan riwayat sewa fisik Anda.</Text>
          </View>
        </View>

        {/* Input Kata Sandi */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Kata Sandi</Text>
          <View style={styles.inputBox}>
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
          <View style={styles.helperRow}>
            <Ionicons name="checkmark-circle-outline" size={14} color={COLORS.success} style={{ marginRight: 4 }} />
            <Text style={styles.validText}>Minimal 8 karakter</Text>
          </View>
        </View>

        {/* Input Ulangi Kata Sandi */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Ulangi Kata Sandi</Text>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.textInput}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Ulangi kata sandi"
              placeholderTextColor={COLORS.textSecondary}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Ionicons name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
          <View style={styles.helperRow}>
            <Ionicons name="checkmark-circle-outline" size={14} color={COLORS.success} style={{ marginRight: 4 }} />
            <Text style={styles.validText}>Kata sandi cocok</Text>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitBtn} activeOpacity={0.8}>
          <Text style={styles.submitBtnText}>Daftar Akun</Text>
          <Ionicons name="arrow-forward" size={18} color={COLORS.textPrimary} style={{ marginLeft: 6 }} />
        </TouchableOpacity>

        {/* Login Redirect */}
        <View style={styles.loginRow}>
          <Text style={styles.loginPrompt}>Sudah punya akun? </Text>
          <TouchableOpacity onPress={() => router.push('/public/login' as any)}>
            <Text style={styles.loginLink}>Masuk</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Added Bottom Navigation Bar */}
      <BottomNavBar activeTab={activeTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  safeHeaderArea: {
    backgroundColor: COLORS.surface,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.large,
    paddingVertical: SIZES.medium,
    height: 56,
  },
  backBtn: {
    padding: 4,
  },
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: SIZES.medium,
  },
  brandHeaderText: {
    ...FONTS.headline3,
    color: COLORS.secondaryDark,
  },
  scrollContent: {
    padding: SIZES.large,
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
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: SIZES.large,
  },
  inputLabel: {
    ...FONTS.labelMedium,
    color: COLORS.textPrimary,
    marginBottom: SIZES.small,
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
  textInput: {
    flex: 1,
    ...FONTS.body,
    color: COLORS.textPrimary,
  },
  phoneInputRow: {
    flexDirection: 'row',
  },
  countryCodeBox: {
    height: 48,
    width: 60,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRightWidth: 0,
    borderTopLeftRadius: SIZES.radiusMedium,
    borderBottomLeftRadius: SIZES.radiusMedium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countryCodeText: {
    ...FONTS.labelMedium,
    color: COLORS.textPrimary,
  },
  helperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  helperText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    flex: 1,
    lineHeight: 16,
  },
  validText: {
    ...FONTS.caption,
    color: COLORS.secondaryDark,
  },
  submitBtn: {
    flexDirection: 'row',
    height: 48,
    backgroundColor: COLORS.primaryLight,
    borderRadius: SIZES.radiusMedium,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SIZES.medium,
    marginBottom: SIZES.large,
  },
  submitBtnText: {
    ...FONTS.labelMedium,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SIZES.large,
  },
  loginPrompt: {
    ...FONTS.body,
    color: COLORS.textSecondary,
  },
  loginLink: {
    ...FONTS.body,
    fontWeight: 'bold',
    color: COLORS.secondaryDark,
  },
});

export default Register;