import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { generatePDF, uploadPDF } from "@/utils/pdf";
import { CombinedResume } from "@/types/resume";

interface DownloadButtonProps {
  resume: CombinedResume;
  themeSettings?: any;
  variant?: "ghost" | "outline" | "default";
  size?: "icon" | "default";
}

export const DownloadButton = ({ resume, themeSettings, variant = "ghost", size = "icon" }: DownloadButtonProps) => {
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
      const pdf = generatePDF(resume.content, themeSettings);
      const publicUrl = await uploadPDF(
        pdf, 
        `${resume.type === 'regular' ? resume.name : resume.version_name}_${new Date().toISOString()}`,
        session.user.id
      );

      // Create a link element and trigger download
      const link = document.createElement('a');
      link.href = publicUrl;
      link.download = `${resume.type === 'regular' ? resume.name : resume.version_name}.pdf`;
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