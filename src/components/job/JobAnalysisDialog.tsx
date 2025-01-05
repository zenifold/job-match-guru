import { Check, LightbulbIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface JobAnalysisDialogProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: {
    match_score: number;
    analysis_text: string;
  } | null;
  jobTitle: string;
  jobId: string; // Added this prop to match what's being passed
}

export function JobAnalysisDialog({
  isOpen,
  onClose,
  analysis,
  jobTitle,
}: JobAnalysisDialogProps) {
  if (!analysis) return null;

  // Parse the analysis text to extract matched and missing keywords
  const analysisLines = analysis.analysis_text.split('\n');
  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  let currentSection = '';
  analysisLines.forEach(line => {
    if (line.includes('Strong Matches:')) {
      currentSection = 'matched';
    } else if (line.includes('Suggested Improvements:')) {
      currentSection = 'missing';
    } else if (line.startsWith('✓ ')) {
      matchedKeywords.push(line.replace('✓ ', '').trim());
    } else if (line.startsWith('• Consider adding experience or skills related to:')) {
      missingKeywords.push(line.replace('• Consider adding experience or skills related to:', '').trim());
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Job Match Analysis - {jobTitle}
          </DialogTitle>
          <DialogDescription>
            Analysis of your resume against the job requirements
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="flex items-center gap-2 text-lg font-medium text-blue-500">
            <Check className="h-6 w-6" />
            <span>Match Score Analysis</span>
          </div>

          <div className="space-y-2">
            <p className="text-gray-700">
              Your resume has matched {matchedKeywords.length} out of {matchedKeywords.length + missingKeywords.length} ({Math.round(analysis.match_score)}%) 
              keywords that appear in the job description.
            </p>

            <div className="relative h-4 w-full rounded-full bg-gray-100">
              <div 
                className="absolute left-0 top-0 h-full rounded-full bg-blue-500"
                style={{ width: `${analysis.match_score}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-amber-500">
              <LightbulbIcon className="h-5 w-5" />
              <p>Try to get your score above 70% to increase your chances!</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">Matched Keywords:</h4>
            <div className="flex flex-wrap gap-2">
              {matchedKeywords.map((keyword) => (
                <div
                  key={keyword}
                  className="flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-sm text-green-700"
                >
                  <Check className="h-4 w-4" />
                  {keyword}
                </div>
              ))}
            </div>
          </div>

          {missingKeywords.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">Missing Keywords:</h4>
              <div className="flex flex-wrap gap-2">
                {missingKeywords.map((keyword) => (
                  <div
                    key={keyword}
                    className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                  >
                    {keyword}
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button className="w-full" asChild>
            <Link to="/builder">Tailor Resume</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}