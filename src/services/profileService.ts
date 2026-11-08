
import { supabase } from '../lib/supabase';
import type { Profile } from '../context/AuthContext';

export type UpdateProfileInput = {
  fullName: string;
  phone: string;
};

// =====================================================
// GET PROFILE
// =====================================================

export async function getProfile(
  userId: string,
): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    throw new Error(`Gagal mengambil profil: ${error.message}`);
  }

  if (!data) {
    throw new Error(
      'Data profil tidak ditemukan. Silakan login kembali.',
    );
  }

  return data as Profile;
}

// =====================================================
// UPDATE PROFILE
// =====================================================

export async function updateProfile(
  userId: string,
  input: UpdateProfileInput,
): Promise<Profile> {
  const fullName = input.fullName.trim();
  const phone = input.phone.trim();

  if (!fullName) {
    throw new Error('Nama lengkap tidak boleh kosong.');
  }

  if (!phone) {
    throw new Error('Nomor WhatsApp tidak boleh kosong.');
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({
      full_name: fullName,
      phone,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select('*')
    .single();

  if (error) {
    throw new Error(`Gagal memperbarui profil: ${error.message}`);
  }

  if (!data) {
    throw new Error('Profil tidak berhasil diperbarui.');
  }

  return data as Profile;
}
