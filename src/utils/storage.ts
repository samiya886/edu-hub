import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

type StorageValue = string | null;

const memoryStore = new Map<string, string>();

function hasWebStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

const useMemoryStorage = Platform.OS === 'web' && !hasWebStorage();

export const appStorage = {
  async getItem(key: string): Promise<StorageValue> {
    if (hasWebStorage()) {
      return window.localStorage.getItem(key);
    }

    if (useMemoryStorage) {
      return memoryStore.get(key) ?? null;
    }

    return AsyncStorage.getItem(key);
  },

  async setItem(key: string, value: string): Promise<void> {
    if (hasWebStorage()) {
      window.localStorage.setItem(key, value);
      return;
    }

    if (useMemoryStorage) {
      memoryStore.set(key, value);
      return;
    }

    await AsyncStorage.setItem(key, value);
  },

  async removeItem(key: string): Promise<void> {
    if (hasWebStorage()) {
      window.localStorage.removeItem(key);
      return;
    }

    if (useMemoryStorage) {
      memoryStore.delete(key);
      return;
    }

    await AsyncStorage.removeItem(key);
  },
};
