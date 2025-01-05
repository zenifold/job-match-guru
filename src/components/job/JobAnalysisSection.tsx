import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, Check, Info, RefreshCw, AlertTriangle, AlertOctagon, AlertCircle } from "lucide-react";
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
          <div className={cn(
            "px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2",
            job.analysis.match_score >= 70 
              ? "bg-green-100 text-green-700" 
              : job.analysis.match_score >= 50 
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          )}>
            {isAnalyzing ? (
              <div className="animate-pulse">Analyzing...</div>
            ) : (
              `Match Score: ${Math.round(job.analysis.match_score)}%`
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="hover:bg-slate-100 flex items-center gap-2"
            onClick={onOptimize}
          >
            <RefreshCw className="h-4 w-4" />
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
          <CardContent className="flex flex-wrap gap-1.5">
            {isAnalyzing ? (
              <div className="w-full space-y-2">
                <div className="h-8 bg-slate-100 rounded-full animate-pulse w-3/4" />
                <div className="h-8 bg-slate-100 rounded-full animate-pulse w-1/2" />
              </div>
            ) : (
              parseKeywords(job.analysis.analysis_text, 'matched').map(({ keyword, priority }, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-sm text-slate-700 border border-green-100"
                >
                  <Check className="h-4 w-4 text-green-500" />
                  {keyword}
                  <PriorityIcon priority={priority} />
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-900 text-left flex items-center gap-2">
              <Info className="h-5 w-5 text-amber-500" />
              Missing Keywords
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-1.5">
            {isAnalyzing ? (
              <div className="w-full space-y-2">
                <div className="h-8 bg-slate-100 rounded-full animate-pulse w-2/3" />
                <div className="h-8 bg-slate-100 rounded-full animate-pulse w-1/2" />
              </div>
            ) : (
              parseKeywords(job.analysis.analysis_text, 'missing').map(({ keyword, priority }, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-sm text-slate-700 border border-amber-100"
                >
                  {keyword}
                  <PriorityIcon priority={priority} />
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}