import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, ArrowLeft, ArrowRight } from "lucide-react";
import { Steps } from "@/components/ui/steps";
import { useToast } from "@/hooks/use-toast";
import { WorkdayTemplateSelector } from "../workday/WorkdayTemplateSelector";
import { validateWorkdayForm } from "@/utils/workdayFormValidation";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { WorkdayFormData } from "@/types/workdayForm";
import { WorkdayFormSteps } from "./workday/WorkdayFormSteps";

export function WorkdayApplicationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<WorkdayFormData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const session = useSession();

  const handleTemplateLoad = (templateData: WorkdayFormData) => {
    setFormData(templateData);
    toast({
      title: "Template Loaded",
      description: "The form has been populated with the template data.",
    });
  };

  const handleFormChange = (newData: Partial<WorkdayFormData>) => {
    const updatedFormData = { ...formData, ...newData };
    setFormData(updatedFormData);
    autoSaveForm(updatedFormData);
  };

  const autoSaveForm = async (data: WorkdayFormData) => {
    if (!session?.user?.id) return;

    try {
      const { error } = await supabase
        .from('workday_profiles')
        .upsert({
          user_id: session.user.id,
          content: data as any, // Type assertion needed for Json compatibility
          name: 'Auto-saved Draft'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error auto-saving form:', error);
    }
  };

  const handleNext = async () => {
    const errors = validateWorkdayForm(formData, currentStep);
    
    if (errors.length > 0) {
      errors.forEach(error => {
        toast({
          title: "Validation Error",
          description: error.message,
          variant: "destructive",
        });
      });
      return;
    }

    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to submit the application",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Here you would typically submit the form data to your backend
      toast({
        title: "Success",
        description: "Your application has been submitted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Workday Application</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Plus className="w-4 h-4" />
            <span>
              Step {currentStep} of 4:{" "}
              {currentStep === 1
                ? "My Information"
                : currentStep === 2
                ? "My Experience"
                : currentStep === 3
                ? "Application Questions"
                : "Voluntary Disclosures"}
            </span>
          </div>
        </div>

        <WorkdayTemplateSelector
          onLoadTemplate={handleTemplateLoad}
          currentFormData={formData}
        />

        <form className="space-y-8">
          <WorkdayFormSteps 
            currentStep={currentStep}
            formData={formData}
            onChange={handleFormChange}
          />

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
              onClick={handleNext}
              disabled={isSubmitting}
            >
              {currentStep === 4 ? (isSubmitting ? "Submitting..." : "Submit") : "Next"}
              {currentStep < 4 && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
}
