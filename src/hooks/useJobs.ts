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
      const { error } = await supabase
        .from("jobs")
        .delete()
        .eq("id", jobId);

      if (error) throw error;
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
      
      const response = await supabase.functions.invoke('analyze-job', {
        body: { jobId, userId: session.user.id },
      });
      
      if (response.error) {
        console.error("Error in analyze-job function:", response.error);
        throw response.error;
      }
      
      console.log("Analysis response:", response.data);
      return response.data;
    },
    onSuccess: () => {
      refetch();
      toast({
        title: "Success",
        description: "Job analysis completed successfully",
      });
    },
    onError: (error) => {
      console.error("Error analyzing job:", error);
      toast({
        title: "Error",
        description: "Failed to analyze job. Please try again.",
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