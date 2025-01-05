import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { JobActions } from "@/components/job/JobActions";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { ChevronDown, FileText, BarChart2, RefreshCw } from "lucide-react";

interface JobsTableProps {
  jobs: any[];
  onDelete: (id: string) => Promise<void>;
  onAnalyze: (jobId: string) => Promise<void>;
  isAnalyzing: boolean;
}

export function JobsTable({ jobs, onDelete, onAnalyze, isAnalyzing }: JobsTableProps) {
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
                <div className="col-span-4 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-slate-400" />
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
                  <AccordionTrigger className="h-8 w-8 p-0 hover:no-underline">
                    <ChevronDown className="h-4 w-4 text-slate-500" />
                  </AccordionTrigger>
                </div>
              </div>

              <AccordionContent>
                <div className="px-6 py-4 bg-slate-50 space-y-6">
                  {job.analysis ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                        <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                          <BarChart2 className="h-5 w-5 text-slate-600" />
                          Analysis Results
                        </h3>
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "px-4 py-2 rounded-full text-base font-medium flex items-center gap-2",
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
                              console.log("Optimizing resume for job:", job.id);
                            }}
                          >
                            <RefreshCw className="h-4 w-4" />
                            Optimize Resume
                          </Button>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200 space-y-6">
                        {job.analysis.analysis_text.split('\n').map((line: string, index: number) => {
                          if (line.startsWith('Strong Matches:')) {
                            return (
                              <div key={index}>
                                <h4 className="text-lg font-semibold text-slate-900 mb-4">
                                  Strong Matches
                                </h4>
                              </div>
                            );
                          }
                          if (line.startsWith('Suggested Improvements:')) {
                            return (
                              <div key={index}>
                                <h4 className="text-lg font-semibold text-slate-900 mb-4">
                                  Suggested Improvements
                                </h4>
                              </div>
                            );
                          }
                          if (line.startsWith('✓')) {
                            return (
                              <div key={index} className="inline-block mr-2 mb-2">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-base bg-green-50 text-green-700 border border-green-200">
                                  {line.replace('✓', '').trim()}
                                </span>
                              </div>
                            );
                          }
                          if (line.startsWith('•')) {
                            return (
                              <div key={index} className="inline-block mr-2 mb-2">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-base bg-blue-50 text-blue-700 border border-blue-200">
                                  {line.replace('•', '').trim()}
                                </span>
                              </div>
                            );
                          }
                          return line.trim() ? (
                            <p key={index} className="text-base text-slate-600">
                              {line}
                            </p>
                          ) : null;
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <span className="text-base text-slate-600">No analysis available</span>
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
    </div>
  );
}