let currentJobData = null;
let currentUser = null;

// Initialize authentication state
chrome.storage.local.get(['authToken', 'userData'], (result) => {
  if (result.authToken && result.userData) {
    currentUser = result.userData;
    updateUIForAuthenticatedUser();
  } else {
    updateUIForUnauthenticatedUser();
  }
});

function updateUIForAuthenticatedUser() {
  document.getElementById('auth-section').innerHTML = `
    <p class="text-sm text-gray-600">Logged in as ${currentUser.email}</p>
    <button id="logout" class="text-sm text-red-600">Logout</button>
  `;
  document.getElementById('main-content').style.display = 'block';
}

function updateUIForUnauthenticatedUser() {
  document.getElementById('auth-section').innerHTML = `
    <p class="text-sm text-gray-600">Please log in to use the extension</p>
    <button id="login" class="button">Login</button>
  `;
  document.getElementById('main-content').style.display = 'none';
}

document.getElementById('analyze').addEventListener('click', async () => {
  const statusEl = document.getElementById('status');
  const autofillBtn = document.getElementById('autofill');
  const resultsEl = document.getElementById('results');
  
  try {
    statusEl.textContent = 'Analyzing job description...';
    statusEl.className = 'status';
    resultsEl.innerHTML = '<div class="loading"></div> Processing...';
    
    // Get the active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Extract job description
    const response = await chrome.tabs.sendMessage(tab.id, { action: 'extractJobDetails' });
    
    if (!response.success) {
      throw new Error('Could not extract job details');
    }
    
    // Send to backend for analysis
    const analysisResponse = await fetch('https://qqbulzzezbcwstrhfbco.supabase.co/functions/v1/analyze-job-extension', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentUser.token}`,
      },
      body: JSON.stringify({
        jobDescription: response.jobDescription,
        jobTitle: response.jobTitle,
        company: response.company,
        userId: currentUser.id
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
    
    // Show optimization results with enhanced UI
    resultsEl.innerHTML = `
      <div class="mt-4 p-4 bg-gray-50 rounded">
        <h3 class="font-semibold">Match Score: ${analysisData.matchScore}%</h3>
        <div class="progress-bar mt-2 h-2 bg-gray-200 rounded">
          <div class="h-full bg-green-500 rounded" style="width: ${analysisData.matchScore}%"></div>
        </div>
        <p class="text-sm text-gray-600 mt-4">Key matches:</p>
        <ul class="text-sm mt-1">
          ${analysisData.matches.map(match => `
            <li class="flex items-center gap-1 mt-1">
              <svg class="w-4 h-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              ${match}
            </li>
          `).join('')}
        </ul>
        ${analysisData.suggestions ? `
          <p class="text-sm text-gray-600 mt-4">Suggestions for improvement:</p>
          <ul class="text-sm mt-1">
            ${analysisData.suggestions.map(suggestion => `
              <li class="flex items-center gap-1 mt-1">
                <svg class="w-4 h-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
                </svg>
                ${suggestion}
              </li>
            `).join('')}
          </ul>
        ` : ''}
      </div>
    `;
    
  } catch (error) {
    statusEl.textContent = `Error: ${error.message}`;
    statusEl.className = 'status error';
    autofillBtn.disabled = true;
    resultsEl.innerHTML = '';
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

// Handle authentication
document.addEventListener('click', async (e) => {
  if (e.target.id === 'login') {
    // Open login page in a new tab
    chrome.tabs.create({ url: 'https://lovable.dev/login' });
  } else if (e.target.id === 'logout') {
    // Clear stored auth data
    await chrome.storage.local.remove(['authToken', 'userData']);
    currentUser = null;
    updateUIForUnauthenticatedUser();
  }
});
