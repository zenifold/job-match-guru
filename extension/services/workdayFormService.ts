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
    console.log('Detecting Workday form fields...');
    
    return [
      // Personal Information
      {
        selector: 'input[data-automation-id*="firstName"], input[name*="firstName"]',
        type: 'text',
        valueType: 'string',
        dataPath: ['personalInfo', 'firstName']
      },
      {
        selector: 'input[data-automation-id*="lastName"], input[name*="lastName"]',
        type: 'text',
        valueType: 'string',
        dataPath: ['personalInfo', 'lastName']
      },
      {
        selector: 'input[data-automation-id*="email"], input[type="email"]',
        type: 'text',
        valueType: 'string',
        dataPath: ['personalInfo', 'email']
      },
      {
        selector: 'input[data-automation-id*="phone"], input[type="tel"]',
        type: 'text',
        valueType: 'string',
        dataPath: ['personalInfo', 'phone']
      },
      // Experience
      {
        selector: 'textarea[data-automation-id*="experience"], textarea[name*="workExperience"]',
        type: 'text',
        valueType: 'string',
        dataPath: ['experience']
      },
      // Education
      {
        selector: 'textarea[data-automation-id*="education"], textarea[name*="education"]',
        type: 'text',
        valueType: 'string',
        dataPath: ['education']
      },
      // Skills
      {
        selector: 'textarea[data-automation-id*="skills"], textarea[name*="skills"]',
        type: 'text',
        valueType: 'string',
        dataPath: ['skills']
      },
      // Resume Upload
      {
        selector: 'input[type="file"][data-automation-id*="resume"], input[type="file"][accept*=".pdf"]',
        type: 'file',
        valueType: 'file',
        dataPath: ['resume']
      }
    ];
  }

  public async navigateWorkdayForm(): Promise<void> {
    console.log('Navigating Workday form sections...');
    
    const sections = Array.from(document.querySelectorAll('[data-automation-id*="section"]'));
    
    for (const section of sections) {
      try {
        // Click to expand section if needed
        if (section instanceof HTMLElement) {
          section.click();
          // Wait for section to expand
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        console.log('Navigated to section:', section.textContent);
      } catch (error) {
        console.error('Error navigating section:', error);
      }
    }
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
  }
}

export const workdayFormService = WorkdayFormService.getInstance();