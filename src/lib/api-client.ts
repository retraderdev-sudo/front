import axios from 'axios';
import { getSession } from 'next-auth/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Create a client-side API instance that works with NextAuth
export const createApiClient = () => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
  });

  // Request interceptor to add auth token from NextAuth session
  client.interceptors.request.use(
    async (config) => {
      const session = await getSession();
      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return client;
};

// Default API client for use in components
export const apiClient = createApiClient();
