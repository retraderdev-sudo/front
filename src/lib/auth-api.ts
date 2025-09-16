import { api } from './api';

export interface SignupData {
  email: string;
  password: string;
  username: string;
}

export interface LoginData {
  email: string;
  password?: string;
  loginMethod: 'password' | 'otp';
}

export interface OtpData {
  email: string;
  code: string;
}

export interface AuthResponse {
  user: {
    id: number;
    email: string;
    role: string;
    firstName?: string;
    lastName?: string;
  };
  accessToken: string;
  refreshToken?: string;
}

export interface OtpResponse {
  message: string;
  expiresIn: number;
}

// Signup with email and password
export const signup = async (
  data: SignupData
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.post('/auth/register', data);
    return {
      success: true,
      message: 'Registration successful. Please check your email for OTP.',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Registration failed',
    };
  }
};

// Send OTP to email
export const sendOtp = async (
  email: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.post('/auth/send-otp', { email });
    return {
      success: true,
      message: 'OTP sent to your email',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to send OTP',
    };
  }
};

// Verify OTP
export const verifyOtp = async (
  data: OtpData
): Promise<AuthResponse | null> => {
  try {
    const response = await api.post('/auth/verify-otp', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'OTP verification failed');
  }
};

// Login with email and password
export const login = async (data: LoginData): Promise<AuthResponse | null> => {
  try {
    const response = await api.post('/auth/login', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

// Login with OTP
export const loginWithOtp = async (
  data: OtpData
): Promise<AuthResponse | null> => {
  try {
    const response = await api.post('/auth/login-otp', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'OTP login failed');
  }
};

// Google OAuth login
export const googleLogin = async (data: {
  email: string;
  name: string;
  googleId: string;
  image?: string;
}): Promise<AuthResponse | null> => {
  try {
    const response = await api.post('/auth/google', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Google login failed');
  }
};

// Refresh token
export const refreshToken = async (): Promise<{
  accessToken: string;
} | null> => {
  try {
    const response = await api.post('/auth/refresh');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Token refresh failed');
  }
};

// Set password for Google OAuth users
export const setPassword = async (
  email: string,
  password: string
): Promise<{ message: string }> => {
  try {
    const response = await api.post('/auth/set-password', { email, password });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to set password');
  }
};
