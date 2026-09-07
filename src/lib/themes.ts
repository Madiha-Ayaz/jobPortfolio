// src/lib/themes.ts
// Central definition of the portfolio's theme system.

export type AppTheme = 'dark' | 'light' | 'green' | 'blue' | 'purple' | 'neutral';

export interface ThemeOption {
  id: AppTheme;
  label: string;
  description: string;
  /** Swatch colours shown in the theme selector. */
  swatches: string[];
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'dark',
    label: 'Dark',
    description: 'Deep navy canvas — the default signature look.',
    swatches: ['#818cf8', '#38bdf8', '#0f172a'],
  },
  {
    id: 'light',
    label: 'Light',
    description: 'Clean, bright workspace-inspired surface.',
    swatches: ['#4f46e5', '#0284c7', '#ffffff'],
  },
  {
    id: 'green',
    label: 'Green / Emerald',
    description: 'Fresh emerald accents on a deep forest canvas.',
    swatches: ['#10b981', '#2dd4bf', '#0a2419'],
  },
  {
    id: 'blue',
    label: 'Professional Blue',
    description: 'Trustworthy steel-blue accents on deep navy.',
    swatches: ['#3b82f6', '#38bdf8', '#081f36'],
  },
  {
    id: 'purple',
    label: 'Professional Purple',
    description: 'Rich violet accents on a deep plum canvas.',
    swatches: ['#8b5cf6', '#a855f7', '#1c1030'],
  },
  {
    id: 'neutral',
    label: 'Neutral / Gray',
    description: 'Restrained graphite tones for a minimal feel.',
    swatches: ['#94a3b8', '#cbd5e1', '#161a21'],
  },
];

export const DEFAULT_THEME: AppTheme = 'dark';

export const isAppTheme = (value: unknown): value is AppTheme => {
  return THEME_OPTIONS.some((t) => t.id === value);
};

export function getThemeLabel(theme: AppTheme): string {
  return THEME_OPTIONS.find((t) => t.id === theme)?.label ?? theme;
}