import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { OptimizationWizard } from "@/components/resume/OptimizationWizard";
import { Loader2 } from "lucide-react";

interface OptimizedResumeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle: string;
}

export function OptimizedResumeDialog({
  isOpen,
  onClose,
  jobId,
  jobTitle,
}: OptimizedResumeDialogProps) {
  const { toast } = useToast();
  const session = useSession();
  const navigate = useNavigate();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!session?.user) return null;
      
      console.log("Fetching profile for user:", session.user.id);
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("is_master", true)  // Only get the master profile
        .maybeSingle();  // Use maybeSingle instead of single

      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }
      
      if (!data) {
        console.log("No master profile found");
        return null;
      }
      
      return data;
    },
  });

  const handleComplete = () => {
    onClose();
    navigate("/resumes");
    toast({
      title: "Resume Optimized",
      description: "Your resume has been successfully optimized.",
    });
  };

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load profile data. Please try again.",
      variant: "destructive",
    });
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !profile ? (
          <div className="text-center p-8">
            <p className="text-sm text-muted-foreground">
              Please create a master profile first to optimize your resume.
            </p>
          </div>
        ) : (
          <OptimizationWizard
            isOpen={isOpen}
            onClose={handleComplete}
            originalResume={profile.content}
            jobTitle={jobTitle}
            jobId={jobId}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}