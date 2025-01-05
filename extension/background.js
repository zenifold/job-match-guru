// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Resume Optimizer Extension installed');
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'analyzeJob') {
    // Handle job analysis request
    analyzeJob(request.data)
      .then(response => {
        console.log('Analysis completed successfully:', response);
        sendResponse(response);
      })
      .catch(error => {
        console.error('Analysis failed:', error);
        sendResponse({ error: error.message });
      });
    return true;
  }
});

async function analyzeJob(jobData) {
  try {
    console.log('Starting job analysis:', jobData);
    
    // Make API call to analyze job
    console.log('Sending analysis request to Supabase function...');
    const response = await fetch('https://qqbulzzezbcwstrhfbco.supabase.co/functions/v1/analyze-job-extension', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jobData.authToken}`,
      },
      body: JSON.stringify({
        jobDescription: jobData.description,
        jobTitle: jobData.jobTitle,
        company: jobData.company,
        userId: jobData.userId
      }),
    });
    
    if (!response.ok) {
      console.error('Analysis request failed:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error details:', errorText);
      throw new Error('Analysis failed');
    }
    
    const analysisResult = await response.json();
    console.log('Analysis result:', analysisResult);
    
    return analysisResult;
  } catch (error) {
    console.error('Error analyzing job:', error);
    throw error;
  }
}