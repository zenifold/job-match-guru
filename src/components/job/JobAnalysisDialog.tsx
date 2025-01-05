import { BarChart2, Check, Info, LightbulbIcon, Target } from "lucide-react";
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
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <BarChart2 className="h-6 w-6 text-blue-500" />
            Analysis Methodology - {jobTitle}
          </DialogTitle>
          <DialogDescription>
            Understanding how your resume was analyzed against the job requirements
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Overview Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-500" />
                Analysis Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-700">
                Our analysis engine performed a comprehensive comparison between your resume and the job description, focusing on three key areas:
              </p>
              <div className="space-y-2 pl-4">
                <li className="text-slate-600">Keyword Extraction: We identified important technical skills, soft skills, and industry-specific terms from the job description.</li>
                <li className="text-slate-600">Resume Scanning: We analyzed your resume content including experience, skills, and projects sections.</li>
                <li className="text-slate-600">Match Calculation: We computed a match score based on the alignment between required and present skills.</li>
              </div>
            </CardContent>
          </Card>

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
                <Info className="h-5 w-5 text-blue-500" />
                Identified Matches
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-700">
                These keywords were found in your resume and align with the job requirements:
              </p>
              <div className="flex flex-wrap gap-2">
                {matchedKeywords.map((keyword) => (
                  <div
                    key={keyword}
                    className="flex items-center gap-1 rounded-full bg-green-50 px-3 py-1.5 text-sm text-slate-700 border border-green-100"
                  >
                    <Check className="h-4 w-4 text-green-500" />
                    {keyword}
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
                Suggested Improvements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-700">
                These keywords were identified as important in the job description but weren't found in your resume:
              </p>
              <div className="flex flex-wrap gap-2">
                {missingKeywords.map((keyword) => (
                  <div
                    key={keyword}
                    className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1.5 text-sm text-slate-700 border border-amber-100"
                  >
                    {keyword}
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-600 mt-4">
                Consider incorporating these keywords into your resume if you have relevant experience in these areas.
                This will improve your match score and increase your chances of getting noticed.
              </p>
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