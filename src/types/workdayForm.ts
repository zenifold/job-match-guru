import { Json } from '@/types/database';

export interface WorkdayFormData {
  [key: string]: any; // Add index signature for Json compatibility
  source?: {
    prompt?: string;
    country?: string;
  };
  personalInfo?: {
    prefix?: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    suffix?: string;
    hasPreferredName?: boolean;
    preferredName?: string;
  };
  address?: {
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
  };
  contact?: {
    email?: string;
    phoneType?: string;
    countryCode?: string;
    phoneNumber?: string;
    phoneExtension?: string;
  };
  experience?: Array<{
    company: string;
    title: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  education?: Array<{
    school: string;
    degree: string;
    field?: string;
    startDate?: string;
    endDate?: string;
    gpa?: string;
  }>;
  languages?: Array<{
    language: string;
    isNative: boolean;
    readingProficiency: string;
    speakingProficiency: string;
    writingProficiency: string;
    translationProficiency: string;
  }>;
  websites?: Array<{
    url: string;
  }>;
  applicationQuestions?: {
    [key: string]: string;
  };
  voluntaryDisclosures?: {
    [key: string]: boolean | string;
  };
}

export interface SectionProps {
  onChange?: (data: Partial<WorkdayFormData>) => void;
  value?: any;
}

export interface ApplicationQuestionsSectionProps extends SectionProps {
  employer?: string;
}