import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export type Profile = {
  id: string;
  full_name: string;
  phone: string | null;
  customer_type: 'Pelajar' | 'Umum';
  role: 'user' | 'admin';
};
type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
};
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!currentUser) { setProfile(null); return; }
    const { data, error } = await supabase.from('profiles')
      .select('id, full_name, phone, customer_type, role')
      .eq('id', currentUser.id).single();
    if (error) throw error;
    setProfile(data as Profile);
  }, []);

  useEffect(() => {
    let mounted = true;
    const initialize = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (mounted) setSession(data.session);
      } catch (err) {
        console.error('Auth initialization:', err);
        if (mounted) setLoading(false);
      }
    };
    void initialize();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
      if (!nextSession) setProfile(null);
    });
    return () => { mounted = false; subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    let active = true;
    if (!session?.user?.id) {
      setProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    void (async () => {
      try {
        const { data, error } = await supabase.from('profiles')
          .select('id, full_name, phone, customer_type, role')
          .eq('id', session.user.id).single();
        if (error) throw error;
        if (active) setProfile(data as Profile);
      } catch (err) {
        console.error('Profile load:', err);
        if (active) setProfile(null);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [session?.user?.id]);

  return <AuthContext.Provider value={{ session, user: session?.user ?? null, profile, loading, refreshProfile }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth harus berada di dalam AuthProvider.');
  return context;
}
