import { getStorageData, setStorageData } from './utils/storage.js';

chrome.runtime.onInstalled.addListener((details) => {
  console.log('Resume Optimizer Extension installed/updated:', details.reason);
  
  // Initialize storage with empty state
  setStorageData({
    optimizedResume: null,
    currentJob: null,
    authToken: null,
    profileData: null
  });
});

// Add update check listener
chrome.runtime.onUpdateAvailable.addListener((details) => {
  console.log('Update available:', details.version);
  chrome.runtime.reload();
});

// Listen for messages from content script and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Received message:', request.type);
  
  if (request.type === "LOG") {
    console.log("Content script log:", request.message);
  } else if (request.type === "ANALYZE_JOB") {
    handleJobAnalysis(request.data);
  } else if (request.type === "GET_PROFILE") {
    handleProfileRequest(sendResponse);
    return true;
  }
});

async function handleJobAnalysis(jobData) {
  try {
    await setStorageData({ currentJob: jobData });
    
    const { authToken } = await getStorageData(['authToken']);
    if (!authToken) {
      throw new Error('Not authenticated');
    }

    const response = await fetch('https://qqbulzzezbcwstrhfbco.supabase.co/rest/v1/jobs', {
      method: 'POST',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxYnVsenplemJjd3N0cmhmYmNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5MjA0MzcsImV4cCI6MjA1MTQ5NjQzN30.vUmslRzwtXxNEjOQXFbRnMHd-ZoghRFmBbqJn2l2g8c',
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(jobData)
    });

    if (!response.ok) {
      throw new Error('Failed to analyze job');
    }

    const result = await response.json();
    await setStorageData({ optimizedResume: result });
    
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

async function handleProfileRequest(sendResponse) {
  try {
    const { authToken } = await getStorageData(['authToken']);
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
    
    await setStorageData({ profileData: profile });
    sendResponse({ success: true, data: profile });
  } catch (error) {
    console.error('Error fetching profile:', error);
    sendResponse({ success: false, error: error.message });
  }
}