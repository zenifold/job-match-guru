import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CombinedResume } from "@/types/resume";

interface PreviewButtonProps {
  resume: CombinedResume;
  themeSettings?: any;
}

export const PreviewButton = ({ resume, themeSettings }: PreviewButtonProps) => {
  const navigate = useNavigate();

  const handlePreview = () => {
    navigate("/preview", { 
      state: { 
        resumeData: resume.content,
        themeSettings: themeSettings
      } 
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handlePreview}
    >
      <Eye className="h-4 w-4" />
    </Button>
  );
};