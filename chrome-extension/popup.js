// Initialize UI elements
document.addEventListener('DOMContentLoaded', () => {
  const analyzeBtn = document.getElementById('analyzeJob');
  const autoFillBtn = document.getElementById('autoFill');
  const statusDiv = document.getElementById('status');
  
  // Helper function to update status
  function updateStatus(message, isError = false) {
    statusDiv.textContent = message;
    statusDiv.className = isError ? 'text-error' : 'text-success';
    
    // Auto-hide status after 5 seconds
    setTimeout(() => {
      statusDiv.textContent = '';
      statusDiv.className = '';
    }, 5000);
  }

  // Handle analyze job button click
  analyzeBtn.addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {action: "analyzeJob"}, (response) => {
        if (chrome.runtime.lastError) {
          updateStatus('Error: Not a valid Workday job page', true);
          return;
        }
        
        if (response?.success) {
          updateStatus('Job analysis in progress...');
        } else {
          updateStatus(response?.error || 'Failed to analyze job', true);
        }
      });
    });
  });

  // Handle auto-fill button click
  autoFillBtn.addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {action: "autoFill"}, (response) => {
        if (chrome.runtime.lastError) {
          updateStatus('Error: Not a valid Workday application page', true);
          return;
        }
        
        if (response?.success) {
          updateStatus('Application form filled successfully');
        } else {
          updateStatus(response?.error || 'Failed to fill application', true);
        }
      });
    });
  });
});