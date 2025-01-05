import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, Check, Info, RefreshCw } from "lucide-react";
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
              job.analysis.analysis_text
                .split('\n')
                .filter((l: string) => l.startsWith('✓'))
                .map((match: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1 rounded-full bg-green-50 px-3 py-1.5 text-sm text-slate-700 border border-green-100"
                  >
                    <Check className="h-4 w-4 text-green-500" />
                    {match.replace('✓', '').trim()}
                  </div>
                ))
            )}
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-900 text-left flex items-center gap-2">
              <Info className="h-5 w-5 text-amber-500" />
              Suggested Improvements
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-1.5">
            {isAnalyzing ? (
              <div className="w-full space-y-2">
                <div className="h-8 bg-slate-100 rounded-full animate-pulse w-2/3" />
                <div className="h-8 bg-slate-100 rounded-full animate-pulse w-1/2" />
              </div>
            ) : (
              job.analysis.analysis_text
                .split('\n')
                .filter((l: string) => l.startsWith('•'))
                .map((improvement: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1.5 text-sm text-slate-700 border border-amber-100"
                  >
                    {improvement.replace('•', '').trim()}
                  </div>
                ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}