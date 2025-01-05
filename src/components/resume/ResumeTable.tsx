import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ResumeActions } from "@/components/resume/ResumeActions";
import { CombinedResume } from "@/types/resume";

interface ResumeTableProps {
  resumes: CombinedResume[];
  onDelete: (id: string, isOptimized: boolean) => Promise<void>;
}

export const ResumeTable = ({ resumes, onDelete }: ResumeTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Career Focus</TableHead>
          <TableHead>Job Title</TableHead>
          <TableHead className="text-right w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {resumes.map((resume) => (
          <TableRow key={resume.id}>
            <TableCell>
              {resume.type === 'regular' ? resume.name : resume.version_name}
            </TableCell>
            <TableCell>
              <Badge variant={resume.type === 'optimized' ? "secondary" : "default"}>
                {resume.type === 'optimized' ? 'Optimized' : (resume.type === 'regular' && resume.is_master ? 'Master' : 'Regular')}
              </Badge>
            </TableCell>
            <TableCell>
              {resume.type === 'regular' ? resume.career_focus || 'General' : '-'}
            </TableCell>
            <TableCell>
              {resume.type === 'optimized' ? resume.jobTitle : '-'}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end">
                <ResumeActions 
                  resume={resume} 
                  onDelete={(id) => onDelete(id, resume.type === 'optimized')} 
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};