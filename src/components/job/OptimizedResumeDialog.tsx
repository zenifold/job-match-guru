import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { OptimizationWizard } from "@/components/resume/OptimizationWizard";

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
  const [optimizationResult, setOptimizationResult] = useState<any>(null);

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!session?.user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const handleOptimize = async (sections: string[]) => {
    if (!session?.user || !profile) return;

    try {
      console.log("Starting resume optimization for job:", jobId);
      console.log("Optimizing sections:", sections);
      
      const response = await supabase.functions.invoke('optimize-resume', {
        body: { 
          jobId, 
          userId: session.user.id,
          sections 
        }
      });

      if (response.error) throw response.error;

      setOptimizationResult(response.data.optimizedResume);
      
      toast({
        title: "Success",
        description: "Resume has been optimized successfully.",
      });

      return response.data.optimizedResume;
    } catch (error) {
      console.error("Error optimizing resume:", error);
      toast({
        title: "Error",
        description: "Failed to optimize resume. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleComplete = () => {
    onClose();
    navigate("/resumes", { replace: true });
    window.location.reload();
  };

  if (!profile) return null;

  return (
    <OptimizationWizard
      isOpen={isOpen}
      onClose={handleComplete}
      originalResume={profile.content}
      jobTitle={jobTitle}
      onOptimize={handleOptimize}
    />
  );
}