import { getStorageData, setStorageData, clearStorage } from './storage.js';

export const isAuthenticated = async () => {
  const { authToken } = await getStorageData(['authToken']);
  return !!authToken;
};

export const handleAuthRequest = async () => {
  try {
    const authURL = 'https://job-match-guru.lovable.app/extension-auth';
    await chrome.windows.create({
      url: authURL,
      type: 'popup',
      width: 500,
      height: 600
    });
    return { success: true };
  } catch (error) {
    console.error("Auth error:", error);
    return { success: false, error: error.message };
  }
};

export const handleAuthComplete = async (token) => {
  try {
    await setStorageData({ authToken: token });
    const profile = await fetchUserProfile(token);
    await setStorageData({ profileData: profile });
    return { success: true };
  } catch (error) {
    console.error("Error saving auth token:", error);
    return { success: false, error: error.message };
  }
};

export const handleLogout = async () => {
  try {
    await clearStorage();
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false, error: error.message };
  }
};

const fetchUserProfile = async (token) => {
  const response = await fetch('https://qqbulzzezbcwstrhfbco.supabase.co/rest/v1/profiles?select=*&is_master=eq.true', {
    headers: {
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxYnVsenplemJjd3N0cmhmYmNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5MjA0MzcsImV4cCI6MjA1MTQ5NjQzN30.vUmslRzwtXxNEjOQXFbRnMHd-ZoghRFmBbqJn2l2g8c',
      'Authorization': `Bearer ${token}`,
    }
  });

  if (!response.ok) throw new Error('Failed to fetch profile');
  const data = await response.json();
  return data[0]?.content || null;
};