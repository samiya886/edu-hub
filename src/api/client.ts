import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../constants';
import { appStorage } from '../utils/storage';

let unauthorizedHandler: (() => void) | null = null;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach the JWT token if stored
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const isAuthRequest = config.url?.startsWith('/auth/login') || config.url?.startsWith('/auth/register');
      if (isAuthRequest) {
        return config;
      }

      const token = await appStorage.getItem(STORAGE_KEYS.TOKEN);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('Unable to read auth token from local app storage', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle errors globally (like 401 unauth)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized request - clearing auth tokens');
      // Token might be expired. Clean storage.
      try {
        await appStorage.removeItem(STORAGE_KEYS.TOKEN);
        await appStorage.removeItem(STORAGE_KEYS.USER);
        unauthorizedHandler?.();
      } catch (storageError) {
        console.error('Error clearing storage on 401', storageError);
      }
    }
    return Promise.reject(error);
  }
);

export function setUnauthorizedHandler(handler: (() => void) | null) {
  unauthorizedHandler = handler;
}

export default apiClient;
