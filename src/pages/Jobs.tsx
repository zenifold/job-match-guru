import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { JobsTable } from "@/components/job/JobsTable";

const Jobs = () => {
  const session = useSession();
  const { toast } = useToast();

  const { data: jobs, refetch } = useQuery({
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
  });

  const analyzeJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      console.log("Starting job analysis for job ID:", jobId);
      
      const response = await supabase.functions.invoke('analyze-job', {
        body: { jobId, userId: session?.user?.id },
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

  const handleDelete = async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from("jobs")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Job deleted successfully",
      });
      await refetch();
    } catch (error) {
      console.error("Error deleting job:", error);
      toast({
        title: "Error",
        description: "Failed to delete job",
        variant: "destructive",
      });
      throw error; // Re-throw the error to ensure the Promise rejects
    }
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Jobs</h1>
        <Button asChild>
          <Link to="/jobs/new">
            <Plus className="mr-2 h-4 w-4" />
            Add New Job
          </Link>
        </Button>
      </div>

      <JobsTable
        jobs={jobs || []}
        onDelete={handleDelete}
        onAnalyze={(jobId) => analyzeJobMutation.mutate(jobId)}
        isAnalyzing={analyzeJobMutation.isPending}
      />
    </MainLayout>
  );
};

export default Jobs;