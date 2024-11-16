import { create } from 'zustand';
import { User, Role } from '../types/auth';
import { supabase } from '../lib/supabase';

interface AdminState {
  users: User[];
  loading: boolean;
  fetchUsers: () => Promise<void>;
  createUser: (userData: { email: string; name: string; role: Role }) => Promise<void>;
  updateUserRole: (userId: string, role: Role) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  users: [],
  loading: false,

  fetchUsers: async () => {
    set({ loading: true });
    try {
      const { data: users, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ users: users || [] });
    } finally {
      set({ loading: false });
    }
  },

  createUser: async ({ email, name, role }) => {
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: 'temporary-password', // User will be prompted to change this
      email_confirm: true,
    });

    if (authError) throw authError;

    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: authUser.user.id,
          full_name: name,
          role,
        },
      ]);

    if (profileError) throw profileError;

    const users = get().users;
    set({
      users: [
        ...users,
        {
          id: authUser.user.id,
          email,
          name,
          role,
        },
      ],
    });
  },

  updateUserRole: async (userId, role) => {
    const { error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId);

    if (error) throw error;

    const users = get().users.map(user =>
      user.id === userId ? { ...user, role } : user
    );
    set({ users });
  },

  deleteUser: async (userId) => {
    const { error } = await supabase.auth.admin.deleteUser(userId);

    if (error) throw error;

    const users = get().users.filter(user => user.id !== userId);
    set({ users });
  },
}));