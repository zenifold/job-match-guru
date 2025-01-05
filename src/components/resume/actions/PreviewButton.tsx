import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";

interface PreviewButtonProps {
  resumeData: any;
}

export const PreviewButton = ({ resumeData }: PreviewButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      asChild
    >
      <Link to={`/preview`} state={{ resumeData }}>
        <Eye className="h-4 w-4" />
      </Link>
    </Button>
  );
};