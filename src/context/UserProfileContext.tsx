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
interface UserProfileContextValue {
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
}

// =====================================================
// CUSTOM HOOK
// =====================================================

export function useUserProfile() {
  const context = useContext(UserProfileContext);

  if (!context) {
    throw new Error(
      'useUserProfile harus digunakan di dalam UserProfileProvider.',
    );
  }

  return context;
}
