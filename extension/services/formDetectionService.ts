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
        selector: 'input[name*="name" i], input[id*="name" i], input[placeholder*="name" i]',
        type: 'text',
        valueType: 'string',
        dataPath: ['personalInfo', 'fullName']
      },
      {
        selector: 'input[type="email"], input[name*="email" i], input[placeholder*="email" i]',
        type: 'text',
        valueType: 'string',
        dataPath: ['personalInfo', 'email']
      },
      {
        selector: 'input[type="tel"], input[name*="phone" i], input[placeholder*="phone" i]',
        type: 'text',
        valueType: 'string',
        dataPath: ['personalInfo', 'phone']
      },
      {
        selector: 'input[name*="linkedin" i], input[placeholder*="linkedin" i]',
        type: 'text',
        valueType: 'string',
        dataPath: ['personalInfo', 'linkedin']
      },
      {
        selector: 'textarea[name*="experience" i], textarea[placeholder*="experience" i]',
        type: 'text',
        valueType: 'string',
        dataPath: ['experience']
      },
      {
        selector: 'textarea[name*="education" i], textarea[placeholder*="education" i]',
        type: 'text',
        valueType: 'string',
        dataPath: ['education']
      },
      {
        selector: 'textarea[name*="skills" i], textarea[placeholder*="skills" i]',
        type: 'text',
        valueType: 'string',
        dataPath: ['skills']
      }
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
    if (element instanceof HTMLInputElement) {
      switch (element.type) {
        case 'email':
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value));
        case 'tel':
          return /^[\d\s\-+()]+$/.test(String(value));
        default:
          return true;
      }
    }
    return true;
  }
}

export const formDetectionService = FormDetectionService.getInstance();