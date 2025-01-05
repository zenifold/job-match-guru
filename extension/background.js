// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Resume Optimizer Extension installed');
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'analyzeJob') {
    // Handle job analysis request
    analyzeJob(request.data)
      .then(response => sendResponse(response))
      .catch(error => sendResponse({ error: error.message }));
    return true;
  }
});

async function analyzeJob(jobData) {
  try {
    // Make API call to your backend
    const response = await fetch('https://your-backend.com/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jobData),
    });
    
    if (!response.ok) {
      throw new Error('Analysis failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error analyzing job:', error);
    throw error;
  }
}