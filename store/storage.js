import { createMMKV } from "react-native-mmkv";

export const storage = createMMKV({
  id: `dinero-storage`,
  encryptionKey: "dinero-key-2026",
});

const secureMMKV = createMMKV({
  id: `dinero-secure-storage`,
  encryptionKey: "dinero-secure-key-2026-auth",
});

export const storageUtils = {
  setItem: (key, value) => {
    try {
      storage.set(key, value);
    } catch (error) {
      console.error("Error saving to storage:", error);
    }
  },

  getItem: (key) => {
    try {
      return storage.getString(key);
    } catch (error) {
      console.error("Error reading from storage:", error);
      return null;
    }
  },

  removeItem: (key) => {
    try {
      storage.delete(key);
    } catch (error) {
      console.error("Error removing from storage:", error);
    }
  },

  clear: () => {
    try {
      storage.clearAll();
    } catch (error) {
      console.error("Error clearing storage:", error);
    }
  },
};

export const secureStorage = {
  setItem: async (key, value) => {
    try {
      secureMMKV.set(key, value);
    } catch (error) {
      console.error("Error saving to secure storage:", error);
    }
  },

  getItem: async (key) => {
    try {
      return secureMMKV.getString(key);
    } catch (error) {
      console.error("Error reading from secure storage:", error);
      return null;
    }
  },

  removeItem: async (key) => {
    try {
      secureMMKV.delete(key);
    } catch (error) {
      console.error("Error removing from secure storage:", error);
    }
  },

  clear: async () => {
    try {
      secureMMKV.clearAll();
    } catch (error) {
      console.error("Error clearing secure storage:", error);
    }
  },
};
