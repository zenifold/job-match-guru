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
  console.log('Starting form autofill with data:', data);
  
  // Map resume data to form fields
  const formData = {
    name: `${data.personalInfo?.fullName || ''}`,
    email: data.personalInfo?.email || '',
    phone: data.personalInfo?.phone || '',
    linkedin: data.personalInfo?.linkedin || '',
    website: data.personalInfo?.website || '',
    experience: data.experience?.map(exp => 
      `${exp.position} at ${exp.company} (${exp.startDate} - ${exp.endDate || 'Present'})\n${exp.description}`
    ).join('\n\n'),
    education: data.education?.map(edu =>
      `${edu.degree} in ${edu.field} from ${edu.school} (${edu.startDate} - ${edu.endDate || 'Present'})`
    ).join('\n\n'),
    skills: data.skills?.join(', ') || '',
    visaStatus: data.personalInfo?.visaStatus || '',
    yearsOfExperience: calculateYearsOfExperience(data.experience)
  };

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

function calculateYearsOfExperience(experience) {
  if (!experience?.length) return '0-2';
  
  const totalMonths = experience.reduce((total, exp) => {
    const startDate = new Date(exp.startDate);
    const endDate = exp.endDate ? new Date(exp.endDate) : new Date();
    const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                  (endDate.getMonth() - startDate.getMonth());
    return total + months;
  }, 0);
  
  const years = Math.floor(totalMonths / 12);
  
  if (years < 2) return '0-2';
  if (years < 5) return '3-5';
  if (years < 10) return '5-10';
  return '10+';
}

function handleSpecialInputs(data) {
  // Handle radio buttons
  const radioGroups = document.querySelectorAll('input[type="radio"]');
  radioGroups.forEach(radio => {
    const name = radio.getAttribute('name')?.toLowerCase();
    if (!name) return;
    
    if (name.includes('visa') || name.includes('work')) {
      const value = radio.value.toLowerCase();
      if (value.includes(data.personalInfo?.visaStatus?.toLowerCase())) {
        radio.checked = true;
        radio.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  });

  // Handle checkboxes
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    const label = checkbox.parentElement?.textContent?.toLowerCase();
    if (!label) return;
    
    // Match skills
    if (data.skills?.some(skill => label.includes(skill.toLowerCase()))) {
      checkbox.checked = true;
      checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
}