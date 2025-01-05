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
  ]
};

export function fillFormField(selector: string, value: string): void {
  const element = document.querySelector(selector);
  if (element) {
    if (element.isContentEditable) {
      element.innerHTML = value || '';
    } else {
      (element as HTMLInputElement).value = value || '';
    }
    element.dispatchEvent(new Event('change', { bubbles: true }));
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }
}