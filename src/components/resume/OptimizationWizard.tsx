import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Steps } from "@/components/ui/steps";
import { useToast } from "@/hooks/use-toast";
import { SelectSectionsStep } from "./optimization/SelectSectionsStep";
import { OptimizingStep } from "./optimization/OptimizingStep";
import { CompletedStep } from "./optimization/CompletedStep";
import { WizardFooter } from "./optimization/WizardFooter";
import { ComparisonView } from "./optimization/ComparisonView";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";

interface OptimizationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  originalResume: any;
  jobTitle: string;
  jobId: string;
}

export function OptimizationWizard({
  isOpen,
  onClose,
  originalResume,
  jobTitle,
  jobId,
}: OptimizationWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedResume, setOptimizedResume] = useState<any>(null);
  const [selectedSections, setSelectedSections] = useState<string[]>([
    "experience",
    "skills",
    "summary",
  ]);
  const { toast } = useToast();
  const session = useSession();

  const steps = [
    {
      title: "Select Sections",
      description: "Choose which parts of your resume to optimize",
    },
    {
      title: "Review Changes",
      description: "Preview and approve the optimized content",
    },
    {
      title: "Complete",
      description: "Save your optimized resume",
    },
  ];

  const handleSectionToggle = (section: string) => {
    setSelectedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const handleNext = async () => {
    if (currentStep === 0 && selectedSections.length === 0) {
      toast({
        title: "Please select at least one section",
        description: "You need to choose which parts of your resume to optimize",
        variant: "destructive",
      });
      return;
    }

    if (currentStep === 0) {
      setIsOptimizing(true);
      try {
        console.log("Starting optimization with sections:", selectedSections);
        const response = await supabase.functions.invoke('optimize-resume', {
          body: { 
            jobId,
            userId: session?.user?.id,
            sections: selectedSections,
            originalResume // Pass the original resume to the function
          }
        });

        if (response.error) throw response.error;
        
        console.log("Optimization response:", response.data);
        setOptimizedResume(response.data.optimizedResume);
        setCurrentStep(currentStep + 1);
        
        toast({
          title: "Success",
          description: "Your resume has been optimized successfully.",
        });
      } catch (error) {
        console.error('Error optimizing resume:', error);
        toast({
          title: "Optimization failed",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setIsOptimizing(false);
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Optimize Resume for {jobTitle}</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <Steps
            steps={steps}
            currentStep={currentStep}
            className="mb-8"
          />

          <div className="mt-4">
            {currentStep === 0 && (
              <SelectSectionsStep
                selectedSections={selectedSections}
                onSectionToggle={handleSectionToggle}
              />
            )}

            {currentStep === 1 && (
              optimizedResume ? (
                <ComparisonView 
                  originalResume={originalResume}
                  optimizedResume={optimizedResume}
                />
              ) : (
                <OptimizingStep />
              )
            )}

            {currentStep === 2 && <CompletedStep />}
          </div>

          <WizardFooter
            currentStep={currentStep}
            totalSteps={steps.length}
            isOptimizing={isOptimizing}
            onBack={handleBack}
            onNext={handleNext}
            onClose={onClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}