import { formDetectionService } from './services/formDetectionService';
import { dataTransformService } from './services/dataTransformService';
import { workdayFormService } from './services/workdayFormService';
import { findContent, extractStructuredData, extractRequirements } from './utils/contentExtractor';
import { selectors } from './utils/selectors';
import { handleSpecialInputs } from './utils/specialInputHandler';

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
  console.log('Starting job details extraction...');
  
  try {
    const jobTitle = findContent(selectors.title);
    console.log('Extracted job title:', jobTitle);
    
    const jobDescription = findContent(selectors.description);
    console.log('Extracted job description length:', jobDescription?.length);
    
    const company = findContent(selectors.company);
    console.log('Extracted company:', company);
    
    const requirements = extractRequirements();
    console.log('Extracted requirements:', requirements);
    
    const structuredData = extractStructuredData();
    console.log('Found structured data:', !!structuredData);

    if (structuredData) {
      const jobData = structuredData['@type'] === 'JobPosting' ? structuredData : structuredData.jobPosting;
      console.log('Using structured data for job details');
      
      return {
        success: true,
        jobTitle: jobTitle || jobData.title,
        jobDescription: jobDescription || jobData.description,
        company: company || (jobData.hiringOrganization && jobData.hiringOrganization.name)
      };
    }

    const result = {
      success: true,
      jobTitle,
      jobDescription: `${jobDescription}\n\nRequirements:\n${requirements}`,
      company
    };
    
    console.log('Final extracted job data:', result);
    return result;
  } catch (error) {
    console.error('Error extracting job details:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

async function autofillForm(data) {
  console.log('Starting form autofill with data:', data);
  
  try {
    // Transform the resume data
    console.log('Transforming resume data...');
    const transformedData = dataTransformService.transformResumeData(data);
    console.log('Transformed data:', transformedData);
    
    let detectedFields;
    
    // Check if this is a Workday page
    if (workdayFormService.isWorkdayPage()) {
      console.log('Detected Workday application form');
      
      // Navigate through Workday form sections
      await workdayFormService.navigateWorkdayForm();
      
      // Get Workday-specific field mappings
      detectedFields = workdayFormService.getWorkdayFields();
      console.log('Detected Workday fields:', detectedFields);
      
      // Handle Workday-specific elements
      await workdayFormService.handleWorkdaySpecifics();
    } else {
      // Use default form detection for non-Workday sites
      console.log('Using default form detection...');
      detectedFields = formDetectionService.detectFormFields();
      console.log('Detected fields:', detectedFields);
    }

    // Fill each detected field
    let filledFields = 0;
    for (const field of detectedFields) {
      const elements = document.querySelectorAll(field.selector);
      console.log(`Found ${elements.length} elements for selector: ${field.selector}`);
      
      for (const element of elements) {
        if (element instanceof HTMLElement) {
          const value = field.dataPath.reduce((obj, key) => obj?.[key], transformedData);
          console.log(`Attempting to fill field ${field.selector} with value:`, value);
          
          if (value !== undefined && formDetectionService.validateField(element, value)) {
            fillFormField(element, value, field.type);
            filledFields++;
          }
        }
      }
    }

    console.log(`Successfully filled ${filledFields} fields`);

    // Handle special inputs like radio buttons and checkboxes
    console.log('Handling special inputs...');
    handleSpecialInputs(data);

    console.log('Form autofill completed successfully');
  } catch (error) {
    console.error('Error during form autofill:', error);
    throw error;
  }
}

function fillFormField(element, value, type) {
  try {
    switch (type) {
      case 'text':
        if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
          const oldValue = element.value;
          element.value = value;
          element.dispatchEvent(new Event('input', { bubbles: true }));
          element.dispatchEvent(new Event('change', { bubbles: true }));
          console.log(`Filled text field: ${element.name || element.id}, old value: "${oldValue}", new value: "${value}"`);
        }
        break;
      case 'select':
        if (element instanceof HTMLSelectElement) {
          const options = Array.from(element.options);
          const bestMatch = options.find(option => 
            option.text.toLowerCase().includes(String(value).toLowerCase())
          );
          if (bestMatch) {
            const oldValue = element.value;
            element.value = bestMatch.value;
            element.dispatchEvent(new Event('change', { bubbles: true }));
            console.log(`Filled select field: ${element.name || element.id}, old value: "${oldValue}", new value: "${bestMatch.value}"`);
          } else {
            console.log(`No matching option found for select field: ${element.name || element.id}, value: "${value}"`);
          }
        }
        break;
    }
  } catch (error) {
    console.error(`Error filling field: ${element.name || element.id}`, error);
  }
}
