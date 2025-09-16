import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { setLoggingOut } from '@/lib/api';

interface User {
  id: number;
  email: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (user: User, accessToken: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      login: (user: User, accessToken: string) => {
        // Set cookie for server-side access
        document.cookie = `accessToken=${accessToken}; path=/; max-age=86400; SameSite=Lax`;
        localStorage.setItem('accessToken', accessToken);
        set({ user, accessToken, isAuthenticated: true });
      },
      logout: () => {
        // Set logout flag to prevent refresh attempts
        setLoggingOut(true);

        // Clear cookie
        document.cookie =
          'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        localStorage.removeItem('accessToken');
        set({ user: null, accessToken: null, isAuthenticated: false });

        // Reset logout flag after a short delay
        setTimeout(() => {
          setLoggingOut(false);
        }, 1000);
      },
      setUser: (user: User) => set({ user }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
