import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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

  if (!profile) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <OptimizationWizard
          isOpen={isOpen}
          onClose={onClose}
          originalResume={profile.content}
          jobTitle={jobTitle}
          jobId={jobId}
        />
      </DialogContent>
    </Dialog>
  );
}