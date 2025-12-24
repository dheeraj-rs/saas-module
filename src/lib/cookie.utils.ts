/**
 * Cookie Utilities
 * 
 * Secure cookie management for authentication tokens and other sensitive data.
 * Provides type-safe methods with security best practices.
 */

export interface CookieOptions {
  expires?: Date | number; // Date object or days from now
  maxAge?: number; // seconds
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

/**
 * Set a cookie with security options
 */
export function setCookie(
  name: string,
  value: string,
  options: CookieOptions = {}
): void {
  const {
    expires,
    maxAge,
    path = '/',
    domain,
    secure = import.meta.env.PROD, // Secure only in production
    sameSite = 'strict',
  } = options;

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (expires) {
    if (typeof expires === 'number') {
      // Convert days to date
      const date = new Date();
      date.setTime(date.getTime() + expires * 24 * 60 * 60 * 1000);
      cookieString += `; expires=${date.toUTCString()}`;
    } else {
      cookieString += `; expires=${expires.toUTCString()}`;
    }
  }

  if (maxAge !== undefined) {
    cookieString += `; max-age=${maxAge}`;
  }

  cookieString += `; path=${path}`;

  if (domain) {
    cookieString += `; domain=${domain}`;
  }

  if (secure) {
    cookieString += '; secure';
  }

  if (sameSite) {
    cookieString += `; samesite=${sameSite}`;
  }

  document.cookie = cookieString;
}

/**
 * Get a cookie value by name
 */
export function getCookie(name: string): string | null {
  const nameEQ = encodeURIComponent(name) + '=';
  const cookies = document.cookie.split(';');

  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }

  return null;
}

/**
 * Remove a cookie by name
 */
export function removeCookie(
  name: string,
  options: Pick<CookieOptions, 'path' | 'domain'> = {}
): void {
  setCookie(name, '', {
    ...options,
    maxAge: -1, // Expire immediately
  });
}

/**
 * Check if a cookie exists
 */
export function hasCookie(name: string): boolean {
  return getCookie(name) !== null;
}

// ============================================================================
// Authentication Token Helpers
// ============================================================================

const AUTH_COOKIE_CONFIG = {
  ACCESS_TOKEN_NAME: 'access_token',
  REFRESH_TOKEN_NAME: 'refresh_token',
  MAX_AGE: 7200, // 2 hours in seconds
  PATH: '/',
} as const;

/**
 * Set access token in cookie
 */
export function setAuthToken(token: string): void {
  setCookie(AUTH_COOKIE_CONFIG.ACCESS_TOKEN_NAME, token, {
    maxAge: AUTH_COOKIE_CONFIG.MAX_AGE,
    path: AUTH_COOKIE_CONFIG.PATH,
    secure: import.meta.env.PROD,
    sameSite: 'strict',
  });
}

/**
 * Get access token from cookie
 */
export function getAuthToken(): string | null {
  return getCookie(AUTH_COOKIE_CONFIG.ACCESS_TOKEN_NAME);
}

/**
 * Remove access token cookie
 */
export function removeAuthToken(): void {
  removeCookie(AUTH_COOKIE_CONFIG.ACCESS_TOKEN_NAME, {
    path: AUTH_COOKIE_CONFIG.PATH,
  });
}

/**
 * Set refresh token in cookie
 */
export function setRefreshToken(token: string): void {
  setCookie(AUTH_COOKIE_CONFIG.REFRESH_TOKEN_NAME, token, {
    maxAge: AUTH_COOKIE_CONFIG.MAX_AGE,
    path: AUTH_COOKIE_CONFIG.PATH,
    secure: import.meta.env.PROD,
    sameSite: 'strict',
  });
}

/**
 * Get refresh token from cookie
 */
export function getRefreshToken(): string | null {
  return getCookie(AUTH_COOKIE_CONFIG.REFRESH_TOKEN_NAME);
}

/**
 * Remove refresh token cookie
 */
export function removeRefreshToken(): void {
  removeCookie(AUTH_COOKIE_CONFIG.REFRESH_TOKEN_NAME, {
    path: AUTH_COOKIE_CONFIG.PATH,
  });
}

/**
 * Remove all authentication cookies
 */
export function clearAuthCookies(): void {
  removeAuthToken();
  removeRefreshToken();
}

/**
 * Check if user has valid auth token
 */
export function hasAuthToken(): boolean {
  return hasCookie(AUTH_COOKIE_CONFIG.ACCESS_TOKEN_NAME);
}
