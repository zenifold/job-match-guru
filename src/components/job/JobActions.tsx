import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash, FileText } from "lucide-react";
import { useState } from "react";
import { JobDetailsDialog } from "./JobDetailsDialog";

interface Job {
  id: string;
  title: string;
  description: string;
  status: string;
  date_added: string;
}

interface JobActionsProps {
  job: Job;
  onDelete: (id: string) => void;
  onUpdate: () => void;
}

export const JobActions = ({ job, onDelete, onUpdate }: JobActionsProps) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setShowDetails(true)}>
            <FileText className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => onDelete(job.id)}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <JobDetailsDialog
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        job={job}
        onUpdate={onUpdate}
      />
    </>
  );
};