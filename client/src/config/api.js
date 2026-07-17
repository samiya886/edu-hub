const trimTrailingSlash = (value) => value.replace(/\/+$/, '');

const ensureApiPath = (value) => {
  const trimmed = trimTrailingSlash(value);
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};

const configuredApiUrl = import.meta.env.VITE_API_URL
  ? ensureApiPath(import.meta.env.VITE_API_URL)
  : '';

const isLocalHost =
  typeof window !== 'undefined' &&
  ['localhost', '127.0.0.1'].includes(window.location.hostname);

export const API_URL = configuredApiUrl || (isLocalHost ? 'http://127.0.0.1:5000/api' : '/api');

export const ASSET_URL = API_URL.endsWith('/api') ? API_URL.slice(0, -4) : '';

export const apiUrl = (path = '') => `${API_URL}${path.startsWith('/') ? path : `/${path}`}`;
