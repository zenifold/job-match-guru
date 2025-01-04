import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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
import { JobActions } from "@/components/job/JobActions";

const Jobs = () => {
  const session = useSession();
  const { toast } = useToast();

  const { data: jobs, refetch } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      if (!session?.user) return [];
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("user_id", session.user.id)
        .order("date_added", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("jobs")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Job deleted successfully",
      });
      refetch();
    } catch (error) {
      console.error("Error deleting job:", error);
      toast({
        title: "Error",
        description: "Failed to delete job",
        variant: "destructive",
      });
    }
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Jobs</h1>
        <Button asChild>
          <Link to="/jobs/new">
            <Plus className="mr-2 h-4 w-4" />
            Add New Job
          </Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date Added</TableHead>
            <TableHead className="text-right w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs?.map((job) => (
            <TableRow key={job.id}>
              <TableCell className="text-left">{job.title}</TableCell>
              <TableCell>{job.status}</TableCell>
              <TableCell>
                {new Date(job.date_added).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end">
                  <JobActions job={job} onDelete={handleDelete} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </MainLayout>
  );
};

export default Jobs;