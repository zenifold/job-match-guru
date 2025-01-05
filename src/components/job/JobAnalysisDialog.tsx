import { BarChart2, Check, Info, LightbulbIcon, Target, AlertTriangle, AlertOctagon, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface JobAnalysisDialogProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: {
    match_score: number;
    analysis_text: string;
  } | null;
  jobTitle: string;
  jobId: string;
}

export function JobAnalysisDialog({
  isOpen,
  onClose,
  analysis,
  jobTitle,
}: JobAnalysisDialogProps) {
  if (!analysis) return null;

  // Parse the analysis text to extract matched and missing keywords with priorities
  const analysisLines = analysis.analysis_text.split('\n');
  const matchedKeywords: Array<{ keyword: string; priority: string }> = [];
  const missingKeywords: Array<{ keyword: string; priority: string }> = [];

  let currentSection = '';
  analysisLines.forEach(line => {
    if (line.includes('Strong Matches:')) {
      currentSection = 'matched';
    } else if (line.includes('Suggested Improvements:')) {
      currentSection = 'missing';
    } else if (line.startsWith('✓ ')) {
      const priorityMatch = line.match(/\((.*?) Priority\)/);
      const priority = priorityMatch ? priorityMatch[1].toLowerCase() : 'standard';
      const keyword = line.replace(/✓ /, '').replace(/\(.*?\)/, '').trim();
      matchedKeywords.push({ keyword, priority });
    } else if (line.includes('Consider adding experience or skills related to:')) {
      const priorityMatch = line.match(/\((.*?) Priority\)/);
      const priority = priorityMatch ? priorityMatch[1].toLowerCase() : 'standard';
      const keyword = line
        .replace('• Consider adding experience or skills related to:', '')
        .replace(/\(.*?\)/, '')
        .trim();
      missingKeywords.push({ keyword, priority });
    }
  });

  const PriorityIcon = ({ priority }: { priority: string }) => {
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
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <BarChart2 className="h-6 w-6 text-blue-500" />
            Analysis Results - {jobTitle}
          </DialogTitle>
          <DialogDescription>
            Understanding how your resume matches against the job requirements
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Match Score Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                Match Score Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-slate-700">
                  Your resume matched {matchedKeywords.length} out of {matchedKeywords.length + missingKeywords.length} key requirements, resulting in a {Math.round(analysis.match_score)}% match score.
                </p>
                <div className="relative h-4 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    className="absolute left-0 top-0 h-full rounded-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${analysis.match_score}%` }}
                  />
                </div>
                <p className="text-sm text-slate-500 mt-2">
                  A score above 70% indicates a strong match with the job requirements.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Matched Keywords Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                Identified Matches
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {matchedKeywords.map(({ keyword, priority }, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-sm text-slate-700 border border-green-100"
                  >
                    <Check className="h-4 w-4 text-green-500" />
                    {keyword}
                    <PriorityIcon priority={priority} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Improvement Suggestions Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <LightbulbIcon className="h-5 w-5 text-amber-500" />
                Missing Keywords
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {missingKeywords.map(({ keyword, priority }, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-sm text-slate-700 border border-amber-100"
                  >
                    {keyword}
                    <PriorityIcon priority={priority} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Separator className="my-4" />
          
          <Button className="w-full" asChild>
            <Link to="/builder">Optimize Resume</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}