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
    
    // Show optimization results
    document.getElementById('results').innerHTML = `
      <div class="mt-4 p-4 bg-gray-50 rounded">
        <h3 class="font-semibold">Match Score: ${analysisData.matchScore}%</h3>
        <p class="text-sm text-gray-600 mt-2">Key matches:</p>
        <ul class="text-sm mt-1">
          ${analysisData.matches.map(match => `
            <li class="flex items-center gap-1">
              <svg class="w-4 h-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              ${match}
            </li>
          `).join('')}
        </ul>
      </div>
    `;
    
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