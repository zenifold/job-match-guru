let token = null;
let currentProfile = null;

// Initialize the popup
document.addEventListener('DOMContentLoaded', async () => {
  const loginButton = document.getElementById('loginButton');
  const fillButton = document.getElementById('fillButton');
  const logoutButton = document.getElementById('logoutButton');
  const settingsButton = document.getElementById('settingsButton');
  const profileSelect = document.getElementById('profileSelect');
  
  // Check if user is already logged in
  const { authToken, profileData } = await chrome.storage.local.get(['authToken', 'profileData']);
  token = authToken;
  currentProfile = profileData;
  
  if (token) {
    await updateUIForLoggedInState();
  } else {
    updateUIForLoggedOutState();
  }

  // Event Listeners with proper cleanup
  const cleanup = () => {
    loginButton.removeEventListener('click', handleLogin);
    fillButton.removeEventListener('click', handleFormFill);
    logoutButton.removeEventListener('click', handleLogout);
    settingsButton.removeEventListener('click', handleSettings);
    profileSelect.removeEventListener('change', handleProfileChange);
  };

  loginButton.addEventListener('click', handleLogin);
  fillButton.addEventListener('click', handleFormFill);
  logoutButton.addEventListener('click', handleLogout);
  settingsButton.addEventListener('click', handleSettings);
  profileSelect.addEventListener('change', handleProfileChange);

  // Listen for auth status changes from background script
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'AUTH_STATUS_CHANGED') {
      if (message.isAuthenticated) {
        updateUIForLoggedInState();
      } else {
        updateUIForLoggedOutState();
      }
    }
  });

  // Cleanup on window unload
  window.addEventListener('unload', cleanup);
});

async function updateUIForLoggedInState() {
  document.getElementById('loginContainer').style.display = 'none';
  document.getElementById('mainContainer').style.display = 'block';
  document.getElementById('loginStatus').textContent = 'Logged in';
  
  // Enable form fill button if profile is selected
  const fillButton = document.getElementById('fillButton');
  fillButton.disabled = !currentProfile;
  
  try {
    // Load profiles
    await loadProfiles();
    // Load history
    loadHistory();
  } catch (error) {
    console.error('Error updating UI for logged in state:', error);
    showMessage('Failed to load profiles or history', 'error');
  }
}

function updateUIForLoggedOutState() {
  document.getElementById('loginContainer').style.display = 'block';
  document.getElementById('mainContainer').style.display = 'none';
  document.getElementById('loginStatus').textContent = 'Not logged in';
}

async function handleLogin() {
  try {
    showMessage('Initiating login...', 'info');
    
    // Request auth from background script
    const response = await chrome.runtime.sendMessage({ type: 'AUTH_REQUEST' });
    
    if (response?.success) {
      showMessage('Login successful!', 'success');
    } else {
      showMessage(response?.error || 'Login failed. Please try again.', 'error');
    }
  } catch (error) {
    console.error('Login error:', error);
    showMessage('An error occurred during login.', 'error');
  }
}

async function handleLogout() {
  try {
    // Clear stored data
    await chrome.storage.local.clear();
    token = null;
    currentProfile = null;
    
    // Update UI
    updateUIForLoggedOutState();
    showMessage('Logged out successfully.', 'success');
  } catch (error) {
    console.error('Logout error:', error);
    showMessage('An error occurred during logout.', 'error');
  }
}

async function loadProfiles() {
  if (!token) {
    console.log('No auth token found');
    return;
  }

  try {
    const response = await fetch('https://qqbulzzezbcwstrhfbco.supabase.co/rest/v1/profiles?select=*', {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxYnVsenplemJjd3N0cmhmYmNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5MjA0MzcsImV4cCI6MjA1MTQ5NjQzN30.vUmslRzwtXxNEjOQXFbRnMHd-ZoghRFmBbqJn2l2g8c',
        'Authorization': `Bearer ${token}`,
      }
    });

    if (!response.ok) throw new Error('Failed to fetch profiles');

    const profiles = await response.json();
    updateProfileSelect(profiles);
  } catch (error) {
    console.error('Error loading profiles:', error);
    showMessage('Failed to load profiles.', 'error');
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
        'Authorization': `Bearer ${token}`,
      }
    });

    if (!response.ok) throw new Error('Failed to fetch profile');

    const [profile] = await response.json();
    currentProfile = profile;
    
    // Store selected profile
    await chrome.storage.local.set({ profileData: profile });
    
    // Enable fill button
    document.getElementById('fillButton').disabled = false;
    showMessage('Profile loaded successfully', 'success');
  } catch (error) {
    console.error('Error loading profile:', error);
    showMessage('Failed to load profile.', 'error');
  }
}

async function handleFormFill() {
  if (!currentProfile) {
    showMessage('Please select a profile first.', 'error');
    return;
  }

  try {
    showMessage('Filling form...', 'info');
    
    // Get current active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Send message to content script to fill form
    const response = await chrome.tabs.sendMessage(tab.id, {
      action: 'autoFill',
      profile: currentProfile
    });
    
    if (response?.success) {
      showMessage('Form filled successfully!', 'success');
      addToHistory({
        timestamp: new Date().toISOString(),
        action: 'Form Fill',
        status: 'Success',
        url: tab.url
      });
    } else {
      throw new Error(response?.error || 'Failed to fill form');
    }
  } catch (error) {
    console.error('Form fill error:', error);
    showMessage('Failed to fill form: ' + error.message, 'error');
    addToHistory({
      timestamp: new Date().toISOString(),
      action: 'Form Fill',
      status: 'Failed',
      url: tab.url,
      error: error.message
    });
  }
}

function handleSettings() {
  chrome.runtime.openOptionsPage();
}

function showMessage(message, type = 'info') {
  const messageEl = document.getElementById('message');
  messageEl.textContent = message;
  messageEl.className = type;
  messageEl.style.display = 'block';
  
  // Hide message after 3 seconds
  setTimeout(() => {
    messageEl.style.display = 'none';
  }, 3000);
}

function addToHistory(entry) {
  chrome.storage.local.get(['history'], (result) => {
    const history = result.history || [];
    history.unshift(entry);
    
    // Keep only last 10 entries
    if (history.length > 10) {
      history.pop();
    }
    
    chrome.storage.local.set({ history });
    updateHistoryDisplay(history);
  });
}

function loadHistory() {
  chrome.storage.local.get(['history'], (result) => {
    if (result.history) {
      updateHistoryDisplay(result.history);
    }
  });
}

function updateHistoryDisplay(history) {
  const historyContainer = document.getElementById('history');
  historyContainer.innerHTML = '';
  
  if (history.length === 0) {
    const emptyMessage = document.createElement('div');
    emptyMessage.className = 'history-item';
    emptyMessage.textContent = 'No history yet';
    historyContainer.appendChild(emptyMessage);
    return;
  }
  
  history.forEach(entry => {
    const item = document.createElement('div');
    item.className = 'history-item';
    
    const date = new Date(entry.timestamp).toLocaleString();
    const status = entry.status === 'Success' 
      ? '<span style="color: #22c55e;">✓</span>' 
      : '<span style="color: #ef4444;">✗</span>';
    
    item.innerHTML = `
      ${status} ${entry.action}<br>
      <small>${date}</small>
    `;
    
    historyContainer.appendChild(item);
  });
}