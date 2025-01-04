import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { PersonalInfoForm } from "@/components/resume/PersonalInfoForm";
import { ExperienceForm } from "@/components/resume/ExperienceForm";
import { EducationForm } from "@/components/resume/EducationForm";
import { SkillsForm } from "@/components/resume/SkillsForm";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";

const initialResumeData = {
  personalInfo: {
    fullName: "Maximilian Murphy",
    email: "maxkmurphy@gmail.com",
    phone: "757-620-7239",
    position: "Director of Product Management",
    summary: "Highly accomplished product and program leader with a proven track record of driving innovation, leading cross-functional teams, and delivering impactful results. Expert in full-cycle product development, strategic planning, and Agile methodologies. Demonstrated success in transforming ideas into revenue-generating products and optimizing processes for enhanced business performance. Adept at fostering collaboration, managing complex projects, and exceeding business objectives.",
  },
  experience: [
    {
      company: "SourceFuse",
      position: "Director of Product Management (US Market)",
      startDate: "2025-01",
      endDate: "",
      location: "Jacksonville FL (Remote, VA)",
      description: "Promoted because of my performance in client delivery success, ability to manage large multifaceted teams, juggle high-value responsibilities, and resolve risks in a timely manner.",
      keyResponsibilities: [
        "Direct the entire US client portfolio, overseeing a team of 6 direct reports each managing their own client engagements",
        "Continue to direct full-cycle product development and implementation of key client engagements",
        "Lead internal product innovation initiatives, building proof-of-concepts (PoCs)",
        "Identifying strategic use cases of AI, developing new products"
      ],
    },
    {
      company: "SourceFuse",
      position: "Senior Program Manager",
      startDate: "2024-03",
      endDate: "2025-01",
      location: "Jacksonville FL (Remote, VA)",
      description: "Managed a high-value portfolio of clients and delivery programs that generated over $6M in net profit annually for SourceFuse.",
      keyResponsibilities: [
        "Served as a strategic partner with clients",
        "Provided expertise in making technical design decisions",
        "Authored business requirement documents",
        "Conducted team meetings to proactively assess project progress"
      ],
    },
    // ... Additional experience entries can be added here
  ],
  education: [
    {
      school: "Quantic University",
      degree: "Masters of Business Administration",
      field: "MBA",
      startDate: "2023-01",
      endDate: "2024-06",
      location: "Online"
    },
    {
      school: "ECPI University",
      degree: "Bachelors of Science",
      field: "Computer Science",
      startDate: "2010-08",
      endDate: "2014-06",
      location: "Norfolk VA"
    }
  ],
  skills: [
    "Product Strategy",
    "Team Collaboration",
    "Agile Project Management",
    "AWS Services",
    "Product Development",
    "Saas Infrastructure",
    "Enterprise Architecture",
    "UX Research",
    "Systems & Design Thinking",
    "Front-End & Back-End Web Development",
    "Marketing Technology",
    "AI Technology",
    "Project Delivery",
    "Change Management",
    "SDLC",
    "UX/UI"
  ],
  certifications: [
    {
      name: "Professional Scrum Product Owner (PSPO I)",
      issuer: "Scrum.org",
      year: "2023"
    },
    {
      name: "AWS Cloud Practitioner Certification",
      issuer: "Amazon Web Services",
      year: "2021"
    },
    // ... Additional certifications can be added here
  ]
};

const Builder = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [resumeData, setResumeData] = useState(initialResumeData);

  const updateResumeData = (section: string, data: any) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: data,
    }));
  };

  const handlePreview = () => {
    navigate("/preview", { state: { resumeData } });
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Resume Builder</h1>
          <Button onClick={handlePreview} variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
        </div>
        <Card className="p-6">
          <div className="space-y-6">
            {step === 1 && (
              <PersonalInfoForm
                data={resumeData.personalInfo}
                onSave={(data) => {
                  updateResumeData("personalInfo", data);
                  setStep(2);
                }}
              />
            )}
            {step === 2 && (
              <ExperienceForm
                data={resumeData.experience}
                onSave={(data) => {
                  updateResumeData("experience", data);
                  setStep(3);
                }}
              />
            )}
            {step === 3 && (
              <EducationForm
                data={resumeData.education}
                onSave={(data) => {
                  updateResumeData("education", data);
                  setStep(4);
                }}
              />
            )}
            {step === 4 && (
              <SkillsForm
                data={resumeData.skills}
                onSave={(data) => {
                  updateResumeData("skills", data);
                }}
              />
            )}
          </div>
        </Card>
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => setStep((prev) => Math.max(1, prev - 1))}
            disabled={step === 1}
          >
            Previous
          </Button>
          <Button
            onClick={() => setStep((prev) => Math.min(4, prev + 1))}
            disabled={step === 4}
          >
            Next
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Builder;