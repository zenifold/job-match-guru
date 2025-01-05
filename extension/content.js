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
    // Enhanced selectors for various job sites
    const selectors = {
      title: [
        'h1',
        '[data-testid*="title"]',
        '.job-title',
        '.position-title',
        '[class*="jobtitle"]',
        // LinkedIn specific
        '.top-card-layout__title',
        // Indeed specific
        '.jobsearch-JobInfoHeader-title',
        // Glassdoor specific
        '[data-test="job-title"]'
      ],
      description: [
        '[data-testid*="description"]',
        '.job-description',
        '#job-description',
        '[class*="description"]',
        'article',
        // LinkedIn specific
        '.description__text',
        // Indeed specific
        '#jobDescriptionText',
        // Glassdoor specific
        '[data-test="description"]'
      ],
      company: [
        '[data-testid*="company"]',
        '.company-name',
        '[class*="company"]',
        '[itemprop="hiringOrganization"]',
        // LinkedIn specific
        '.top-card-layout__company',
        // Indeed specific
        '.jobsearch-InlineCompanyRating',
        // Glassdoor specific
        '[data-test="employer-name"]'
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

    // Add structured data extraction
    const structuredData = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
      .map(script => {
        try {
          return JSON.parse(script.textContent || '');
        } catch (e) {
          return null;
        }
      })
      .find(data => data && (data['@type'] === 'JobPosting' || data.jobPosting));

    if (structuredData) {
      const jobData = structuredData['@type'] === 'JobPosting' ? structuredData : structuredData.jobPosting;
      return {
        success: true,
        jobTitle: jobTitle || jobData.title,
        jobDescription: jobDescription || jobData.description,
        company: company || (jobData.hiringOrganization && jobData.hiringOrganization.name)
      };
    }

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
  // Enhanced field mapping for various job sites
  const fieldMap = {
    name: [
      'input[name*="name" i]', 
      'input[id*="name" i]',
      'input[placeholder*="name" i]',
      'input[aria-label*="name" i]',
      // LinkedIn specific
      '[data-test-form-element="name-input"]',
      // Indeed specific
      '#input-applicant-name',
      // Glassdoor specific
      '[data-test="application-name"]'
    ],
    email: [
      'input[type="email"]',
      'input[name*="email" i]',
      'input[id*="email" i]',
      'input[placeholder*="email" i]',
      // Platform specific selectors
      '[data-test-form-element="email-input"]',
      '#input-email',
      '[data-test="application-email"]'
    ],
    phone: [
      'input[type="tel"]',
      'input[name*="phone" i]',
      'input[id*="phone" i]',
      'input[placeholder*="phone" i]',
      // Platform specific selectors
      '[data-test-form-element="phone-input"]',
      '#input-phone',
      '[data-test="application-phone"]'
    ],
    resume: [
      'textarea[name*="resume" i]',
      'textarea[id*="resume" i]',
      'textarea[placeholder*="resume" i]',
      'textarea[aria-label*="resume" i]',
      '.ql-editor',
      '[contenteditable="true"]',
      // Platform specific selectors
      '[data-test-form-element="resume-input"]',
      '#input-resume',
      '[data-test="application-resume"]'
    ],
    linkedin: [
      'input[name*="linkedin" i]',
      'input[placeholder*="linkedin" i]',
      'input[aria-label*="linkedin" i]',
      // Platform specific selectors
      '[data-test-form-element="linkedin-input"]',
      '#input-linkedin',
      '[data-test="application-linkedin"]'
    ],
    website: [
      'input[name*="website" i]',
      'input[placeholder*="website" i]',
      'input[aria-label*="website" i]',
      // Platform specific selectors
      '[data-test-form-element="website-input"]',
      '#input-website',
      '[data-test="application-website"]'
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
