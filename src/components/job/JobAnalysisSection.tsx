import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
  error?: { type: 'rate-limit' | 'ai-error' | 'general'; message: string };
  onReanalyze: () => void;
  onOptimize: () => void;
}

export function JobAnalysisSection({ 
  job, 
  isAnalyzing,
  error,
  onReanalyze,
  onOptimize 
}: JobAnalysisSectionProps) {
  const renderError = () => {
    if (!error) return null;

    const errorConfig = {
      'rate-limit': {
        icon: AlertOctagon,
        title: 'Rate Limit Reached',
        description: error.message || 'Please wait a moment before trying again.',
      },
      'ai-error': {
        icon: AlertTriangle,
        title: 'AI Analysis Error',
        description: error.message || 'There was an issue analyzing your job. Please try again later.',
      },
      'general': {
        icon: AlertCircle,
        title: 'Error',
        description: error.message || 'An unexpected error occurred. Please try again.',
      }
    };

    const config = errorConfig[error.type];

    return (
      <Alert variant="destructive" className="mb-6">
        <config.icon className="h-4 w-4" />
        <AlertTitle>{config.title}</AlertTitle>
        <AlertDescription>{config.description}</AlertDescription>
      </Alert>
    );
  };

  if (!job.analysis && !error) return null;

  const analysisLines = job.analysis?.analysis_text?.split('\n') || [];
  const matchedKeywords: Array<{ keyword: string; priority: string }> = [];
  const targetKeywords: Array<{ keyword: string; priority: string }> = [];
  const requiredExperience: Array<{ experience: string; priority: string }> = [];

  let currentSection = '';
  analysisLines.forEach(line => {
    const trimmedLine = line.trim().toLowerCase();
    
    // More flexible section detection
    if (trimmedLine.includes('strong matches:')) {
      currentSection = 'matched';
    } else if (trimmedLine.includes('target keywords:')) {
      currentSection = 'target';
    } else if (trimmedLine.includes('required experience:')) {
      currentSection = 'experience';
    } else if (line.startsWith('✓ ') || line.startsWith('- ')) {
      const priorityMatch = line.match(/\((.*?) Priority\)/i); // Case-insensitive priority matching
      const priority = priorityMatch ? priorityMatch[1].toLowerCase() : 'standard';
      
      // Remove the priority text and clean up the item text
      const itemText = line
        .replace(/^[✓-]\s*/, '')
        .replace(/\(.*?Priority\)/i, '')
        .trim();

      if (currentSection === 'matched' && line.startsWith('✓')) {
        matchedKeywords.push({ keyword: itemText, priority });
      } else if (currentSection === 'target' && line.startsWith('-')) {
        targetKeywords.push({ keyword: itemText, priority });
      } else if (currentSection === 'experience' && line.startsWith('-')) {
        requiredExperience.push({ experience: itemText, priority });
      }
    }
  });

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

  console.log('Analysis Debug:', {
    sections: {
      matched: matchedKeywords.length,
      target: targetKeywords.length,
      experience: requiredExperience.length
    },
    analysisText: job.analysis.analysis_text
  });

  return (
    <div className="space-y-6">
      {renderError()}
      
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-slate-600" />
          Analysis Results
          <Button
            variant="ghost"
            size="icon"
            className="ml-2"
            onClick={onReanalyze}
            disabled={isAnalyzing || error?.type === 'rate-limit'}
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
            disabled={isAnalyzing || !!error}
          >
            <Target className="h-4 w-4" />
            Optimize Resume
          </Button>
        </div>
      </div>
      
      {job.analysis && (
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
      )}
    </div>
  );
}
