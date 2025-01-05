import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Steps } from "@/components/ui/steps";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowRight, ArrowLeft } from "lucide-react";

interface OptimizationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  originalResume: any;
  jobTitle: string;
  onOptimize: (sections: string[]) => Promise<any>;
}

export function OptimizationWizard({
  isOpen,
  onClose,
  originalResume,
  jobTitle,
  onOptimize,
}: OptimizationWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [selectedSections, setSelectedSections] = useState<string[]>([
    "experience",
    "skills",
    "summary",
  ]);
  const { toast } = useToast();

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

    if (currentStep === 1) {
      setIsOptimizing(true);
      try {
        await onOptimize(selectedSections);
        setCurrentStep(currentStep + 1);
      } catch (error) {
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
      <DialogContent className="sm:max-w-[600px]">
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
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4">
                  Select sections to optimize
                </h3>
                <div className="space-y-4">
                  {["summary", "experience", "skills", "education"].map(
                    (section) => (
                      <div key={section} className="flex items-center space-x-2">
                        <Checkbox
                          id={section}
                          checked={selectedSections.includes(section)}
                          onCheckedChange={() => handleSectionToggle(section)}
                        />
                        <label
                          htmlFor={section}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {section.charAt(0).toUpperCase() + section.slice(1)}
                        </label>
                      </div>
                    )
                  )}
                </div>
              </Card>
            )}

            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                  <p className="mt-2 text-sm text-gray-600">
                    Optimizing your resume...
                  </p>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="text-center space-y-4">
                <div className="rounded-full bg-green-100 p-3 w-12 h-12 mx-auto flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Optimization Complete!</h3>
                <p className="text-sm text-gray-600">
                  Your resume has been optimized and saved
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-between mt-8">
            {currentStep > 0 && currentStep < steps.length - 1 && (
              <Button onClick={handleBack} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            )}
            {currentStep < steps.length - 1 ? (
              <Button
                onClick={handleNext}
                disabled={isOptimizing}
                className="ml-auto"
              >
                {isOptimizing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            ) : (
              <Button onClick={onClose} className="ml-auto">
                Done
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}