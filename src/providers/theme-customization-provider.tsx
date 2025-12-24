'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { storageService } from '@/services/storage.service';

// Color Schemes
export type ColorScheme = 'blue-white' | 'red-white' | 'black-white';

// Font Size (affects entire UI scale) - More options for better control
export type FontSize = 'tiny' | 'small' | 'medium' | 'large' | 'extra-large';

// Font Family - Professional fonts only
export type FontFamily =
  | 'inter'
  | 'sans-serif'
  | 'roboto'
  | 'poppins'
  | 'open-sans'
  | 'lato';

// Border Radius
export type BorderRadius = number; // 0-20px

interface ThemeCustomization {
  colorScheme: ColorScheme;
  fontSize: FontSize;
  fontFamily: FontFamily;
  borderRadius: BorderRadius;
}

interface ThemeCustomizationContextType extends ThemeCustomization {
  setColorScheme: (scheme: ColorScheme) => void;
  setFontSize: (size: FontSize) => void;
  setFontFamily: (family: FontFamily) => void;
  setBorderRadius: (radius: BorderRadius) => void;
  resetToDefaults: () => void;
}

const defaultCustomization: ThemeCustomization = {
  colorScheme: 'blue-white',
  fontSize: 'medium',
  fontFamily: 'sans-serif',
  borderRadius: 8,
};

const ThemeCustomizationContext = createContext<
  ThemeCustomizationContextType | undefined
>(undefined);

// Color scheme definitions (using oklch format to match CSS)
// Using user-friendly, eye-comfortable colors
const COLOR_SCHEMES = {
  'blue-white': {
    primary: 'oklch(0.55 0.22 250)', // Softer, comfortable blue
    primaryForeground: 'oklch(0.985 0 0)', // White
    accent: 'oklch(0.97 0 0)', // Light gray
    accentForeground: 'oklch(0.205 0 0)', // Dark
  },
  'red-white': {
    primary: 'oklch(0.58 0.20 25)', // Softer, comfortable red (coral-ish)
    primaryForeground: 'oklch(0.985 0 0)', // White
    accent: 'oklch(0.97 0 0)', // Light gray
    accentForeground: 'oklch(0.58 0.20 25)', // Matching red
  },
  'black-white': {
    primary: 'oklch(0.205 0 0)', // Black
    primaryForeground: 'oklch(0.985 0 0)', // White
    accent: 'oklch(0.97 0 0)', // Light gray
    accentForeground: 'oklch(0.205 0 0)', // Black
  },
};

// Font size scale multipliers - More options for flexibility
const FONT_SIZE_SCALES = {
  tiny: 0.75, // 12px base
  small: 0.875, // 14px base
  medium: 1, // 16px base
  large: 1.125, // 18px base
  'extra-large': 1.25, // 20px base
};

// Font family mappings - Using proper CSS font stacks
const FONT_FAMILIES = {
  inter: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  'sans-serif': "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  roboto: "'Roboto', -apple-system, BlinkMacSystemFont, sans-serif",
  poppins: "'Poppins', -apple-system, BlinkMacSystemFont, sans-serif",
  'open-sans': "'Open Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  lato: "'Lato', -apple-system, BlinkMacSystemFont, sans-serif",
};

export function ThemeCustomizationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [customization, setCustomization] = useState<ThemeCustomization>(() => {
    const stored = storageService.getCustomization();
    return { ...defaultCustomization, ...stored };
  });

  // Apply customizations to document root
  useEffect(() => {
    const root = document.documentElement;

    // Apply color scheme
    const colors = COLOR_SCHEMES[customization.colorScheme];
    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--primary-foreground', colors.primaryForeground);
    root.style.setProperty('--accent', colors.accent);
    root.style.setProperty('--accent-foreground', colors.accentForeground);

    // Also apply to sidebar for consistent theming
    root.style.setProperty('--sidebar-primary', colors.primary);
    root.style.setProperty(
      '--sidebar-primary-foreground',
      colors.primaryForeground
    );
    root.style.setProperty('--sidebar-accent', colors.accent);
    root.style.setProperty(
      '--sidebar-accent-foreground',
      colors.accentForeground
    );

    // Apply font size scale (affects entire UI)
    const scale = FONT_SIZE_SCALES[customization.fontSize];
    root.style.setProperty('--font-size-scale', scale.toString());
    root.style.fontSize = `${16 * scale}px`;

    // Apply font family via CSS variable
    const fontFamily = FONT_FAMILIES[customization.fontFamily];
    root.style.setProperty('--font-family', fontFamily);

    // Apply border radius
    root.style.setProperty('--radius', `${customization.borderRadius}px`);

    // Save to centralized storage
    storageService.setCustomization(customization);
  }, [customization]);

  const setColorScheme = (scheme: ColorScheme) => {
    setCustomization((prev) => ({ ...prev, colorScheme: scheme }));
  };

  const setFontSize = (size: FontSize) => {
    setCustomization((prev) => ({ ...prev, fontSize: size }));
  };

  const setFontFamily = (family: FontFamily) => {
    setCustomization((prev) => ({ ...prev, fontFamily: family }));
  };

  const setBorderRadius = (radius: BorderRadius) => {
    setCustomization((prev) => ({ ...prev, borderRadius: radius }));
  };

  const resetToDefaults = () => {
    setCustomization(defaultCustomization);
  };

  return (
    <ThemeCustomizationContext.Provider
      value={{
        ...customization,
        setColorScheme,
        setFontSize,
        setFontFamily,
        setBorderRadius,
        resetToDefaults,
      }}
    >
      {children}
    </ThemeCustomizationContext.Provider>
  );
}

export function useThemeCustomization() {
  const context = useContext(ThemeCustomizationContext);
  if (!context) {
    throw new Error(
      'useThemeCustomization must be used within ThemeCustomizationProvider'
    );
  }
  return context;
}
