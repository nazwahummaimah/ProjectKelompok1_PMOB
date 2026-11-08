
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import {
  useLocalSearchParams,
  useRouter,
  useFocusEffect,
} from 'expo-router';

import AdminPageLayout, {
  adminUi,
} from '../../components/organisms/AdminPageLayout';

import AdminStatusBadge from '../../components/molecules/AdminStatusBadge';

import { COLORS, FONTS, SIZES } from '../../constants/theme';

import {
  getBikeById,
  Bike,
} from '../../services/bikeService';

export default function AdminUnitDetailScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{ id?: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [bike, setBike] = useState<Bike | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const loadBike = useCallback(async () => {
    if (!id) {
      setBike(null);
      setErrorMessage('ID unit sepeda tidak ditemukan.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');

      const data = await getBikeById(id);
      setBike(data);
    } catch (error) {
      console.error('Admin bike detail error:', error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Gagal mengambil detail unit sepeda.',
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      loadBike();
    }, [loadBike]),
  );

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID').format(value);
  };

  // QR menggunakan identifier yang tersimpan di Supabase.
  const qrValue = bike?.qr_code || bike?.id || '';

  return (
    <AdminPageLayout
      title="Detail Unit"
      subtitle="Informasi inventaris dan kondisi operasional sepeda."
      activeTab="Inventaris"
      showBottomNav
      showBack
    >
      {/* Loading */}
      {loading && (
        <View style={styles.stateContainer}>
          <ActivityIndicator
            size="large"
            color={COLORS.secondaryDark}
          />

          <Text style={styles.helper}>
            Memuat detail unit...
          </Text>
        </View>
      )}

      {/* Error */}
      {!loading && !!errorMessage && (
        <View style={styles.stateContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={38}
            color="#EF4444"
          />

          <Text style={styles.stateTitle}>
            Gagal Memuat Detail
          </Text>

          <Text style={styles.helper}>
            {errorMessage}
          </Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadBike}
          >
            <Text style={styles.retryButtonText}>
              Coba Lagi
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Unit Not Found */}
      {!loading && !errorMessage && !bike && (
        <View style={styles.stateContainer}>
          <Ionicons
            name="bicycle-outline"
            size={38}
            color={COLORS.textSecondary}
          />

          <Text style={styles.stateTitle}>
            Unit Tidak Ditemukan
          </Text>

          <Text style={styles.helper}>
            Data sepeda dengan ID {id || '-'} tidak ditemukan.
          </Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={() =>
              router.replace('/admin/inventaris' as any)
            }
          >
            <Text style={styles.retryButtonText}>
              Kembali ke Inventaris
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Detail Data */}
      {!loading && !errorMessage && bike && (
        <>
          {/* Hero */}
          <View style={styles.hero}>
            <View style={styles.bikeIcon}>
              <Ionicons
                name="bicycle"
                size={48}
                color={COLORS.secondaryDark}
              />
            </View>

            <Text style={styles.unitId}>
              {bike.id}
            </Text>

            <Text style={styles.name}>
              {bike.name}
            </Text>

            <Text style={styles.category}>
              {bike.category}
            </Text>

            <View style={{ marginTop: 10 }}>
              <AdminStatusBadge status={bike.status} />
            </View>
          </View>

          {/* Informasi Unit */}
          <View style={adminUi.card}>
            <Text style={styles.cardTitle}>
              Informasi Unit
            </Text>

            <InfoRow
              label="Kode QR"
              value={bike.qr_code || 'Belum tersedia'}
            />

            <InfoRow
              label="Lokasi"
              value={bike.location || 'Belum ditentukan'}
            />

            <InfoRow
              label="Alamat"
              value={bike.address || 'Belum tersedia'}
            />

            <InfoRow
              label="Kategori"
              value={bike.category}
            />

            <InfoRow
              label="Tarif per Jam"
              value={`Rp${formatRupiah(Number(bike.price_per_hour))}`}
            />

            <InfoRow
              label="Jam Operasional"
              value={bike.opening_hours || 'Belum tersedia'}
            />

            <InfoRow
              label="Status Operasional"
              value={bike.status}
            />

            <InfoRow
              label="Catatan"
              value={bike.notes || 'Belum ada catatan.'}
              last
            />
          </View>

          {/* Identitas QR Sungguhan */}
          <View style={adminUi.card}>
            <View style={adminUi.row}>
              <Ionicons
                name="qr-code-outline"
                size={20}
                color={COLORS.secondaryDark}
              />

              <Text
                style={[
                  styles.cardTitle,
                  { marginLeft: 8, marginBottom: 0 },
                ]}
              >
                Identitas QR Unit
              </Text>
            </View>

            <View style={styles.qrBox}>
              {qrValue ? (
                <>
                  <View style={styles.qrImageContainer}>
                    <QRCode
                      value={qrValue}
                      size={200}
                      color="#000000"
                      backgroundColor="#FFFFFF"
                      quietZone={12}
                    />
                  </View>

                  <Text style={styles.qrCode}>
                    {qrValue}
                  </Text>

                  <Text style={styles.helper}>
                    QR Code asli yang dapat dipindai menggunakan
                    kamera pada aplikasi Jamal Jepret.
                  </Text>
                </>
              ) : (
                <>
                  <Ionicons
                    name="alert-circle-outline"
                    size={42}
                    color="#EF4444"
                  />

                  <Text style={styles.qrCode}>
                    QR belum tersedia
                  </Text>

                  <Text style={styles.helper}>
                    Unit ini belum memiliki identifier QR.
                  </Text>
                </>
              )}
            </View>
          </View>

          {/* Kondisi Teknis */}
          <View style={adminUi.card}>
            <Text style={styles.cardTitle}>
              Kondisi Teknis
            </Text>

            <InfoRow
              label="Kondisi Unit"
              value={bike.technical_condition || 'Belum diperiksa'}
            />

            <InfoRow
              label="Ukuran Ban"
              value={bike.tire_size || 'Belum tersedia'}
            />

            <InfoRow
              label="Pengereman"
              value={bike.brakes || 'Belum tersedia'}
            />

            <InfoRow
              label="Transmisi"
              value={bike.transmission || 'Belum tersedia'}
            />

            <InfoRow
              label="Fasilitas"
              value={bike.facilities || 'Belum tersedia'}
              last
            />
          </View>

          {/* Fitur */}
          {bike.features && bike.features.length > 0 && (
            <View style={adminUi.card}>
              <Text style={styles.cardTitle}>
                Fitur Unit
              </Text>

              <View style={styles.tagsContainer}>
                {bike.features.map((feature, index) => (
                  <View
                    key={`${bike.id}-feature-${index}`}
                    style={styles.tag}
                  >
                    <Text style={styles.tagText}>
                      {feature}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Extra Tags */}
          {bike.extra_tags && bike.extra_tags.length > 0 && (
            <View style={adminUi.card}>
              <Text style={styles.cardTitle}>
                Tag Tambahan
              </Text>

              <View style={styles.tagsContainer}>
                {bike.extra_tags.map((tag, index) => (
                  <View
                    key={`${bike.id}-tag-${index}`}
                    style={styles.tag}
                  >
                    <Text style={styles.tagText}>
                      {tag}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Edit Button */}
          <TouchableOpacity
            style={adminUi.button}
            onPress={() =>
              router.push(
                `/admin/form-unit?id=${encodeURIComponent(bike.id)}` as any
              )
            }
          >
            <Ionicons
              name="create-outline"
              size={18}
              color={COLORS.textPrimary}
            />

            <Text
              style={[
                adminUi.buttonText,
                { marginLeft: 7 },
              ]}
            >
              Edit Data Unit
            </Text>
          </TouchableOpacity>

          {/* Maintenance Button */}
          {bike.status === 'Perawatan' && (
            <TouchableOpacity
              style={[
                adminUi.outlineButton,
                { marginTop: 10 },
              ]}
              onPress={() =>
                router.push('/admin/perawatan' as any)
              }
            >
              <Text style={adminUi.buttonText}>
                Buka Perawatan
              </Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </AdminPageLayout>
  );
}

function InfoRow({
  label,
  value,
  last,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View
      style={[
        styles.infoRow,
        last && {
          borderBottomWidth: 0,
          paddingBottom: 0,
        },
      ]}
    >
      <Text style={styles.infoLabel}>
        {label}
      </Text>

      <Text style={styles.infoValue}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: '#E0F2FE',
    borderRadius: SIZES.radiusLarge,
    padding: 22,
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },

  bikeIcon: {
    width: 94,
    height: 94,
    borderRadius: 26,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  unitId: {
    ...FONTS.caption,
    color: COLORS.secondaryDark,
    fontWeight: '700',
  },

  name: {
    ...FONTS.headline2,
    color: COLORS.textPrimary,
    marginTop: 4,
    textAlign: 'center',
  },

  category: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  cardTitle: {
    ...FONTS.labelLarge,
    color: COLORS.secondaryDark,
    marginBottom: 12,
  },

  infoRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  infoLabel: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },

  infoValue: {
    ...FONTS.body,
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginTop: 3,
  },

  qrBox: {
    alignItems: 'center',
    padding: 16,
    marginTop: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: SIZES.radiusMedium,
  },

  qrImageContainer: {
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  qrCode: {
    ...FONTS.labelMedium,
    color: COLORS.secondaryDark,
    marginTop: 12,
    fontWeight: '700',
  },

  helper: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 18,
  },

  stateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    gap: 10,
  },

  stateTitle: {
    ...FONTS.headline3,
    color: COLORS.secondaryDark,
    textAlign: 'center',
  },

  retryButton: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SIZES.large,
    paddingVertical: SIZES.medium,
    borderRadius: SIZES.radiusMedium,
    marginTop: SIZES.small,
  },

  retryButtonText: {
    ...FONTS.labelMedium,
    color: COLORS.textPrimary,
  },

  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  tag: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: SIZES.radiusPill,
  },

  tagText: {
    ...FONTS.caption,
    color: COLORS.secondaryDark,
  },
});
