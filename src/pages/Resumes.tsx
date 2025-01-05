import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ResumeActions } from "@/components/resume/ResumeActions";
import { Badge } from "@/components/ui/badge";

const Resumes = () => {
  const session = useSession();
  const { toast } = useToast();

  // Fetch both regular and optimized resumes
  const { data: allResumes, refetch } = useQuery({
    queryKey: ["all-resumes"],
    queryFn: async () => {
      if (!session?.user) return { regular: [], optimized: [] };

      // Fetch regular resumes
      const { data: regularResumes, error: regularError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", session.user.id);

      if (regularError) throw regularError;

      // Fetch optimized resumes with job information
      const { data: optimizedResumes, error: optimizedError } = await supabase
        .from("optimized_resumes")
        .select(`
          *,
          jobs (
            title
          )
        `)
        .eq("user_id", session.user.id);

      if (optimizedError) throw optimizedError;

      return {
        regular: regularResumes || [],
        optimized: optimizedResumes || [],
      };
    },
  });

  const handleDelete = async (id: string, isOptimized: boolean = false) => {
    try {
      const { error } = await supabase
        .from(isOptimized ? "optimized_resumes" : "profiles")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Resume deleted successfully",
      });
      refetch();
    } catch (error) {
      console.error("Error deleting resume:", error);
      toast({
        title: "Error",
        description: "Failed to delete resume",
        variant: "destructive",
      });
    }
  };

  const combinedResumes = [
    ...(allResumes?.regular?.map(resume => ({ ...resume, type: 'regular' as const })) || []),
    ...(allResumes?.optimized?.map(resume => ({ 
      ...resume, 
      type: 'optimized' as const,
      jobTitle: resume.jobs?.title || 'Unknown Job'
    })) || [])
  ];

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Resumes</h1>
        <Button asChild>
          <Link to="/builder">
            <FileText className="mr-2 h-4 w-4" />
            Create New Resume
          </Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Job Title</TableHead>
            <TableHead className="text-right w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {combinedResumes.map((resume) => (
            <TableRow key={resume.id}>
              <TableCell>{resume.name || resume.version_name}</TableCell>
              <TableCell>
                <Badge variant={resume.type === 'optimized' ? "secondary" : "default"}>
                  {resume.type === 'optimized' ? 'Optimized' : 'Original'}
                </Badge>
              </TableCell>
              <TableCell>
                {resume.type === 'optimized' ? resume.jobTitle : '-'}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end">
                  <ResumeActions 
                    resume={resume} 
                    onDelete={(id) => handleDelete(id, resume.type === 'optimized')} 
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </MainLayout>
  );
};

export default Resumes;