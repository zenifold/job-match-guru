import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Mail, Phone, MapPin, Github, Linkedin } from "lucide-react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ResumeTemplateProps {
  data: any;
}

export const ResumeTemplate = ({ data }: ResumeTemplateProps) => {
  const downloadPDF = async () => {
    const element = document.getElementById('resume-content');
    if (!element) return;

    try {
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('resume.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white">
      <div className="flex justify-end mb-4">
        <Button onClick={downloadPDF} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>

      <div id="resume-content" className="space-y-8">
        {/* Header */}
        {data.personalInfo && (
          <div className="border-b pb-6">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              {data.personalInfo.fullName}
            </h1>
            <div className="flex flex-wrap gap-4 text-muted-foreground">
              {data.personalInfo.email && (
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  {data.personalInfo.email}
                </div>
              )}
              {data.personalInfo.phone && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  {data.personalInfo.phone}
                </div>
              )}
              {data.personalInfo.location && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {data.personalInfo.location}
                </div>
              )}
              {data.personalInfo.github && (
                <div className="flex items-center">
                  <Github className="h-4 w-4 mr-2" />
                  <a href={data.personalInfo.github} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                    GitHub
                  </a>
                </div>
              )}
              {data.personalInfo.linkedin && (
                <div className="flex items-center">
                  <Linkedin className="h-4 w-4 mr-2" />
                  <a href={data.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                    LinkedIn
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Experience</h2>
            <div className="space-y-6">
              {data.experience.map((exp: any, index: number) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg">{exp.position}</h3>
                      <p className="text-muted-foreground">{exp.company}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {exp.startDate} - {exp.endDate || "Present"}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Education</h2>
            <div className="space-y-6">
              {data.education.map((edu: any, index: number) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg">{edu.school}</h3>
                      <p className="text-muted-foreground">
                        {edu.degree} in {edu.field}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {edu.startDate} - {edu.endDate || "Present"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};