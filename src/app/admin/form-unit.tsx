
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

import AdminPageLayout, {
  adminUi,
} from '../../components/organisms/AdminPageLayout';

import {
  createBike,
  getBikeById,
  updateBike,
  Bike,
  CreateBikeInput,
} from '../../services/bikeService';

import { COLORS, FONTS, SIZES } from '../../constants/theme';

const CATEGORIES = [
  'Mountain Bike (MTB)',
  'Folding Bike',
  'City Bike',
  'Road Bike',
  'Electric Bike',
];

type FormState = {
  name: string;
  category: string;
  pricePerHour: string;
  location: string;
  address: string;
  openingHours: string;
  imageUrl: string;
  tireSize: string;
  brakes: string;
  transmission: string;
  facilities: string;
  technicalCondition: string;
  features: string;
  extraTags: string;
  notes: string;
};

const INITIAL_FORM: FormState = {
  name: '',
  category: 'Mountain Bike (MTB)',
  pricePerHour: '0',
  location: '',
  address: '',
  openingHours: '',
  imageUrl: '',
  tireSize: '',
  brakes: '',
  transmission: '',
  facilities: '',
  technicalCondition: '',
  features: '',
  extraTags: '',
  notes: '',
};

const splitList = (value: string): string[] => {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

const nullableText = (value: string): string | null => {
  return value.trim() || null;
};

export default function AdminUnitFormScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{ id?: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const isEdit = Boolean(id);

  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [existingBike, setExistingBike] = useState<Bike | null>(null);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const updateField = (field: keyof FormState, value: string) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // Mengambil data unit dari Supabase ketika mode edit.
  useEffect(() => {
    let mounted = true;

    const loadExistingBike = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setErrorMessage('');

        const data = await getBikeById(id);

        if (!mounted) return;

        if (!data) {
          setExistingBike(null);
          setErrorMessage('Unit sepeda yang akan diedit tidak ditemukan.');
          return;
        }

        setExistingBike(data);

        setForm({
          name: data.name ?? '',
          category: data.category ?? 'Mountain Bike (MTB)',
          pricePerHour: String(data.price_per_hour ?? 0),
          location: data.location ?? '',
          address: data.address ?? '',
          openingHours: data.opening_hours ?? '',
          imageUrl: data.image_url ?? '',
          tireSize: data.tire_size ?? '',
          brakes: data.brakes ?? '',
          transmission: data.transmission ?? '',
          facilities: data.facilities ?? '',
          technicalCondition: data.technical_condition ?? '',
          features: (data.features ?? []).join(', '),
          extraTags: (data.extra_tags ?? []).join(', '),
          notes: data.notes ?? '',
        });
      } catch (error) {
        console.error('Load bike form error:', error);

        if (mounted) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : 'Gagal mengambil data unit.'
          );
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadExistingBike();

    return () => {
      mounted = false;
    };
  }, [id]);

  const handleSave = async () => {
    const name = form.name.trim();
    const category = form.category.trim();
    const priceText = form.pricePerHour.trim();
    const price = Number(priceText);

    if (name.length < 3) {
      Alert.alert(
        'Periksa Nama Unit',
        'Nama sepeda minimal 3 karakter.'
      );
      return;
    }

    if (!category) {
      Alert.alert(
        'Periksa Kategori',
        'Kategori sepeda wajib dipilih.'
      );
      return;
    }

    if (
      !priceText ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      Alert.alert(
        'Periksa Tarif',
        'Tarif sewa harus berupa angka dan tidak boleh negatif.'
      );
      return;
    }

    const payload: CreateBikeInput = {
      name,
      category,
      price_per_hour: price,
      location: nullableText(form.location),
      address: nullableText(form.address),
      opening_hours: nullableText(form.openingHours),
      image_url: nullableText(form.imageUrl),
      tire_size: nullableText(form.tireSize),
      brakes: nullableText(form.brakes),
      transmission: nullableText(form.transmission),
      facilities: nullableText(form.facilities),
      technical_condition: nullableText(form.technicalCondition),
      features: splitList(form.features),
      extra_tags: splitList(form.extraTags),
      notes: nullableText(form.notes),
    };

    try {
      setSaving(true);

      if (isEdit && id) {
        await updateBike(id, payload);

        Alert.alert(
          'Berhasil',
          'Data unit berhasil diperbarui.',
          [
            {
              text: 'Lihat Detail',
              onPress: () =>
                router.replace(
                  `/admin/detail-unit?id=${encodeURIComponent(id)}` as any
                ),
            },
          ]
        );
      } else {
        const newBike = await createBike(payload);

        Alert.alert(
          'Berhasil',
          `${newBike.id} berhasil ditambahkan dengan status Tersedia.`,
          [
            {
              text: 'Lihat Unit',
              onPress: () =>
                router.replace(
                  `/admin/detail-unit?id=${encodeURIComponent(newBike.id)}` as any
                ),
            },
          ]
        );
      }
    } catch (error) {
      console.error('Save bike error:', error);

      Alert.alert(
        'Gagal Menyimpan',
        error instanceof Error
          ? error.message
          : 'Terjadi kesalahan ketika menyimpan data unit.'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminPageLayout
        title={isEdit ? 'Edit Unit' : 'Tambah Unit'}
        subtitle="Memuat informasi unit sepeda..."
        showBack
      >
        <View style={styles.stateContainer}>
          <ActivityIndicator
            size="large"
            color={COLORS.secondaryDark}
          />
          <Text style={styles.helper}>
            Memuat data dari Supabase...
          </Text>
        </View>
      </AdminPageLayout>
    );
  }

  if (isEdit && (!existingBike || errorMessage)) {
    return (
      <AdminPageLayout
        title="Edit Unit"
        subtitle="Data unit tidak dapat dimuat."
        showBack
      >
        <View style={styles.stateContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={38}
            color="#EF4444"
          />
          <Text style={styles.helper}>
            {errorMessage || 'Unit tidak ditemukan.'}
          </Text>

          <TouchableOpacity
            style={adminUi.button}
            onPress={() =>
              router.replace('/admin/inventaris' as any)
            }
          >
            <Text style={adminUi.buttonText}>
              Kembali ke Inventaris
            </Text>
          </TouchableOpacity>
        </View>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout
      title={isEdit ? 'Edit Unit' : 'Tambah Unit'}
      subtitle="Lengkapi informasi sepeda untuk inventaris Jamal Jepret."
      activeTab="Inventaris"
      showBottomNav
      showBack
    >
      <View style={adminUi.card}>
        <Text style={styles.sectionTitle}>
          Informasi Dasar
        </Text>

        <FormField
          label="Nama Sepeda *"
          value={form.name}
          onChangeText={(value) => updateField('name', value)}
          placeholder="Contoh: Polygon Cascade 4"
        />

        <Text style={styles.label}>
          Kategori *
        </Text>

        <View style={styles.choiceRow}>
          {CATEGORIES.map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => updateField('category', item)}
              style={[
                adminUi.chip,
                form.category === item && adminUi.chipActive,
              ]}
            >
              <Text
                style={[
                  styles.choiceText,
                  form.category === item && styles.choiceActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <FormField
          label="Tarif Sewa per Jam (Rp) *"
          value={form.pricePerHour}
          onChangeText={(value) =>
            updateField('pricePerHour', value)
          }
          placeholder="Contoh: 15000"
          keyboardType="numeric"
        />

        <FormField
          label="URL Gambar"
          value={form.imageUrl}
          onChangeText={(value) => updateField('imageUrl', value)}
          placeholder="https://contoh.com/gambar-sepeda.jpg"
        />
      </View>

      <View style={adminUi.card}>
        <Text style={styles.sectionTitle}>
          Informasi Lokasi
        </Text>

        <FormField
          label="Lokasi / Nama Pos"
          value={form.location}
          onChangeText={(value) => updateField('location', value)}
          placeholder="Contoh: Pos Jamal Jepret Cirebon"
        />

        <FormField
          label="Alamat"
          value={form.address}
          onChangeText={(value) => updateField('address', value)}
          placeholder="Alamat lengkap pos penyewaan"
          multiline
        />

        <FormField
          label="Jam Operasional"
          value={form.openingHours}
          onChangeText={(value) => updateField('openingHours', value)}
          placeholder="Contoh: Setiap hari, 06:00 - 22:00"
        />
      </View>

      <View style={adminUi.card}>
        <Text style={styles.sectionTitle}>
          Spesifikasi dan Kondisi
        </Text>

        <FormField
          label="Ukuran Ban"
          value={form.tireSize}
          onChangeText={(value) => updateField('tireSize', value)}
          placeholder="Contoh: 27.5 inch"
        />

        <FormField
          label="Pengereman"
          value={form.brakes}
          onChangeText={(value) => updateField('brakes', value)}
          placeholder="Contoh: Hydraulic Disc Brake"
        />

        <FormField
          label="Transmisi"
          value={form.transmission}
          onChangeText={(value) => updateField('transmission', value)}
          placeholder="Contoh: 21 Speed"
        />

        <FormField
          label="Fasilitas Unit"
          value={form.facilities}
          onChangeText={(value) => updateField('facilities', value)}
          placeholder="Contoh: Helm, kunci, keranjang"
        />

        <FormField
          label="Kondisi Teknis"
          value={form.technicalCondition}
          onChangeText={(value) =>
            updateField('technicalCondition', value)
          }
          placeholder="Contoh: Sangat baik"
        />
      </View>

      <View style={adminUi.card}>
        <Text style={styles.sectionTitle}>
          Fitur dan Catatan
        </Text>

        <FormField
          label="Fitur"
          value={form.features}
          onChangeText={(value) => updateField('features', value)}
          placeholder="Pisahkan dengan koma. Contoh: Ringan, Nyaman, Sporty"
          multiline
        />

        <Text style={styles.helper}>
          Pisahkan setiap fitur menggunakan tanda koma.
        </Text>

        <FormField
          label="Tag Tambahan"
          value={form.extraTags}
          onChangeText={(value) => updateField('extraTags', value)}
          placeholder="Contoh: Favorit, Premium"
          multiline
        />

        <FormField
          label="Catatan Unit"
          value={form.notes}
          onChangeText={(value) => updateField('notes', value)}
          placeholder="Catatan tambahan mengenai unit sepeda"
          multiline
        />
      </View>

      <View style={styles.statusInfo}>
        <Ionicons
          name="information-circle-outline"
          size={19}
          color={COLORS.secondaryDark}
        />

        <Text style={styles.statusInfoText}>
          {isEdit
            ? `Status saat ini: ${existingBike?.status}. Status tidak diubah melalui formulir ini.`
            : 'Unit baru otomatis dibuat dengan status Tersedia. Kode unit dan QR Code dibuat oleh sistem.'}
        </Text>
      </View>

      <TouchableOpacity
        style={[
          adminUi.button,
          styles.saveButton,
          saving && styles.disabledButton,
        ]}
        onPress={handleSave}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator
            size="small"
            color={COLORS.textPrimary}
          />
        ) : (
          <Ionicons
            name="save-outline"
            size={18}
            color={COLORS.textPrimary}
          />
        )}

        <Text style={[adminUi.buttonText, { marginLeft: 8 }]}>
          {saving
            ? 'Menyimpan...'
            : isEdit
              ? 'Simpan Perubahan'
              : 'Simpan Data Unit'}
        </Text>
      </TouchableOpacity>
    </AdminPageLayout>
  );
}

function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  multiline,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'decimal-pad';
  multiline?: boolean;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>
        {label}
      </Text>

      <TextInput
        style={[
          adminUi.input,
          multiline && styles.multiline,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textSecondary}
        keyboardType={keyboardType || 'default'}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        editable
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    ...FONTS.headline3,
    color: COLORS.secondaryDark,
    marginBottom: SIZES.large,
  },

  field: {
    marginBottom: SIZES.medium,
  },

  label: {
    ...FONTS.labelMedium,
    color: COLORS.textPrimary,
    marginBottom: 7,
  },

  choiceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: SIZES.medium,
  },

  choiceText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },

  choiceActive: {
    color: COLORS.secondaryDark,
    fontWeight: '700',
  },

  multiline: {
    minHeight: 85,
    paddingTop: 12,
  },

  helper: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: SIZES.medium,
  },

  statusInfo: {
    backgroundColor: '#F0F9FF',
    padding: 12,
    borderRadius: SIZES.radiusMedium,
    marginBottom: SIZES.medium,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },

  statusInfoText: {
    ...FONTS.caption,
    color: COLORS.secondaryDark,
    lineHeight: 18,
    flex: 1,
  },

  saveButton: {
    marginBottom: SIZES.large,
  },

  disabledButton: {
    opacity: 0.6,
  },

  stateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    gap: 12,
  },
});