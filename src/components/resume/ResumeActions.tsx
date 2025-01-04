import { Button } from "@/components/ui/button";
import { Eye, Edit2, Download, Trash2, MoreVertical } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
      tempDiv.style.width = '210mm'; // A4 width
      tempDiv.style.height = '297mm'; // A4 height
      tempDiv.style.backgroundColor = 'white';
      tempDiv.style.padding = '20mm';
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.innerHTML = `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 170mm;">
          <div style="margin-bottom: 30px;">
            <h1 style="font-size: 28px; margin-bottom: 8px; color: #2d3748;">${resume.content.personalInfo?.fullName || ''}</h1>
            <div style="font-size: 14px; color: #4a5568;">
              ${resume.content.personalInfo?.email ? `<div style="margin-bottom: 4px;">${resume.content.personalInfo.email}</div>` : ''}
              ${resume.content.personalInfo?.phone ? `<div style="margin-bottom: 4px;">${resume.content.personalInfo.phone}</div>` : ''}
              ${resume.content.personalInfo?.location ? `<div style="margin-bottom: 4px;">${resume.content.personalInfo.location}</div>` : ''}
              ${resume.content.personalInfo?.github ? `<div style="margin-bottom: 4px;">GitHub: ${resume.content.personalInfo.github}</div>` : ''}
              ${resume.content.personalInfo?.linkedin ? `<div style="margin-bottom: 4px;">LinkedIn: ${resume.content.personalInfo.linkedin}</div>` : ''}
            </div>
          </div>

          ${resume.content.experience?.length ? `
            <div style="margin-bottom: 25px;">
              <h2 style="font-size: 20px; color: #2d3748; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 16px;">Experience</h2>
              ${resume.content.experience.map((exp: any) => `
                <div style="margin-bottom: 20px;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                    <div style="font-weight: bold; font-size: 16px;">${exp.position}</div>
                    <div style="color: #718096; font-size: 14px;">${exp.startDate} - ${exp.endDate || 'Present'}</div>
                  </div>
                  <div style="font-size: 15px; color: #4a5568; margin-bottom: 4px;">${exp.company}</div>
                  <div style="font-size: 14px; color: #718096;">${exp.description}</div>
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${resume.content.education?.length ? `
            <div style="margin-bottom: 25px;">
              <h2 style="font-size: 20px; color: #2d3748; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 16px;">Education</h2>
              ${resume.content.education.map((edu: any) => `
                <div style="margin-bottom: 20px;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                    <div style="font-weight: bold; font-size: 16px;">${edu.school}</div>
                    <div style="color: #718096; font-size: 14px;">${edu.startDate} - ${edu.endDate || 'Present'}</div>
                  </div>
                  <div style="font-size: 15px; color: #4a5568;">${edu.degree} in ${edu.field}</div>
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${resume.content.skills?.length ? `
            <div style="margin-bottom: 25px;">
              <h2 style="font-size: 20px; color: #2d3748; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 16px;">Skills</h2>
              <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                ${resume.content.skills.map((skill: string) => `
                  <span style="background-color: #edf2f7; padding: 4px 12px; border-radius: 4px; font-size: 14px; color: #4a5568;">${skill}</span>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      `;
      document.body.appendChild(tempDiv);

      // Generate PDF with better quality settings
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: tempDiv.scrollWidth,
        windowHeight: tempDiv.scrollHeight,
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