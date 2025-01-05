import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { JobsTable } from "@/components/job/JobsTable";
import { useJobs } from "@/hooks/useJobs";

const Jobs = () => {
  const { jobs, deleteJob, analyzeJob, isAnalyzing } = useJobs();

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
        onDelete={deleteJob}
        onAnalyze={analyzeJob}
        isAnalyzing={isAnalyzing}
      />
    </MainLayout>
  );
};

export default Jobs;