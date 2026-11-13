
import React, { useCallback, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
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

      if (!data) {
        setErrorMessage('Unit sepeda tidak ditemukan.');
      }
    } catch (error) {
      console.error('Admin bike detail error:', error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Gagal mengambil detail unit sepeda.'
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Memuat ulang detail setiap kali halaman kembali difokuskan.
  useFocusEffect(
    useCallback(() => {
      loadBike();
    }, [loadBike])
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
      {/* LOADING */}
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

      {/* ERROR */}
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

          <TouchableOpacity
            style={styles.backButton}
            onPress={() =>
              router.replace('/admin/inventaris' as any)
            }
          >
            <Text style={styles.backButtonText}>
              Kembali ke Inventaris
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* DETAIL DATA */}
      {!loading && !errorMessage && bike && (
        <>
          {/* HERO FOTO UNIT */}
          <View style={styles.hero}>
            {bike.image_url ? (
              <Image
                source={{ uri: bike.image_url }}
                style={styles.heroImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.heroFallback}>
                <View style={styles.fallbackIcon}>
                  <Ionicons
                    name="bicycle"
                    size={58}
                    color={COLORS.secondaryDark}
                  />
                </View>

                <Text style={styles.fallbackTitle}>
                  Foto Belum Tersedia
                </Text>

                <Text style={styles.fallbackSubtitle}>
                  Tambahkan foto melalui Edit Data Unit.
                </Text>
              </View>
            )}

            {/* ID UNIT */}
            <View style={styles.heroIdBadge}>
              <Ionicons
                name="pricetag-outline"
                size={13}
                color="#FFFFFF"
              />

              <Text style={styles.heroIdText}>
                {bike.id}
              </Text>
            </View>

            {/* INFORMASI DI BAGIAN BAWAH FOTO */}
            {bike.image_url && (
              <View style={styles.heroOverlay}>
                <View style={styles.heroTextContainer}>
                  <Text style={styles.heroName}>
                    {bike.name}
                  </Text>

                  <Text style={styles.heroCategory}>
                    {bike.category}
                  </Text>
                </View>

                <View style={styles.heroStatus}>
                  <AdminStatusBadge status={bike.status} />
                </View>
              </View>
            )}

            {/* STATUS UNTUK FALLBACK TANPA GAMBAR */}
            {!bike.image_url && (
              <View style={styles.fallbackStatus}>
                <AdminStatusBadge status={bike.status} />
              </View>
            )}
          </View>

          {/* RINGKASAN UNIT */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryItem}>
              <Ionicons
                name="cash-outline"
                size={19}
                color={COLORS.secondaryDark}
              />

              <View style={styles.summaryTextContainer}>
                <Text style={styles.summaryLabel}>
                  Tarif Sewa
                </Text>

                <Text style={styles.summaryValue}>
                  Rp{formatRupiah(Number(bike.price_per_hour))}
                  <Text style={styles.summaryUnit}>
                    {' '}/ jam
                  </Text>
                </Text>
              </View>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryItem}>
              <Ionicons
                name="location-outline"
                size={19}
                color={COLORS.secondaryDark}
              />

              <View style={styles.summaryTextContainer}>
                <Text style={styles.summaryLabel}>
                  Lokasi Unit
                </Text>

                <Text
                  style={styles.summaryValue}
                  numberOfLines={2}
                >
                  {bike.location || 'Belum ditentukan'}
                </Text>
              </View>
            </View>
          </View>

          {/* INFORMASI UNIT */}
          <View style={adminUi.card}>
            <Text style={styles.cardTitle}>
              Informasi Unit
            </Text>

            <InfoRow
              label="Kode Unit"
              value={bike.id}
            />

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

          {/* IDENTITAS QR UNIT */}
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
                  {
                    marginLeft: 8,
                    marginBottom: 0,
                  },
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

          {/* KONDISI TEKNIS */}
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

          {/* FITUR UNIT */}
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

          {/* TAG TAMBAHAN */}
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

          {/* EDIT BUTTON */}
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

          {/* MAINTENANCE BUTTON */}
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

/**
 * Komponen baris informasi unit.
 */
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
  /* HERO IMAGE */
  hero: {
    height: 280,
    borderRadius: SIZES.radiusLarge,
    overflow: 'hidden',
    backgroundColor: '#E0F2FE',
    marginBottom: SIZES.medium,
    position: 'relative',
  },

  heroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },

  heroFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#E0F2FE',
  },

  fallbackIcon: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  fallbackTitle: {
    ...FONTS.labelLarge,
    color: COLORS.secondaryDark,
  },

  fallbackSubtitle: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },

  heroIdBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: SIZES.radiusSmall,
  },

  heroIdText: {
    ...FONTS.caption,
    color: '#FFFFFF',
    fontWeight: '700',
  },

  heroOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 17,
    paddingVertical: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.68)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 10,
  },

  heroTextContainer: {
    flex: 1,
  },

  heroName: {
    ...FONTS.headline2,
    color: '#FFFFFF',
    fontWeight: '700',
  },

  heroCategory: {
    ...FONTS.caption,
    color: '#E2E8F0',
    marginTop: 4,
  },

  heroStatus: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },

  fallbackStatus: {
    position: 'absolute',
    bottom: 18,
    alignSelf: 'center',
  },

  /* SUMMARY */
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLarge,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 15,
    marginBottom: SIZES.medium,
    flexDirection: 'row',
    alignItems: 'center',
  },

  summaryItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
  },

  summaryTextContainer: {
    flex: 1,
  },

  summaryLabel: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },

  summaryValue: {
    ...FONTS.labelMedium,
    color: COLORS.textPrimary,
    marginTop: 3,
  },

  summaryUnit: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    fontWeight: 'normal',
  },

  summaryDivider: {
    width: 1,
    height: 38,
    backgroundColor: COLORS.border,
    marginHorizontal: 12,
  },

  /* INFORMATION */
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

  /* QR */
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

  /* STATES */
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

  backButton: {
    padding: 10,
  },

  backButtonText: {
    ...FONTS.labelMedium,
    color: COLORS.secondaryDark,
  },

  /* TAGS */
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
