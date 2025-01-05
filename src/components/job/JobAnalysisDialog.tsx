import { BarChart2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { MatchScoreCard } from "./analysis/MatchScoreCard";
import { MatchedSkillsCard } from "./analysis/MatchedSkillsCard";
import { MissingSkillsCard } from "./analysis/MissingSkillsCard";
import { TargetKeywordsCard } from "./analysis/TargetKeywordsCard";
import { RequiredExperienceCard } from "./analysis/RequiredExperienceCard";
import { AIAssistantChat } from "./analysis/AIAssistantChat";

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
  const targetKeywords: Array<{ keyword: string; priority: string }> = [];
  const requiredExperience: Array<{ experience: string; priority: string }> = [];

  let currentSection = '';
  analysisLines.forEach(line => {
    if (line.includes('Strong Matches:')) {
      currentSection = 'matched';
    } else if (line.includes('Suggested Improvements:')) {
      currentSection = 'missing';
    } else if (line.includes('Target Keywords:')) {
      currentSection = 'target';
    } else if (line.includes('Required Experience:')) {
      currentSection = 'experience';
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
          <MatchScoreCard 
            matchScore={analysis.match_score}
            matchedCount={matchedKeywords.length}
            missingCount={missingKeywords.length}
          />

          <div className="grid grid-cols-2 gap-6">
            <MatchedSkillsCard matchedKeywords={matchedKeywords} />
            <MissingSkillsCard missingKeywords={missingKeywords} />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <TargetKeywordsCard targetKeywords={targetKeywords} />
            <RequiredExperienceCard requiredExperience={requiredExperience} />
          </div>

          <AIAssistantChat
            jobTitle={jobTitle}
            matchScore={analysis.match_score}
            matchedKeywords={matchedKeywords}
            missingKeywords={missingKeywords}
          />

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