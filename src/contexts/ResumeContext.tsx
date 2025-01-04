import React, { createContext, useContext, useState } from 'react';

type ResumeData = {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    phonePrefix: string;
    location: string;
    country: string;
    city: string;
    address: string;
    zipCode: string;
    github: string;
    linkedin: string;
    dateOfBirth: string;
  };
  experience: any[];
  education: any[];
  skills: any[];
  projects: any[];
  certifications: any[];
};

const initialResumeData = {
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    phonePrefix: "",
    location: "",
    country: "",
    city: "",
    address: "",
    zipCode: "",
    github: "",
    linkedin: "",
    dateOfBirth: "",
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
};

type ResumeContextType = {
  resumeData: ResumeData;
  updateResumeData: (section: string, data: any) => void;
};

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider = ({ children }: { children: React.ReactNode }) => {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);

  const updateResumeData = (section: string, data: any) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: data,
    }));
  };

  return (
    <ResumeContext.Provider value={{ resumeData, updateResumeData }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};