import { AlertOctagon, AlertTriangle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface PriorityIconProps {
  priority: string;
  className?: string;
}

export function PriorityIcon({ priority, className }: PriorityIconProps) {
  switch (priority.toLowerCase()) {
    case 'critical':
      return <AlertOctagon className={cn("h-4 w-4 text-red-500", className)} />;
    case 'high':
      return <AlertTriangle className={cn("h-4 w-4 text-orange-500", className)} />;
    case 'medium':
      return <AlertCircle className={cn("h-4 w-4 text-yellow-500", className)} />;
    default:
      return <Info className={cn("h-4 w-4 text-blue-500", className)} />;
  }
}