chrome.runtime.onInstalled.addListener(() => {
  console.log('Resume Optimizer Extension installed');
  
  // Initialize storage with empty state
  chrome.storage.local.set({
    optimizedResume: null,
    currentJob: null
  });
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "LOG") {
    console.log("Content script log:", request.message);
  } else if (request.type === "ANALYZE_JOB") {
    handleJobAnalysis(request.data);
  }
});

async function handleJobAnalysis(jobData) {
  console.log("Processing job data:", jobData);
  
  try {
    // Store the current job data
    await chrome.storage.local.set({ currentJob: jobData });
    
    // TODO: Integrate with your backend API to analyze the job and get optimized resume
    // For now, we'll just store some mock data
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