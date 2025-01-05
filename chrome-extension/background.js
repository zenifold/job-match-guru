chrome.runtime.onInstalled.addListener(() => {
  console.log('Resume Optimizer Extension installed');
  
  // Initialize storage with empty state
  chrome.storage.local.set({
    optimizedResume: null,
    currentJob: null,
    authToken: null
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
    const authURL = 'http://localhost:5173/extension-auth'; // Update with your auth page URL
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