import { FormFieldMapping } from '../types';

class WorkdayFormService {
  private static instance: WorkdayFormService;

  private constructor() {}

  public static getInstance(): WorkdayFormService {
    if (!WorkdayFormService.instance) {
      WorkdayFormService.instance = new WorkdayFormService();
    }
    return WorkdayFormService.instance;
  }

  public isWorkdayPage(): boolean {
    return window.location.hostname.includes('workday') || 
           document.querySelector('meta[name="workday"]') !== null;
  }

  public getWorkdayFields(): FormFieldMapping[] {
    console.log('Detecting Workday form fields for My Information page...');
    
    return [
      // Personal Information Section
      {
        selector: '[data-automation-id="firstName"], input[name*="firstName"], [aria-label*="First Name"]',
        type: 'text',
        valueType: 'string',
        dataPath: ['personalInfo', 'firstName']
      },
      {
        selector: '[data-automation-id="lastName"], input[name*="lastName"], [aria-label*="Last Name"]',
        type: 'text',
        valueType: 'string',
        dataPath: ['personalInfo', 'lastName']
      },
      {
        selector: '[data-automation-id="addressLine1"], input[name*="addressLine1"], [aria-label*="Address Line 1"]',
        type: 'text',
        valueType: 'string',
        dataPath: ['personalInfo', 'address']
      },
      {
        selector: '[data-automation-id="city"], input[name*="city"], [aria-label*="City"]',
        type: 'text',
        valueType: 'string',
        dataPath: ['personalInfo', 'city']
      },
      {
        selector: '[data-automation-id="postalCode"], input[name*="postalCode"], [aria-label*="Postal Code"]',
        type: 'text',
        valueType: 'string',
        dataPath: ['personalInfo', 'zipCode']
      },
      {
        selector: '[data-automation-id="email"], input[type="email"], [aria-label*="Email"]',
        type: 'text',
        valueType: 'string',
        dataPath: ['personalInfo', 'email']
      },
      {
        selector: '[data-automation-id="phone"], input[type="tel"], [aria-label*="Phone Number"]',
        type: 'text',
        valueType: 'string',
        dataPath: ['personalInfo', 'phone']
      }
    ];
  }

  public async navigateWorkdayForm(): Promise<void> {
    console.log('Navigating Workday form sections...');
    
    // Handle radio button for previous employment
    const previousEmploymentNo = document.querySelector('input[type="radio"][value="No"]');
    if (previousEmploymentNo instanceof HTMLInputElement) {
      previousEmploymentNo.click();
      console.log('Selected "No" for previous employment');
    }

    // Handle phone type dropdown
    const phoneTypeDropdown = document.querySelector('[data-automation-id="phoneDeviceType"]');
    if (phoneTypeDropdown instanceof HTMLElement) {
      phoneTypeDropdown.click();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mobileOption = document.querySelector('[data-automation-id*="mobile"]');
      if (mobileOption instanceof HTMLElement) {
        mobileOption.click();
        console.log('Selected Mobile as phone type');
      }
    }

    // Handle country code selection
    const countryCodeDropdown = document.querySelector('[data-automation-id="countryPhoneCode"]');
    if (countryCodeDropdown instanceof HTMLElement) {
      countryCodeDropdown.click();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const usOption = document.querySelector('[data-automation-id*="United States"]');
      if (usOption instanceof HTMLElement) {
        usOption.click();
        console.log('Selected United States phone code');
      }
    }

    // Handle state selection
    const stateDropdown = document.querySelector('[data-automation-id="state"]');
    if (stateDropdown instanceof HTMLElement) {
      stateDropdown.click();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get state from personal info and select it
      const stateOption = document.querySelector(`[data-automation-id*="${this.getStateFromPersonalInfo()}"]`);
      if (stateOption instanceof HTMLElement) {
        stateOption.click();
        console.log('Selected state from personal info');
      }
    }
  }

  private getStateFromPersonalInfo(): string {
    // Extract state from location string (e.g., "Roanoke, VA, USA" -> "Virginia")
    const stateAbbreviations: { [key: string]: string } = {
      'VA': 'Virginia',
      // Add more state mappings as needed
    };

    const location = document.querySelector('[data-automation-id="location"]')?.textContent;
    if (location) {
      const match = location.match(/,\s*([A-Z]{2}),/);
      if (match && match[1] in stateAbbreviations) {
        return stateAbbreviations[match[1]];
      }
    }
    return '';
  }

  public async handleWorkdaySpecifics(): Promise<void> {
    console.log('Handling Workday-specific form elements...');
    
    // Handle any popup dialogs
    const handleDialog = () => {
      const dialog = document.querySelector('[data-automation-id*="dialog"]');
      if (dialog instanceof HTMLElement) {
        const confirmButton = dialog.querySelector('button[data-automation-id*="confirm"]');
        if (confirmButton instanceof HTMLElement) {
          confirmButton.click();
        }
      }
    };

    // Set up observer for dynamic content
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          handleDialog();
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Initial check
    handleDialog();

    console.log('Workday specific handlers set up successfully');
  }
}

export const workdayFormService = WorkdayFormService.getInstance();