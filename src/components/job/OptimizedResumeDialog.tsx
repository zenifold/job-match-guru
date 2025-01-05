import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

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
  const [isOptimizing, setIsOptimizing] = useState(false);

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

  const handleOptimizeResume = async () => {
    if (!session?.user || !profile) return;

    setIsOptimizing(true);
    try {
      console.log("Starting resume optimization for job:", jobId);
      
      const response = await supabase.functions.invoke('optimize-resume', {
        body: { jobId, userId: session.user.id }
      });

      if (response.error) throw response.error;

      toast({
        title: "Success",
        description: "Resume has been optimized successfully. View it in the Resumes page.",
      });
      
      onClose();
      navigate("/resumes");
    } catch (error) {
      console.error("Error optimizing resume:", error);
      toast({
        title: "Error",
        description: "Failed to optimize resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Optimize Resume for {jobTitle}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-gray-600">
            Would you like to create an optimized version of your resume for this job?
            This will:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Create a new version of your resume</li>
            <li>Optimize it based on the job requirements</li>
            <li>Save it for future reference</li>
          </ul>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleOptimizeResume} disabled={isOptimizing}>
              {isOptimizing ? "Optimizing..." : "Optimize Resume"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}