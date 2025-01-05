import { Button } from "@/components/ui/button";
import { JobActions } from "@/components/job/JobActions";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BarChart2 } from "lucide-react";
import { useState } from "react";
import { OptimizedResumeDialog } from "./OptimizedResumeDialog";
import { useToast } from "@/hooks/use-toast";
import { JobTableHeader } from "./JobTableHeader";
import { JobAnalysisSection } from "./JobAnalysisSection";

interface JobsTableProps {
  jobs: any[];
  onDelete: (id: string) => Promise<void>;
  onAnalyze: (jobId: string) => Promise<void>;
  isAnalyzing: boolean;
}

export function JobsTable({ jobs, onDelete, onAnalyze, isAnalyzing }: JobsTableProps) {
  const [selectedJob, setSelectedJob] = useState<{ id: string; title: string } | null>(null);
  const [analyzingJobId, setAnalyzingJobId] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<{ jobId: string; type: 'rate-limit' | 'ai-error' | 'general'; message: string } | null>(null);
  const { toast } = useToast();

  const handleUpdate = () => {
    window.location.reload();
  };

  const handleReanalyze = async (jobId: string) => {
    try {
      setAnalyzingJobId(jobId);
      setAnalysisError(null);
      await onAnalyze(jobId);
      toast({
        title: "Analysis Complete",
        description: "Job has been re-analyzed successfully.",
      });
    } catch (error: any) {
      console.error("Error analyzing job:", error);
      
      // Parse the error response
      let errorType: 'rate-limit' | 'ai-error' | 'general' = 'general';
      let errorMessage = "Failed to analyze job. Please try again.";
      
      try {
        const errorBody = JSON.parse(error.body);
        
        if (error.status === 429) {
          errorType = 'rate-limit';
          errorMessage = "Rate limit reached. Please wait a minute before trying again.";
        } else if (errorBody.error === "Invalid AI response format") {
          errorType = 'ai-error';
          errorMessage = "There was an issue with the AI analysis. Our team has been notified.";
        }
      } catch (e) {
        console.error("Error parsing error body:", e);
      }
      
      setAnalysisError({ jobId, type: errorType, message: errorMessage });
      
      toast({
        title: "Analysis Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setAnalyzingJobId(null);
    }
  };

  return (
    <div className="w-full overflow-hidden">
      <div className="min-w-full">
        <JobTableHeader />

        <Accordion type="single" collapsible className="w-full">
          {jobs?.map((job) => (
            <AccordionItem value={job.id} key={job.id} className="border-b border-slate-200">
              <div className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-slate-50 transition-colors">
                <div className="col-span-4 flex items-center">
                  <span className="font-medium text-slate-700">{job.title}</span>
                </div>
                <div className="col-span-3 flex items-center justify-center">
                  <span className="text-sm text-slate-500">{job.status}</span>
                </div>
                <div className="col-span-3 flex items-center justify-center">
                  <span className="text-sm text-slate-500">
                    {new Date(job.date_added).toLocaleDateString()}
                  </span>
                </div>
                <div className="col-span-2 flex items-center justify-end gap-2">
                  <JobActions job={job} onDelete={onDelete} onUpdate={handleUpdate} />
                  <AccordionTrigger className="h-8 w-8 p-0 hover:no-underline" />
                </div>
              </div>

              <AccordionContent>
                <div className="px-6 py-4 bg-slate-50 space-y-4">
                  {job.analysis || analysisError?.jobId === job.id ? (
                    <JobAnalysisSection
                      job={job}
                      isAnalyzing={isAnalyzing && analyzingJobId === job.id}
                      error={analysisError?.jobId === job.id ? {
                        type: analysisError.type,
                        message: analysisError.message
                      } : undefined}
                      onReanalyze={() => handleReanalyze(job.id)}
                      onOptimize={() => setSelectedJob({ id: job.id, title: job.title })}
                    />
                  ) : (
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-slate-600">No analysis available</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReanalyze(job.id)}
                        disabled={isAnalyzing}
                        className="flex items-center gap-2"
                      >
                        <BarChart2 className="h-4 w-4" />
                        {isAnalyzing ? "Analyzing..." : "Analyze Job"}
                      </Button>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {selectedJob && (
        <OptimizedResumeDialog
          isOpen={!!selectedJob}
          onClose={() => setSelectedJob(null)}
          jobId={selectedJob.id}
          jobTitle={selectedJob.title}
        />
      )}
    </div>
  );
}