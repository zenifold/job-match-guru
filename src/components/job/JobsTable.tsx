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
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Title</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Date Added</TableHead>
            <TableHead className="text-right w-[200px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <Accordion type="single" collapsible className="w-full">
            {jobs?.map((job) => (
              <AccordionItem value={job.id} key={job.id} className="w-full border-b-0">
                <TableRow>
                  <TableCell colSpan={4} className="p-0">
                    <AccordionTrigger className="hover:no-underline w-full px-4 py-3">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{job.title}</span>
                        </div>
                        <div className="flex items-center gap-8">
                          <span className="text-sm text-muted-foreground">{job.status}</span>
                          <span className="text-sm text-muted-foreground">
                            {new Date(job.date_added).toLocaleDateString()}
                          </span>
                          <div className="flex items-center gap-4">
                            <JobActions job={job} onDelete={onDelete} />
                            <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={4} className="p-0">
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
                  </TableCell>
                </TableRow>
              </AccordionItem>
            ))}
          </Accordion>
        </TableBody>
      </Table>
    </div>
  );
}