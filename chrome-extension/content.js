import { mapProfileToWorkdayFields } from './profileUtils.js';
import { fillField, validateFieldValue } from './utils/form.js';

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

// Function to handle form filling
async function fillApplicationForm(profile) {
  console.log("Starting form fill process");
  
  try {
    // Map profile data to Workday fields
    const mappedData = mapProfileToWorkdayFields(profile);
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
    await fillField('[data-automation-id="linkedin"]', mappedData.personalInfo.linkedin);
    await fillField('[data-automation-id="github"]', mappedData.personalInfo.github);

    // Experience
    if (mappedData.experience) {
      for (const [index, exp] of mappedData.experience.entries()) {
        await fillField(`[data-automation-id="workExperience.${index}.title"]`, exp.jobTitle);
        await fillField(`[data-automation-id="workExperience.${index}.company"]`, exp.company);
        await fillField(`[data-automation-id="workExperience.${index}.location"]`, exp.location);
        await fillField(`[data-automation-id="workExperience.${index}.startDate"]`, exp.startDate);
        await fillField(`[data-automation-id="workExperience.${index}.endDate"]`, exp.endDate);
        await fillField(`[data-automation-id="workExperience.${index}.description"]`, exp.description);
      }
    }

    // Education
    if (mappedData.education) {
      for (const [index, edu] of mappedData.education.entries()) {
        await fillField(`[data-automation-id="education.${index}.school"]`, edu.school);
        await fillField(`[data-automation-id="education.${index}.degree"]`, edu.degree);
        await fillField(`[data-automation-id="education.${index}.field"]`, edu.field);
        await fillField(`[data-automation-id="education.${index}.startDate"]`, edu.startDate);
        await fillField(`[data-automation-id="education.${index}.endDate"]`, edu.endDate);
        await fillField(`[data-automation-id="education.${index}.gpa"]`, edu.gpa);
      }
    }

    // Skills
    if (mappedData.skills) {
      await fillField('[data-automation-id="skills"]', mappedData.skills.join(', '));
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
    if (request.action === "autoFill") {
      const success = await fillApplicationForm(request.profile);
      sendResponse({ success });
    }
  } catch (error) {
    console.error("Error in message listener:", error);
    sendResponse({ success: false, error: error.message });
  }
  return true;
});