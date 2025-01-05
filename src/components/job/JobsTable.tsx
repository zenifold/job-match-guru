import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { JobActions } from "@/components/job/JobActions";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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
            <TableHead className="text-right w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <Accordion type="single" collapsible className="w-full">
            {jobs?.map((job) => (
              <AccordionItem value={job.id} key={job.id} className="border-b-0">
                <TableRow>
                  <TableCell className="text-left font-medium">
                    <AccordionTrigger className="hover:no-underline">
                      {job.title}
                    </AccordionTrigger>
                  </TableCell>
                  <TableCell className="text-center">{job.status}</TableCell>
                  <TableCell className="text-center">
                    {new Date(job.date_added).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end">
                      <JobActions job={job} onDelete={onDelete} />
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={4} className="p-0">
                    <AccordionContent className="px-6 py-4 bg-slate-50">
                      <div className="space-y-6">
                        {job.analysis ? (
                          <>
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold text-slate-900">Analysis Results</h3>
                              <div className="flex items-center gap-4">
                                <div className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                                  Match Score: {Math.round(job.analysis.match_score)}%
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="hover:bg-slate-100"
                                  onClick={() => {
                                    console.log("Optimizing resume for job:", job.id);
                                  }}
                                >
                                  Optimize Resume
                                </Button>
                              </div>
                              <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                                <p className="text-sm text-slate-600 whitespace-pre-wrap">
                                  {job.analysis.analysis_text}
                                </p>
                              </div>
                            </div>
                          </>
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
                            >
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