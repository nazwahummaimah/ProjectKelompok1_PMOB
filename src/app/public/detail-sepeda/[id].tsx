
import React from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { PrimaryButton } from '../../../components/molecules/PrimaryButton';

const C = {
  green: '#16833B',
  darkGreen: '#07532C',
  lightGreen: '#E8F6EC',
  background: '#F7F9F8',
  white: '#FFFFFF',
  text: '#173B29',
  secondary: '#61766A',
  border: '#E5ECE7',
  red: '#B3261E',
};

const bikes = [
  {
    id: 'MTB-001',
    name: 'Sepeda Gunung',
    type: 'Gunung',
    branch: 'Cabang Perjuangan',
    image: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?auto=format&fit=crop&w=900&q=85',
    available: true,
    description: 'Sepeda gunung untuk menemani aktivitas bersepeda dan perjalanan di berbagai kondisi jalan.',
  },
  {
    id: 'LP-012',
    name: 'Sepeda Lipat',
    type: 'Lipat',
    branch: 'Cabang Perjuangan',
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=900&q=85',
    available: true,
    description: 'Sepeda lipat yang praktis untuk perjalanan santai dan aktivitas sehari-hari.',
  },
  {
    id: 'MTB-003',
    name: 'Sepeda Gunung',
    type: 'Gunung',
    branch: 'Cabang Perjuangan',
    image: 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=900&q=85',
    available: true,
    description: 'Sepeda gunung yang cocok untuk aktivitas luar ruangan dan bersepeda santai.',
  },
  {
    id: 'LP-014',
    name: 'Sepeda Lipat',
    type: 'Lipat',
    branch: 'Cabang Perjuangan',
    image: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=900&q=85',
    available: false,
    description: 'Sepeda lipat yang praktis dan mudah dibawa dan cocok untuk pemula.',
  },
];

export default function DetailSepedaScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const bike = bikes.find((item) => item.id === id);

  const openDuration = () => router.push('/public/durasi-sewa');

  if (!bike) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.notFound}>
          <MaterialCommunityIcons
            name="bicycle"
            size={54}
            color={C.green}
          />
          <Text style={styles.title}>Sepeda tidak ditemukan</Text>
          <Text style={styles.description}>
            Data sepeda yang kamu cari tidak tersedia.
          </Text>
          <PrimaryButton
            title="Kembali ke Beranda"
            onPress={() => router.replace('/public')}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={23}
          color={C.darkGreen}
          onPress={() => router.back()}
        />
        <Text style={styles.headerTitle}>Detail Sepeda</Text>
        <View style={{ width: 23 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Image source={{ uri: bike.image }} style={styles.bikeImage} />

        <View style={styles.card}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.bikeName}>{bike.name}</Text>
              <Text style={styles.bikeCode}>Kode unit: {bike.id}</Text>
            </View>

            <View
              style={[
                styles.badge,
                !bike.available && styles.badgeUnavailable,
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  !bike.available && styles.badgeTextUnavailable,
                ]}
              >
                {bike.available ? 'Tersedia' : 'Disewa'}
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Informasi Sepeda</Text>

          <InfoRow
            icon="bicycle"
            label="Jenis sepeda"
            value={bike.type}
          />
          <InfoRow
            icon="storefront-outline"
            label="Cabang"
            value={bike.branch}
          />
          <InfoRow
            icon="information-outline"
            label="Status"
            value={bike.available ? 'Siap disewa' : 'Sedang disewa'}
          />

          <Text style={styles.sectionTitle}>Deskripsi</Text>
          <Text style={styles.description}>{bike.description}</Text>

          <Text style={styles.sectionTitle}>Informasi Tarif</Text>
          <View style={styles.priceBox}>
            <Text style={styles.priceLabel}>Pelajar · Hari biasa</Text>
            <Text style={styles.price}>Rp10.000/jam</Text>
            <Text style={styles.priceLabel}>Pelajar · Hari libur</Text>
            <Text style={styles.price}>Rp12.000/jam</Text>
            <Text style={styles.priceLabel}>Umum · Hari biasa</Text>
            <Text style={styles.price}>Rp12.000/jam</Text>
            <Text style={styles.priceLabel}>Umum · Hari libur</Text>
            <Text style={styles.price}>Rp15.000/jam</Text>
            <Text style={styles.note}>
              Tarif malam mendapat tambahan Rp5.000 per jam.
            </Text>
          </View>

          <PrimaryButton
            title="Kembali ke Katalog"
            outlined
            onPress={() => router.back()}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <MaterialCommunityIcons
        name={icon}
        size={20}
        color={C.green}
      />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: C.background,
  },
  header: {
    minHeight: 58,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: C.white,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: C.darkGreen,
  },
  content: {
    padding: 14,
    paddingBottom: 28,
  },
  bikeImage: {
    width: '100%',
    height: 240,
    borderRadius: 18,
    backgroundColor: C.lightGreen,
  },
  card: {
    marginTop: 14,
    padding: 17,
    backgroundColor: C.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.border,
    gap: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  bikeName: {
    fontSize: 22,
    fontWeight: '900',
    color: C.darkGreen,
  },
  bikeCode: {
    marginTop: 5,
    fontSize: 13,
    color: C.secondary,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: C.lightGreen,
  },
  badgeUnavailable: {
    backgroundColor: '#FCE8E6',
  },
  badgeText: {
    color: C.green,
    fontSize: 11,
    fontWeight: '800',
  },
  badgeTextUnavailable: {
    color: C.red,
  },
  sectionTitle: {
    marginTop: 7,
    fontSize: 15,
    fontWeight: '800',
    color: C.darkGreen,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingVertical: 5,
  },
  infoLabel: {
    flex: 1,
    fontSize: 13,
    color: C.secondary,
  },
  infoValue: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: C.text,
    textAlign: 'right',
  },
  description: {
    fontSize: 13,
    lineHeight: 20,
    color: C.secondary,
  },
  priceBox: {
    padding: 13,
    borderRadius: 13,
    backgroundColor: C.lightGreen,
    gap: 5,
  },
  priceLabel: {
    marginTop: 3,
    fontSize: 12,
    color: C.secondary,
  },
  price: {
    fontSize: 16,
    fontWeight: '900',
    color: C.darkGreen,
  },
  note: {
    marginTop: 7,
    fontSize: 12,
    lineHeight: 18,
    color: C.secondary,
  },
  unavailableNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#FCE8E6',
  },
  unavailableText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: C.red,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: C.darkGreen,
  },
});
