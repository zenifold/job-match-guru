document.addEventListener('DOMContentLoaded', async () => {
  // Load saved settings
  chrome.storage.local.get([
    'autoFillEnabled',
    'showNotifications',
    'saveHistory'
  ], (result) => {
    document.getElementById('autoFillEnabled').checked = 
      result.autoFillEnabled !== false;
    document.getElementById('showNotifications').checked = 
      result.showNotifications !== false;
    document.getElementById('saveHistory').checked = 
      result.saveHistory !== false;
  });

  // Save settings when changed
  document.getElementById('autoFillEnabled').addEventListener('change', (e) => {
    chrome.storage.local.set({ autoFillEnabled: e.target.checked });
    showMessage('Settings saved!', 'success');
  });

  document.getElementById('showNotifications').addEventListener('change', (e) => {
    chrome.storage.local.set({ showNotifications: e.target.checked });
    showMessage('Settings saved!', 'success');
  });

  document.getElementById('saveHistory').addEventListener('change', (e) => {
    chrome.storage.local.set({ saveHistory: e.target.checked });
    showMessage('Settings saved!', 'success');
  });

  // Clear history
  document.getElementById('clearHistory').addEventListener('click', async () => {
    try {
      await chrome.storage.local.remove(['history']);
      showMessage('History cleared successfully!', 'success');
    } catch (error) {
      console.error('Error clearing history:', error);
      showMessage('Failed to clear history.', 'error');
    }
  });
});

function showMessage(message, type = 'info') {
  const messageEl = document.getElementById('message');
  messageEl.textContent = message;
  messageEl.className = `message ${type}`;
  messageEl.style.display = 'block';
  
  setTimeout(() => {
    messageEl.style.display = 'none';
  }, 3000);
}