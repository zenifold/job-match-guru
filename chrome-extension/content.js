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

// Function to handle form filling
async function fillApplicationForm(resumeData) {
  console.log("Filling application form with data:", resumeData);

  // Map resume data to Workday fields
  const fieldMappings = {
    'input[data-automation-id="firstName"]': resumeData.personalInfo?.firstName,
    'input[data-automation-id="lastName"]': resumeData.personalInfo?.lastName,
    'input[data-automation-id="email"]': resumeData.personalInfo?.email,
    'input[data-automation-id="phone"]': resumeData.personalInfo?.phone,
    'input[data-automation-id="address"]': resumeData.personalInfo?.address,
    'input[data-automation-id="city"]': resumeData.personalInfo?.city,
    'input[data-automation-id="postalCode"]': resumeData.personalInfo?.zipCode,
  };

  // Fill each field if it exists
  for (const [selector, value] of Object.entries(fieldMappings)) {
    const element = document.querySelector(selector);
    if (element && value) {
      element.value = value;
      // Trigger change event to ensure Workday registers the input
      element.dispatchEvent(new Event('change', { bubbles: true }));
      
      // Highlight the filled field
      element.classList.add('resume-optimizer-highlight');
      
      // Add tooltip
      const tooltip = document.createElement('div');
      tooltip.className = 'resume-optimizer-tooltip';
      tooltip.textContent = 'Auto-filled from your profile';
      element.parentElement.appendChild(tooltip);
      
      // Remove highlight and tooltip after 3 seconds
      setTimeout(() => {
        element.classList.remove('resume-optimizer-highlight');
        tooltip.remove();
      }, 3000);
    }
  }

  // Handle experience section if it exists
  const experienceContainer = document.querySelector('[data-automation-id="workExperienceSection"]');
  if (experienceContainer && resumeData.experience?.length > 0) {
    // Find or click "Add Experience" button if needed
    const addExperienceBtn = document.querySelector('[data-automation-id="Add Another"]');
    if (addExperienceBtn) {
      addExperienceBtn.click();
    }

    // Wait for fields to be available
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Fill experience fields
    resumeData.experience.forEach((exp, index) => {
      const expSection = document.querySelector(`[data-automation-id="workExperience-${index + 1}"]`);
      if (expSection) {
        const fields = {
          'jobTitle': exp.title,
          'company': exp.company,
          'startDate': exp.startDate,
          'endDate': exp.endDate,
          'description': exp.description
        };

        Object.entries(fields).forEach(([field, value]) => {
          const input = expSection.querySelector(`[data-automation-id="${field}"]`);
          if (input && value) {
            input.value = value;
            input.dispatchEvent(new Event('change', { bubbles: true }));
          }
        });
      }
    });
  }

  // Handle education section if it exists
  const educationContainer = document.querySelector('[data-automation-id="educationSection"]');
  if (educationContainer && resumeData.education?.length > 0) {
    // Similar logic for education fields
    resumeData.education.forEach((edu, index) => {
      const eduSection = document.querySelector(`[data-automation-id="education-${index + 1}"]`);
      if (eduSection) {
        const fields = {
          'school': edu.school,
          'degree': edu.degree,
          'field-of-study': edu.field,
          'startDate': edu.startDate,
          'endDate': edu.endDate,
          'gpa': edu.gpa
        };

        Object.entries(fields).forEach(([field, value]) => {
          const input = eduSection.querySelector(`[data-automation-id="${field}"]`);
          if (input && value) {
            input.value = value;
            input.dispatchEvent(new Event('change', { bubbles: true }));
          }
        });
      }
    });
  }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  const pageType = detectWorkdayPage();
  console.log("Current page type:", pageType);

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
      chrome.runtime.sendMessage({
        type: "LOG",
        message: `Error analyzing job: ${error.message}`
      });
      sendResponse({ success: false, error: error.message });
    }
  } else if (request.action === "autoFill" && pageType === 'application') {
    try {
      // Get the optimized resume data from storage
      chrome.storage.local.get(['optimizedResume'], async (result) => {
        if (result.optimizedResume) {
          await fillApplicationForm(result.optimizedResume);
          sendResponse({ success: true });
        } else {
          throw new Error('No optimized resume found. Please analyze a job first.');
        }
      });
    } catch (error) {
      console.error("Error auto-filling form:", error);
      chrome.runtime.sendMessage({
        type: "LOG",
        message: `Error auto-filling form: ${error.message}`
      });
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
    border: 2px solid #222222 !important;
    background-color: rgba(34, 34, 34, 0.05) !important;
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
    color: #222222;
    margin-top: 4px;
  }
`;
document.head.appendChild(style);