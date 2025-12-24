/**
 * Centralized Storage Service
 * 
 * Manages all application configuration in a single JSON object in localStorage.
 * Provides type-safe methods for getting and setting configuration values.
 * Includes automatic migration from old localStorage keys.
 */

import type {
  ColorScheme,
  FontSize,
  FontFamily,
  BorderRadius,
} from '@/providers/theme-customization-provider';

// ============================================================================
// Types
// ============================================================================

export type Theme = 'dark' | 'light' | 'system';

export interface ThemeCustomization {
  colorScheme: ColorScheme;
  fontSize: FontSize;
  fontFamily: FontFamily;
  borderRadius: BorderRadius;
}

export interface AppConfig {
  version: number; // For future migrations
  theme: Theme;
  customization: ThemeCustomization;
  // Add more configuration as needed
  preferences?: {
    [key: string]: unknown;
  };
}

// ============================================================================
// Default Configuration
// ============================================================================

const DEFAULT_CONFIG: AppConfig = {
  version: 1,
  theme: 'system',
  customization: {
    colorScheme: 'blue-white',
    fontSize: 'medium',
    fontFamily: 'sans-serif',
    borderRadius: 8,
  },
};

// ============================================================================
// Storage Keys
// ============================================================================

const STORAGE_KEY = 'app-config';

// Old keys for migration
const OLD_KEYS = {
  THEME: 'refine-ui-theme',
  CUSTOMIZATION: 'theme-customization',
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  FAKE_USERS: 'fake_api_users',
  FAKE_CURRENT_USER: 'fake_api_current_user',
} as const;

// ============================================================================
// Storage Service
// ============================================================================

class StorageService {
  private config: AppConfig;
  private migrated = false;

  constructor() {
    this.config = this.loadConfig();
  }

  /**
   * Load configuration from localStorage
   */
  private loadConfig(): AppConfig {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AppConfig;
        // Merge with defaults to handle missing fields
        return { ...DEFAULT_CONFIG, ...parsed };
      }
    } catch (error) {
      console.error('[StorageService] Failed to load config:', error);
    }

    // If no config exists, try to migrate from old keys
    return this.migrateFromOldStorage();
  }

  /**
   * Save configuration to localStorage
   */
  private saveConfig(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.config));
    } catch (error) {
      console.error('[StorageService] Failed to save config:', error);
    }
  }

  /**
   * Migrate from old localStorage keys
   */
  private migrateFromOldStorage(): AppConfig {
    if (this.migrated) {
      return DEFAULT_CONFIG;
    }

    const config: AppConfig = { ...DEFAULT_CONFIG };
    let hasMigrated = false;

    // Migrate theme
    const oldTheme = localStorage.getItem(OLD_KEYS.THEME);
    if (oldTheme && (oldTheme === 'dark' || oldTheme === 'light' || oldTheme === 'system')) {
      config.theme = oldTheme as Theme;
      hasMigrated = true;
      console.log('[StorageService] Migrated theme:', oldTheme);
    }

    // Migrate customization
    const oldCustomization = localStorage.getItem(OLD_KEYS.CUSTOMIZATION);
    if (oldCustomization) {
      try {
        const parsed = JSON.parse(oldCustomization);
        config.customization = { ...DEFAULT_CONFIG.customization, ...parsed };
        hasMigrated = true;
        console.log('[StorageService] Migrated customization');
      } catch (error) {
        console.error('[StorageService] Failed to migrate customization:', error);
      }
    }

    // Clean up old keys (except fake API keys for development)
    if (hasMigrated) {
      localStorage.removeItem(OLD_KEYS.THEME);
      localStorage.removeItem(OLD_KEYS.CUSTOMIZATION);
      // Note: Tokens are migrated to cookies by auth services
      console.log('[StorageService] Migration complete, old keys removed');
    }

    this.migrated = true;
    return config;
  }

  // ==========================================================================
  // Theme Methods
  // ==========================================================================

  getTheme(): Theme {
    return this.config.theme;
  }

  setTheme(theme: Theme): void {
    this.config.theme = theme;
    this.saveConfig();
  }

  // ==========================================================================
  // Customization Methods
  // ==========================================================================

  getCustomization(): ThemeCustomization {
    return this.config.customization;
  }

  setCustomization(customization: Partial<ThemeCustomization>): void {
    this.config.customization = {
      ...this.config.customization,
      ...customization,
    };
    this.saveConfig();
  }

  setColorScheme(colorScheme: ColorScheme): void {
    this.config.customization.colorScheme = colorScheme;
    this.saveConfig();
  }

  setFontSize(fontSize: FontSize): void {
    this.config.customization.fontSize = fontSize;
    this.saveConfig();
  }

  setFontFamily(fontFamily: FontFamily): void {
    this.config.customization.fontFamily = fontFamily;
    this.saveConfig();
  }

  setBorderRadius(borderRadius: BorderRadius): void {
    this.config.customization.borderRadius = borderRadius;
    this.saveConfig();
  }

  resetCustomization(): void {
    this.config.customization = DEFAULT_CONFIG.customization;
    this.saveConfig();
  }

  // ==========================================================================
  // Preferences Methods
  // ==========================================================================

  getPreference<T = unknown>(key: string, defaultValue?: T): T | undefined {
    return (this.config.preferences?.[key] as T) ?? defaultValue;
  }

  setPreference<T = unknown>(key: string, value: T): void {
    if (!this.config.preferences) {
      this.config.preferences = {};
    }
    this.config.preferences[key] = value;
    this.saveConfig();
  }

  removePreference(key: string): void {
    if (this.config.preferences) {
      delete this.config.preferences[key];
      this.saveConfig();
    }
  }

  // ==========================================================================
  // Utility Methods
  // ==========================================================================

  /**
   * Get entire configuration
   */
  getConfig(): AppConfig {
    return { ...this.config };
  }

  /**
   * Reset all configuration to defaults
   */
  resetAll(): void {
    this.config = { ...DEFAULT_CONFIG };
    this.saveConfig();
  }

  /**
   * Clear all storage (including app-config)
   */
  clearAll(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.config = { ...DEFAULT_CONFIG };
  }
}

// ============================================================================
// Export Singleton Instance
// ============================================================================

export const storageService = new StorageService();
