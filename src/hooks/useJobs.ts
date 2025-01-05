import { useSession } from "@supabase/auth-helpers-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Job {
  id: string;
  title: string;
  description: string;
  status: string;
  date_added: string;
  analysis?: {
    match_score: number;
    analysis_text: string;
  };
}

export function useJobs() {
  const session = useSession();
  const { toast } = useToast();

  const {
    data: jobs,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      if (!session?.user) return [];
      
      console.log("Fetching jobs and analyses...");
      
      const { data: jobsData, error: jobsError } = await supabase
        .from("jobs")
        .select("*")
        .eq("user_id", session.user.id)
        .order("date_added", { ascending: false });

      if (jobsError) {
        console.error("Error fetching jobs:", jobsError);
        throw jobsError;
      }

      const { data: analysesData, error: analysesError } = await supabase
        .from("job_analyses")
        .select("*")
        .eq("user_id", session.user.id);

      if (analysesError) {
        console.error("Error fetching analyses:", analysesError);
        throw analysesError;
      }

      console.log("Jobs data:", jobsData);
      console.log("Analyses data:", analysesData);

      return jobsData.map(job => ({
        ...job,
        analysis: analysesData.find(analysis => analysis.job_id === job.id)
      }));
    },
    enabled: !!session?.user,
  });

  const deleteJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      // First, delete related optimized resumes
      const { error: resumesError } = await supabase
        .from("optimized_resumes")
        .delete()
        .eq("job_id", jobId);

      if (resumesError) {
        console.error("Error deleting optimized resumes:", resumesError);
        throw resumesError;
      }

      // Then, delete related job analyses
      const { error: analysesError } = await supabase
        .from("job_analyses")
        .delete()
        .eq("job_id", jobId);

      if (analysesError) {
        console.error("Error deleting job analyses:", analysesError);
        throw analysesError;
      }

      // Finally, delete the job itself
      const { error: jobError } = await supabase
        .from("jobs")
        .delete()
        .eq("id", jobId);

      if (jobError) {
        console.error("Error deleting job:", jobError);
        throw jobError;
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Job deleted successfully",
      });
      refetch();
    },
    onError: (error) => {
      console.error("Error deleting job:", error);
      toast({
        title: "Error",
        description: "Failed to delete job",
        variant: "destructive",
      });
    },
  });

  const analyzeJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      if (!session?.user) throw new Error("User not authenticated");
      
      console.log("Starting job analysis for job ID:", jobId);
      
      try {
        const response = await supabase.functions.invoke('analyze-job', {
          body: { jobId, userId: session.user.id },
        });
        
        if (response.error) {
          // Handle rate limit error specifically
          if (response.error.status === 429) {
            const retryAfter = 60; // Default to 60 seconds if not provided
            throw new Error(`Rate limit reached. Please try again in ${retryAfter} seconds.`);
          }
          console.error("Error in analyze-job function:", response.error);
          throw response.error;
        }
        
        console.log("Analysis response:", response.data);
        return response.data;
      } catch (error: any) {
        // If it's already a rate limit error, rethrow it
        if (error.message.includes('Rate limit')) {
          throw error;
        }
        // For other errors, throw a generic error
        throw new Error("Failed to analyze job. Please try again.");
      }
    },
    onSuccess: () => {
      refetch();
      toast({
        title: "Success",
        description: "Job analysis completed successfully",
      });
    },
    onError: (error: Error) => {
      console.error("Error analyzing job:", error);
      toast({
        title: "Analysis Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    jobs,
    isLoading,
    deleteJob: (id: string) => deleteJobMutation.mutateAsync(id),
    analyzeJob: (jobId: string) => analyzeJobMutation.mutateAsync(jobId),
    isAnalyzing: analyzeJobMutation.isPending,
  };
}