import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { FileText, Palette } from "lucide-react";
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
import { ThemeCustomizerDialog } from "@/components/resume/theme/ThemeCustomizerDialog";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type RegularResume = {
  type: 'regular';
  id: string;
  name: string;
  content: any;
  created_at: string;
  user_id: string;
  career_focus: string | null;
  is_master: boolean;
};

type OptimizedResume = {
  type: 'optimized';
  id: string;
  version_name: string;
  content: any;
  created_at: string;
  user_id: string;
  job_id: string;
  original_resume_id: string;
  match_score: number;
  optimization_status: string;
  jobTitle: string;
  jobs: { title: string };
};

type CombinedResume = RegularResume | OptimizedResume;

const Resumes = () => {
  const session = useSession();
  const { toast } = useToast();
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  const { data: allResumes, refetch } = useQuery({
    queryKey: ["all-resumes"],
    queryFn: async () => {
      if (!session?.user) return { regular: [], optimized: [] };

      const { data: regularResumes, error: regularError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", session.user.id);

      if (regularError) throw regularError;

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

  const combinedResumes: CombinedResume[] = [
    ...(allResumes?.regular?.map(resume => ({ 
      ...resume, 
      type: 'regular' as const 
    })) || []),
    ...(allResumes?.optimized?.map(resume => ({ 
      ...resume, 
      type: 'optimized' as const,
      jobTitle: resume.jobs?.title || 'Unknown Job'
    })) || [])
  ];

  // Group master resumes by career focus
  const masterResumes = combinedResumes.filter(
    resume => resume.type === 'regular' && resume.is_master
  ) as RegularResume[];

  const careerFocuses = Array.from(
    new Set(masterResumes.map(resume => resume.career_focus || 'General'))
  );

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Resumes</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsCustomizerOpen(true)}>
            <Palette className="mr-2 h-4 w-4" />
            Customize Templates
          </Button>
          <Button asChild>
            <Link to="/builder">
              <FileText className="mr-2 h-4 w-4" />
              Create New Resume
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Resumes</TabsTrigger>
          <TabsTrigger value="master">Master Resumes</TabsTrigger>
          <TabsTrigger value="optimized">Optimized Versions</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
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
              {combinedResumes.map((resume) => (
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
                        onDelete={(id) => handleDelete(id, resume.type === 'optimized')} 
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="master">
          <div className="space-y-6">
            {careerFocuses.map((focus) => (
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
                    {masterResumes
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
                                onDelete={(id) => handleDelete(id)} 
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
        </TabsContent>

        <TabsContent value="optimized">
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
              {combinedResumes
                .filter((resume): resume is OptimizedResume => resume.type === 'optimized')
                .map((resume) => (
                  <TableRow key={resume.id}>
                    <TableCell>{resume.version_name}</TableCell>
                    <TableCell>{resume.jobTitle}</TableCell>
                    <TableCell>{resume.match_score}%</TableCell>
                    <TableCell>
                      <Badge variant={resume.optimization_status === 'completed' ? 'success' : 'secondary'}>
                        {resume.optimization_status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end">
                        <ResumeActions 
                          resume={resume} 
                          onDelete={(id) => handleDelete(id, true)} 
                        />
                      </div>
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>

      <ThemeCustomizerDialog 
        open={isCustomizerOpen} 
        onOpenChange={setIsCustomizerOpen} 
      />
    </MainLayout>
  );
};

export default Resumes;