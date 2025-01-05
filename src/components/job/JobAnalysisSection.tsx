import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart2, Check, Info, RefreshCw, AlertTriangle, AlertOctagon, AlertCircle, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface JobAnalysisSectionProps {
  job: any;
  isAnalyzing: boolean;
  onShowInfo: () => void;
  onReanalyze: () => void;
  onOptimize: () => void;
}

export function JobAnalysisSection({ 
  job, 
  isAnalyzing, 
  onShowInfo, 
  onReanalyze,
  onOptimize 
}: JobAnalysisSectionProps) {
  if (!job.analysis) return null;

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

  const parseKeywords = (text: string, type: 'matched' | 'missing') => {
    return text
      .split('\n')
      .filter(l => type === 'matched' ? l.startsWith('✓') : l.startsWith('•'))
      .map(line => {
        const priorityMatch = line.match(/\((.*?) Priority\)/);
        const priority = priorityMatch ? priorityMatch[1].toLowerCase() : 'standard';
        const keyword = type === 'matched' 
          ? line.replace(/✓ /, '').replace(/\(.*?\)/, '').trim()
          : line.replace('• Consider adding experience or skills related to:', '').replace(/\(.*?\)/, '').trim();
        return { keyword, priority };
      });
  };

  const matchedKeywords = parseKeywords(job.analysis.analysis_text, 'matched');
  const missingKeywords = parseKeywords(job.analysis.analysis_text, 'missing');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-slate-600" />
          Analysis Results
          <Button
            variant="ghost"
            size="icon"
            className="ml-2"
            onClick={onShowInfo}
          >
            <Info className="h-4 w-4 text-slate-600" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="ml-2"
            onClick={onReanalyze}
            disabled={isAnalyzing}
          >
            <RefreshCw className={cn(
              "h-4 w-4 text-slate-600",
              isAnalyzing && "animate-spin"
            )} />
          </Button>
        </h3>
        <div className="flex items-center gap-4">
          <div className="text-center px-4 py-2 bg-slate-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(job.analysis.match_score)}%
            </div>
            <div className="text-sm text-slate-600">Match Score</div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="hover:bg-slate-100 flex items-center gap-2"
            onClick={onOptimize}
          >
            <Target className="h-4 w-4" />
            Optimize Resume
          </Button>
        </div>
      </div>
      
      <div className="space-y-6">
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-900 text-left flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              Strong Matches
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isAnalyzing ? (
              <div className="space-y-2 animate-pulse">
                <div className="h-8 bg-slate-100 rounded-full w-3/4" />
                <div className="h-8 bg-slate-100 rounded-full w-1/2" />
              </div>
            ) : (
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
            )}
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-900 text-left flex items-center gap-2">
              <Info className="h-5 w-5 text-amber-500" />
              Skills to Develop
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isAnalyzing ? (
              <div className="space-y-2 animate-pulse">
                <div className="h-8 bg-slate-100 rounded-full w-2/3" />
                <div className="h-8 bg-slate-100 rounded-full w-1/2" />
              </div>
            ) : (
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}