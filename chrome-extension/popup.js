document.addEventListener('DOMContentLoaded', async () => {
  const analyzeBtn = document.getElementById('analyzeJob');
  const autoFillBtn = document.getElementById('autoFill');
  const statusDiv = document.getElementById('status');
  const loginBtn = document.getElementById('login');
  const logoutBtn = document.getElementById('logout');
  
  // Helper function to update status
  function updateStatus(message, isError = false) {
    statusDiv.textContent = message;
    statusDiv.className = isError ? 'text-red-500' : 'text-green-500';
  }

  // Check auth state and load profile data
  const { authToken } = await chrome.storage.local.get(['authToken']);
  if (authToken) {
    chrome.runtime.sendMessage({ type: "GET_PROFILE" }, (response) => {
      if (response?.success) {
        console.log('Profile data loaded successfully');
      } else {
        updateStatus('Failed to load profile data', true);
      }
    });
  }
  updateAuthUI(!!authToken);

  // Handle login button click
  loginBtn?.addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: "AUTH_REQUEST" }, (response) => {
      if (response?.success) {
        updateStatus('Successfully logged in');
        updateAuthUI(true);
      } else {
        updateStatus(response?.error || 'Failed to login', true);
      }
    });
  });

  // Handle logout button click
  logoutBtn?.addEventListener('click', async () => {
    await chrome.storage.local.remove(['authToken']);
    updateStatus('Logged out successfully');
    updateAuthUI(false);
  });

  // Handle analyze job button click
  analyzeBtn?.addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {action: "analyzeJob"}, (response) => {
        if (chrome.runtime.lastError) {
          updateStatus('Error: Not a valid Workday job page', true);
          return;
        }
        
        if (response?.success) {
          updateStatus('Job analysis in progress...');
        } else {
          updateStatus(response?.error || 'Failed to analyze job', true);
        }
      });
    });
  });

  // Handle auto-fill button click
  autoFillBtn?.addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {action: "autoFill"}, (response) => {
        if (chrome.runtime.lastError) {
          updateStatus('Error: Not a valid Workday application page', true);
          return;
        }
        
        if (response?.success) {
          updateStatus('Application form filled successfully');
        } else {
          updateStatus(response?.error || 'Failed to fill application', true);
        }
      });
    });
  });

  function updateAuthUI(isAuthenticated) {
    if (isAuthenticated) {
      loginBtn.style.display = 'none';
      logoutBtn.style.display = 'block';
      analyzeBtn.disabled = false;
      autoFillBtn.disabled = false;
    } else {
      loginBtn.style.display = 'block';
      logoutBtn.style.display = 'none';
      analyzeBtn.disabled = true;
      autoFillBtn.disabled = true;
    }
  }

  // Listen for auth status changes
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "AUTH_STATUS_CHANGED") {
      updateAuthUI(message.isAuthenticated);
    }
  });
});
