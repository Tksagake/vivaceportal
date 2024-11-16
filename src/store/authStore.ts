import { create } from 'zustand';
import { User } from '../types/auth';
import { supabase } from '../lib/supabase';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  checkSession: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        set({
          user: {
            id: session.user.id,
            email: session.user.email!,
            name: profile.full_name,
            role: profile.role,
            avatar: profile.avatar_url,
          },
          isAuthenticated: true,
        });
      }
    }
  },

  login: async ({ email, password }) => {
    const { data: { session }, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (session?.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        set({
          user: {
            id: session.user.id,
            email: session.user.email!,
            name: profile.full_name,
            role: profile.role,
            avatar: profile.avatar_url,
          },
          isAuthenticated: true,
        });
      }
    }
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, isAuthenticated: false });
  },
}));