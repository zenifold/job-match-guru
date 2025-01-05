import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { JobsTable } from "@/components/job/JobsTable";
import { useJobs } from "@/hooks/useJobs";
import { useToast } from "@/hooks/use-toast";

const Jobs = () => {
  const { jobs, deleteJob, analyzeJob, isAnalyzing } = useJobs();
  const { toast } = useToast();

  const handleReanalyzeAll = async () => {
    if (!jobs?.length) {
      toast({
        title: "No jobs found",
        description: "Add some jobs first to analyze them.",
      });
      return;
    }

    toast({
      title: "Starting Analysis",
      description: `Re-analyzing ${jobs.length} jobs...`,
    });

    try {
      // Process jobs sequentially to avoid overwhelming the system
      for (const job of jobs) {
        await analyzeJob(job.id);
      }

      toast({
        title: "Analysis Complete",
        description: `Successfully re-analyzed ${jobs.length} jobs.`,
      });
    } catch (error) {
      console.error("Error during batch analysis:", error);
      toast({
        title: "Analysis Error",
        description: "Some jobs could not be analyzed. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Jobs</h1>
        <div className="flex gap-4">
          <Button 
            variant="outline"
            onClick={handleReanalyzeAll}
            disabled={isAnalyzing || !jobs?.length}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Re-analyze All
          </Button>
          <Button asChild>
            <Link to="/jobs/new">
              <Plus className="mr-2 h-4 w-4" />
              Add New Job
            </Link>
          </Button>
        </div>
      </div>

      <JobsTable
        jobs={jobs || []}
        onDelete={deleteJob}
        onAnalyze={analyzeJob}
        isAnalyzing={isAnalyzing}
      />
    </MainLayout>
  );
};

export default Jobs;