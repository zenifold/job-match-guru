import { BarChart2, Check, Info, LightbulbIcon, Target, AlertTriangle, AlertOctagon, AlertCircle, BookOpen, ExternalLink } from "lucide-react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

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

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

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

  const getLearningResources = (keyword: string) => {
    return [
      { name: "Coursera", url: `https://www.coursera.org/search?query=${encodeURIComponent(keyword)}` },
      { name: "Udemy", url: `https://www.udemy.com/courses/search/?q=${encodeURIComponent(keyword)}` },
      { name: "LinkedIn Learning", url: `https://www.linkedin.com/learning/search?keywords=${encodeURIComponent(keyword)}` }
    ];
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <BarChart2 className="h-6 w-6 text-blue-500" />
            Analysis Results - {jobTitle}
          </DialogTitle>
          <DialogDescription>
            Detailed analysis of your resume's match with the job requirements
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Match Score Section with Enhanced Visualization */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-500" />
                Match Score Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Overall Match</span>
                <span className={`text-2xl font-bold ${getMatchScoreColor(analysis.match_score)}`}>
                  {Math.round(analysis.match_score)}%
                </span>
              </div>
              <Progress value={analysis.match_score} className="h-2" />
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{matchedKeywords.length}</div>
                  <div className="text-sm text-slate-600">Matched Skills</div>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{missingKeywords.length}</div>
                  <div className="text-sm text-slate-600">Missing Skills</div>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {matchedKeywords.length + missingKeywords.length}
                  </div>
                  <div className="text-sm text-slate-600">Total Requirements</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Matched Keywords Section with Enhanced Visualization */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                Your Matching Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {matchedKeywords.map(({ keyword, priority }, idx) => (
                  <TooltipProvider key={idx}>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-sm text-slate-700 border border-green-100">
                          <Check className="h-4 w-4 text-green-500" />
                          {keyword}
                          <PriorityIcon priority={priority} />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{priority.charAt(0).toUpperCase() + priority.slice(1)} Priority Skill</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Missing Keywords Section with Learning Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <LightbulbIcon className="h-5 w-5 text-amber-500" />
                Skills to Develop
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {missingKeywords.map(({ keyword, priority }, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <PriorityIcon priority={priority} />
                        <span className="font-medium">{keyword}</span>
                        <span className="text-sm text-slate-500">({priority} priority)</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="text-sm text-slate-600 mb-2">Learning Resources:</div>
                      <div className="flex gap-2">
                        {getLearningResources(keyword).map((resource, resourceIdx) => (
                          <a
                            key={resourceIdx}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                          >
                            <BookOpen className="h-4 w-4" />
                            {resource.name}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Separator className="my-4" />
          
          <div className="flex gap-4">
            <Button className="w-full" asChild>
              <Link to="/builder">Optimize Resume</Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}