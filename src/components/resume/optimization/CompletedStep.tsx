import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function CompletedStep() {
  return (
    <div className="text-center space-y-6">
      <div className="rounded-full bg-green-100 p-3 w-12 h-12 mx-auto flex items-center justify-center">
        <Check className="w-6 h-6 text-green-600" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Optimization Complete!</h3>
        <p className="text-sm text-muted-foreground">
          Your resume has been optimized and saved
        </p>
      </div>
      <Button asChild className="mt-4">
        <Link to="/resumes">
          View All Resumes <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}