import { selectors } from './utils/selectors';
import { findContent, extractStructuredData, extractRequirements } from './utils/contentExtractor';
import { fieldMap, fillFormField } from './utils/formFiller';
import { handleSpecialInputs } from './utils/specialInputHandler';
import { formatFormData } from './utils/dataFormatter';
import { calculateYearsOfExperience } from './utils/experienceCalculator';

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
    const jobTitle = findContent(selectors.title);
    const jobDescription = findContent(selectors.description);
    const company = findContent(selectors.company);
    const requirements = extractRequirements();
    const structuredData = extractStructuredData();

    if (structuredData) {
      const jobData = structuredData['@type'] === 'JobPosting' ? structuredData : structuredData.jobPosting;
      return {
        success: true,
        jobTitle: jobTitle || jobData.title,
        jobDescription: jobDescription || jobData.description,
        company: company || (jobData.hiringOrganization && jobData.hiringOrganization.name)
      };
    }

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
  console.log('Starting form autofill with data:', data);
  
  const formData = formatFormData(data);

  // Attempt to fill each field type
  Object.entries(fieldMap).forEach(([field, selectors]) => {
    console.log(`Attempting to fill ${field} field`);
    for (const selector of selectors) {
      fillFormField(selector, formData[field]);
    }
  });

  // Handle special cases like radio buttons and checkboxes
  handleSpecialInputs(data);

  console.log('Form autofill completed');
}