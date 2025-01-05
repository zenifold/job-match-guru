import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ResumePreviewProps {
  data: any;
  isOptimized?: boolean;
  originalContent?: any;
}

export const ResumePreview = ({ data, isOptimized, originalContent }: ResumePreviewProps) => {
  const downloadPDF = () => {
    // TODO: Implement PDF download
    console.log("Downloading PDF...", data);
  };

  const hasChanges = (section: string, field: string, value: any) => {
    if (!isOptimized || !originalContent) return false;
    return JSON.stringify(originalContent[section]?.[field]) !== JSON.stringify(value);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Preview</h2>
          {isOptimized && (
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-muted-foreground">
                Highlighted sections show optimized content
              </span>
            </div>
          )}
        </div>
        <Button onClick={downloadPDF}>
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>

      <Card className="p-6 space-y-6">
        {/* Personal Info */}
        {data.personalInfo && Object.keys(data.personalInfo).length > 0 && (
          <div className={`space-y-2 ${hasChanges('personalInfo', 'summary', data.personalInfo.summary) ? 'bg-yellow-50 p-2 rounded-md border border-yellow-200' : ''}`}>
            <h1 className="text-2xl font-bold">{data.personalInfo.fullName}</h1>
            <div className="text-sm text-muted-foreground">
              <p>{data.personalInfo.email}</p>
              <p>{data.personalInfo.phone}</p>
              <p>{data.personalInfo.location}</p>
            </div>
          </div>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Experience</h2>
            {data.experience.map((exp: any, index: number) => (
              <div 
                key={index} 
                className={`space-y-2 ${hasChanges('experience', index, exp) ? 'bg-yellow-50 p-2 rounded-md border border-yellow-200' : ''}`}
              >
                <div className="flex justify-between">
                  <h3 className="font-medium">{exp.position}</h3>
                  <p className="text-sm text-muted-foreground">
                    {exp.startDate} - {exp.endDate || "Present"}
                  </p>
                </div>
                <p className="text-sm">{exp.company}</p>
                <p className="text-sm text-muted-foreground">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Education</h2>
            {data.education.map((edu: any, index: number) => (
              <div 
                key={index} 
                className={`space-y-1 ${hasChanges('education', index, edu) ? 'bg-yellow-50 p-2 rounded-md border border-yellow-200' : ''}`}
              >
                <div className="flex justify-between">
                  <h3 className="font-medium">{edu.school}</h3>
                  <p className="text-sm text-muted-foreground">
                    {edu.startDate} - {edu.endDate || "Present"}
                  </p>
                </div>
                <p className="text-sm">
                  {edu.degree} in {edu.field}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill: string, index: number) => {
                const isNew = isOptimized && originalContent?.skills && !originalContent.skills.includes(skill);
                return (
                  <Badge
                    key={index}
                    variant={isNew ? "secondary" : "default"}
                    className={isNew ? "border border-yellow-200" : ""}
                  >
                    {skill}
                    {isNew && <span className="ml-1 text-xs">(Added)</span>}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};