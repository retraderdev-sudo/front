import { useAuthStore } from '@/store/auth';
import { useLogin, useRegister } from './use-api';
import { signOut } from 'next-auth/react';

export const useAuth = () => {
  const { user, isAuthenticated, login, logout } = useAuthStore();
  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const handleLogin = async (email: string, password: string) => {
    try {
      const result = await loginMutation.mutateAsync({ email, password });
      const { user, accessToken } = result;
      login(user, accessToken);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const handleRegister = async (email: string, password: string) => {
    try {
      const result = await registerMutation.mutateAsync({ email, password });
      const { user, accessToken } = result;
      login(user, accessToken);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  const handleLogout = async () => {
    try {
      // Use NextAuth signOut
      await signOut({ redirect: false });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local state
      logout();
    }
  };

  return {
    user,
    isAuthenticated,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    isLoading: loginMutation.isPending || registerMutation.isPending,
  };
};
