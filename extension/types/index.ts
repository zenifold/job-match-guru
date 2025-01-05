export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    linkedin: string;
    website: string;
    visaStatus?: string;
  };
  experience: Array<{
    position: string;
    company: string;
    startDate: string;
    endDate?: string;
    description: string;
  }>;
  education: Array<{
    school: string;
    degree: string;
    field: string;
    startDate: string;
    endDate?: string;
  }>;
  skills: string[];
}

export interface JobDetails {
  title: string;
  company: string;
  description: string;
  requirements?: string[];
}

export interface FormFieldMapping {
  selector: string;
  type: 'text' | 'select' | 'radio' | 'checkbox';
  valueType: 'string' | 'date' | 'boolean';
  dataPath: string[];
}