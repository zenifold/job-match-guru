import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { FileText, Palette } from "lucide-react";
import { Link } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { ThemeCustomizerDialog } from "@/components/resume/theme/ThemeCustomizerDialog";
import { ResumeTable } from "@/components/resume/ResumeTable";
import { OptimizedResumeTable } from "@/components/resume/OptimizedResumeTable";
import { MasterResumeTable } from "@/components/resume/MasterResumeTable";
import { CombinedResume, OptimizedResume, RegularResume } from "@/types/resume";

const Resumes = () => {
  const session = useSession();
  const { toast } = useToast();
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  const { data: allResumes, refetch, isLoading, error } = useQuery({
    queryKey: ["all-resumes", session?.user?.id],
    queryFn: async () => {
      if (!session?.user) {
        console.log("No session found, returning empty resumes arrays");
        return { regular: [], optimized: [] };
      }

      console.log("Fetching resumes data...");

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

      console.log("Regular resumes:", regularResumes);
      console.log("Optimized resumes:", optimizedResumes);

      return {
        regular: regularResumes || [],
        optimized: optimizedResumes || [],
      };
    },
    enabled: !!session?.user,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    retry: 2,
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

  const masterResumes = combinedResumes.filter(
    resume => resume.type === 'regular' && resume.is_master
  ) as RegularResume[];

  const optimizedResumes = combinedResumes.filter(
    resume => resume.type === 'optimized'
  ) as OptimizedResume[];

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-pulse text-gray-500">Loading resumes...</div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-red-500">Error loading resumes. Please try again.</div>
        </div>
      </MainLayout>
    );
  }

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
          <ResumeTable resumes={combinedResumes} onDelete={handleDelete} />
        </TabsContent>

        <TabsContent value="master">
          <MasterResumeTable resumes={masterResumes} onDelete={handleDelete} />
        </TabsContent>

        <TabsContent value="optimized">
          <OptimizedResumeTable resumes={optimizedResumes} onDelete={handleDelete} />
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
