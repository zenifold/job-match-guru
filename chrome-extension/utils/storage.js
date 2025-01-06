// Helper functions for chrome storage operations
export const getStorageData = async (keys) => {
  return await chrome.storage.local.get(keys);
};

export const setStorageData = async (data) => {
  return await chrome.storage.local.set(data);
};

export const clearStorage = async () => {
  return await chrome.storage.local.clear();
};