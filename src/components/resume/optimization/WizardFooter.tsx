import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

interface WizardFooterProps {
  currentStep: number;
  totalSteps: number;
  isOptimizing: boolean;
  onBack: () => void;
  onNext: () => void;
  onClose: () => void;
}

export function WizardFooter({
  currentStep,
  totalSteps,
  isOptimizing,
  onBack,
  onNext,
  onClose,
}: WizardFooterProps) {
  return (
    <div className="flex justify-between mt-8">
      {currentStep > 0 && currentStep < totalSteps - 1 && (
        <Button onClick={onBack} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      )}
      {currentStep < totalSteps - 1 ? (
        <Button
          onClick={onNext}
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
  );
}