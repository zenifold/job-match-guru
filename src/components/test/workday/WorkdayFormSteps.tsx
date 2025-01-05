import { WorkdayFormData, SectionProps } from "@/types/workdayForm";
import { SourceSection } from "./SourceSection";
import { LegalNameSection } from "./LegalNameSection";
import { AddressSection } from "./AddressSection";
import { ContactSection } from "./ContactSection";
import { ExperienceSection } from "./ExperienceSection";
import { EducationSection } from "./EducationSection";
import { LanguagesSection } from "./LanguagesSection";
import { WebsitesSection } from "./WebsitesSection";
import { ApplicationQuestionsSection } from "./ApplicationQuestionsSection";
import { VoluntaryDisclosuresSection } from "./VoluntaryDisclosuresSection";

interface WorkdayFormStepsProps {
  currentStep: number;
  formData: WorkdayFormData;
  onChange: (data: Partial<WorkdayFormData>) => void;
}

export const WorkdayFormSteps = ({ currentStep, formData, onChange }: WorkdayFormStepsProps) => {
  const mapExperienceData = (data: any[]) => {
    return data.map(exp => ({
      jobTitle: exp.title,
      company: exp.company,
      location: "",
      currentlyWorkHere: exp.current,
      startDate: exp.startDate,
      endDate: exp.endDate,
      description: exp.description
    }));
  };

  switch (currentStep) {
    case 1:
      return (
        <>
          <SourceSection onChange={onChange} value={formData.source} />
          <div className="border-t pt-6">
            <LegalNameSection onChange={onChange} value={formData.personalInfo} />
          </div>
          <div className="border-t pt-6">
            <AddressSection onChange={onChange} value={formData.address} />
          </div>
          <div className="border-t pt-6">
            <ContactSection onChange={onChange} value={formData.contact} />
          </div>
        </>
      );
    case 2:
      return (
        <>
          <ExperienceSection onChange={onChange} value={mapExperienceData(formData.experience || [])} />
          <div className="border-t pt-6">
            <EducationSection onChange={onChange} value={formData.education} />
          </div>
          <div className="border-t pt-6">
            <LanguagesSection onChange={onChange} value={formData.languages} />
          </div>
          <div className="border-t pt-6">
            <WebsitesSection onChange={onChange} value={formData.websites} />
          </div>
        </>
      );
    case 3:
      return <ApplicationQuestionsSection onChange={onChange} value={formData.applicationQuestions} />;
    case 4:
      return <VoluntaryDisclosuresSection onChange={onChange} value={formData.voluntaryDisclosures} />;
    default:
      return null;
  }
};