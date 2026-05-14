import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthState {
  session: Session | null;
  user: User | null;
  isInitialized: boolean;
  initializeAuth: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  isInitialized: false,

  initializeAuth: async () => {
    // 1. Grab the initial session on boot
    const { data: { session } } = await supabase.auth.getSession();
    set({ session, user: session?.user || null, isInitialized: true });

    // 2. Listen for log in/out events and token expirations
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user || null });
    });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null });
  }
}));