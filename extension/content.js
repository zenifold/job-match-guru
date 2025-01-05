// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractJobDetails') {
    const jobData = extractJobDetails();
    sendResponse(jobData);
  } else if (request.action === 'autofillForm') {
    autofillForm(request.data);
    sendResponse({ success: true });
  }
  return true;
});

function extractJobDetails() {
  try {
    // This is a basic implementation - would need to be enhanced for specific job sites
    const jobTitle = document.querySelector('h1')?.innerText || '';
    const jobDescription = Array.from(document.querySelectorAll('p, li'))
      .map(el => el.innerText)
      .join('\n');
    
    return {
      success: true,
      jobTitle,
      jobDescription,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

function autofillForm(data) {
  // Common form field selectors
  const fieldMap = {
    name: ['input[name*="name" i]', 'input[id*="name" i]'],
    email: ['input[type="email"]', 'input[name*="email" i]', 'input[id*="email" i]'],
    phone: ['input[type="tel"]', 'input[name*="phone" i]', 'input[id*="phone" i]'],
    resume: ['textarea[name*="resume" i]', 'textarea[id*="resume" i]'],
  };

  // Attempt to fill each field
  Object.entries(fieldMap).forEach(([field, selectors]) => {
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) {
        element.value = data[field] || '';
        // Trigger change event
        element.dispatchEvent(new Event('change', { bubbles: true }));
        break;
      }
    }
  });
}