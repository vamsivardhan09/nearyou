import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

// ─── Types ──────────────────────────────────────────────────────────────────
export interface UserProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  displayName: string;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

// ─── Context ────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  session: null,
  loading: true,
  displayName: '',
  signOut: async () => {},
  refreshProfile: async () => {},
});

// ─── Provider ───────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch the profile row from Supabase for the given user ID
  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = no rows found (first login before trigger runs)
        console.warn('Profile fetch error:', error.message);
      }
      setProfile(data ?? null);
    } catch (e) {
      console.warn('fetchProfile threw:', e);
    }
  }, []);

  // Bootstrap: check existing session on mount
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { data: { session: existingSession } } = await supabase.auth.getSession();
      if (!mounted) return;

      setSession(existingSession);
      setUser(existingSession?.user ?? null);

      if (existingSession?.user) {
        await fetchProfile(existingSession.user.id);
      }
      setLoading(false);
    };

    init();

    // Listen for auth state changes (login / logout / token refresh / magic link)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        if (!mounted) return;
        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          await fetchProfile(newSession.user.id);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  const refreshProfile = useCallback(async () => {
    if (user) await fetchProfile(user.id);
  }, [user, fetchProfile]);

  // Derive a friendly first name from profile or email
  const displayName =
    profile?.full_name?.trim().split(' ')[0] ||
    user?.email?.split('@')[0] ||
    '';

  return (
    <AuthContext.Provider value={{ user, profile, session, loading, displayName, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
