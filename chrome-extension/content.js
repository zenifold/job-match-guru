import { mapProfileToWorkdayFields } from './profileUtils.js';

// Helper function to detect page type
function detectWorkdayPage() {
  const url = window.location.href;
  if (url.includes('/job/')) {
    return 'jobDetails';
  } else if (url.includes('/apply/')) {
    return 'application';
  }
  return null;
}

// Function to extract job details
async function extractJobDetails() {
  const jobTitle = document.querySelector('[data-automation-id="jobTitle"]')?.textContent;
  const jobDescription = document.querySelector('[data-automation-id="jobDescription"]')?.textContent;
  const company = document.querySelector('[data-automation-id="companyName"]')?.textContent;

  return {
    title: jobTitle || 'Unknown Title',
    description: jobDescription || '',
    company: company || 'Unknown Company',
    url: window.location.href
  };
}

// Function to fill form fields with retry mechanism
async function fillField(selector, value, maxRetries = 3) {
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
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
      }
    }
  }
  return false;
}

// Function to handle form filling
async function fillApplicationForm() {
  console.log("Starting form fill process");
  
  // Get profile data from storage
  const { profileData } = await chrome.storage.local.get(['profileData']);
  if (!profileData) {
    throw new Error('No profile data found');
  }

  // Map profile data to Workday fields
  const mappedData = mapProfileToWorkdayFields(profileData);
  if (!mappedData) {
    throw new Error('Failed to map profile data');
  }

  console.log("Mapped data:", mappedData);

  try {
    // Personal Information
    await fillField('[data-automation-id="firstName"]', mappedData.personalInfo.firstName);
    await fillField('[data-automation-id="lastName"]', mappedData.personalInfo.lastName);
    await fillField('[data-automation-id="email"]', mappedData.personalInfo.email);
    await fillField('[data-automation-id="phone"]', mappedData.personalInfo.phone);
    await fillField('[data-automation-id="address"]', mappedData.personalInfo.address);
    await fillField('[data-automation-id="city"]', mappedData.personalInfo.city);
    await fillField('[data-automation-id="state"]', mappedData.personalInfo.state);
    await fillField('[data-automation-id="postalCode"]', mappedData.personalInfo.zipCode);
    await fillField('[data-automation-id="country"]', mappedData.personalInfo.country);

    // Social Links
    await fillField('[data-automation-id="linkedin"]', mappedData.personalInfo.linkedin);
    await fillField('[data-automation-id="github"]', mappedData.personalInfo.github);

    // Experience
    for (const [index, exp] of mappedData.experience.entries()) {
      await fillField(`[data-automation-id="workExperience.${index}.title"]`, exp.jobTitle);
      await fillField(`[data-automation-id="workExperience.${index}.company"]`, exp.company);
      await fillField(`[data-automation-id="workExperience.${index}.location"]`, exp.location);
      await fillField(`[data-automation-id="workExperience.${index}.startDate"]`, exp.startDate);
      await fillField(`[data-automation-id="workExperience.${index}.endDate"]`, exp.endDate);
      await fillField(`[data-automation-id="workExperience.${index}.description"]`, exp.description);
    }

    // Education
    for (const [index, edu] of mappedData.education.entries()) {
      await fillField(`[data-automation-id="education.${index}.school"]`, edu.school);
      await fillField(`[data-automation-id="education.${index}.degree"]`, edu.degree);
      await fillField(`[data-automation-id="education.${index}.field"]`, edu.field);
      await fillField(`[data-automation-id="education.${index}.startDate"]`, edu.startDate);
      await fillField(`[data-automation-id="education.${index}.endDate"]`, edu.endDate);
      await fillField(`[data-automation-id="education.${index}.gpa"]`, edu.gpa);
    }

    // Skills
    const skillsField = document.querySelector('[data-automation-id="skills"]');
    if (skillsField && mappedData.skills.length > 0) {
      skillsField.value = mappedData.skills.join(', ');
      skillsField.dispatchEvent(new Event('change', { bubbles: true }));
    }

    console.log("Form fill completed successfully");
    return true;
  } catch (error) {
    console.error("Error filling form:", error);
    throw error;
  }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  const pageType = detectWorkdayPage();
  console.log("Current page type:", pageType);

  // Check authentication first
  const { authToken } = await chrome.storage.local.get(['authToken']);
  if (!authToken && request.action !== 'checkAuth') {
    sendResponse({ success: false, error: 'Not authenticated' });
    return true;
  }

  if (request.action === "analyzeJob" && pageType === 'jobDetails') {
    try {
      const jobDetails = await extractJobDetails();
      console.log("Extracted job details:", jobDetails);
      
      // Send job details to background script for processing
      chrome.runtime.sendMessage({
        type: "ANALYZE_JOB",
        data: jobDetails
      });
      
      sendResponse({ success: true });
    } catch (error) {
      console.error("Error analyzing job:", error);
      sendResponse({ success: false, error: error.message });
    }
  } else if (request.action === "autoFill" && pageType === 'application') {
    try {
      const success = await fillApplicationForm();
      sendResponse({ success });
    } catch (error) {
      console.error("Error auto-filling form:", error);
      sendResponse({ success: false, error: error.message });
    }
  }
  
  // Return true to indicate we'll send a response asynchronously
  return true;
});

// Add styles for the extension UI elements
const style = document.createElement('style');
style.textContent = `
  .resume-optimizer-highlight {
    border: 2px solid #6366f1 !important;
    background-color: rgba(99, 102, 241, 0.1) !important;
    transition: all 0.3s ease;
  }
  
  .resume-optimizer-tooltip {
    position: absolute;
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 8px 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    z-index: 10000;
    font-size: 14px;
    color: #1a202c;
  }
`;
document.head.appendChild(style);