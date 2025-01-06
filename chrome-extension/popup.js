import { getStorageData, setStorageData } from './utils/storage.js';
import { isAuthenticated, handleAuthRequest, handleLogout } from './utils/auth.js';
import { showMessage } from './utils/ui.js';
import { handleFormFill } from './utils/form.js';
import { History } from './components/History.js';

let currentProfile = null;
let historyComponent = null;

// Initialize the popup
document.addEventListener('DOMContentLoaded', async () => {
  const loginButton = document.getElementById('loginButton');
  const fillButton = document.getElementById('fillButton');
  const logoutButton = document.getElementById('logoutButton');
  const settingsButton = document.getElementById('settingsButton');
  const profileSelect = document.getElementById('profileSelect');
  const historyContainer = document.getElementById('history');
  
  historyComponent = new History(historyContainer);
  
  // Check if user is already logged in
  const isLoggedIn = await isAuthenticated();
  if (isLoggedIn) {
    await updateUIForLoggedInState();
  } else {
    updateUIForLoggedOutState();
  }

  // Event Listeners
  loginButton?.addEventListener('click', handleLogin);
  fillButton?.addEventListener('click', () => handleFormFill(currentProfile, historyComponent.addEntry.bind(historyComponent)));
  logoutButton?.addEventListener('click', handleLogout);
  settingsButton?.addEventListener('click', () => chrome.runtime.openOptionsPage());
  profileSelect?.addEventListener('change', handleProfileChange);

  // Listen for auth status changes
  chrome.runtime.onMessage.addListener((message) => {
    console.log('Received message in popup:', message);
    if (message.type === 'AUTH_STATUS_CHANGED') {
      if (message.isAuthenticated) {
        updateUIForLoggedInState();
      } else {
        updateUIForLoggedOutState();
      }
    } else if (message.type === 'AUTH_COMPLETE') {
      if (message.success) {
        updateUIForLoggedInState();
        showMessage(document.getElementById('message'), 'Login successful!', 'success');
      } else {
        showMessage(document.getElementById('message'), message.error || 'Login failed', 'error');
      }
    }
  });
});

async function updateUIForLoggedInState() {
  document.getElementById('loginContainer').style.display = 'none';
  document.getElementById('mainContainer').style.display = 'block';
  document.getElementById('loginStatus').textContent = 'Logged in';
  
  const fillButton = document.getElementById('fillButton');
  if (fillButton) {
    fillButton.disabled = !currentProfile;
  }
  
  try {
    await loadProfiles();
    const { history } = await getStorageData(['history']);
    if (historyComponent) {
      historyComponent.loadHistory(history);
    }
  } catch (error) {
    console.error('Error updating UI for logged in state:', error);
    showMessage(document.getElementById('message'), 'Failed to load profiles or history', 'error');
  }
}

function updateUIForLoggedOutState() {
  document.getElementById('loginContainer').style.display = 'block';
  document.getElementById('mainContainer').style.display = 'none';
  document.getElementById('loginStatus').textContent = 'Not logged in';
}

async function handleLogin() {
  try {
    showMessage(document.getElementById('message'), 'Initiating login...', 'info');
    const response = await handleAuthRequest();
    
    if (response?.success) {
      showMessage(document.getElementById('message'), 'Login successful!', 'success');
    } else {
      showMessage(document.getElementById('message'), response?.error || 'Login failed. Please try again.', 'error');
    }
  } catch (error) {
    console.error('Login error:', error);
    showMessage(document.getElementById('message'), 'An error occurred during login.', 'error');
  }
}

async function handleProfileChange(event) {
  const profileId = event.target.value;
  if (!profileId) {
    currentProfile = null;
    document.getElementById('fillButton').disabled = true;
    return;
  }

  try {
    const response = await fetch(`https://qqbulzzezbcwstrhfbco.supabase.co/rest/v1/profiles?id=eq.${profileId}&select=*`, {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxYnVsenplemJjd3N0cmhmYmNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5MjA0MzcsImV4cCI6MjA1MTQ5NjQzN30.vUmslRzwtXxNEjOQXFbRnMHd-ZoghRFmBbqJn2l2g8c',
        'Authorization': `Bearer ${await getStorageData(['authToken'])}`,
      }
    });

    if (!response.ok) throw new Error('Failed to fetch profile');

    const [profile] = await response.json();
    currentProfile = profile;
    
    await setStorageData({ profileData: profile });
    document.getElementById('fillButton').disabled = false;
    showMessage(document.getElementById('message'), 'Profile loaded successfully', 'success');
  } catch (error) {
    console.error('Error loading profile:', error);
    showMessage(document.getElementById('message'), 'Failed to load profile.', 'error');
  }
}

async function loadProfiles() {
  const { authToken } = await getStorageData(['authToken']);
  if (!authToken) {
    console.log('No auth token found');
    return;
  }

  try {
    const response = await fetch('https://qqbulzzezbcwstrhfbco.supabase.co/rest/v1/profiles?select=*', {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxYnVsenplemJjd3N0cmhmYmNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5MjA0MzcsImV4cCI6MjA1MTQ5NjQzN30.vUmslRzwtXxNEjOQXFbRnMHd-ZoghRFmBbqJn2l2g8c',
        'Authorization': `Bearer ${authToken}`,
      }
    });

    if (!response.ok) throw new Error('Failed to fetch profiles');

    const profiles = await response.json();
    updateProfileSelect(profiles);
  } catch (error) {
    console.error('Error loading profiles:', error);
    showMessage(document.getElementById('message'), 'Failed to load profiles.', 'error');
  }
}

function updateProfileSelect(profiles) {
  const select = document.getElementById('profileSelect');
  select.innerHTML = '<option value="">Select a profile</option>';
  
  profiles.forEach(profile => {
    const option = document.createElement('option');
    option.value = profile.id;
    option.textContent = profile.name;
    if (currentProfile && currentProfile.id === profile.id) {
      option.selected = true;
    }
    select.appendChild(option);
  });
}