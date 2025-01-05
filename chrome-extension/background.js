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
    return true; // Keep the message channel open for async response
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

    // TODO: Fetch profile data from Supabase using authToken
    const mockOptimizedResume = {
      personalInfo: {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "123-456-7890",
        address: "123 Main St",
        city: "New York",
        state: "NY",
        zipCode: "10001"
      }
    };
    
    await chrome.storage.local.set({ optimizedResume: mockOptimizedResume });
    
    // Notify that analysis is complete
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
    // Create a new window for Supabase auth
    const authURL = 'https://your-app-url.com/auth'; // Replace with your auth page URL
    const authWindow = await chrome.windows.create({
      url: authURL,
      type: 'popup',
      width: 500,
      height: 600
    });

    // Listen for auth completion message
    chrome.runtime.onMessage.addListener(function authListener(msg) {
      if (msg.type === "AUTH_COMPLETE" && msg.token) {
        chrome.storage.local.set({ authToken: msg.token });
        chrome.windows.remove(authWindow.id);
        sendResponse({ success: true });
        chrome.runtime.onMessage.removeListener(authListener);
      }
    });
  } catch (error) {
    console.error("Auth error:", error);
    sendResponse({ success: false, error: error.message });
  }
}