
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import type { ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';

import { supabase } from '../lib/supabase';

export type CustomerType = 'Pelajar' | 'Umum';
export type UserRole = 'admin' | 'user';

export type Profile = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  customer_type: CustomerType;
  role: UserRole;
  created_at: string;
  updated_at: string;
};

type SignUpInput = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  customerType?: CustomerType;
};

type SignUpResult = {
  needsEmailConfirmation: boolean;
};

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;

  signIn: (
    email: string,
    password: string,
  ) => Promise<Profile>;

  signUp: (
    input: SignUpInput,
  ) => Promise<SignUpResult>;

  signOut: () => Promise<void>;

  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // ===================================================
  // FETCH PROFILE
  // ===================================================

  const fetchProfile = useCallback(
    async (userId: string): Promise<Profile> => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error(
          'Profil akun belum tersedia. Silakan hubungi administrator.',
        );
      }

      return data as Profile;
    },
    [],
  );

  // ===================================================
  // REFRESH PROFILE
  // ===================================================

  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      return;
    }

    const data = await fetchProfile(user.id);
    setProfile(data);
  }, [user, fetchProfile]);

  // ===================================================
  // INITIAL SESSION + AUTH LISTENER
  // ===================================================

  useEffect(() => {
    let mounted = true;
    let profileRequestId = 0;

    const loadProfile = async (userId: string) => {
      const requestId = ++profileRequestId;

      try {
        const data = await fetchProfile(userId);

        if (
          mounted &&
          requestId === profileRequestId
        ) {
          setProfile(data);
        }
      } catch (error) {
        console.error('Load profile error:', error);

        if (
          mounted &&
          requestId === profileRequestId
        ) {
          setProfile(null);
        }
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        if (!mounted) return;

        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          const userId = currentSession.user.id;

          setTimeout(() => {
            if (mounted) {
              void loadProfile(userId);
            }
          }, 0);
        } else {
          profileRequestId++;
          setProfile(null);
        }

        setLoading(false);
      },
    );

    supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) return;

      if (error) {
        console.error('Get session error:', error.message);
        setLoading(false);
        return;
      }

      const currentSession = data.session;

      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        void loadProfile(currentSession.user.id);
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => {
      mounted = false;
      profileRequestId++;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  // ===================================================
  // SIGN IN
  // ===================================================

  const signIn = useCallback(
    async (
      email: string,
      password: string,
    ): Promise<Profile> => {
      const { data, error } =
        await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });

      if (error) {
        throw error;
      }

      if (!data.user) {
        throw new Error('Data akun tidak ditemukan.');
      }

      const userProfile = await fetchProfile(data.user.id);

      setSession(data.session);
      setUser(data.user);
      setProfile(userProfile);

      return userProfile;
    },
    [fetchProfile],
  );

  // ===================================================
  // SIGN UP
  // ===================================================

  const signUp = useCallback(
    async (input: SignUpInput): Promise<SignUpResult> => {
      const { data, error } = await supabase.auth.signUp({
        email: input.email.trim().toLowerCase(),
        password: input.password,

        options: {
          data: {
            full_name: input.fullName.trim(),
            phone: input.phone.trim(),
            customer_type: input.customerType ?? 'Umum',
          },
        },
      });

      if (error) {
        throw error;
      }

      if (!data.user) {
        throw new Error(
          'Supabase tidak mengembalikan data akun. Silakan coba kembali.',
        );
      }

      return {
        needsEmailConfirmation: !data.session,
      };
    },
    [],
  );

  // ===================================================
  // SIGN OUT
  // ===================================================

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    setSession(null);
    setUser(null);
    setProfile(null);
  }, []);

  const value: AuthContextValue = {
    session,
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// =====================================================
// CUSTOM HOOK
// =====================================================

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth harus digunakan di dalam AuthProvider.',
    );
  }

  return context;
}