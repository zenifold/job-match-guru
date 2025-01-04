import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { JobActions } from "@/components/job/JobActions";

const Jobs = () => {
  const session = useSession();
  const { toast } = useToast();

  const { data: jobs, refetch } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      if (!session?.user) return [];
      const { data: jobsData, error: jobsError } = await supabase
        .from("jobs")
        .select("*")
        .eq("user_id", session.user.id)
        .order("date_added", { ascending: false });

      if (jobsError) throw jobsError;

      // Fetch analyses for all jobs
      const { data: analysesData, error: analysesError } = await supabase
        .from("job_analyses")
        .select("*")
        .eq("user_id", session.user.id);

      if (analysesError) throw analysesError;

      // Combine jobs with their analyses
      return jobsData.map(job => ({
        ...job,
        analysis: analysesData.find(analysis => analysis.job_id === job.id)
      }));
    },
  });

  const analyzeJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const response = await supabase.functions.invoke('analyze-job', {
        body: { jobId, userId: session?.user?.id },
      });
      
      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: () => {
      refetch();
      toast({
        title: "Success",
        description: "Job analysis completed",
      });
    },
    onError: (error) => {
      console.error("Error analyzing job:", error);
      toast({
        title: "Error",
        description: "Failed to analyze job",
        variant: "destructive",
      });
    },
  });

  const handleDelete = async (id: string) => {
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
      refetch();
    } catch (error) {
      console.error("Error deleting job:", error);
      toast({
        title: "Error",
        description: "Failed to delete job",
        variant: "destructive",
      });
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

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Title</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Date Added</TableHead>
            <TableHead className="text-center">Match Score</TableHead>
            <TableHead className="text-right w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs?.map((job) => (
            <TableRow key={job.id}>
              <TableCell className="text-left">{job.title}</TableCell>
              <TableCell className="text-center">{job.status}</TableCell>
              <TableCell className="text-center">
                {new Date(job.date_added).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-center">
                {job.analysis ? (
                  <span className="font-medium">
                    {Math.round(job.analysis.match_score)}%
                  </span>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => analyzeJobMutation.mutate(job.id)}
                  >
                    Analyze
                  </Button>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end">
                  <JobActions job={job} onDelete={handleDelete} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </MainLayout>
  );
};

export default Jobs;