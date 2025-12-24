/**
 * Real Laravel API Service
 *
 * This service connects to your actual Laravel backend.
 * All API calls are made using fetch with proper error handling.
 */

import type { ApiResponse, AuthResponse, User } from '@/config/api.config';
import {
  API_ENDPOINTS,
  LARAVEL_API_BASE_URL,
  TOKEN_CONFIG,
} from '@/config/api.config';
import {
  getAuthToken,
  setAuthToken,
  clearAuthCookies,
} from '@/lib/cookie.utils';

/**
 * Make authenticated API request
 */
async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getAuthToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  // Add custom headers from options
  if (options.headers) {
    const optionsHeaders = options.headers as Record<string, string>;
    Object.assign(headers, optionsHeaders);
  }

  if (token) {
    headers['Authorization'] = `${TOKEN_CONFIG.TOKEN_TYPE} ${token}`;
  }

  try {
    const response = await fetch(`${LARAVEL_API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      // Laravel validation errors
      if (response.status === 422) {
        return {
          success: false,
          message: data.message || 'Validation failed.',
          errors: data.errors,
        };
      }

      // Other errors
      return {
        success: false,
        message: data.message || 'An error occurred.',
      };
    }

    return {
      success: true,
      message: data.message || 'Success',
      data: data.data || data,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Network error occurred.',
    };
  }
}

/**
 * Real Laravel Authentication API
 */
export const realAuthApi = {
  /**
   * Login with email and password
   */
  async login(
    email: string,
    password: string
  ): Promise<ApiResponse<AuthResponse>> {
    const response = await apiRequest<AuthResponse>(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data) {
      setAuthToken(response.data.token);
    }

    return response;
  },

  /**
   * Register new user
   */
  async register(
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string
  ): Promise<ApiResponse<AuthResponse>> {
    const response = await apiRequest<AuthResponse>(API_ENDPOINTS.REGISTER, {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      }),
    });

    if (response.success && response.data) {
      setAuthToken(response.data.token);
    }

    return response;
  },

  /**
   * Forgot password
   */
  async forgotPassword(email: string): Promise<ApiResponse> {
    return apiRequest(API_ENDPOINTS.FORGOT_PASSWORD, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  /**
   * Logout
   */
  async logout(): Promise<ApiResponse> {
    const response = await apiRequest(API_ENDPOINTS.LOGOUT, {
      method: 'POST',
    });

    clearAuthCookies();

    return response;
  },

  /**
   * Get current user
   */
  async me(): Promise<ApiResponse<User>> {
    return apiRequest<User>(API_ENDPOINTS.ME, {
      method: 'GET',
    });
  },

  /**
   * Check if user is authenticated
   */
  async check(): Promise<boolean> {
    const token = getAuthToken();
    if (!token) return false;

    const response = await this.me();
    return response.success;
  },

  /**
   * OAuth Login
   */
  async oauthLogin(
    provider: 'google' | 'github'
  ): Promise<ApiResponse<AuthResponse>> {
    // For OAuth, you typically redirect to Laravel's OAuth endpoint
    // This is a simplified version - adjust based on your Laravel OAuth setup
    const endpoint =
      provider === 'google'
        ? API_ENDPOINTS.GOOGLE_LOGIN
        : API_ENDPOINTS.GITHUB_LOGIN;

    // In a real implementation, you would:
    // 1. Redirect to Laravel OAuth endpoint
    // 2. Laravel redirects to provider (Google/GitHub)
    // 3. Provider redirects back to Laravel callback
    // 4. Laravel redirects back to frontend with token

    window.location.href = `${LARAVEL_API_BASE_URL}${endpoint}`;

    return {
      success: true,
      message: 'Redirecting to OAuth provider...',
    };
  },
};
