import { BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PriorityIcon } from "./PriorityIcon";

interface RequiredExperienceCardProps {
  requiredExperience: Array<{ experience: string; priority: string }>;
}

export function RequiredExperienceCard({ requiredExperience }: RequiredExperienceCardProps) {
  if (!requiredExperience.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-purple-500" />
          Required Experience
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {requiredExperience.map(({ experience, priority }, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 bg-purple-50 px-3 py-2 rounded-lg border border-purple-100"
            >
              <span className="font-medium text-slate-700">{experience}</span>
              <PriorityIcon priority={priority} />
              <span className="text-sm text-slate-500">({priority} priority)</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}