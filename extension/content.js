import { formDetectionService } from './services/formDetectionService';
import { dataTransformService } from './services/dataTransformService';
import { findContent, extractStructuredData, extractRequirements } from './utils/contentExtractor';
import { selectors } from './utils/selectors';

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
  
  try {
    // Transform the resume data
    const transformedData = dataTransformService.transformResumeData(data);
    
    // Detect form fields
    const detectedFields = formDetectionService.detectFormFields();
    
    // Fill each detected field
    detectedFields.forEach(field => {
      const elements = document.querySelectorAll(field.selector);
      elements.forEach(element => {
        if (element instanceof HTMLElement) {
          const value = field.dataPath.reduce((obj, key) => obj?.[key], transformedData);
          
          if (value !== undefined && formDetectionService.validateField(element, value)) {
            fillFormField(element, value, field.type);
          }
        }
      });
    });

    console.log('Form autofill completed successfully');
  } catch (error) {
    console.error('Error during form autofill:', error);
  }
}

function fillFormField(element: HTMLElement, value: any, type: string) {
  switch (type) {
    case 'text':
      if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
        element.value = value;
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
      }
      break;
    case 'select':
      if (element instanceof HTMLSelectElement) {
        const options = Array.from(element.options);
        const bestMatch = options.find(option => 
          option.text.toLowerCase().includes(String(value).toLowerCase())
        );
        if (bestMatch) {
          element.value = bestMatch.value;
          element.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
      break;
    // Add more cases for other input types
  }
}