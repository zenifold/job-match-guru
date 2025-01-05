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
      jobId={jobId}
    />
  );
}