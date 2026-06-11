type StorageValue = string | null;

const memoryStore = new Map<string, string>();

function hasWebStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export const appStorage = {
  async getItem(key: string): Promise<StorageValue> {
    if (hasWebStorage()) {
      return window.localStorage.getItem(key);
    }

    return memoryStore.get(key) ?? null;
  },

  async setItem(key: string, value: string): Promise<void> {
    if (hasWebStorage()) {
      window.localStorage.setItem(key, value);
      return;
    }

    memoryStore.set(key, value);
  },

  async removeItem(key: string): Promise<void> {
    if (hasWebStorage()) {
      window.localStorage.removeItem(key);
      return;
    }

    memoryStore.delete(key);
  },
};
