import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface DeleteButtonProps {
  onDelete: () => void;
}

export const DeleteButton = ({ onDelete }: DeleteButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onDelete}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
};