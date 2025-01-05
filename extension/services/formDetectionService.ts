import { FormFieldMapping } from '../types';

class FormDetectionService {
  private static instance: FormDetectionService;
  private fieldMappings: FormFieldMapping[];

  private constructor() {
    this.fieldMappings = [];
    this.initializeFieldMappings();
  }

  public static getInstance(): FormDetectionService {
    if (!FormDetectionService.instance) {
      FormDetectionService.instance = new FormDetectionService();
    }
    return FormDetectionService.instance;
  }

  private initializeFieldMappings() {
    this.fieldMappings = [
      {
        selector: 'input[name*="name" i], input[id*="name" i]',
        type: 'text',
        valueType: 'string',
        dataPath: ['personalInfo', 'fullName']
      },
      {
        selector: 'input[type="email"], input[name*="email" i]',
        type: 'text',
        valueType: 'string',
        dataPath: ['personalInfo', 'email']
      },
      // Add more field mappings as needed
    ];
  }

  public detectFormFields(): FormFieldMapping[] {
    const detectedFields: FormFieldMapping[] = [];
    
    this.fieldMappings.forEach(mapping => {
      const elements = document.querySelectorAll(mapping.selector);
      if (elements.length > 0) {
        detectedFields.push(mapping);
      }
    });

    return detectedFields;
  }

  public validateField(element: HTMLElement, value: any): boolean {
    // Add validation logic here
    return true;
  }
}

export const formDetectionService = FormDetectionService.getInstance();