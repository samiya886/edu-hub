export const API_BASE_URL = 'https://edu-hub-production-f5d4.up.railway.app/api';

export const COLORS = {
  primary: '#ff9f1c',
  primaryDark: '#e68a00',
  brand: '#0a4a44',
  brandDark: '#061826',
  teal: '#22c7b8',
  secondary: '#64748b',
  background: '#f8fafc',
  surface: '#ffffff',
  surfaceMuted: '#f3f4f6',
  text: '#0a4a44',
  textDark: '#061826',
  textSecondary: '#6b7280',
  muted: '#94a3b8',
  border: '#e5e7eb',
  error: '#dc2626',
  errorBg: '#fef2f2',
  success: '#16a34a',
  successBg: '#ecfdf5',
  warning: '#d97706',
  warningBg: '#fff7ed',
  placeholder: '#9ca3af',
  white: '#ffffff',
  transparent: 'transparent',
  overlay: 'rgba(6, 24, 38, 0.62)',
};

export const SHADOWS = {
  card: {
    shadowColor: '#061826',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
  },
  lift: {
    shadowColor: '#ff9f1c',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 5,
  },
};

export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user',
};

export type UserRole = 'student' | 'teacher' | 'admin';
