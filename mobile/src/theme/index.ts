export const OAK_BRAND = {
  navy: '#1B2B4B',
  navyLight: '#2A3F6A',
  green: '#2D6A4F',
  greenLight: '#40916C',
  greenAccent: '#52B788',
  gold: '#C9A84C',
  white: '#FFFFFF',
  offWhite: '#F7F8FA',
  grey: '#6B7280',
  greyLight: '#E5E7EB',
  error: '#DC2626',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const RADIUS = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const FONT = {
  h1: 32,
  h2: 24,
  h3: 18,
  body: 16,
  caption: 14,
  small: 12,
} as const;

export type OakBrandColors = typeof OAK_BRAND;
