/**
 * Fake Authentication API Service
 *
 * This service simulates Laravel backend API responses for development and testing.
 * It includes complete validation, error handling, and matches Laravel's response structure.
 *
 * Features:
 * - Mock user database with localStorage persistence
 * - Complete validation matching Laravel rules
 * - Proper error responses with field-level errors
 * - Token generation and management
 * - Simulated network delays for realistic testing
 */

import type { ApiResponse, AuthResponse, User } from '@/config/api.config';
import { TOKEN_CONFIG } from '@/config/api.config';
import {
  getAuthToken,
  setAuthToken,
  clearAuthCookies,
} from '@/lib/cookie.utils';

// Simulated network delay (in ms)
const NETWORK_DELAY = 800;

// Mock user database (stored in localStorage)
const STORAGE_KEYS = {
  USERS: 'fake_api_users',
  CURRENT_USER: 'fake_api_current_user',
} as const;

// Default test users matching Laravel backend structure
// IMPORTANT: Each user has COMPLETELY DIFFERENT organizations for proper data isolation
const DEFAULT_USERS: User[] = [
  {
    user_id: '018f2000-a111-b222-c333-000000000001',
    organization_ids: [
      '018f012c-6b3c-7455-a9e8-9a12e7c8c101', // Medical Conference Association
      '018f012c-6b3c-7455-a9e8-9a12e7c8c103', // Tech Summit Group
    ],
    event_ids: [],
    email: 'john.williams@organizer.com',
    name: 'John Williams',
    exp: Math.floor(Date.now() / 1000) + 7200, // 2 hours from now
    iat: Math.floor(Date.now() / 1000),
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    role: 'organizer',
  },
  {
    user_id: '018f2000-a111-b222-c333-000000000002',
    organization_ids: [
      '018f012c-6b3c-7455-a9e8-9a12e7c8c102', // Healthcare Events Ltd
      '018f012c-6b3c-7455-a9e8-9a12e7c8c104', // Global Education Forum
    ],
    event_ids: [
      '018f012c-6b3c-7403-a9e8-9a12e7c8c101',
      '018f0452c-6b3c-7455-a9e8-9a12e7c8c101',
    ],
    email: 'sarah.johnson@organizer.com',
    name: 'Sarah Johnson',
    exp: Math.floor(Date.now() / 1000) + 7200, // 2 hours from now
    iat: Math.floor(Date.now() / 1000),
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    role: 'organizer',
  },
];

// Password storage (in real app, this would be hashed on backend)
const USER_PASSWORDS = new Map<string, string>([
  ['john.williams@organizer.com', 'password123'],
  ['sarah.johnson@organizer.com', 'password123'],
]);

/**
 * Validation Rules (matching Laravel validation)
 */
const ValidationRules = {
  email: {
    required: (value: string) => !!value || 'The email field is required.',
    email: (value: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return (
        emailRegex.test(value) || 'The email must be a valid email address.'
      );
    },
  },
  password: {
    required: (value: string) => !!value || 'The password field is required.',
    min: (value: string, min: number = 8) =>
      value.length >= min || `The password must be at least ${min} characters.`,
  },
  name: {
    required: (value: string) => !!value || 'The name field is required.',
    min: (value: string, min: number = 2) =>
      value.length >= min || `The name must be at least ${min} characters.`,
    max: (value: string, max: number = 255) =>
      value.length <= max ||
      `The name must not be greater than ${max} characters.`,
  },
};

/**
 * Validate field with multiple rules
 */
function validateField(
  value: string,
  rules: Array<(value: string, ...args: number[]) => string | true>
): string | null {
  for (const rule of rules) {
    const result = rule(value);
    if (result !== true) {
      return result;
    }
  }
  return null;
}

/**
 * Simulate network delay
 */
function delay(ms: number = NETWORK_DELAY): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Get users from localStorage
 */
function getUsers(): User[] {
  const stored = localStorage.getItem(STORAGE_KEYS.USERS);
  if (!stored) {
    // Initialize with default users
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
    return DEFAULT_USERS;
  }
  return JSON.parse(stored);
}

/**
 * Save users to localStorage
 */
function saveUsers(users: User[]): void {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

/**
 * Generate a fake JWT token matching Laravel backend structure
 */
function generateToken(user: User): string {
  const now = Math.floor(Date.now() / 1000);
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      user_id: user.user_id,
      organization_ids: user.organization_ids,
      event_ids: user.event_ids,
      email: user.email,
      exp: now + 7200, // 2 hours
      iat: now,
    })
  );
  const signature = btoa(`fake_signature_${user.user_id}_${Date.now()}`);
  return `${header}.${payload}.${signature}`;
}

/**
 * Generate UUID v7 (time-based)
 */
function generateUUID(): string {
  const timestamp = Date.now();
  const hex = timestamp.toString(16).padStart(12, '0');
  const random = Math.random().toString(16).substring(2, 14);
  return `018f${hex.substring(0, 4)}-${hex.substring(4, 8)}-7${hex.substring(
    8,
    11
  )}-${random.substring(0, 4)}-${random.substring(4, 16)}`;
}

/**
 * Fake Authentication API
 */
export const fakeAuthApi = {
  /**
   * Login with email and password
   */
  async login(
    email: string,
    password: string
  ): Promise<ApiResponse<AuthResponse>> {
    await delay();

    // Validation
    const errors: Record<string, string[]> = {};

    const emailError = validateField(email, [
      ValidationRules.email.required,
      ValidationRules.email.email,
    ]);
    if (emailError) errors.email = [emailError];

    const passwordError = validateField(password, [
      ValidationRules.password.required,
    ]);
    if (passwordError) errors.password = [passwordError];

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: 'The given data was invalid.',
        errors,
      };
    }

    // Check credentials
    const users = getUsers();
    const user = users.find((u) => u.email === email);

    if (!user || USER_PASSWORDS.get(email) !== password) {
      return {
        success: false,
        message: 'These credentials do not match our records.',
        errors: {
          email: ['These credentials do not match our records.'],
        },
      };
    }

    // Generate token with updated user timestamps
    const updatedUser: User = {
      ...user,
      exp: Math.floor(Date.now() / 1000) + 7200, // 2 hours from now
      iat: Math.floor(Date.now() / 1000),
    };

    const token = generateToken(updatedUser);
    setAuthToken(token);
    localStorage.setItem(
      STORAGE_KEYS.CURRENT_USER,
      JSON.stringify(updatedUser)
    );

    return {
      success: true,
      message: 'Login successful.',
      data: {
        user: updatedUser,
        token,
        token_type: TOKEN_CONFIG.TOKEN_TYPE,
        expires_in: 7200, // 2 hours in seconds
      },
    };
  },

  /**
   * Register new user
   */
  async register(
    name: string,
    email: string,
    password: string,
    passwordConfirmation?: string
  ): Promise<ApiResponse<AuthResponse>> {
    await delay();

    // Validation
    const errors: Record<string, string[]> = {};

    const nameError = validateField(name, [
      ValidationRules.name.required,
      ValidationRules.name.min,
      ValidationRules.name.max,
    ]);
    if (nameError) errors.name = [nameError];

    const emailError = validateField(email, [
      ValidationRules.email.required,
      ValidationRules.email.email,
    ]);
    if (emailError) errors.email = [emailError];

    const passwordError = validateField(password, [
      ValidationRules.password.required,
      (val) => ValidationRules.password.min(val, 8),
    ]);
    if (passwordError) errors.password = [passwordError];

    // Check if passwords match (if confirmation provided)
    if (
      passwordConfirmation !== undefined &&
      password !== passwordConfirmation
    ) {
      errors.password = errors.password || [];
      errors.password.push('The password confirmation does not match.');
    }

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: 'The given data was invalid.',
        errors,
      };
    }

    // Check if email already exists
    const users = getUsers();
    if (users.some((u) => u.email === email)) {
      return {
        success: false,
        message: 'The given data was invalid.',
        errors: {
          email: ['The email has already been taken.'],
        },
      };
    }

    // Create new user with UUID and Laravel structure
    const now = Math.floor(Date.now() / 1000);
    const newUser: User = {
      user_id: generateUUID(),
      organization_ids: [], // New users start with no organizations
      event_ids: [], // New users start with no events
      email,
      name,
      exp: now + 7200, // 2 hours from now
      iat: now,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      role: 'user',
    };

    users.push(newUser);
    saveUsers(users);
    USER_PASSWORDS.set(email, password);

    // Generate token and auto-login
    const token = generateToken(newUser);
    setAuthToken(token);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));

    return {
      success: true,
      message: 'Registration successful.',
      data: {
        user: newUser,
        token,
        token_type: TOKEN_CONFIG.TOKEN_TYPE,
        expires_in: 7200, // 2 hours in seconds
      },
    };
  },

  /**
   * Forgot password - send reset link
   */
  async forgotPassword(email: string): Promise<ApiResponse> {
    await delay();

    // Validation
    const emailError = validateField(email, [
      ValidationRules.email.required,
      ValidationRules.email.email,
    ]);

    if (emailError) {
      return {
        success: false,
        message: 'The given data was invalid.',
        errors: {
          email: [emailError],
        },
      };
    }

    // Check if user exists
    const users = getUsers();
    const user = users.find((u) => u.email === email);

    if (!user) {
      // For security, don't reveal if email exists
      // But return success anyway (Laravel behavior)
      return {
        success: true,
        message: 'We have emailed your password reset link!',
      };
    }

    // In real app, this would send an email
    console.log(`[FAKE API] Password reset link sent to: ${email}`);
    console.log(
      `[FAKE API] Reset token: fake_reset_token_${user.user_id}_${Date.now()}`
    );

    return {
      success: true,
      message: 'We have emailed your password reset link!',
    };
  },

  /**
   * Logout
   */
  async logout(): Promise<ApiResponse> {
    await delay(300); // Shorter delay for logout

    clearAuthCookies();
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);

    return {
      success: true,
      message: 'Logged out successfully.',
    };
  },

  /**
   * Get current user
   */
  async me(): Promise<ApiResponse<User>> {
    await delay(300);

    const token = getAuthToken();
    if (!token) {
      return {
        success: false,
        message: 'Unauthenticated.',
      };
    }

    const userStr = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!userStr) {
      return {
        success: false,
        message: 'User not found.',
      };
    }

    const user = JSON.parse(userStr) as User;

    return {
      success: true,
      message: 'User retrieved successfully.',
      data: user,
    };
  },

  /**
   * Check if user is authenticated
   */
  async check(): Promise<boolean> {
    const token = getAuthToken();
    return !!token;
  },

  /**
   * OAuth Login (Google, GitHub, etc.)
   */
  async oauthLogin(
    provider: 'google' | 'github'
  ): Promise<ApiResponse<AuthResponse>> {
    await delay();

    // Simulate OAuth flow
    const email = `${provider}user@organizer.com`;
    const users = getUsers();
    let user = users.find((u) => u.email === email);

    if (!user) {
      // Create new user from OAuth
      const now = Math.floor(Date.now() / 1000);
      user = {
        user_id: generateUUID(),
        organization_ids: [],
        event_ids: [],
        name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
        email,
        exp: now + 7200,
        iat: now,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${provider}`,
        role: 'user',
      };
      users.push(user);
      saveUsers(users);
    }

    // Update timestamps
    const updatedUser: User = {
      ...user,
      exp: Math.floor(Date.now() / 1000) + 7200,
      iat: Math.floor(Date.now() / 1000),
    };

    const token = generateToken(updatedUser);
    setAuthToken(token);
    localStorage.setItem(
      STORAGE_KEYS.CURRENT_USER,
      JSON.stringify(updatedUser)
    );

    return {
      success: true,
      message: `${provider} login successful.`,
      data: {
        user: updatedUser,
        token,
        token_type: TOKEN_CONFIG.TOKEN_TYPE,
        expires_in: 7200,
      },
    };
  },
};
