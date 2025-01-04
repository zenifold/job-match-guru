import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { PersonalInfoForm } from "@/components/resume/PersonalInfoForm";
import { ExperienceForm } from "@/components/resume/ExperienceForm";
import { EducationForm } from "@/components/resume/EducationForm";
import { SkillsForm } from "@/components/resume/SkillsForm";
import { ProjectsForm } from "@/components/resume/ProjectsForm";
import { CertificationsForm } from "@/components/resume/CertificationsForm";
import { BuilderActions } from "@/components/resume/BuilderActions";
import { ResumeProvider, useResume } from "@/contexts/ResumeContext";
import { Button } from "@/components/ui/button";

const BuilderContent = () => {
  const [step, setStep] = useState(1);
  const { resumeData, updateResumeData } = useResume();

  const renderStep = () => {
    switch (step) {
      case 1:
        return <PersonalInfoForm 
          data={resumeData.personalInfo} 
          onSave={(data) => {
            updateResumeData('personalInfo', data);
            setStep(2);
          }} 
        />;
      case 2:
        return <ExperienceForm 
          data={resumeData.experience} 
          onSave={(data) => {
            updateResumeData('experience', data);
            setStep(3);
          }} 
        />;
      case 3:
        return <EducationForm 
          data={resumeData.education} 
          onSave={(data) => {
            updateResumeData('education', data);
            setStep(4);
          }} 
        />;
      case 4:
        return <ProjectsForm 
          data={resumeData.projects} 
          onSave={(data) => {
            updateResumeData('projects', data);
            setStep(5);
          }} 
        />;
      case 5:
        return <CertificationsForm 
          data={resumeData.certifications} 
          onSave={(data) => {
            updateResumeData('certifications', data);
            setStep(6);
          }} 
        />;
      case 6:
        return <SkillsForm 
          data={resumeData.skills} 
          onSave={(data) => {
            updateResumeData('skills', data);
          }} 
        />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Resume Builder</h1>
        <BuilderActions 
          step={step} 
          setStep={setStep} 
          isLastStep={step === 6} 
        />
      </div>
      <Card className="p-6">
        <div className="space-y-6">
          {renderStep()}
        </div>
      </Card>
      <div className="flex justify-between mt-6 pb-6">
        <Button
          variant="outline"
          onClick={() => setStep(step - 1)}
          disabled={step === 1}
        >
          Previous
        </Button>
        {step === 6 ? null : (
          <Button
            onClick={() => setStep(step + 1)}
            disabled={step === 6}
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
};

const Builder = () => {
  return (
    <MainLayout>
      <ResumeProvider>
        <BuilderContent />
      </ResumeProvider>
    </MainLayout>
  );
};

export default Builder;