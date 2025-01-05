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
    // Enhanced job detail extraction for various job sites
    const selectors = {
      title: [
        'h1',
        '[data-testid*="title"]',
        '.job-title',
        '.position-title',
        '[class*="jobtitle"]'
      ],
      description: [
        '[data-testid*="description"]',
        '.job-description',
        '#job-description',
        '[class*="description"]',
        'article'
      ],
      company: [
        '[data-testid*="company"]',
        '.company-name',
        '[class*="company"]',
        '[itemprop="hiringOrganization"]'
      ]
    };

    const findContent = (selectorList) => {
      for (const selector of selectorList) {
        const element = document.querySelector(selector);
        if (element) return element.innerText.trim();
      }
      return '';
    };

    // Extract main content
    const jobTitle = findContent(selectors.title);
    const jobDescription = findContent(selectors.description);
    const company = findContent(selectors.company);

    // Extract additional requirements and skills
    const requirements = Array.from(document.querySelectorAll('ul li, ol li'))
      .map(li => li.innerText.trim())
      .filter(text => 
        text.toLowerCase().includes('require') || 
        text.toLowerCase().includes('skill') ||
        text.toLowerCase().includes('experience')
      )
      .join('\n');

    console.log('Extracted job details:', { jobTitle, company, requirements });
    
    return {
      success: true,
      jobTitle,
      jobDescription: `${jobDescription}\n\nRequirements:\n${requirements}`,
      company
    };
  } catch (error) {
    console.error('Error extracting job details:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

function autofillForm(data) {
  // Enhanced form field detection
  const fieldMap = {
    name: [
      'input[name*="name" i]', 
      'input[id*="name" i]',
      'input[placeholder*="name" i]',
      'input[aria-label*="name" i]'
    ],
    email: [
      'input[type="email"]',
      'input[name*="email" i]',
      'input[id*="email" i]',
      'input[placeholder*="email" i]'
    ],
    phone: [
      'input[type="tel"]',
      'input[name*="phone" i]',
      'input[id*="phone" i]',
      'input[placeholder*="phone" i]'
    ],
    resume: [
      'textarea[name*="resume" i]',
      'textarea[id*="resume" i]',
      'textarea[placeholder*="resume" i]',
      'textarea[aria-label*="resume" i]',
      // Common rich text editor selectors
      '.ql-editor',
      '[contenteditable="true"]'
    ],
    linkedin: [
      'input[name*="linkedin" i]',
      'input[placeholder*="linkedin" i]',
      'input[aria-label*="linkedin" i]'
    ],
    website: [
      'input[name*="website" i]',
      'input[placeholder*="website" i]',
      'input[aria-label*="website" i]'
    ]
  };

  // Attempt to fill each field
  Object.entries(fieldMap).forEach(([field, selectors]) => {
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) {
        if (element.isContentEditable) {
          // Handle rich text editors
          element.innerHTML = data[field] || '';
        } else {
          element.value = data[field] || '';
        }
        // Trigger change event
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.dispatchEvent(new Event('input', { bubbles: true }));
        break;
      }
    }
  });

  console.log('Form autofill completed');
}