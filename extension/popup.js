import { updateUIForAuthenticatedUser, updateUIForUnauthenticatedUser } from './components/AuthSection';
import { showTutorial } from './components/Tutorial';
import { handleAnalysis } from './services/analysisService';

let currentJobData = null;
let currentUser = null;

// Initialize authentication state
chrome.storage.local.get(['authToken', 'userData', 'hasSeenTutorial'], (result) => {
  if (result.authToken && result.userData) {
    currentUser = result.userData;
    updateUIForAuthenticatedUser(currentUser);
    
    if (!result.hasSeenTutorial) {
      showTutorial();
      chrome.storage.local.set({ hasSeenTutorial: true });
    }
  } else {
    updateUIForUnauthenticatedUser();
  }
});

document.getElementById('analyze').addEventListener('click', async () => {
  const statusEl = document.getElementById('status');
  const autofillBtn = document.getElementById('autofill');
  const resultsEl = document.getElementById('results');
  
  try {
    statusEl.textContent = 'Starting analysis...';
    statusEl.className = 'status';
    resultsEl.innerHTML = `
      <div class="flex items-center space-x-2">
        <div class="loading"></div>
        <div>
          <p class="font-medium">Analyzing job description...</p>
          <p class="text-sm text-gray-500">This usually takes about 30 seconds</p>
        </div>
      </div>
    `;
    
    // Get the active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Extract job description
    const response = await chrome.tabs.sendMessage(tab.id, { action: 'extractJobDetails' });
    
    if (!response.success) {
      throw new Error('Could not extract job details. Please make sure you are on a job posting page.');
    }
    
    // Update status to show progress
    statusEl.textContent = 'Optimizing resume...';
    
    // Handle the complete analysis flow
    const result = await handleAnalysis({
      jobDescription: response.jobDescription,
      jobTitle: response.jobTitle,
      company: response.company
    }, currentUser.token, currentUser.id);
    
    currentJobData = result;
    
    statusEl.textContent = 'Analysis complete! Ready to auto-fill.';
    statusEl.className = 'status success';
    autofillBtn.disabled = false;
    
    // Show optimization results
    resultsEl.innerHTML = `
      <div class="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="font-semibold">Match Score</h3>
          <span class="text-lg font-bold ${
            analysisData.matchScore >= 80 ? 'text-green-600' : 
            analysisData.matchScore >= 60 ? 'text-yellow-600' : 'text-red-600'
          }">${analysisData.matchScore}%</span>
        </div>
        
        <div class="space-y-1">
          <div class="h-2 bg-gray-200 rounded overflow-hidden">
            <div 
              class="h-full rounded ${
                analysisData.matchScore >= 80 ? 'bg-green-500' : 
                analysisData.matchScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }" 
              style="width: ${analysisData.matchScore}%"
            ></div>
          </div>
          <p class="text-xs text-gray-500 text-right">
            ${analysisData.matchScore >= 80 ? 'Excellent match!' : 
              analysisData.matchScore >= 60 ? 'Good match' : 'Could be improved'}
          </p>
        </div>

        <div class="space-y-2">
          <p class="text-sm font-medium text-gray-700">Key Matches:</p>
          <ul class="text-sm space-y-1">
            ${analysisData.matches.map(match => `
              <li class="flex items-center gap-1 text-green-600">
                <svg class="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                ${match}
              </li>
            `).join('')}
          </ul>
        </div>
        
        ${analysisData.suggestions ? `
          <div class="space-y-2">
            <p class="text-sm font-medium text-gray-700">Suggestions:</p>
            <ul class="text-sm space-y-1">
              ${analysisData.suggestions.map(suggestion => `
                <li class="flex items-center gap-1 text-blue-600">
                  <svg class="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
                  </svg>
                  ${suggestion}
                </li>
              `).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    `;
    
  } catch (error) {
    statusEl.textContent = `Error: ${error.message}`;
    statusEl.className = 'status error';
    autofillBtn.disabled = true;
    resultsEl.innerHTML = `
      <div class="mt-4 p-4 bg-red-50 rounded-lg">
        <div class="flex items-center gap-2 text-red-600">
          <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          <p class="text-sm font-medium">${error.message}</p>
        </div>
        <p class="mt-2 text-xs text-gray-500">
          Try refreshing the page or make sure you're on a job posting page.
        </p>
      </div>
    `;
  }
});

document.getElementById('autofill').addEventListener('click', async () => {
  if (!currentJobData) return;
  
  const statusEl = document.getElementById('status');
  const autofillBtn = document.getElementById('autofill');
  
  try {
    statusEl.textContent = 'Auto-filling form...';
    autofillBtn.disabled = true;
    
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    await chrome.tabs.sendMessage(tab.id, {
      action: 'autofillForm',
      data: currentJobData
    });
    
    statusEl.textContent = 'Form auto-filled successfully!';
    statusEl.className = 'status success';
  } catch (error) {
    statusEl.textContent = `Error: ${error.message}`;
    statusEl.className = 'status error';
  } finally {
    autofillBtn.disabled = false;
  }
});

// Handle authentication
document.addEventListener('click', async (e) => {
  if (e.target.id === 'login') {
    // Open login page in a new tab
    chrome.tabs.create({ url: 'https://lovable.dev/login' });
  } else if (e.target.id === 'logout') {
    // Clear stored auth data
    await chrome.storage.local.remove(['authToken', 'userData', 'hasSeenTutorial']);
    currentUser = null;
    updateUIForUnauthenticatedUser();
  }
});
