import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { generatePDF, uploadPDF } from "@/utils/pdf";

interface DownloadButtonProps {
  resume: any;
  variant?: "ghost" | "outline" | "default";
  size?: "icon" | "default";
}

export const DownloadButton = ({ resume, variant = "ghost", size = "icon" }: DownloadButtonProps) => {
  const { toast } = useToast();
  const session = useSession();

  const handleDownload = async () => {
    if (!session?.user) {
      toast({
        title: "Error",
        description: "Please sign in to download resumes",
        variant: "destructive",
      });
      return;
    }

    try {
      const pdf = generatePDF(resume.content);
      const publicUrl = await uploadPDF(
        pdf, 
        `${resume.name || 'resume'}_${new Date().toISOString()}`,
        session.user.id
      );

      // Create a link element and trigger download
      const link = document.createElement('a');
      link.href = publicUrl;
      link.download = `${resume.name || 'resume'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Success",
        description: "Resume downloaded successfully",
      });
    } catch (error) {
      console.error('Error downloading resume:', error);
      toast({
        title: "Error",
        description: "Failed to download resume",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleDownload}
    >
      <Download className="h-4 w-4" />
    </Button>
  );
};