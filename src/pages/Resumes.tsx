import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Edit2, Download, Trash2, MoreVertical } from "lucide-react";
import { Link } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Resumes = () => {
  const session = useSession();
  const { toast } = useToast();

  const { data: resumes, refetch } = useQuery({
    queryKey: ["resumes"],
    queryFn: async () => {
      if (!session?.user) return [];
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", session.user.id);

      if (error) throw error;
      return data || [];
    },
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
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

  const handleExportJSON = (resume: any) => {
    try {
      const dataStr = JSON.stringify(resume.content, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${resume.name}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "Resume exported successfully as JSON",
      });
    } catch (error) {
      console.error('Error exporting JSON:', error);
      toast({
        title: "Error",
        description: "Failed to export resume as JSON",
        variant: "destructive",
      });
    }
  };

  const handleDownloadPDF = async (resumeData: any) => {
    try {
      const element = document.getElementById('resume-content');
      if (!element) {
        toast({
          title: "Error",
          description: "Resume content not found",
          variant: "destructive",
        });
        return;
      }

      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('resume.pdf');

      toast({
        title: "Success",
        description: "Resume downloaded as PDF",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive",
      });
    }
  };

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
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resumes?.map((resume) => (
            <TableRow key={resume.id}>
              <TableCell>{resume.name}</TableCell>
              <TableCell>
                {new Date(resume.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                >
                  <Link to={`/preview`} state={{ resumeData: resume.content }}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                >
                  <Link to={`/builder`} state={{ resumeData: resume.content }}>
                    <Edit2 className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDownloadPDF(resume.content)}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleExportJSON(resume)}>
                      Export JSON
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(resume.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </MainLayout>
  );
};

export default Resumes;