import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function OptimizingStep() {
  return (
    <div className="text-center space-y-6">
      <div className="flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <h3 className="text-lg font-semibold mt-4">Optimizing Your Resume</h3>
        <Progress value={33} className="w-[60%] mt-4" />
        <div className="space-y-2 mt-4">
          <p className="text-sm text-muted-foreground">
            Our AI is analyzing your resume and making improvements
          </p>
          <p className="text-xs text-muted-foreground">
            This usually takes about 30 seconds
          </p>
        </div>
      </div>
    </div>
  );
}