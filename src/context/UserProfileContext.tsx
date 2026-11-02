import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { DEMO_USER_PROFILE } from '../constants/userDemo';
import type { DemoUserProfile } from '../constants/userDemo';
import { useAdmin } from './AdminContext';

type EditableProfile = Pick<DemoUserProfile, 'fullName' | 'phone'>;

interface UserProfileContextValue {
  profile: DemoUserProfile;
  updateProfile: (updates: Partial<EditableProfile>) => void;
}

const UserProfileContext = createContext<UserProfileContextValue | undefined>(undefined);

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<DemoUserProfile>(DEMO_USER_PROFILE);
  const { updateCustomerProfile } = useAdmin();

  const updateProfile = useCallback((updates: Partial<EditableProfile>) => {
    // Customer identity is linked by WhatsApp in this frontend demo.
    updateCustomerProfile(profile.phone, {
      customerName: updates.fullName?.trim(),
      phone: updates.phone?.trim(),
    });
    setProfile((current) => ({ ...current, ...updates }));
  }, [profile.phone, updateCustomerProfile]);

  const value = useMemo<UserProfileContextValue>(() => ({ profile, updateProfile }), [profile, updateProfile]);

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within UserProfileProvider.');
  }
  return context;
}
