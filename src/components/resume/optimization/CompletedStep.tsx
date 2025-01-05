import { Check } from "lucide-react";

export function CompletedStep() {
  return (
    <div className="text-center space-y-4">
      <div className="rounded-full bg-green-100 p-3 w-12 h-12 mx-auto flex items-center justify-center">
        <Check className="w-6 h-6 text-green-600" />
      </div>
      <h3 className="text-lg font-semibold">Optimization Complete!</h3>
      <p className="text-sm text-gray-600">
        Your resume has been optimized and saved
      </p>
    </div>
  );
}