import React, { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { DEMO_USER_PROFILE } from '../constants/userDemo';
import type { DemoUserProfile } from '../constants/userDemo';

type EditableProfile = Pick<DemoUserProfile, 'fullName' | 'phone'>;

interface UserProfileContextValue {
  profile: DemoUserProfile;
  updateProfile: (updates: Partial<EditableProfile>) => void;
}

const UserProfileContext = createContext<UserProfileContextValue | undefined>(undefined);

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<DemoUserProfile>(DEMO_USER_PROFILE);

  const value = useMemo<UserProfileContextValue>(() => ({
    profile,
    updateProfile: (updates) => setProfile((current) => ({ ...current, ...updates })),
  }), [profile]);

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
