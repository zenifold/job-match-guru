import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { PersonalInfoForm } from "@/components/resume/PersonalInfoForm";
import { ExperienceForm } from "@/components/resume/ExperienceForm";
import { EducationForm } from "@/components/resume/EducationForm";
import { SkillsForm } from "@/components/resume/SkillsForm";
import { ResumePreview } from "@/components/resume/ResumePreview";

const Builder = () => {
  const [step, setStep] = useState(1);
  const [resumeData, setResumeData] = useState({
    personalInfo: {},
    experience: [],
    education: [],
    skills: [],
  });

  const updateResumeData = (section: string, data: any) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: data,
    }));
  };

  return (
    <MainLayout>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
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
          <div className="flex justify-between">
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
        <div className="lg:sticky lg:top-6 space-y-6">
          <ResumePreview data={resumeData} />
        </div>
      </div>
    </MainLayout>
  );
};

export default Builder;