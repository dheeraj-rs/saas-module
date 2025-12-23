/**
 * API Configuration
 *
 * This file centralizes all API configuration.
 * To switch from fake APIs to real Laravel backend:
 * 1. Set USE_FAKE_API to false
 * 2. Update LARAVEL_API_BASE_URL to your Laravel server URL
 */

// Toggle between fake API and real Laravel API
export const USE_FAKE_API = true;

// Laravel Backend Configuration
export const LARAVEL_API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_EMAIL: '/auth/verify-email',

  // User
  ME: '/auth/me',
  UPDATE_PROFILE: '/auth/profile',
  CHANGE_PASSWORD: '/auth/change-password',

  // OAuth
  GOOGLE_LOGIN: '/auth/google',
  GITHUB_LOGIN: '/auth/github',
} as const;

// Token Configuration
export const TOKEN_CONFIG = {
  ACCESS_TOKEN_KEY: 'access_token',
  REFRESH_TOKEN_KEY: 'refresh_token',
  TOKEN_TYPE: 'Bearer',
} as const;

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
  statusCode?: number;
}

export interface AuthResponse {
  user: User;
  token: string;
  token_type: string;
  expires_in?: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  avatar?: string;
  role?: string;
  created_at: string;
  updated_at: string;
}
