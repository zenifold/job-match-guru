import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import { Link } from "react-router-dom";

interface EditButtonProps {
  resumeData: any;
}

export const EditButton = ({ resumeData }: EditButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      asChild
    >
      <Link to={`/builder`} state={{ resumeData }}>
        <Edit2 className="h-4 w-4" />
      </Link>
    </Button>
  );
};