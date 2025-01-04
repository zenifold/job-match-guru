import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ResumePreviewProps {
  data: any;
}

export const ResumePreview = ({ data }: ResumePreviewProps) => {
  const downloadPDF = () => {
    // TODO: Implement PDF download
    console.log("Downloading PDF...", data);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Preview</h2>
        <Button onClick={downloadPDF}>
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>
      <Card className="p-6 space-y-6">
        {/* Personal Info */}
        {data.personalInfo && Object.keys(data.personalInfo).length > 0 && (
          <div className="space-y-2">
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
              <div key={index} className="space-y-2">
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
              <div key={index} className="space-y-1">
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
              {data.skills.map((skill: string, index: number) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};