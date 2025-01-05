import { Button } from "@/components/ui/button";
import { JobActions } from "@/components/job/JobActions";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { BarChart2, RefreshCw } from "lucide-react";
import { useState } from "react";
import { OptimizedResumeDialog } from "./OptimizedResumeDialog";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface JobsTableProps {
  jobs: any[];
  onDelete: (id: string) => Promise<void>;
  onAnalyze: (jobId: string) => Promise<void>;
  isAnalyzing: boolean;
}

export function JobsTable({ jobs, onDelete, onAnalyze, isAnalyzing }: JobsTableProps) {
  const [selectedJob, setSelectedJob] = useState<{ id: string; title: string } | null>(null);
  const { toast } = useToast();

  return (
    <div className="w-full overflow-hidden">
      <div className="min-w-full">
        <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-slate-50 text-sm font-medium text-slate-500">
          <div className="col-span-4">Title</div>
          <div className="col-span-3 text-center">Status</div>
          <div className="col-span-3 text-center">Date Added</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

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
                  <JobActions job={job} onDelete={onDelete} />
                  <AccordionTrigger className="h-8 w-8 p-0 hover:no-underline" />
                </div>
              </div>

              <AccordionContent>
                <div className="px-6 py-4 bg-slate-50 space-y-4">
                  {job.analysis ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                        <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                          <BarChart2 className="h-5 w-5 text-slate-600" />
                          Analysis Results
                        </h3>
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2",
                            job.analysis.match_score >= 70 
                              ? "bg-green-100 text-green-700" 
                              : job.analysis.match_score >= 50 
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          )}>
                            Match Score: {Math.round(job.analysis.match_score)}%
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-slate-100 flex items-center gap-2"
                            onClick={() => {
                              setSelectedJob({ id: job.id, title: job.title });
                            }}
                          >
                            <RefreshCw className="h-4 w-4" />
                            Optimize Resume
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {job.analysis.analysis_text.split('\n').map((line: string, index: number) => {
                          if (line.startsWith('Strong Matches:')) {
                            return (
                              <Card key={index} className="bg-white">
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-base font-semibold text-slate-900">
                                    Strong Matches
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-wrap gap-1.5">
                                  {job.analysis.analysis_text
                                    .split('\n')
                                    .filter((l: string) => l.startsWith('✓'))
                                    .map((match: string, idx: number) => (
                                      <span
                                        key={idx}
                                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-50 text-green-700 border border-green-200"
                                      >
                                        {match.replace('✓', '').trim()}
                                      </span>
                                    ))}
                                </CardContent>
                              </Card>
                            );
                          }
                          if (line.startsWith('Suggested Improvements:')) {
                            return (
                              <Card key={index} className="bg-white">
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-base font-semibold text-slate-900">
                                    Suggested Improvements
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-wrap gap-1.5">
                                  {job.analysis.analysis_text
                                    .split('\n')
                                    .filter((l: string) => l.startsWith('•'))
                                    .map((improvement: string, idx: number) => (
                                      <span
                                        key={idx}
                                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-200"
                                      >
                                        {improvement.replace('•', '').trim()}
                                      </span>
                                    ))}
                                </CardContent>
                              </Card>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-slate-600">No analysis available</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          console.log("Triggering analysis for job:", job.id);
                          onAnalyze(job.id);
                        }}
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