/**
 * Authentication Service
 *
 * This is the main authentication service that automatically switches
 * between fake API and real Laravel API based on configuration.
 *
 * To switch to real Laravel API:
 * - Set USE_FAKE_API to false in config/api.config.ts
 */

import { USE_FAKE_API } from '@/config/api.config';
import { fakeAuthApi } from './fake-auth-api';
import { realAuthApi } from './real-auth-api';

// Automatically select the appropriate API based on configuration
export const authApi = USE_FAKE_API ? fakeAuthApi : realAuthApi;

// Export types for convenience
export type { ApiResponse, AuthResponse, User } from '@/config/api.config';
