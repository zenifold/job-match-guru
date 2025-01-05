import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ResumeActions } from "@/components/resume/ResumeActions";
import { OptimizedResume } from "@/types/resume";

interface OptimizedResumeTableProps {
  resumes: OptimizedResume[];
  onDelete: (id: string) => Promise<void>;
}

export const OptimizedResumeTable = ({ resumes, onDelete }: OptimizedResumeTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Job Title</TableHead>
          <TableHead>Match Score</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {resumes.map((resume) => (
          <TableRow key={resume.id}>
            <TableCell>{resume.version_name}</TableCell>
            <TableCell>{resume.jobTitle}</TableCell>
            <TableCell>{resume.match_score}%</TableCell>
            <TableCell>
              <Badge variant={resume.optimization_status === 'completed' ? "default" : "secondary"}>
                {resume.optimization_status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end">
                <ResumeActions 
                  resume={resume} 
                  onDelete={(id) => onDelete(id)} 
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};