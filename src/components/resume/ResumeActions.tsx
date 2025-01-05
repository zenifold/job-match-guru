import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteButton } from "./actions/DeleteButton";
import { PreviewButton } from "./actions/PreviewButton";
import { EditButton } from "./actions/EditButton";
import { DownloadButton } from "./actions/DownloadButton";
import { CombinedResume } from "@/types/resume";

interface ResumeActionsProps {
  resume: CombinedResume;
  onDelete: (id: string) => void;
  themeSettings?: any;
}

export const ResumeActions = ({ resume, onDelete, themeSettings }: ResumeActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <PreviewButton resume={resume} themeSettings={themeSettings} />
        <EditButton resume={resume} />
        <DownloadButton resume={resume} themeSettings={themeSettings} />
        <DeleteButton onDelete={() => onDelete(resume.id)} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};