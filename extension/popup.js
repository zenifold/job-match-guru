let currentJobData = null;

document.getElementById('analyze').addEventListener('click', async () => {
  const statusEl = document.getElementById('status');
  const autofillBtn = document.getElementById('autofill');
  
  try {
    statusEl.textContent = 'Analyzing job description...';
    statusEl.className = 'status';
    
    // Get the active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Extract job description
    const response = await chrome.tabs.sendMessage(tab.id, { action: 'extractJobDetails' });
    
    if (!response.success) {
      throw new Error('Could not extract job details');
    }
    
    // Send to backend for analysis
    const analysisResponse = await fetch('https://your-backend.com/analyze-job', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jobDescription: response.jobDescription,
        jobTitle: response.jobTitle,
      }),
    });
    
    if (!analysisResponse.ok) {
      throw new Error('Analysis failed');
    }
    
    const analysisData = await analysisResponse.json();
    currentJobData = analysisData;
    
    statusEl.textContent = 'Analysis complete! Ready to auto-fill.';
    statusEl.className = 'status success';
    autofillBtn.disabled = false;
    
  } catch (error) {
    statusEl.textContent = `Error: ${error.message}`;
    statusEl.className = 'status error';
    autofillBtn.disabled = true;
  }
});

document.getElementById('autofill').addEventListener('click', async () => {
  if (!currentJobData) return;
  
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.tabs.sendMessage(tab.id, {
    action: 'autofillForm',
    data: currentJobData
  });
});