import { supabase } from './supabase.js';
import { setStorageData } from './storage.js';

export const handleAuthRequest = async (email, password) => {
  try {
    console.log('Attempting login with:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Supabase auth error:', error);
      throw error;
    }

    console.log('Login successful:', data);

    // Store the session token
    await setStorageData({ 
      authToken: data.session.access_token,
      userId: data.user.id,
      session: data.session
    });

    return { success: true };
  } catch (error) {
    console.error('Auth error:', error);
    return { 
      success: false, 
      error: error.message || 'Authentication failed'
    };
  }
};

export const handleLogout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    // Clear stored data
    await chrome.storage.local.clear();
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { 
      success: false, 
      error: error.message || 'Logout failed'
    };
  }
};

export const isAuthenticated = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    console.log('Current session:', session);
    return !!session;
  } catch (error) {
    console.error('Auth check error:', error);
    return false;
  }
};