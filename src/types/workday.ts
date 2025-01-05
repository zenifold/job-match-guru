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

export type WorkdayProfile = {
  id?: string;
  user_id?: string;
  content: WorkdayFormData;
  created_at?: string;
  updated_at?: string;
};