import React, { createContext, useCallback, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { Profile } from './AuthContext';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

type EditableProfile = { full_name: string; phone: string | null };
interface UserProfileContextValue {
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
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (!context) throw new Error('useUserProfile harus berada di dalam UserProfileProvider.');
  return context;
}
