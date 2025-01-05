import { Json } from '@/types/database';

// Define the shape of the form data
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

// Interface for the database record
export interface WorkdayProfile {
  id?: string;
  user_id?: string;
  content: Json;
  created_at?: string;
  updated_at?: string;
}

// Type guard to safely convert Json to WorkdayFormData
export function isWorkdayFormData(data: unknown): data is WorkdayFormData {
  const d = data as WorkdayFormData;
  return (
    d !== null &&
    typeof d === 'object' &&
    'personalInfo' in d &&
    'experience' in d &&
    'education' in d &&
    Array.isArray(d.experience) &&
    Array.isArray(d.education)
  );
}