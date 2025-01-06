import { mapProfileToWorkdayFields } from './profileUtils.js';
import { fillField, validateFieldValue } from './utils/form.js';
import { getSupabase } from './utils/supabase.js';

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
  try {
    const jobTitle = document.querySelector('[data-automation-id="jobTitle"]')?.textContent;
    const jobDescription = document.querySelector('[data-automation-id="jobDescription"]')?.textContent;
    const company = document.querySelector('[data-automation-id="companyName"]')?.textContent;

    return {
      title: jobTitle || 'Unknown Title',
      description: jobDescription || '',
      company: company || 'Unknown Company',
      url: window.location.href
    };
  } catch (error) {
    console.error('Error extracting job details:', error);
    throw error;
  }
}

// Function to handle form filling
async function fillApplicationForm() {
  console.log("Starting form fill process");
  
  try {
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

    // Experience - with enhanced error handling and retry logic
    for (const [index, exp] of mappedData.experience.entries()) {
      // Try different possible selectors for work experience fields
      const selectors = [
        `[data-automation-id="workExperience.${index}.title"]`,
        `[data-automation-id="experience.${index}.jobTitle"]`,
        `[data-automation-id="workHistory.${index}.position"]`
      ];

      // Try each selector until one works
      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) {
          await fillField(selector, exp.jobTitle);
          break;
        }
      }

      // Company name
      await fillField(`[data-automation-id="workExperience.${index}.company"]`, exp.company);
      await fillField(`[data-automation-id="workExperience.${index}.location"]`, exp.location);
      
      // Dates with proper formatting
      await fillField(`[data-automation-id="workExperience.${index}.startDate"]`, exp.startDate);
      if (!exp.currentlyWorkHere) {
        await fillField(`[data-automation-id="workExperience.${index}.endDate"]`, exp.endDate);
      }
      
      // Description with proper formatting
      const description = Array.isArray(exp.description) 
        ? exp.description.join('\n• ')
        : exp.description;
      await fillField(`[data-automation-id="workExperience.${index}.description"]`, description);

      // Handle "Current Position" checkbox if it exists
      const currentPositionSelector = `[data-automation-id="workExperience.${index}.currentPosition"]`;
      if (document.querySelector(currentPositionSelector)) {
        await fillField(currentPositionSelector, exp.currentlyWorkHere);
      }
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
  try {
    const pageType = detectWorkdayPage();
    console.log("Current page type:", pageType);

    if (request.action === "analyzeJob" && pageType === 'jobDetails') {
      const jobDetails = await extractJobDetails();
      console.log("Extracted job details:", jobDetails);
      
      const supabase = await getSupabase();
      chrome.runtime.sendMessage({
        type: "ANALYZE_JOB",
        data: jobDetails
      });
      
      sendResponse({ success: true });
    } else if (request.action === "autoFill" && pageType === 'application') {
      const success = await fillApplicationForm();
      sendResponse({ success });
    } else {
      sendResponse({ success: false, error: 'Invalid action or page type' });
    }
  } catch (error) {
    console.error("Error in message listener:", error);
    sendResponse({ success: false, error: error.message });
  }
  
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

  .resume-optimizer-success {
    border-color: #10b981 !important;
    background-color: rgba(16, 185, 129, 0.1) !important;
  }

  .resume-optimizer-error {
    border-color: #ef4444 !important;
    background-color: rgba(239, 68, 68, 0.1) !important;
  }
`;
document.head.appendChild(style);
