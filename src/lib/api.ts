import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Flag to prevent refresh attempts during logout
let isLoggingOut = false;
let isRefreshing = false;

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Function to set logout flag
export const setLoggingOut = (value: boolean) => {
  isLoggingOut = value;
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't attempt refresh if we're logging out, already refreshing, or if this is a refresh request
    if (
      isLoggingOut ||
      isRefreshing ||
      originalRequest.url?.includes('/auth/refresh')
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await api.post('/auth/refresh');
        const { accessToken } = response.data;

        // Set cookie for server-side access
        document.cookie = `accessToken=${accessToken}; path=/; max-age=86400; SameSite=Lax`;
        localStorage.setItem('accessToken', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        isRefreshing = false;
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;

        // Only redirect to login if we're not already logging out
        if (!isLoggingOut) {
          // Clear tokens
          document.cookie =
            'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          localStorage.removeItem('accessToken');

          // Only redirect if we're not on a login page
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
