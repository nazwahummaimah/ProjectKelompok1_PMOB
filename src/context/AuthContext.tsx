
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import type { ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';

import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

import { supabase } from '../lib/supabase';

// Menyelesaikan sesi browser OAuth jika berjalan di web.
WebBrowser.maybeCompleteAuthSession();

// =====================================================
// TYPES
// =====================================================

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

  signInWithGoogle: () => Promise<Profile>;

  signUp: (
    input: SignUpInput,
  ) => Promise<SignUpResult>;

  signOut: () => Promise<void>;

  refreshProfile: () => Promise<void>;
};

// =====================================================
// CONTEXT
// =====================================================

const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

// =====================================================
// PROVIDER
// =====================================================

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

          // Hindari menjalankan query Supabase langsung
          // di dalam callback onAuthStateChange.
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
  // SIGN IN WITH EMAIL + PASSWORD
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

      if (!data.user || !data.session) {
        throw new Error('Data akun atau sesi tidak ditemukan.');
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
  // SIGN IN WITH GOOGLE (PKCE)
  // ===================================================

  const signInWithGoogle = useCallback(
    async (): Promise<Profile> => {
      // Deep link callback aplikasi.
      // Harus terdaftar di Supabase Redirect URLs.
      const redirectTo = AuthSession.makeRedirectUri({
        scheme: 'kelompok1',
        path: 'auth/callback',
      });

      // Meminta Supabase membuat URL OAuth Google.
      const { data, error } =
        await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo,
            skipBrowserRedirect: true,
            queryParams: {
              prompt: 'select_account',
            },
          },
        });

      if (error) {
        throw error;
      }

      if (!data.url) {
        throw new Error(
          'Supabase tidak menghasilkan URL autentikasi Google.',
        );
      }

      // Pastikan URL authorization menggunakan PKCE.
      const authorizationUrl = new URL(data.url);

      const hasCodeChallenge =
        authorizationUrl.searchParams.has('code_challenge');

      const challengeMethod =
        authorizationUrl.searchParams.get('code_challenge_method');

      console.log(
        '[Google OAuth] PKCE challenge exists:',
        hasCodeChallenge,
      );

      console.log(
        '[Google OAuth] PKCE challenge method:',
        challengeMethod,
      );

      if (!hasCodeChallenge || challengeMethod !== 's256') {
        throw new Error(
          'Konfigurasi PKCE belum aktif. Periksa flowType di src/lib/supabase.ts.',
        );
      }

      // Buka browser untuk proses Google OAuth.
      const browserResult =
        await WebBrowser.openAuthSessionAsync(
          data.url,
          redirectTo,
        );

      console.log(
        '[Google OAuth] Browser result:',
        browserResult.type,
      );

      if (browserResult.type !== 'success') {
        if (
          browserResult.type === 'cancel' ||
          browserResult.type === 'dismiss'
        ) {
          throw new Error('LOGIN_GOOGLE_CANCELLED');
        }

        throw new Error(
          'Proses autentikasi Google tidak berhasil diselesaikan.',
        );
      }

      // Parse URL callback.
      const callbackUrl = new URL(browserResult.url);

      const queryParams = callbackUrl.searchParams;

      const hashParams = new URLSearchParams(
        callbackUrl.hash.replace(/^#/, ''),
      );

      // Cetak diagnostik tanpa menampilkan token atau code.
      console.log(
        '[Google OAuth] Callback protocol:',
        callbackUrl.protocol,
      );

      console.log(
        '[Google OAuth] Callback host:',
        callbackUrl.host,
      );

      console.log(
        '[Google OAuth] Callback path:',
        callbackUrl.pathname,
      );

      console.log(
        '[Google OAuth] Query parameter names:',
        Array.from(queryParams.keys()),
      );

      console.log(
        '[Google OAuth] Hash parameter names:',
        Array.from(hashParams.keys()),
      );

      // Periksa error dari Supabase.
      const oauthError =
        queryParams.get('error') ??
        hashParams.get('error');

      const oauthErrorDescription =
        queryParams.get('error_description') ??
        hashParams.get('error_description');

      if (oauthError) {
        throw new Error(
          oauthErrorDescription || oauthError,
        );
      }

      // PKCE harus mengembalikan authorization code
      // melalui query parameter, bukan token di URL hash.
      const code = queryParams.get('code');

      if (!code) {
        if (hashParams.has('access_token')) {
          throw new Error(
            'Supabase mengembalikan access token melalui URL hash. Pastikan flowType: pkce sudah diterapkan pada Supabase client dan aplikasi menggunakan konfigurasi terbaru.',
          );
        }

        throw new Error(
          'Authorization code tidak ditemukan pada callback Google.',
        );
      }

      // Tukarkan authorization code dengan session.
      // Supabase mengambil PKCE code verifier yang tersimpan
      // ketika proses signInWithOAuth dimulai.
      const {
        data: sessionData,
        error: exchangeError,
      } = await supabase.auth.exchangeCodeForSession(code);

      if (exchangeError) {
        throw exchangeError;
      }

      if (!sessionData.user || !sessionData.session) {
        throw new Error(
          'Sesi pengguna tidak berhasil dibuat oleh Supabase.',
        );
      }

      // Ambil profil dari tabel public.profiles.
      const userProfile = await fetchProfile(
        sessionData.user.id,
      );

      setSession(sessionData.session);
      setUser(sessionData.user);
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

  // ===================================================
  // CONTEXT VALUE
  // ===================================================

  const value: AuthContextValue = {
    session,
    user,
    profile,
    loading,
    signIn,
    signInWithGoogle,
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
