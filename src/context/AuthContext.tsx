import React, { createContext, useState, useEffect, useContext } from 'react';
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Load persisted session on boot
  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedToken = await appStorage.getItem(STORAGE_KEYS.TOKEN);
        const storedUser = await appStorage.getItem(STORAGE_KEYS.USER);

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to load auth session from storage', error);
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      await appStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
      await appStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
      setToken(response.token);
      setUser(response.user);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    setLoading(true);
    try {
      const response = await authService.register({ name, email, password, role });
      await appStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
      await appStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
      setToken(response.token);
      setUser(response.user);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await appStorage.removeItem(STORAGE_KEYS.TOKEN);
      await appStorage.removeItem(STORAGE_KEYS.USER);
      setToken(null);
      setUser(null);
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
    await appStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
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
