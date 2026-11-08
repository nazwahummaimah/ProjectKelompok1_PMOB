<<<<<<< HEAD

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import type { ReactNode } from 'react';

import { useAuth } from './AuthContext';
import type { Profile as SupabaseProfile } from './AuthContext';

import {
  updateProfile as updateProfileService,
} from '../services/profileService';

import type {
  UpdateProfileInput,
} from '../services/profileService';

import type {
  DemoUserProfile,
} from '../constants/userDemo';

// =====================================================
// TYPES
// =====================================================

type EditableProfile = Pick<
  DemoUserProfile,
  'fullName' | 'phone'
>;
=======
import React, { createContext, useCallback, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { Profile } from './AuthContext';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';
>>>>>>> 8e11d31070a99647ff703eaa542824a5f5cc1ce8

type EditableProfile = { full_name: string; phone: string | null };
interface UserProfileContextValue {
<<<<<<< HEAD
  profile: DemoUserProfile;
  loading: boolean;
  updateProfile: (
    updates: Partial<EditableProfile>,
  ) => Promise<void>;
}

// =====================================================
// HELPERS
// =====================================================

function formatMemberSince(date: string): string {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return '-';
  }

  return parsedDate.toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
  });
}

function mapSupabaseProfile(
  data: SupabaseProfile,
): DemoUserProfile {
  return {
    fullName: data.full_name,
    email: data.email,
    phone: data.phone ?? '',
    customerType: data.customer_type,
    memberSince: formatMemberSince(data.created_at),
  };
}

const EMPTY_PROFILE: DemoUserProfile = {
  fullName: '',
  email: '',
  phone: '',
  customerType: 'Umum',
  memberSince: '-',
};

// =====================================================
// CONTEXT
// =====================================================

const UserProfileContext = createContext<
  UserProfileContextValue | undefined
>(undefined);

// =====================================================
// PROVIDER
// =====================================================

export function UserProfileProvider({
  children,
}: {
  children: ReactNode;
}) {
  const {
    user,
    profile: authProfile,
    refreshProfile,
  } = useAuth();

  const [profile, setProfile] =
    useState<DemoUserProfile>(EMPTY_PROFILE);

  const [loading, setLoading] = useState(true);

  // ===================================================
  // SYNC AUTH PROFILE
  // ===================================================

  useEffect(() => {
    if (!user) {
      setProfile(EMPTY_PROFILE);
      setLoading(false);
      return;
    }

    if (!authProfile) {
      setProfile(EMPTY_PROFILE);
      setLoading(true);
      return;
    }

    try {
      const mappedProfile = mapSupabaseProfile(authProfile);

      setProfile(mappedProfile);
      setLoading(false);
    } catch (error) {
      console.error('Profile mapping error:', error);
      setLoading(false);
    }
  }, [user?.id, authProfile]);

  // ===================================================
  // UPDATE PROFILE
  // ===================================================

  const updateProfile = useCallback(
    async (updates: Partial<EditableProfile>) => {
      if (!user) {
        throw new Error(
          'Kamu harus login untuk memperbarui profil.',
        );
      }

      const input: UpdateProfileInput = {
        fullName:
          updates.fullName?.trim() ?? profile.fullName,
        phone:
          updates.phone?.trim() ?? profile.phone,
      };

      // Request database hanya satu kali.
      const updatedData = await updateProfileService(
        user.id,
        input,
      );

      // Langsung perbarui tampilan.
      const mappedProfile = mapSupabaseProfile(updatedData);

      setProfile(mappedProfile);

      // Sinkronisasi AuthContext berjalan di background.
      // Tidak perlu menunggu request kedua.
      void refreshProfile().catch((error) => {
        console.error(
          'Background profile synchronization error:',
          error,
        );
      });
    },
    [user, profile, refreshProfile],
  );

  // ===================================================
  // CONTEXT VALUE
  // ===================================================

  const value = useMemo<UserProfileContextValue>(
    () => ({
      profile,
      loading,
      updateProfile,
    }),
    [profile, loading, updateProfile],
  );

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
=======
  profile: (Profile & { email: string }) | null;
  updateProfile: (updates: Partial<EditableProfile>) => Promise<void>;
}
const UserProfileContext = createContext<UserProfileContextValue | undefined>(undefined);

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const { profile: authProfile, user, refreshProfile } = useAuth();
  const updateProfile = useCallback(async (updates: Partial<EditableProfile>) => {
    if (!authProfile?.id) throw new Error('Profil pengguna tidak ditemukan.');
    const payload: Partial<EditableProfile> = {};
    if (typeof updates.full_name === 'string') payload.full_name = updates.full_name.trim();
    if (typeof updates.phone === 'string' || updates.phone === null) payload.phone = updates.phone;
    const { error } = await supabase.from('profiles').update(payload).eq('id', authProfile.id);
    if (error) throw error;
    await refreshProfile();
  }, [authProfile?.id, refreshProfile]);

  const value = useMemo(() => ({
    profile: authProfile && user ? { ...authProfile, email: user.email ?? '' } : null,
    updateProfile,
  }), [authProfile, user?.email, updateProfile]);
  return <UserProfileContext.Provider value={value}>{children}</UserProfileContext.Provider>;
>>>>>>> 8e11d31070a99647ff703eaa542824a5f5cc1ce8
}

// =====================================================
// CUSTOM HOOK
// =====================================================

export function useUserProfile() {
  const context = useContext(UserProfileContext);
<<<<<<< HEAD

  if (!context) {
    throw new Error(
      'useUserProfile harus digunakan di dalam UserProfileProvider.',
    );
  }

=======
  if (!context) throw new Error('useUserProfile harus berada di dalam UserProfileProvider.');
>>>>>>> 8e11d31070a99647ff703eaa542824a5f5cc1ce8
  return context;
}
