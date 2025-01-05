import { PreviewButton } from "./actions/PreviewButton";
import { EditButton } from "./actions/EditButton";
import { ExportButton } from "./actions/ExportButton";
import { DownloadButton } from "./actions/DownloadButton";
import { DeleteButton } from "./actions/DeleteButton";

interface ResumeActionsProps {
  resume: any;
  onDelete: (id: string) => void;
}

export const ResumeActions = ({ resume, onDelete }: ResumeActionsProps) => {
  return (
    <div className="flex space-x-2">
      <PreviewButton resumeData={resume.content} />
      <EditButton resumeData={resume.content} />
      <DownloadButton resume={resume} />
      <ExportButton resume={resume} />
      <DeleteButton onDelete={() => onDelete(resume.id)} />
    </div>
  );
};