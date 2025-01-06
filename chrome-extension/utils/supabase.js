import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qqbulzzezbcwstrhfbco.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxYnVsenplemJjd3N0cmhmYmNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5MjA0MzcsImV4cCI6MjA1MTQ5NjQzN30.vUmslRzwtXxNEjOQXFbRnMHd-ZoghRFmBbqJn2l2g8c';

// Configure with extension-specific settings
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storage: {
      getItem: async (key) => {
        const { [key]: value } = await chrome.storage.local.get(key);
        return value;
      },
      setItem: async (key, value) => {
        await chrome.storage.local.set({ [key]: value });
      },
      removeItem: async (key) => {
        await chrome.storage.local.remove(key);
      }
    }
  }
});