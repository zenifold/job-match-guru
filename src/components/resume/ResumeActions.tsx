import { Button } from "@/components/ui/button";
import { Eye, Edit2, Download, Trash2, MoreVertical } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ResumeTemplate } from "@/components/resume/ResumeTemplate";

interface ResumeActionsProps {
  resume: any;
  onDelete: (id: string) => void;
}

export const ResumeActions = ({ resume, onDelete }: ResumeActionsProps) => {
  const { toast } = useToast();

  const handleExportJSON = () => {
    try {
      const dataStr = JSON.stringify(resume.content, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${resume.name}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "Resume exported successfully as JSON",
      });
    } catch (error) {
      console.error('Error exporting JSON:', error);
      toast({
        title: "Error",
        description: "Failed to export resume as JSON",
        variant: "destructive",
      });
    }
  };

  const handleDownloadPDF = async () => {
    try {
      // Create a temporary div to render the resume
      const tempDiv = document.createElement('div');
      document.body.appendChild(tempDiv);
      
      // Render the ResumeTemplate component into the temporary div
      const resumeContent = document.createElement('div');
      resumeContent.style.width = '210mm'; // A4 width
      resumeContent.style.backgroundColor = 'white';
      resumeContent.style.padding = '20mm';
      tempDiv.appendChild(resumeContent);
      
      // Render the resume content
      resumeContent.innerHTML = `
        <div style="max-width: 170mm;">
          <h1 style="font-size: 24px; margin-bottom: 16px;">${resume.content.personalInfo?.fullName || ''}</h1>
          <div style="margin-bottom: 24px;">
            ${resume.content.personalInfo?.email ? `<div>${resume.content.personalInfo.email}</div>` : ''}
            ${resume.content.personalInfo?.phone ? `<div>${resume.content.personalInfo.phone}</div>` : ''}
            ${resume.content.personalInfo?.location ? `<div>${resume.content.personalInfo.location}</div>` : ''}
          </div>
          ${resume.content.experience?.length ? `
            <h2 style="font-size: 20px; margin-bottom: 16px;">Experience</h2>
            ${resume.content.experience.map((exp: any) => `
              <div style="margin-bottom: 16px;">
                <div style="font-weight: bold;">${exp.position}</div>
                <div>${exp.company}</div>
                <div>${exp.startDate} - ${exp.endDate || 'Present'}</div>
                <div>${exp.description}</div>
              </div>
            `).join('')}
          ` : ''}
          ${resume.content.education?.length ? `
            <h2 style="font-size: 20px; margin-bottom: 16px;">Education</h2>
            ${resume.content.education.map((edu: any) => `
              <div style="margin-bottom: 16px;">
                <div style="font-weight: bold;">${edu.school}</div>
                <div>${edu.degree} in ${edu.field}</div>
                <div>${edu.startDate} - ${edu.endDate || 'Present'}</div>
              </div>
            `).join('')}
          ` : ''}
          ${resume.content.skills?.length ? `
            <h2 style="font-size: 20px; margin-bottom: 16px;">Skills</h2>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              ${resume.content.skills.map((skill: string) => `
                <span style="background-color: #f3f4f6; padding: 4px 8px; border-radius: 4px;">${skill}</span>
              `).join('')}
            </div>
          ` : ''}
        </div>
      `;

      // Generate PDF
      const canvas = await html2canvas(resumeContent, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${resume.name}.pdf`);

      // Clean up
      document.body.removeChild(tempDiv);

      toast({
        title: "Success",
        description: "Resume downloaded as PDF",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex space-x-2">
      <Button
        variant="ghost"
        size="icon"
        asChild
      >
        <Link to={`/preview`} state={{ resumeData: resume.content }}>
          <Eye className="h-4 w-4" />
        </Link>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        asChild
      >
        <Link to={`/builder`} state={{ resumeData: resume.content }}>
          <Edit2 className="h-4 w-4" />
        </Link>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDownloadPDF}
      >
        <Download className="h-4 w-4" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleExportJSON}>
            Export JSON
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(resume.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};