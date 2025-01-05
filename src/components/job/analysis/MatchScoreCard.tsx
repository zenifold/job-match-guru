import { Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface MatchScoreCardProps {
  matchScore: number;
  matchedCount: number;
  missingCount: number;
}

export function MatchScoreCard({ matchScore, matchedCount, missingCount }: MatchScoreCardProps) {
  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
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
          <span className={`text-2xl font-bold ${getMatchScoreColor(matchScore)}`}>
            {Math.round(matchScore)}%
          </span>
        </div>
        <Progress value={matchScore} className="h-2" />
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{matchedCount}</div>
            <div className="text-sm text-slate-600">Matched Skills</div>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{missingCount}</div>
            <div className="text-sm text-slate-600">Missing Skills</div>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {matchedCount + missingCount}
            </div>
            <div className="text-sm text-slate-600">Total Requirements</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}