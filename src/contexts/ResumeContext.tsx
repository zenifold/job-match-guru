import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  skills: string[];
  projects: any[];
  certifications: any[];
};

const initialResumeData = {
  personalInfo: {
    fullName: "Maximilian Murphy",
    email: "maxkmurphy@gmail.com",
    phone: "(757) 620-7239",
    phonePrefix: "+1",
    location: "Roanoke, VA, USA",
    country: "USA",
    city: "Roanoke",
    address: "",
    zipCode: "",
    github: "",
    linkedin: "linkedin.com/in/maximilian-murphy/",
    dateOfBirth: "",
  },
  experience: [
    {
      company: "SourceFuse",
      position: "Senior Program Manager",
      startDate: "2024-01",
      endDate: "2024-12",
      description: "Managed a high-value portfolio of clients and delivery programs that generated over $6M in net profit annually for SourceFuse.",
      location: "Remote",
      industry: "Technology",
      keyResponsibilities: [
        "Served as a strategic partner with clients to translate their complex business requirements into actionable product requirements",
        "Provided expertise in making technical design decisions",
        "Authored business requirement documents and drove consensus with leadership"
      ],
      skillsAcquired: ["Program Management", "Strategic Planning", "Technical Leadership"]
    },
    // ... Add other experiences similarly
  ],
  education: [
    {
      school: "Quantic University",
      degree: "MBA",
      field: "Business",
      startDate: "2023-02",
      endDate: "2024-06",
      finalEvaluationGrade: "",
      exams: []
    },
    {
      school: "ECPI University",
      degree: "Bachelor's",
      field: "Computer Science",
      startDate: "2010-09",
      endDate: "2014-06",
      finalEvaluationGrade: "3.0",
      exams: []
    }
  ],
  skills: [
    "Program Management",
    "Product Management",
    "Agile/Scrum",
    "Strategic Planning",
    "Technical Leadership",
    "Business Analysis",
    "Software Development",
    "Project Management",
    "Cross-functional Team Leadership",
    "Digital Transformation"
  ],
  projects: [
    {
      name: "Oral Genome Mobile App Development",
      description: "Led the vision and execution of a groundbreaking health tech app for saliva-based diagnostics",
      startDate: "2024-06",
      endDate: "2024-12",
      url: "",
      technologies: ["Mobile Development", "AI", "Healthcare Tech"]
    },
    // ... Add other projects similarly
  ],
  certifications: []
};

type ResumeContextType = {
  resumeData: ResumeData;
  updateResumeData: (section: string, data: any) => void;
};

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider = ({ children }: { children: React.ReactNode }) => {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const session = useSession();
  const { toast } = useToast();

  useEffect(() => {
    const loadSavedResume = async () => {
      if (!session?.user?.id) return;

      try {
        console.log('Loading resume for user:', session.user.id);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('content')
          .eq('user_id', session.user.id)
          .eq('is_master', true)  // Only get the master profile
          .maybeSingle();  // Use maybeSingle instead of single

        if (error) {
          console.error('Error loading resume:', error);
          toast({
            title: "Error Loading Resume",
            description: "Failed to load your resume data. Please try again.",
            variant: "destructive",
          });
          return;
        }

        if (!data) {
          console.log('No master profile found');
          toast({
            title: "No Master Profile",
            description: "Please create a master profile first.",
          });
          return;
        }

        console.log('Resume loaded successfully');
        setResumeData(data.content as ResumeData);
        toast({
          title: "Resume Loaded",
          description: "Your saved resume data has been loaded.",
        });
      } catch (error) {
        console.error('Error in loadSavedResume:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred while loading your resume.",
          variant: "destructive",
        });
      }
    };

    loadSavedResume();
  }, [session?.user?.id, toast]);

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