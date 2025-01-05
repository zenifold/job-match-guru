import { AlertTriangle, AlertOctagon, AlertCircle, Info } from "lucide-react";

interface PriorityIconProps {
  priority: string;
}

export function PriorityIcon({ priority }: PriorityIconProps) {
  switch (priority.toLowerCase()) {
    case 'critical':
      return <AlertOctagon className="h-4 w-4 text-red-500" />;
    case 'high':
      return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    case 'medium':
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    default:
      return <Info className="h-4 w-4 text-blue-500" />;
  }
}