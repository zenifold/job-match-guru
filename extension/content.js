import { selectors } from './utils/selectors';
import { findContent, extractStructuredData, extractRequirements } from './utils/contentExtractor';
import { fieldMap, fillFormField } from './utils/formFiller';

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
  Object.entries(fieldMap).forEach(([field, selectors]) => {
    for (const selector of selectors) {
      fillFormField(selector, data[field]);
    }
  });
  console.log('Form autofill completed');
}