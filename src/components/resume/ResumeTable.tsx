import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ResumeActions } from "@/components/resume/ResumeActions";
import { CombinedResume } from "@/types/resume";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";

interface ResumeTableProps {
  resumes: CombinedResume[];
  onDelete: (id: string, isOptimized: boolean) => Promise<void>;
}

export const ResumeTable = ({ resumes, onDelete }: ResumeTableProps) => {
  const session = useSession();

  const { data: themeSettings } = useQuery({
    queryKey: ['theme-settings', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;

      const { data: themes, error } = await supabase
        .from('resume_themes')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('is_default', true)
        .single();

      if (error) {
        console.error('Error fetching theme:', error);
        return null;
      }

      return themes?.settings || null;
    },
    enabled: !!session?.user?.id
  });

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
                  themeSettings={themeSettings}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};