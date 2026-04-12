import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    initialized: false,
  });

  useEffect(() => {
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setState({
        user: session?.user ?? null,
        session,
        loading: false,
        initialized: true,
      });
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setState((prev) => ({
          ...prev,
          user: session?.user ?? null,
          session,
          loading: false,
        }));
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const refreshSession = useCallback(async () => {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) {
      console.error('Session refresh failed:', error);
      return null;
    }
    return data.session;
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out failed:', error);
      throw error;
    }
  }, []);

  return {
    ...state,
    refreshSession,
    signOut,
    isAuthenticated: state.user !== null,
  };
}

export function useSessionTimeout(timeoutMinutes = 30) {
  const [isExpired, setIsExpired] = useState(false);
  const { user, session } = useAuth();

  useEffect(() => {
    if (!session) return;

    const expiresAt = new Date(session.expires_at ?? 0).getTime();
    const now = Date.now();
    const timeout = timeoutMinutes * 60 * 1000;

    if (expiresAt - now < timeout) {
      setIsExpired(true);
    }

    const checkInterval = setInterval(() => {
      const currentExp = new Date(session.expires_at ?? 0).getTime();
      if (currentExp - Date.now() < 0) {
        setIsExpired(true);
      }
    }, 1000 * 60);

    return () => clearInterval(checkInterval);
  }, [session, timeoutMinutes]);

  return { isExpired, user };
}

export function usePersistSession() {
  const { user, session } = useAuth();

  useEffect(() => {
    if (user && session) {
      localStorage.setItem('lastSession', Date.now().toString());
    }
  }, [user, session]);

  useEffect(() => {
    const lastSession = localStorage.getItem('lastSession');
    if (lastSession) {
      const timeSinceLastSession = Date.now() - parseInt(lastSession);
      const oneDay = 24 * 60 * 60 * 1000;
      
      if (timeSinceLastSession > oneDay) {
        localStorage.removeItem('lastSession');
      }
    }
  }, []);

  return null;
}

export default useAuth;