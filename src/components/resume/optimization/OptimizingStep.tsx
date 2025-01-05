import { Loader2 } from "lucide-react";

export function OptimizingStep() {
  return (
    <div className="text-center space-y-4">
      <div className="flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="mt-4 text-sm text-gray-600">
          Optimizing your resume...
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Our AI is analyzing your resume and making improvements
        </p>
      </div>
    </div>
  );
}