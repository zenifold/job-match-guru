import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
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
  const [isOptimizing, setIsOptimizing] = useState(false);
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

  const handleOptimizeResume = async () => {
    if (!session?.user || !profile) return;

    setIsOptimizing(true);
    try {
      console.log("Starting resume optimization for job:", jobId);
      
      const response = await supabase.functions.invoke('optimize-resume', {
        body: { jobId, userId: session.user.id }
      });

      if (response.error) throw response.error;

      setOptimizationResult(response.data.optimizedResume);
      
      toast({
        title: "Success",
        description: "Resume has been optimized successfully.",
      });
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

  const handleViewResumes = () => {
    onClose();
    navigate("/resumes");
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Optimize Resume for {jobTitle}</DialogTitle>
        </DialogHeader>
        
        {!optimizationResult ? (
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
              <Button 
                onClick={handleOptimizeResume} 
                disabled={isOptimizing}
                className="min-w-[120px]"
              >
                {isOptimizing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Optimizing...
                  </>
                ) : (
                  "Optimize Resume"
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <p className="text-green-700">
                Resume optimization complete! Match score: {optimizationResult.match_score}%
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Optimizations made:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Added relevant skills from job requirements</li>
                <li>Enhanced experience descriptions</li>
                <li>Reorganized content for better matching</li>
              </ul>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button onClick={handleViewResumes}>
                View Optimized Resume
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}