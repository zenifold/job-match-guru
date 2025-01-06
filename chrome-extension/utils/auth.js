import { getStorageData, setStorageData, clearStorage } from './storage.js';

export const isAuthenticated = async () => {
  const { authToken } = await getStorageData(['authToken']);
  return !!authToken;
};

export const handleAuthRequest = async (email, password) => {
  try {
    const response = await fetch('https://qqbulzzezbcwstrhfbco.supabase.co/auth/v1/token?grant_type=password', {
      method: 'POST',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxYnVsenplemJjd3N0cmhmYmNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5MjA0MzcsImV4cCI6MjA1MTQ5NjQzN30.vUmslRzwtXxNEjOQXFbRnMHd-ZoghRFmBbqJn2l2g8c',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error('Authentication failed');
    }

    const data = await response.json();
    await setStorageData({ authToken: data.access_token });
    
    return { success: true };
  } catch (error) {
    console.error('Auth error:', error);
    return { success: false, error: error.message };
  }
};

export const handleLogout = async () => {
  try {
    await clearStorage();
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error: error.message };
  }
};