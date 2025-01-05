import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PriorityIcon } from "./PriorityIcon";

interface MatchedSkillsCardProps {
  matchedKeywords: Array<{ keyword: string; priority: string }>;
}

export function MatchedSkillsCard({ matchedKeywords }: MatchedSkillsCardProps) {
  return (
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
  );
}