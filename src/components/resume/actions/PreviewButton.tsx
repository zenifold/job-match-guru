import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
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
    <DropdownMenuItem onClick={handlePreview}>
      <Eye className="mr-2 h-4 w-4" />
      <span>Preview</span>
    </DropdownMenuItem>
  );
};