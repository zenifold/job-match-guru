import { Json } from '@/types/database';

export interface WorkdayFormData {
  personalInfo: {
    firstName: string;
    middleName: string;
    lastName: string;
    preferredName: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    email: string;
    phoneType: string;
    phoneNumber: string;
    phoneExtension: string;
    previouslyEmployed: boolean;
  };
  experience: Array<{
    company: string;
    title: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    school: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa: string;
  }>;
}

export interface WorkdayProfile {
  id?: string;
  user_id?: string;
  content: WorkdayFormData;
  created_at?: string;
  updated_at?: string;
}

// Type guard to ensure proper JSON conversion
export function isWorkdayFormData(data: Json): data is WorkdayFormData {
  const d = data as WorkdayFormData;
  return (
    d &&
    typeof d === 'object' &&
    'personalInfo' in d &&
    'experience' in d &&
    'education' in d
  );
}