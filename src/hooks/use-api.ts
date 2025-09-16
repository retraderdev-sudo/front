import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

// Query Keys
export const queryKeys = {
  user: ['user'] as const,
  auth: ['auth'] as const,
} as const;

// Types
interface User {
  id: number;
  email: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  user: User;
  accessToken: string;
}

// Custom hook for user data
export function useUser() {
  return useQuery({
    queryKey: queryKeys.user,
    queryFn: async (): Promise<User> => {
      const response = await api.get('/auth/me');
      return response.data.user;
    },
    enabled: false, // We'll enable this manually when needed
    retry: false,
  });
}

// Custom hook for login
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginRequest): Promise<AuthResponse> => {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate and refetch user data
      queryClient.setQueryData(queryKeys.user, data.user);
      queryClient.invalidateQueries({ queryKey: queryKeys.user });
    },
    onError: (error: any) => {
      console.error('Login error:', error);
    },
  });
}

// Custom hook for register
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: RegisterRequest): Promise<AuthResponse> => {
      const response = await api.post('/auth/register', userData);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate and refetch user data
      queryClient.setQueryData(queryKeys.user, data.user);
      queryClient.invalidateQueries({ queryKey: queryKeys.user });
    },
    onError: (error: any) => {
      console.error('Register error:', error);
    },
  });
}

// Custom hook for token refresh
export function useRefreshToken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<{ accessToken: string }> => {
      const response = await api.post('/auth/refresh');
      return response.data;
    },
    onSuccess: (data) => {
      // Update the stored token
      localStorage.setItem('accessToken', data.accessToken);
      document.cookie = `accessToken=${data.accessToken}; path=/; max-age=86400; SameSite=Lax`;
    },
    onError: (error: any) => {
      console.error('Token refresh error:', error);
      // Clear all data on refresh failure
      queryClient.clear();
    },
  });
}
