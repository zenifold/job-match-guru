import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { PersonalInfoForm } from "@/components/resume/PersonalInfoForm";
import { ExperienceForm } from "@/components/resume/ExperienceForm";
import { EducationForm } from "@/components/resume/EducationForm";
import { SkillsForm } from "@/components/resume/SkillsForm";
import { ProjectsForm } from "@/components/resume/ProjectsForm";
import { CertificationsForm } from "@/components/resume/CertificationsForm";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";

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
                data={resumeData.experience || []}
                onSave={(data) => {
                  updateResumeData("experience", data);
                  setStep(3);
                }}
              />
            )}
            {step === 3 && (
              <EducationForm
                data={resumeData.education || []}
                onSave={(data) => {
                  updateResumeData("education", data);
                  setStep(4);
                }}
              />
            )}
            {step === 4 && (
              <ProjectsForm
                data={resumeData.projects || []}
                onSave={(data) => {
                  updateResumeData("projects", data);
                  setStep(5);
                }}
              />
            )}
            {step === 5 && (
              <CertificationsForm
                data={resumeData.certifications || []}
                onSave={(data) => {
                  updateResumeData("certifications", data);
                  setStep(6);
                }}
              />
            )}
            {step === 6 && (
              <SkillsForm
                data={resumeData.skills || []}
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
            onClick={() => setStep((prev) => Math.min(6, prev + 1))}
            disabled={step === 6}
          >
            Next
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Builder;