import { BookOpen, ExternalLink, LightbulbIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PriorityIcon } from "./PriorityIcon";

interface MissingSkillsCardProps {
  missingKeywords: Array<{ keyword: string; priority: string }>;
}

export function MissingSkillsCard({ missingKeywords }: MissingSkillsCardProps) {
  const getLearningResources = (keyword: string) => {
    return [
      { name: "Coursera", url: `https://www.coursera.org/search?query=${encodeURIComponent(keyword)}` },
      { name: "Udemy", url: `https://www.udemy.com/courses/search/?q=${encodeURIComponent(keyword)}` },
      { name: "LinkedIn Learning", url: `https://www.linkedin.com/learning/search?keywords=${encodeURIComponent(keyword)}` }
    ];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <LightbulbIcon className="h-5 w-5 text-amber-500" />
          Skills to Develop
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {missingKeywords.map(({ keyword, priority }, idx) => (
            <div key={idx} className="bg-slate-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <PriorityIcon priority={priority} />
                  <span className="font-medium">{keyword}</span>
                  <span className="text-sm text-slate-500">({priority} priority)</span>
                </div>
              </div>
              <div className="mt-2">
                <div className="text-sm text-slate-600 mb-2">Learning Resources:</div>
                <div className="flex gap-2">
                  {getLearningResources(keyword).map((resource, resourceIdx) => (
                    <a
                      key={resourceIdx}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                    >
                      <BookOpen className="h-4 w-4" />
                      {resource.name}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}