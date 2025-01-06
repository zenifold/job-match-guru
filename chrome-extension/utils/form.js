export const fillField = async (selector, value, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    const element = document.querySelector(selector);
    if (element && value) {
      try {
        element.value = value;
        element.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
      } catch (error) {
        console.error(`Attempt ${i + 1} failed for selector ${selector}:`, error);
        if (i === maxRetries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
  return false;
};

export const handleFormFill = async (currentProfile, addToHistory) => {
  if (!currentProfile) {
    throw new Error('Please select a profile first.');
  }

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  const response = await chrome.tabs.sendMessage(tab.id, {
    action: 'autoFill',
    profile: currentProfile
  });
  
  if (response?.success) {
    addToHistory({
      timestamp: new Date().toISOString(),
      action: 'Form Fill',
      status: 'Success',
      url: tab.url
    });
    return { success: true };
  } else {
    throw new Error(response?.error || 'Failed to fill form');
  }
};