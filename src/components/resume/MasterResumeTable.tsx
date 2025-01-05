import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ResumeActions } from "@/components/resume/ResumeActions";
import { RegularResume } from "@/types/resume";

interface MasterResumeTableProps {
  resumes: RegularResume[];
  onDelete: (id: string) => Promise<void>;
}

export const MasterResumeTable = ({ resumes, onDelete }: MasterResumeTableProps) => {
  return (
    <div className="space-y-6">
      {Array.from(new Set(resumes.map(resume => resume.career_focus || 'General'))).map((focus) => (
        <div key={focus} className="space-y-4">
          <h3 className="text-lg font-semibold">{focus}</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resumes
                .filter(resume => (resume.career_focus || 'General') === focus)
                .map((resume) => (
                  <TableRow key={resume.id}>
                    <TableCell>{resume.name}</TableCell>
                    <TableCell>
                      {new Date(resume.created_at).toLocaleDateString()}
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
        </div>
      ))}
    </div>
  );
};