import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import { Link } from "react-router-dom";
import { CombinedResume } from "@/types/resume";

interface EditButtonProps {
  resume: CombinedResume;
}

export const EditButton = ({ resume }: EditButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      asChild
    >
      <Link to={`/builder`} state={{ resumeData: resume.content }}>
        <Edit2 className="h-4 w-4" />
      </Link>
    </Button>
  );
};