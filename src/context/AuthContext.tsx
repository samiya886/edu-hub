import React, { createContext, useState, useEffect, useContext } from 'react';
import { setUnauthorizedHandler } from '../api/client';
import { STORAGE_KEYS, UserRole } from '../constants';
import { authService, User } from '../services/api';
import { appStorage } from '../utils/storage';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updatedUser: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const TOKEN_EXPIRY_SKEW_SECONDS = 30;

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(normalized.length + (4 - normalized.length % 4) % 4, '=');

  if (typeof atob === 'function') {
    return atob(padded);
  }

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let output = '';
  let index = 0;

  while (index < padded.length) {
    const encoded1 = chars.indexOf(padded.charAt(index++));
    const encoded2 = chars.indexOf(padded.charAt(index++));
    const encoded3 = chars.indexOf(padded.charAt(index++));
    const encoded4 = chars.indexOf(padded.charAt(index++));
    const bitmap = (encoded1 << 18) | (encoded2 << 12) | (encoded3 << 6) | encoded4;

    output += String.fromCharCode((bitmap >> 16) & 255);
    if (encoded3 !== 64) output += String.fromCharCode((bitmap >> 8) & 255);
    if (encoded4 !== 64) output += String.fromCharCode(bitmap & 255);
  }

  return output;
}

function isJwtExpired(token: string) {
  const [, payload] = token.split('.');

  if (!payload) {
    console.warn('[Auth] Stored token is not a valid JWT');
    return true;
  }

  try {
    const decodedPayload = JSON.parse(decodeBase64Url(payload)) as { exp?: number };

    if (!decodedPayload.exp) {
      console.warn('[Auth] Stored JWT is missing exp claim');
      return true;
    }

    const nowInSeconds = Math.floor(Date.now() / 1000);
    return decodedPayload.exp <= nowInSeconds + TOKEN_EXPIRY_SKEW_SECONDS;
  } catch (error) {
    console.warn('[Auth] Failed to decode stored JWT', error);
    return true;
  }
}

function parseStoredUser(storedUser: string) {
  try {
    return JSON.parse(storedUser) as User;
  } catch (error) {
    console.warn('[Auth] Stored user profile is invalid JSON', error);
    return null;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const clearSession = async () => {
    await appStorage.removeItem(STORAGE_KEYS.TOKEN);
    await appStorage.removeItem(STORAGE_KEYS.USER);
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const restoreSession = async () => {
      console.log('[Auth] Checking stored session');

      try {
        const storedToken = await appStorage.getItem(STORAGE_KEYS.TOKEN);
        const storedUser = await appStorage.getItem(STORAGE_KEYS.USER);

        if (!storedToken || !storedUser) {
          console.log('[Auth] No stored session found');
          return;
        }

        if (isJwtExpired(storedToken)) {
          console.warn('[Auth] Stored token is expired or malformed');
          await clearSession();
          return;
        }

        const cachedUser = parseStoredUser(storedUser);
        if (!cachedUser) {
          await clearSession();
          return;
        }

        try {
          const profile = await authService.getProfile();
          await appStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(profile));
          setToken(storedToken);
          setUser(profile);
          console.log('[Auth] Stored session restored');
        } catch (error) {
          console.warn('[Auth] Stored token is invalid or expired', error);
          await clearSession();
        }
      } catch (error) {
        console.error('[Auth] Failed to restore session from storage', error);
        await clearSession();
      } finally {
        setLoading(false);
      }
    };

    setUnauthorizedHandler(() => {
      console.warn('[Auth] Backend rejected token. Clearing local session.');
      setToken(null);
      setUser(null);
    });

    restoreSession();

    return () => setUnauthorizedHandler(null);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log('[Auth] Attempting login');
      const response = await authService.login(email, password);
      await appStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
      await appStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
      setToken(response.token);
      setUser(response.user);
      console.log('[Auth] Login successful');
    } catch (error) {
      console.error('[Auth] Login failed', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    setLoading(true);
    try {
      console.log('[Auth] Attempting registration');
      const response = await authService.register({ name, email, password, role });
      await appStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
      await appStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
      setToken(response.token);
      setUser(response.user);
      console.log('[Auth] Registration successful');
    } catch (error) {
      console.error('[Auth] Registration failed', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      console.log('[Auth] Logging out');
      await clearSession();
      console.log('[Auth] Logout complete');
    } catch (error) {
      console.error('Failed to logout cleanly', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (updatedUserFields: Partial<User>) => {
    if (!user) return;
    const newUser = { ...user, ...updatedUserFields };
    setUser(newUser);
    try {
      await appStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
    } catch (error) {
      console.error('[Auth] Failed to persist updated user profile', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
