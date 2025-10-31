// Base design tokens used across the application.
// Keep values in sync with CSS custom properties defined in index.css.

export const colors = {
  background: '#f7f8fb',
  surface: '#ffffff',
  surfaceMuted: '#f0f2f8',
  primary: '#2563eb',
  primaryDark: '#1d4ed8',
  accent: '#6366f1',
  success: '#16a34a',
  warning: '#f59e0b',
  danger: '#dc2626',
  text: '#111827',
  textMuted: '#4b5563',
  border: '#e2e8f0',
};

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '0.85rem',
  lg: '1.25rem',
  xl: '1.75rem',
  xxl: '2.5rem',
};

export const typography = {
  fontFamily: {
    base: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
    heading: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
    mono: "'JetBrains Mono', 'SFMono-Regular', monospace",
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.35rem',
    '2xl': '1.625rem',
    '3xl': '2rem',
  },
  lineHeight: {
    tight: '1.2',
    snug: '1.35',
    normal: '1.5',
    relaxed: '1.7',
  },
};

export const radii = {
  sm: '8px',
  md: '14px',
  lg: '20px',
  pill: '999px',
};

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
};

export const elevations = {
  xs: '0 2px 4px rgba(15, 23, 42, 0.06)',
  sm: '0 8px 20px rgba(15, 23, 42, 0.08)',
  md: '0 16px 32px rgba(15, 23, 42, 0.12)',
};

export default {
  colors,
  spacing,
  typography,
  radii,
  elevations,
  breakpoints,
};


