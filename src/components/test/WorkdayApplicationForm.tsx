import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useState } from "react";
import { SourceSection } from "./workday/SourceSection";
import { LegalNameSection } from "./workday/LegalNameSection";
import { AddressSection } from "./workday/AddressSection";
import { ContactSection } from "./workday/ContactSection";
import { ExperienceSection } from "./workday/ExperienceSection";
import { EducationSection } from "./workday/EducationSection";
import { LanguagesSection } from "./workday/LanguagesSection";
import { WebsitesSection } from "./workday/WebsitesSection";
import { ApplicationQuestionsSection } from "./workday/ApplicationQuestionsSection";

export function WorkdayApplicationForm() {
  const [currentStep, setCurrentStep] = useState(1);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <SourceSection />
            <div className="border-t pt-6">
              <LegalNameSection />
            </div>
            <div className="border-t pt-6">
              <AddressSection />
            </div>
            <div className="border-t pt-6">
              <ContactSection />
            </div>
          </>
        );
      case 2:
        return (
          <>
            <ExperienceSection />
            <div className="border-t pt-6">
              <EducationSection />
            </div>
            <div className="border-t pt-6">
              <LanguagesSection />
            </div>
            <div className="border-t pt-6">
              <WebsitesSection />
            </div>
          </>
        );
      case 3:
        return <ApplicationQuestionsSection employer="Walmart" />;
      default:
        return null;
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Workday Application</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Check className="w-4 h-4" />
            <span>
              Step {currentStep} of 3:{" "}
              {currentStep === 1
                ? "My Information"
                : currentStep === 2
                ? "My Experience"
                : "Application Questions"}
            </span>
          </div>
        </div>

        <form className="space-y-8">
          {renderStep()}

          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              type="button"
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <Button
              type="button"
              onClick={() => setCurrentStep((prev) => Math.min(3, prev + 1))}
            >
              {currentStep === 3 ? "Submit" : "Next"}
              {currentStep < 3 && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
}