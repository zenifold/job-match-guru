import { Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PriorityIcon } from "./PriorityIcon";

interface TargetKeywordsCardProps {
  targetKeywords: Array<{ keyword: string; priority: string }>;
}

export function TargetKeywordsCard({ targetKeywords }: TargetKeywordsCardProps) {
  if (!targetKeywords.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-500" />
          Target Keywords
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {targetKeywords.map(({ keyword, priority }, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg border border-blue-100"
            >
              <span className="font-medium text-slate-700">{keyword}</span>
              <PriorityIcon priority={priority} />
              <span className="text-sm text-slate-500">({priority} priority)</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}