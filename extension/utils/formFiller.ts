export const fieldMap = {
  name: [
    'input[name*="name" i]', 
    'input[id*="name" i]',
    'input[placeholder*="name" i]',
    'input[aria-label*="name" i]',
    '[data-test-form-element="name-input"]',
    '#input-applicant-name',
    '[data-test="application-name"]'
  ],
  email: [
    'input[type="email"]',
    'input[name*="email" i]',
    'input[id*="email" i]',
    'input[placeholder*="email" i]',
    '[data-test-form-element="email-input"]',
    '#input-email',
    '[data-test="application-email"]'
  ],
  phone: [
    'input[type="tel"]',
    'input[name*="phone" i]',
    'input[id*="phone" i]',
    'input[placeholder*="phone" i]',
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
    '[data-test-form-element="resume-input"]',
    '#input-resume',
    '[data-test="application-resume"]'
  ],
  experience: [
    'textarea[name*="experience" i]',
    'textarea[id*="experience" i]',
    'textarea[placeholder*="experience" i]',
    '[data-test-form-element="experience-input"]',
    '#input-experience',
    '[data-test="application-experience"]',
    'div[contenteditable][aria-label*="experience" i]'
  ],
  education: [
    'textarea[name*="education" i]',
    'textarea[id*="education" i]',
    'textarea[placeholder*="education" i]',
    '[data-test-form-element="education-input"]',
    '#input-education',
    '[data-test="application-education"]',
    'div[contenteditable][aria-label*="education" i]'
  ],
  skills: [
    'textarea[name*="skills" i]',
    'textarea[id*="skills" i]',
    'textarea[placeholder*="skills" i]',
    '[data-test-form-element="skills-input"]',
    '#input-skills',
    '[data-test="application-skills"]',
    'div[contenteditable][aria-label*="skills" i]'
  ],
  linkedin: [
    'input[name*="linkedin" i]',
    'input[placeholder*="linkedin" i]',
    'input[aria-label*="linkedin" i]',
    '[data-test-form-element="linkedin-input"]',
    '#input-linkedin',
    '[data-test="application-linkedin"]'
  ],
  website: [
    'input[name*="website" i]',
    'input[placeholder*="website" i]',
    'input[aria-label*="website" i]',
    '[data-test-form-element="website-input"]',
    '#input-website',
    '[data-test="application-website"]'
  ],
  visaStatus: [
    'select[name*="visa" i]',
    'select[id*="visa" i]',
    'select[name*="work-authorization" i]',
    '[data-test-form-element="visa-input"]',
    '#input-visa-status',
    '[data-test="application-visa"]'
  ],
  yearsOfExperience: [
    'select[name*="years-experience" i]',
    'select[id*="years-experience" i]',
    'input[name*="years-experience" i]',
    '[data-test-form-element="years-experience-input"]',
    '#input-years-experience',
    '[data-test="application-years-experience"]'
  ]
};

export function fillFormField(selector: string, value: string | null): void {
  if (!value) return;
  
  const element = document.querySelector(selector);
  if (!element) return;

  if (element instanceof HTMLSelectElement) {
    // Handle dropdown fields
    const options = Array.from(element.options);
    const bestMatch = options.find(option => 
      option.text.toLowerCase().includes(value.toLowerCase())
    );
    if (bestMatch) {
      element.value = bestMatch.value;
    }
  } else if (element.isContentEditable) {
    element.innerHTML = value;
  } else if (element instanceof HTMLTextAreaElement || element instanceof HTMLInputElement) {
    element.value = value;
  }

  // Dispatch events to trigger form validations
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
  
  // For React-based forms
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value"
  )?.set;
  if (nativeInputValueSetter) {
    nativeInputValueSetter.call(element, value);
  }
}