export const fillField = async (selector, value, maxRetries = 3) => {
  if (!selector || !value) {
    console.log(`Skipping empty field: ${selector}`);
    return false;
  }

  for (let i = 0; i < maxRetries; i++) {
    try {
      const element = document.querySelector(selector);
      if (!element) {
        console.log(`Element not found: ${selector}, attempt ${i + 1}/${maxRetries}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }

      // Handle different input types
      if (element.tagName === 'SELECT') {
        const option = Array.from(element.options).find(opt => 
          opt.text.toLowerCase().includes(value.toLowerCase()) || 
          opt.value.toLowerCase().includes(value.toLowerCase())
        );
        if (option) {
          element.value = option.value;
        } else {
          console.log(`No matching option found for ${selector} with value ${value}`);
        }
      } else {
        element.value = value;
      }

      // Trigger both change and input events
      element.dispatchEvent(new Event('change', { bubbles: true }));
      element.dispatchEvent(new Event('input', { bubbles: true }));
      
      console.log(`Successfully filled field: ${selector} with value: ${value}`);
      return true;
    } catch (error) {
      console.error(`Attempt ${i + 1} failed for selector ${selector}:`, error);
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  return false;
};

export const handleFormFill = async (currentProfile, addToHistory) => {
  if (!currentProfile) {
    throw new Error('Please select a profile first.');
  }

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) {
    throw new Error('No active tab found.');
  }
  
  try {
    console.log('Starting form fill process...');
    const response = await chrome.tabs.sendMessage(tab.id, {
      action: 'autoFill',
      profile: currentProfile
    });
    
    if (response?.success) {
      console.log('Form fill completed successfully');
      addToHistory?.({
        timestamp: new Date().toISOString(),
        action: 'Form Fill',
        status: 'Success',
        url: tab.url
      });
      return { success: true };
    } else {
      throw new Error(response?.error || 'Failed to fill form');
    }
  } catch (error) {
    console.error('Error in handleFormFill:', error);
    throw error;
  }
};

// Utility function to validate field value
export const validateFieldValue = (value, fieldType) => {
  if (!value) return false;
  
  switch (fieldType) {
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    case 'phone':
      return /^[\d\s\-\+\(\)]{10,}$/.test(value);
    case 'date':
      return !isNaN(Date.parse(value));
    default:
      return true;
  }
};