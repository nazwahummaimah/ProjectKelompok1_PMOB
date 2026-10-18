
import React, { useMemo, useRef, useState } from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Pressable,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const C = {
  green: '#16833B',
  darkGreen: '#07532C',
  deepGreen: '#064426',
  lightGreen: '#E8F6EC',
  paleGreen: '#F1FAF3',
  yellow: '#F9A825',
  background: '#F7F9F8',
  white: '#FFFFFF',
  text: '#173B29',
  secondary: '#61766A',
  muted: '#87988E',
  border: '#E5ECE7',
  success: '#10A65A',
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = Math.min(SCREEN_WIDTH * 0.68, 270);

type Bike = {
  id: string;
  name: string;
  type: 'Gunung' | 'Lipat';
  branch: 'Cabang Perjuangan' | 'Cabang 2';
  image: string;
  available: boolean;
};

const bikes: Bike[] = [
  {
    id: 'MTB-001',
    name: 'Sepeda Gunung',
    type: 'Gunung',
    branch: 'Cabang Perjuangan',
    image:
      'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?auto=format&fit=crop&w=900&q=85',
    available: true,
  },
  {
    id: 'LP-012',
    name: 'Sepeda Lipat',
    type: 'Lipat',
    branch: 'Cabang 2',
    image:
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=900&q=85',
    available: true,
  },
  {
    id: 'MTB-003',
    name: 'Sepeda Gunung',
    type: 'Gunung',
    branch: 'Cabang Perjuangan',
    image:
      'https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=900&q=85',
    available: true,
  },
  {
    id: 'LP-014',
    name: 'Sepeda Lipat',
    type: 'Lipat',
    branch: 'Cabang 2',
    image:
      'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=900&q=85',
    available: false,
  },
];

const filters = [
  'Semua',
  'Gunung',
  'Lipat',
  'Cabang Perjuangan',
  'Cabang 2',
];

function SectionHeading({
  icon,
  title,
  action,
  onPress,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  action?: string;
  onPress?: () => void;
}) {
  return (
    <View style={styles.sectionHeading}>
      <View style={styles.headingLeft}>
        <MaterialCommunityIcons
          name={icon}
          size={21}
          color={C.green}
        />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {action ? (
        <Pressable
          onPress={onPress}
          style={styles.seeAll}
          accessibilityRole="button"
        >
          <Text style={styles.seeAllText}>{action}</Text>
          <Ionicons name="arrow-forward" size={15} color={C.green} />
        </Pressable>
      ) : null}
    </View>
  );
}

function PrimaryButton({
  title,
  onPress,
  icon,
  outlined = false,
  small = false,
}: {
  title: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  outlined?: boolean;
  small?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.primaryButton,
        outlined && styles.outlinedButton,
        small && styles.smallButton,
      ]}
      accessibilityRole="button"
    >
      <Text
        style={[
          styles.primaryButtonText,
          outlined && styles.outlinedButtonText,
        ]}
      >
        {title}
      </Text>
      {icon ? (
        <Ionicons
          name={icon}
          size={15}
          color={outlined ? C.green : C.white}
        />
      ) : null}
    </Pressable>
  );
}

export default function PublicHomeScreen() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const sectionPositions = useRef<Record<string, number>>({});
  const [activeFilter, setActiveFilter] = useState('Semua');

  const filteredBikes = useMemo(() => {
    if (activeFilter === 'Semua') return bikes;
    if (activeFilter === 'Gunung' || activeFilter === 'Lipat') {
      return bikes.filter((bike) => bike.type === activeFilter);
    }
    return bikes.filter((bike) => bike.branch === activeFilter);
  }, [activeFilter]);

  const scrollToSection = (section: string) => {
    const y = sectionPositions.current[section];
    if (typeof y === 'number') {
      scrollRef.current?.scrollTo({ y: Math.max(0, y - 12), animated: true });
    }
  };

  const recordPosition = (section: string, y: number) => {
    sectionPositions.current[section] = y;
  };

  const openDuration = () => router.push('/public/durasi-sewa');
  const openLogin = () => router.push('/public/login');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={C.white} />

      <View style={styles.header}>
        <View style={styles.logoIcon}>
          <MaterialCommunityIcons
            name="bicycle"
            size={43}
            color={C.green}
          />
        </View>
        <View style={styles.logoTextWrap}>
          <Text style={styles.logoTitle}>Jamal Jepret</Text>
          <Text style={styles.logoSubtitle}>Penyewaan Sepeda</Text>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* BANNER UTAMA */}
        <View style={styles.hero}>
          <ImageBackground
            source={{
              uri: 'https://images.unsplash.com/photo-1544191696-15693072a8b7?auto=format&fit=crop&w=1600&q=90',
            }}
            style={styles.heroImage}
            imageStyle={styles.heroImageStyle}
            resizeMode="cover"
          >
            <View style={styles.heroOverlay} />
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>
                Jelajahi Sekitar{'\n'}dengan Sepeda{'\n'}Favoritmu
              </Text>
              <Text style={styles.heroDescription}>
                Nikmati pengalaman bersepeda bersama Jamal Jepret.
                Pilih jenis sepeda yang sesuai dan lihat tarif sewa
                sebelum datang ke cabang kami.
              </Text>
              <View style={styles.heroButtons}>
                <PrimaryButton
                  title="Lihat Unit Sepeda"
                  icon="arrow-forward"
                  onPress={() => scrollToSection('bikes')}
                />
                <PrimaryButton
                  title="Lihat Tarif"
                  outlined
                  onPress={() => scrollToSection('pricing')}
                />
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* KATALOG SEPEDA */}
        <View
          onLayout={(e) => recordPosition('bikes', e.nativeEvent.layout.y)}
          style={styles.section}
        >
          <SectionHeading
            icon="bicycle"
            title="Unit Sepeda Kami"
            action="Lihat Semua"
            onPress={() => setActiveFilter('Semua')}
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterList}
          >
            {filters.map((filter) => {
              const selected = activeFilter === filter;
              return (
                <Pressable
                  key={filter}
                  onPress={() => setActiveFilter(filter)}
                  style={[
                    styles.filterChip,
                    selected && styles.filterChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterText,
                      selected && styles.filterTextActive,
                    ]}
                  >
                    {filter}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.bikeList}
          >
            {filteredBikes.map((bike) => (
              <View key={bike.id} style={styles.bikeCard}>
                <View style={styles.bikeImageWrap}>
                  <Image
                    source={{ uri: bike.image }}
                    style={styles.bikeImage}
                    resizeMode="contain"
                  />
                  <View
                    style={[
                      styles.availabilityBadge,
                      !bike.available && styles.unavailableBadge,
                    ]}
                  >
                    <View
                      style={[
                        styles.statusDot,
                        !bike.available && styles.unavailableDot,
                      ]}
                    />
                    <Text
                      style={[
                        styles.availabilityText,
                        !bike.available && styles.unavailableText,
                      ]}
                    >
                      {bike.available ? 'Tersedia' : 'Disewa'}
                    </Text>
                  </View>
                </View>

                <Text style={styles.bikeCode}>{bike.id}</Text>
                <View style={styles.bikeInfoRow}>
                  <MaterialCommunityIcons
                    name={bike.type === 'Lipat' ? 'bicycle' : 'triangle-outline'}
                    size={16}
                    color={C.deepGreen}
                  />
                  <Text style={styles.bikeInfoText}>{`Sepeda ${bike.type}`}</Text>
                </View>
                <View style={styles.bikeInfoRow}>
                  <Ionicons name="location-outline" size={16} color={C.deepGreen} />
                  <Text style={styles.bikeInfoText} numberOfLines={1}>
                    {bike.branch}
                  </Text>
                </View>

                <PrimaryButton
                  title="Lihat Detail"
                  small
                  onPress={() =>
                    router.push(`/public/detail-sepeda/${bike.id}` as never)
                  }
                />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* TARIF PER JAM */}
        <View
          onLayout={(e) => recordPosition('pricing', e.nativeEvent.layout.y)}
          style={styles.section}
        >
          <SectionHeading
            icon="cash-multiple"
            title="Tarif & Paket Sewa"
            action="Lihat Semua"
            onPress={openDuration}
          />

          <View style={styles.pricingPanel}>
            <View style={styles.pricingIntro}>
              <View style={styles.pricingIconCircle}>
                <MaterialCommunityIcons
                  name="wallet"
                  size={24}
                  color={C.green}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.pricingIntroTitle}>Tarif per jam</Text>
                <Text style={styles.pricingIntroSub}>
                  Berlaku untuk semua jenis sepeda
                </Text>
              </View>
            </View>

            <View style={styles.pricingColumn}>
              <Text style={styles.pricingCategory}>Pelajar</Text>
              <Text style={styles.price}>Rp10.000</Text>
              <Text style={styles.priceSub}>/jam (hari biasa)</Text>
              <Text style={[styles.price, styles.holidayPrice]}>Rp12.000</Text>
              <Text style={styles.priceSub}>/jam (hari libur)</Text>
            </View>

            <View style={styles.pricingColumn}>
              <Text style={styles.pricingCategory}>Umum</Text>
              <Text style={styles.price}>Rp12.000</Text>
              <Text style={styles.priceSub}>/jam (hari biasa)</Text>
              <Text style={[styles.price, styles.holidayPrice]}>Rp15.000</Text>
              <Text style={styles.priceSub}>/jam (hari libur)</Text>
            </View>
          </View>

          <View style={styles.packageHeading}>
            <MaterialCommunityIcons
              name="gift"
              size={21}
              color={C.green}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.packageHeadingTitle}>Paket Sewa</Text>
              <Text style={styles.packageHeadingSub}>
                Tersedia paket pagi, siang/sore, malam dan sehari penuh.
              </Text>
            </View>
          </View>

          <View style={styles.packageGrid}>
            <PackageCard
              emoji="☀️"
              title="Pagi"
              time="06.00 – 10.00"
              onPress={openDuration}
            />
            <PackageCard
              emoji="🌤️"
              title="Siang / Sore"
              time="10.00 – 17.00"
              onPress={openDuration}
            />
            <PackageCard
              emoji="🌙"
              title="Malam"
              time="17.00 – 22.00"
              onPress={openDuration}
            />
            <PackageCard
              emoji="🗓️"
              title="Sehari Penuh"
              time="Sesuai ketentuan"
              onPress={openDuration}
            />
          </View>

          <View style={styles.noteRow}>
            <Ionicons name="information-circle" size={16} color={C.secondary} />
            <Text style={styles.noteText}>
              Harga dan ketentuan paket dapat berbeda berdasarkan kategori
              pelanggan, hari penyewaan, dan paket yang dipilih.
            </Text>
          </View>
        </View>

        {/* INFORMASI CABANG */}
        <View style={styles.section}>
          <SectionHeading
            icon="map-marker"
            title="Informasi Cabang"
            action="Lihat Semua"
            onPress={openLogin}
          />

          <View style={styles.branchList}>
            <BranchCard name="Cabang Perjuangan" />
            <BranchCard name="Cabang 2" />
          </View>
        </View>

        {/* CARA MENYEWA */}
        <View style={styles.section}>
          <SectionHeading
            icon="format-list-numbered"
            title="Cara Menyewa"
            action="Lihat Semua"
            onPress={openDuration}
          />

          <View style={styles.stepsRow}>
            <Step number="1" title="Pilih Sepeda" text="Lihat katalog dan tentukan jenis sepeda yang diinginkan." />
            <Step number="2" title="Datang ke Cabang" text="Kunjungi lokasi penyewaan untuk memeriksa unit." />
            <Step number="3" title="Proses Penyewaan" text="Petugas mencatat data pelanggan, unit, durasi dan jaminan." />
            <Step number="4" title="Mulai Bersepeda" text="Gunakan sepeda setelah proses penyewaan selesai." />
          </View>
        </View>

        {/* KETENTUAN */}
        <View style={styles.section}>
          <SectionHeading
            icon="shield-check"
            title="Ketentuan Penyewaan"
            action="Lihat Ketentuan Lengkap"
            onPress={openDuration}
          />

          <View style={styles.termsPanel}>
            <TermItem icon="account-outline" title="Kategori pelanggan" text="Pelajar dan umum" />
            <TermItem icon="shield-check-outline" title="Jaminan penyewaan" text="Sesuai kebijakan cabang" />
            <TermItem icon="clock-check-outline" title="Pengembalian sepeda" text="Sesuai waktu sewa" />
            <TermItem icon="phone-outline" title="Keterlambatan" text="Lebih dari 2 jam ditindaklanjuti" />
            <TermItem icon="wrench-outline" title="Kerusakan berat" text="Dapat dikenakan ganti rugi" />
            <TermItem icon="credit-card-outline" title="Pembayaran" text="Tunai dan QRIS" />
          </View>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <View style={styles.footerBrand}>
            <MaterialCommunityIcons
              name="bicycle"
              size={31}
              color={C.green}
            />
            <View>
              <Text style={styles.footerBrandTitle}>Jamal Jepret</Text>
              <Text style={styles.footerBrandSub}>Penyewaan Sepeda</Text>
            </View>
          </View>
          <Text style={styles.footerDescription}>
            Nikmati pengalaman bersepeda yang menyenangkan dengan layanan
            terbaik dari Jamal Jepret.
          </Text>
          <View style={styles.footerContactRow}>
            <Ionicons name="location-outline" size={15} color={C.secondary} />
            <Text style={styles.footerContact}>Cabang Perjuangan & Cabang 2</Text>
          </View>
          <View style={styles.footerContactRow}>
            <Ionicons name="call-outline" size={15} color={C.secondary} />
            <Text style={styles.footerContact}>Informasi kontak tersedia di cabang</Text>
          </View>
          <Text style={styles.copyright}>
            © 2026 Jamal Jepret. Semua hak dilindungi.
          </Text>
        </View>
      </ScrollView>

      {/* NAVIGASI BAWAH */}
      <View style={styles.bottomNav}>
        <BottomNavItem
          icon="home"
          label="Home"
          active
          onPress={() => scrollRef.current?.scrollTo({ y: 0, animated: true })}
        />
        <BottomNavItem
          icon="scan-outline"
          label="Durasi Sewa"
          onPress={openDuration}
        />
        <BottomNavItem
          icon="person-circle-outline"
          label="Login"
          onPress={openLogin}
        />
      </View>
    </SafeAreaView>
  );
}

function PackageCard({
  emoji,
  title,
  time,
  onPress,
}: {
  emoji: string;
  title: string;
  time: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.packageCard}
      accessibilityRole="button"
    >
      <Text style={styles.packageEmoji}>{emoji}</Text>
      <Text style={styles.packageTitle}>{title}</Text>
      <Text style={styles.packageTime}>{time}</Text>
      <Ionicons
        name="arrow-forward"
        size={13}
        color={C.green}
        style={styles.packageArrow}
      />
    </Pressable>
  );
}

function BranchCard({ name }: { name: string }) {
  return (
    <View style={styles.branchCard}>
      <View style={styles.branchImagePlaceholder}>
        <MaterialCommunityIcons name="storefront-outline" size={43} color={C.green} />
      </View>
      <View style={styles.branchContent}>
        <Text style={styles.branchName}>{name}</Text>
        <View style={styles.branchInfoRow}>
          <Ionicons name="location-outline" size={13} color={C.secondary} />
          <Text style={styles.branchInfo}>Alamat belum tersedia</Text>
        </View>
        <View style={styles.branchInfoRow}>
          <Ionicons name="time-outline" size={13} color={C.secondary} />
          <Text style={styles.branchInfo}>Jam operasional belum tersedia</Text>
        </View>
        <View style={styles.branchInfoRow}>
          <Ionicons name="call-outline" size={13} color={C.secondary} />
          <Text style={styles.branchInfo}>Kontak belum tersedia</Text>
        </View>
        <View style={styles.locationButton}>
          <Ionicons name="map-outline" size={14} color={C.green} />
          <Text style={styles.locationButtonText}>Informasi Lokasi</Text>
        </View>
      </View>
    </View>
  );
}

function Step({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <View style={styles.stepItem}>
      <View style={styles.stepNumber}>
        <Text style={styles.stepNumberText}>{number}</Text>
      </View>
      <View style={styles.stepLine} />
      <Text style={styles.stepTitle}>{title}</Text>
      <Text style={styles.stepText}>{text}</Text>
    </View>
  );
}

function TermItem({
  icon,
  title,
  text,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  text: string;
}) {
  return (
    <View style={styles.termItem}>
      <MaterialCommunityIcons name={icon} size={20} color={C.green} />
      <View style={{ flex: 1 }}>
        <Text style={styles.termTitle}>{title}</Text>
        <Text style={styles.termText}>{text}</Text>
      </View>
    </View>
  );
}

function BottomNavItem({
  icon,
  label,
  active = false,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.bottomNavItem}
      accessibilityRole="button"
    >
      <Ionicons
        name={icon}
        size={23}
        color={active ? C.green : '#87969E'}
      />
      <Text
        style={[
          styles.bottomNavLabel,
          active && styles.bottomNavLabelActive,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: C.white,
  },
  header: {
    height: 66,
    backgroundColor: C.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F3F1',
  },
  logoIcon: {
    width: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoTextWrap: {
    marginLeft: 3,
  },
  logoTitle: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '800',
    color: C.green,
  },
  logoSubtitle: {
    fontSize: 10,
    color: C.secondary,
    marginTop: 1,
  },
  scroll: {
    flex: 1,
    backgroundColor: C.background,
  },
  scrollContent: {
    paddingBottom: 22,
  },
  hero: {
    marginHorizontal: 9,
    marginTop: 5,
    marginBottom: 13,
    height: 238,
    borderRadius: 17,
    overflow: 'hidden',
    backgroundColor: C.lightGreen,
  },
  heroImage: {
    flex: 1,
    justifyContent: 'center',
  },
  heroImageStyle: {
    borderRadius: 17,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(238, 250, 239, 0.72)',
  },
  heroContent: {
    width: '76%',
    paddingLeft: 19,
    paddingVertical: 15,
  },
  heroTitle: {
    fontSize: 25,
    lineHeight: 27,
    fontWeight: '900',
    color: C.deepGreen,
    letterSpacing: -0.5,
  },
  heroDescription: {
    fontSize: 11.5,
    lineHeight: 17,
    color: C.deepGreen,
    marginTop: 7,
    maxWidth: 285,
  },
  heroButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  primaryButton: {
    minHeight: 39,
    paddingHorizontal: 14,
    borderRadius: 13,
    backgroundColor: C.green,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  primaryButtonText: {
    color: C.white,
    fontSize: 11,
    fontWeight: '800',
  },
  outlinedButton: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 1,
    borderColor: C.green,
  },
  outlinedButtonText: {
    color: C.green,
  },
  smallButton: {
    minHeight: 31,
    borderRadius: 11,
    marginTop: 12,
  },
  section: {
    marginBottom: 19,
  },
  sectionHeading: {
    minHeight: 31,
    paddingHorizontal: 12,
    marginBottom: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: C.deepGreen,
  },
  seeAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 5,
  },
  seeAllText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: C.darkGreen,
  },
  filterList: {
    paddingHorizontal: 10,
    paddingBottom: 9,
    gap: 8,
  },
  filterChip: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: '#EDF1EE',
    borderRadius: 22,
    paddingHorizontal: 16,
    height: 31,
    justifyContent: 'center',
    shadowColor: '#143D27',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  filterChipActive: {
    backgroundColor: C.green,
    borderColor: C.green,
  },
  filterText: {
    color: C.darkGreen,
    fontSize: 10.5,
    fontWeight: '600',
  },
  filterTextActive: {
    color: C.white,
    fontWeight: '800',
  },
  bikeList: {
    paddingHorizontal: 10,
    paddingBottom: 4,
    gap: 13,
  },
  bikeCard: {
    width: CARD_WIDTH,
    backgroundColor: C.white,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EEF2EF',
    shadowColor: '#203E2C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 9,
    elevation: 3,
  },
  bikeImageWrap: {
    height: 119,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F3F7F4',
    justifyContent: 'center',
  },
  bikeImage: {
    width: '100%',
    height: '100%',
  },
  availabilityBadge: {
    position: 'absolute',
    top: 7,
    right: 6,
    backgroundColor: '#D8FAE9',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  unavailableBadge: {
    backgroundColor: '#FCE8E6',
  },
  statusDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: C.success,
  },
  unavailableDot: {
    backgroundColor: '#C62828',
  },
  availabilityText: {
    color: C.success,
    fontSize: 10,
    fontWeight: '700',
  },
  unavailableText: {
    color: '#B3261E',
  },
  bikeCode: {
    fontSize: 13,
    fontWeight: '800',
    color: C.deepGreen,
    marginTop: 10,
    marginBottom: 5,
  },
  bikeInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 3,
  },
  bikeInfoText: {
    fontSize: 11,
    color: '#50685C',
    flexShrink: 1,
  },
  pricingPanel: {
    marginHorizontal: 10,
    padding: 13,
    borderRadius: 15,
    backgroundColor: '#EDF8F0',
    flexDirection: 'row',
    gap: 10,
  },
  pricingIntro: {
    flex: 1.25,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingTop: 2,
  },
  pricingIconCircle: {
    height: 32,
    width: 32,
    borderRadius: 16,
    backgroundColor: '#D5EFD9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pricingIntroTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: C.darkGreen,
    marginTop: 4,
  },
  pricingIntroSub: {
    fontSize: 9.5,
    color: C.secondary,
    marginTop: 3,
    lineHeight: 13,
  },
  pricingColumn: {
    flex: 0.9,
    borderLeftWidth: 1,
    borderLeftColor: '#D6E9DB',
    paddingLeft: 10,
  },
  pricingCategory: {
    fontSize: 11,
    color: C.deepGreen,
    fontWeight: '800',
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '900',
    color: C.deepGreen,
  },
  holidayPrice: {
    marginTop: 7,
  },
  priceSub: {
    fontSize: 9,
    color: C.secondary,
    marginTop: 1,
  },
  packageHeading: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    paddingHorizontal: 12,
    marginTop: 14,
    marginBottom: 9,
  },
  packageHeadingTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: C.deepGreen,
  },
  packageHeadingSub: {
    fontSize: 9.5,
    color: C.secondary,
    marginTop: 3,
  },
  packageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    gap: 8,
  },
  packageCard: {
    width: '48%',
    flexGrow: 1,
    minHeight: 105,
    borderRadius: 15,
    padding: 11,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: '#203E2C',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  packageEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  packageTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: C.deepGreen,
  },
  packageTime: {
    fontSize: 9.5,
    color: C.secondary,
    marginTop: 3,
    paddingRight: 5,
  },
  packageArrow: {
    position: 'absolute',
    right: 10,
    bottom: 11,
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    paddingHorizontal: 13,
    marginTop: 11,
  },
  noteText: {
    flex: 1,
    color: C.secondary,
    fontSize: 9.5,
    lineHeight: 14,
  },
  branchList: {
    paddingHorizontal: 10,
    gap: 10,
  },
  branchCard: {
    flexDirection: 'row',
    gap: 11,
    padding: 11,
    backgroundColor: C.white,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#EEF2EF',
    shadowColor: '#203E2C',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  branchImagePlaceholder: {
    width: 78,
    height: 82,
    backgroundColor: C.lightGreen,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  branchContent: {
    flex: 1,
    justifyContent: 'center',
  },
  branchName: {
    color: C.deepGreen,
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 5,
  },
  branchInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  branchInfo: {
    fontSize: 9,
    color: C.secondary,
    flexShrink: 1,
  },
  locationButton: {
    marginTop: 2,
    backgroundColor: C.paleGreen,
    borderRadius: 9,
    paddingHorizontal: 9,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationButtonText: {
    color: C.darkGreen,
    fontSize: 9.5,
    fontWeight: '700',
  },
  stepsRow: {
    flexDirection: 'row',
    paddingHorizontal: 11,
    gap: 7,
  },
  stepItem: {
    flex: 1,
    minWidth: 0,
    paddingRight: 3,
  },
  stepNumber: {
    width: 27,
    height: 27,
    borderRadius: 14,
    backgroundColor: '#C9EBD3',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#B4DEC1',
  },
  stepNumberText: {
    color: C.darkGreen,
    fontSize: 11,
    fontWeight: '900',
  },
  stepLine: {
    height: 1,
    backgroundColor: '#D8E8DD',
    marginVertical: 8,
  },
  stepTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: C.deepGreen,
    lineHeight: 14,
  },
  stepText: {
    fontSize: 8.5,
    lineHeight: 12,
    color: C.secondary,
    marginTop: 4,
  },
  termsPanel: {
    marginHorizontal: 10,
    padding: 12,
    borderRadius: 15,
    backgroundColor: '#EAF7ED',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  termItem: {
    width: '46%',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 7,
  },
  termTitle: {
    fontSize: 9.5,
    fontWeight: '800',
    color: C.deepGreen,
  },
  termText: {
    fontSize: 8.5,
    color: C.secondary,
    marginTop: 2,
    lineHeight: 12,
  },
  footer: {
    marginHorizontal: 10,
    marginTop: 1,
    padding: 15,
    borderRadius: 15,
    backgroundColor: '#EEF3F5',
  },
  footerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerBrandTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: C.green,
  },
  footerBrandSub: {
    fontSize: 9,
    color: C.secondary,
  },
  footerDescription: {
    fontSize: 10,
    lineHeight: 15,
    color: C.secondary,
    marginTop: 9,
    marginBottom: 8,
  },
  footerContactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  footerContact: {
    fontSize: 9.5,
    color: C.secondary,
  },
  copyright: {
    textAlign: 'center',
    color: C.muted,
    fontSize: 9,
    marginTop: 15,
  },
  bottomNav: {
    height: 65,
    flexDirection: 'row',
    backgroundColor: C.white,
    borderTopWidth: 1,
    borderTopColor: '#EDF1EE',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  bottomNavItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  bottomNavLabel: {
    color: '#819099',
    fontSize: 10,
    fontWeight: '600',
  },
  bottomNavLabelActive: {
    color: C.green,
    fontWeight: '800',
  },
});
