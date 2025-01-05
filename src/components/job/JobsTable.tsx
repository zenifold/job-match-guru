import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { JobActions } from "@/components/job/JobActions";
import { useState } from "react";
import { JobAnalysisDialog } from "./JobAnalysisDialog";
import { OptimizedResumeDialog } from "./OptimizedResumeDialog";

interface JobsTableProps {
  jobs: any[];
  onDelete: (id: string) => Promise<void>;
  onAnalyze: (jobId: string) => Promise<void>;
  isAnalyzing: boolean;
}

export function JobsTable({ jobs, onDelete, onAnalyze, isAnalyzing }: JobsTableProps) {
  const [selectedAnalysis, setSelectedAnalysis] = useState<{
    analysis: { match_score: number; analysis_text: string } | null;
    jobTitle: string;
  } | null>(null);
  const [optimizeDialog, setOptimizeDialog] = useState<{
    jobId: string;
    jobTitle: string;
  } | null>(null);

  return (
    <>
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
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="ghost"
                      className="font-medium hover:bg-blue-50"
                      onClick={() => {
                        setSelectedAnalysis({
                          analysis: job.analysis,
                          jobTitle: job.title,
                        });
                      }}
                    >
                      {Math.round(job.analysis.match_score)}%
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setOptimizeDialog({
                          jobId: job.id,
                          jobTitle: job.title,
                        });
                      }}
                    >
                      Optimize
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      console.log("Triggering analysis for job:", job.id);
                      onAnalyze(job.id);
                    }}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? "Analyzing..." : "Analyze"}
                  </Button>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end">
                  <JobActions job={job} onDelete={onDelete} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <JobAnalysisDialog
        isOpen={!!selectedAnalysis}
        onClose={() => setSelectedAnalysis(null)}
        analysis={selectedAnalysis?.analysis}
        jobTitle={selectedAnalysis?.jobTitle || ""}
      />

      {optimizeDialog && (
        <OptimizedResumeDialog
          isOpen={!!optimizeDialog}
          onClose={() => setOptimizeDialog(null)}
          jobId={optimizeDialog.jobId}
          jobTitle={optimizeDialog.jobTitle}
        />
      )}
    </>
  );
}