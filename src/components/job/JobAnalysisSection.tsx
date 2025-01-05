import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart2, Check, Info, RefreshCw, AlertTriangle, AlertOctagon, AlertCircle, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { MatchScoreCard } from "./analysis/MatchScoreCard";
import { MatchedSkillsCard } from "./analysis/MatchedSkillsCard";
import { TargetKeywordsCard } from "./analysis/TargetKeywordsCard";
import { RequiredExperienceCard } from "./analysis/RequiredExperienceCard";
import { AIAssistantChat } from "./analysis/AIAssistantChat";

interface JobAnalysisSectionProps {
  job: any;
  isAnalyzing: boolean;
  onReanalyze: () => void;
  onOptimize: () => void;
}

export function JobAnalysisSection({ 
  job, 
  isAnalyzing,
  onReanalyze,
  onOptimize 
}: JobAnalysisSectionProps) {
  if (!job.analysis) return null;

  const analysisLines = job.analysis.analysis_text.split('\n');
  const matchedKeywords: Array<{ keyword: string; priority: string }> = [];
  const targetKeywords: Array<{ keyword: string; priority: string }> = [];
  const requiredExperience: Array<{ experience: string; priority: string }> = [];

  let currentSection = '';
  analysisLines.forEach(line => {
    if (line.includes('Strong Matches:')) {
      currentSection = 'matched';
    } else if (line.includes('Target Keywords:')) {
      currentSection = 'target';
    } else if (line.includes('Required Experience:')) {
      currentSection = 'experience';
    } else if (line.startsWith('✓ ')) {
      const priorityMatch = line.match(/\((.*?) Priority\)/);
      const priority = priorityMatch ? priorityMatch[1].toLowerCase() : 'standard';
      const keyword = line.replace(/✓ /, '').replace(/\(.*?\)/, '').trim();
      matchedKeywords.push({ keyword, priority });
    } else if (line.startsWith('- ') && currentSection === 'target') {
      const priorityMatch = line.match(/\((.*?) Priority\)/);
      const priority = priorityMatch ? priorityMatch[1].toLowerCase() : 'standard';
      const keyword = line.replace(/- /, '').replace(/\(.*?\)/, '').trim();
      targetKeywords.push({ keyword, priority });
    } else if (line.startsWith('- ') && currentSection === 'experience') {
      const priorityMatch = line.match(/\((.*?) Priority\)/);
      const priority = priorityMatch ? priorityMatch[1].toLowerCase() : 'standard';
      const experience = line.replace(/- /, '').replace(/\(.*?\)/, '').trim();
      requiredExperience.push({ experience, priority });
    }
  });

  // Calculate match statistics
  const totalRequirements = targetKeywords.length;
  const matchedCount = matchedKeywords.length;
  const missingCount = Math.max(0, totalRequirements - matchedCount);

  // Calculate weighted match score
  const calculateWeightedScore = () => {
    if (totalRequirements === 0) return 0;

    const weights = {
      critical: 1.5,
      high: 1.25,
      medium: 1,
      standard: 0.75
    };

    const totalWeightedMatches = matchedKeywords.reduce((acc, { priority }) => {
      return acc + (weights[priority as keyof typeof weights] || weights.standard);
    }, 0);

    const totalPossibleWeight = targetKeywords.reduce((acc, { priority }) => {
      return acc + (weights[priority as keyof typeof weights] || weights.standard);
    }, 0);

    return totalPossibleWeight > 0 
      ? (totalWeightedMatches / totalPossibleWeight) * 100 
      : 0;
  };

  const matchScore = calculateWeightedScore();

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
        <MatchScoreCard 
          matchScore={matchScore}
          matchedCount={matchedCount}
          missingCount={missingCount}
          totalRequirements={totalRequirements}
        />

        <div className="grid grid-cols-1 gap-6">
          <MatchedSkillsCard matchedKeywords={matchedKeywords} />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <TargetKeywordsCard targetKeywords={targetKeywords} />
          <RequiredExperienceCard requiredExperience={requiredExperience} />
        </div>

        <AIAssistantChat
          jobTitle={job.title}
          matchScore={matchScore}
          matchedKeywords={matchedKeywords}
          missingKeywords={[]}
        />
      </div>
    </div>
  );
}