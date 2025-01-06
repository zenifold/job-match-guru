import { getStorageData, setStorageData, clearStorage } from './storage.js';

export const isAuthenticated = async () => {
  const { authToken } = await getStorageData(['authToken']);
  return !!authToken;
};

export const handleAuthRequest = async () => {
  try {
    // Send message to background script to handle auth
    const response = await chrome.runtime.sendMessage({
      type: 'AUTH_REQUEST'
    });
    
    return response;
  } catch (error) {
    console.error('Auth request error:', error);
    return { success: false, error: error.message };
  }
};

export const handleLogout = async () => {
  try {
    await clearStorage();
    
    // Notify about auth status change
    chrome.runtime.sendMessage({
      type: 'AUTH_STATUS_CHANGED',
      isAuthenticated: false
    });
    
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error: error.message };
  }
};