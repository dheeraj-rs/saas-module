/**
 * Refine Auth Provider
 *
 * This provider integrates our authentication service with Refine's auth system.
 * It handles all authentication flows including login, register, logout, and OAuth.
 *
 * Features:
 * - Complete error handling with user-friendly messages
 * - Field-level validation errors
 * - OAuth support (Google, GitHub)
 * - Token management
 * - User identity management
 */

import type { AuthProvider } from '@refinedev/core';
import { authApi } from '@/services/auth.service';

export const authProvider: AuthProvider = {
  /**
   * Login handler
   * Supports both email/password and OAuth login
   */
  login: async ({ email, password, providerName }) => {
    try {
      // OAuth login (Google, GitHub)
      if (providerName) {
        const response = await authApi.oauthLogin(
          providerName as 'google' | 'github'
        );

        if (!response.success) {
          return {
            success: false,
            error: {
              name: 'LoginError',
              message: response.message,
            },
          };
        }

        return {
          success: true,
          redirectTo: '/',
        };
      }

      // Email/Password login
      if (!email || !password) {
        return {
          success: false,
          error: {
            name: 'LoginError',
            message: 'Email and password are required.',
          },
        };
      }

      const response = await authApi.login(email, password);

      if (!response.success) {
        // Handle validation errors
        if (response.errors) {
          const errorMessages = Object.values(response.errors).flat().join(' ');

          return {
            success: false,
            error: {
              name: 'LoginError',
              message: errorMessages || response.message,
            },
          };
        }

        return {
          success: false,
          error: {
            name: 'LoginError',
            message: response.message,
          },
        };
      }

      return {
        success: true,
        redirectTo: '/',
      };
    } catch (error) {
      return {
        success: false,
        error: {
          name: 'LoginError',
          message:
            error instanceof Error
              ? error.message
              : 'An unexpected error occurred.',
        },
      };
    }
  },

  /**
   * Register handler
   */
  register: async ({ email, password, providerName }) => {
    try {
      // OAuth registration (same as login for OAuth)
      if (providerName) {
        const response = await authApi.oauthLogin(
          providerName as 'google' | 'github'
        );

        if (!response.success) {
          return {
            success: false,
            error: {
              name: 'RegisterError',
              message: response.message,
            },
          };
        }

        return {
          success: true,
          redirectTo: '/',
        };
      }

      // Email/Password registration
      // Note: We need to get name and password confirmation from the form
      // For now, we'll extract it from the email parameter if it's an object
      let name = 'User';
      let passwordConfirmation = password;

      // If email is actually an object with all fields (from form)
      interface RegisterFormData {
        name?: string;
        email: string;
        password: string;
        passwordConfirmation?: string;
        password_confirmation?: string;
      }

      if (typeof email === 'object' && email !== null) {
        const formData = email as RegisterFormData;
        name = formData.name || 'User';
        email = formData.email;
        password = formData.password;
        passwordConfirmation =
          formData.passwordConfirmation ||
          formData.password_confirmation ||
          password;
      }

      const response = await authApi.register(
        name,
        email as string,
        password,
        passwordConfirmation
      );

      if (!response.success) {
        // Handle validation errors
        if (response.errors) {
          const errorMessages = Object.values(response.errors).flat().join(' ');

          return {
            success: false,
            error: {
              name: 'RegisterError',
              message: errorMessages || response.message,
            },
          };
        }

        return {
          success: false,
          error: {
            name: 'RegisterError',
            message: response.message,
          },
        };
      }

      return {
        success: true,
        redirectTo: '/',
      };
    } catch (error) {
      return {
        success: false,
        error: {
          name: 'RegisterError',
          message:
            error instanceof Error
              ? error.message
              : 'An unexpected error occurred.',
        },
      };
    }
  },

  /**
   * Logout handler
   */
  logout: async () => {
    try {
      await authApi.logout();

      return {
        success: true,
        redirectTo: '/login',
      };
    } catch (error) {
      return {
        success: false,
        error: {
          name: 'LogoutError',
          message: error instanceof Error ? error.message : 'Logout failed.',
        },
      };
    }
  },

  /**
   * Check authentication status
   */
  check: async () => {
    try {
      const isAuthenticated = await authApi.check();

      if (!isAuthenticated) {
        return {
          authenticated: false,
          redirectTo: '/login',
          logout: true,
        };
      }

      return {
        authenticated: true,
      };
    } catch (error) {
      return {
        authenticated: false,
        redirectTo: '/login',
        logout: true,
        error: {
          name: 'AuthCheckError',
          message:
            error instanceof Error
              ? error.message
              : 'Authentication check failed.',
        },
      };
    }
  },

  /**
   * Get user identity
   */
  getIdentity: async () => {
    try {
      const response = await authApi.me();

      if (!response.success || !response.data) {
        return null;
      }

      return response.data;
    } catch (error) {
      console.error('Failed to get user identity:', error);
      return null;
    }
  },

  /**
   * Forgot password handler
   */
  forgotPassword: async ({ email }) => {
    try {
      if (!email) {
        return {
          success: false,
          error: {
            name: 'ForgotPasswordError',
            message: 'Email is required.',
          },
        };
      }

      const response = await authApi.forgotPassword(email);

      if (!response.success) {
        // Handle validation errors
        if (response.errors) {
          const errorMessages = Object.values(response.errors).flat().join(' ');

          return {
            success: false,
            error: {
              name: 'ForgotPasswordError',
              message: errorMessages || response.message,
            },
          };
        }

        return {
          success: false,
          error: {
            name: 'ForgotPasswordError',
            message: response.message,
          },
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          name: 'ForgotPasswordError',
          message:
            error instanceof Error
              ? error.message
              : 'An unexpected error occurred.',
        },
      };
    }
  },

  /**
   * Error handler
   */
  onError: async (error) => {
    console.error('Auth error:', error);

    // Handle 401 Unauthorized errors
    if (error?.statusCode === 401) {
      return {
        logout: true,
        redirectTo: '/login',
        error,
      };
    }

    return { error };
  },
};
