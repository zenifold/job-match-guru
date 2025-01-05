chrome.runtime.onInstalled.addListener(() => {
  console.log('Resume Optimizer Extension installed');
  
  // Initialize storage with empty state
  chrome.storage.local.set({
    optimizedResume: null,
    currentJob: null,
    authToken: null,
    profileData: null
  });
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "LOG") {
    console.log("Content script log:", request.message);
  } else if (request.type === "ANALYZE_JOB") {
    handleJobAnalysis(request.data);
  } else if (request.type === "AUTH_REQUEST") {
    handleAuthRequest(sendResponse);
    return true; // Keep channel open for async response
  } else if (request.type === "EXTENSION_AUTH_COMPLETE") {
    handleAuthComplete(request.token, sendResponse);
    return true;
  } else if (request.type === "GET_PROFILE") {
    handleProfileRequest(sendResponse);
    return true;
  }
});

async function handleJobAnalysis(jobData) {
  console.log("Processing job data:", jobData);
  
  try {
    // Store the current job data
    await chrome.storage.local.set({ currentJob: jobData });
    
    // Get auth token
    const { authToken } = await chrome.storage.local.get(['authToken']);
    if (!authToken) {
      throw new Error('Not authenticated');
    }

    // TODO: Implement job analysis with Supabase
    const mockOptimizedResume = {
      personalInfo: {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com"
      }
    };
    
    await chrome.storage.local.set({ optimizedResume: mockOptimizedResume });
    
    chrome.runtime.sendMessage({
      type: "ANALYSIS_COMPLETE",
      success: true
    });
  } catch (error) {
    console.error("Error in job analysis:", error);
    chrome.runtime.sendMessage({
      type: "ANALYSIS_COMPLETE",
      success: false,
      error: error.message
    });
  }
}

async function handleAuthRequest(sendResponse) {
  try {
    const authURL = 'http://localhost:5173/extension-auth';
    const authWindow = await chrome.windows.create({
      url: authURL,
      type: 'popup',
      width: 500,
      height: 600
    });

    // Response will be sent by handleAuthComplete when auth is done
  } catch (error) {
    console.error("Auth error:", error);
    sendResponse({ success: false, error: error.message });
  }
}

async function handleAuthComplete(token, sendResponse) {
  try {
    await chrome.storage.local.set({ authToken: token });
    
    // After authentication, fetch and store the user's profile
    const response = await fetch('https://qqbulzzezbcwstrhfbco.supabase.co/rest/v1/profiles?select=*&is_master=eq.true', {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxYnVsenplemJjd3N0cmhmYmNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5MjA0MzcsImV4cCI6MjA1MTQ5NjQzN30.vUmslRzwtXxNEjOQXFbRnMHd-ZoghRFmBbqJn2l2g8c',
        'Authorization': `Bearer ${token}`,
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    const data = await response.json();
    const profile = data[0]?.content || null;
    
    await chrome.storage.local.set({ profileData: profile });
    
    chrome.runtime.sendMessage({ 
      type: "AUTH_STATUS_CHANGED", 
      isAuthenticated: true 
    });
    
    sendResponse({ success: true });
  } catch (error) {
    console.error("Error saving auth token:", error);
    sendResponse({ success: false, error: error.message });
  }
}

async function handleProfileRequest(sendResponse) {
  try {
    const { authToken } = await chrome.storage.local.get(['authToken']);
    if (!authToken) {
      throw new Error('Not authenticated');
    }

    const response = await fetch('https://qqbulzzezbcwstrhfbco.supabase.co/rest/v1/profiles?select=*&is_master=eq.true', {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxYnVsenplemJjd3N0cmhmYmNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5MjA0MzcsImV4cCI6MjA1MTQ5NjQzN30.vUmslRzwtXxNEjOQXFbRnMHd-ZoghRFmBbqJn2l2g8c',
        'Authorization': `Bearer ${authToken}`,
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    const data = await response.json();
    const profile = data[0]?.content || null;
    
    await chrome.storage.local.set({ profileData: profile });
    sendResponse({ success: true, data: profile });
  } catch (error) {
    console.error('Error fetching profile:', error);
    sendResponse({ success: false, error: error.message });
  }
}