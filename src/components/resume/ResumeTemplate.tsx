import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { ResumeHeader } from "./sections/ResumeHeader";
import { ResumeExperience } from "./sections/ResumeExperience";
import { ResumeEducation } from "./sections/ResumeEducation";
import { ResumeSkills } from "./sections/ResumeSkills";

interface ResumeTemplateProps {
  data: any;
  themeSettings?: any;
}

export const ResumeTemplate = ({ data, themeSettings }: ResumeTemplateProps) => {
  const downloadPDF = () => {
    // Create a new window with just the resume content
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups for this website');
      return;
    }

    // Write the HTML content
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${data.personalInfo?.fullName || 'Resume'}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 40px auto;
              padding: 20px;
            }
            h1 { font-size: 24px; margin-bottom: 8px; }
            h2 { font-size: 20px; margin-top: 24px; margin-bottom: 16px; border-bottom: 2px solid #eee; padding-bottom: 8px; }
            .contact-info { color: #666; margin-bottom: 24px; }
            .experience-item, .education-item { margin-bottom: 20px; }
            .date { color: #666; font-size: 14px; }
            .skills { display: flex; flex-wrap: wrap; gap: 8px; }
            .skill-tag {
              background: #f3f4f6;
              padding: 4px 12px;
              border-radius: 4px;
              font-size: 14px;
            }
            @media print {
              body { margin: 0; padding: 20px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="no-print" style="margin-bottom: 20px;">
            <button onclick="window.print()">Print/Save as PDF</button>
          </div>

          ${data.personalInfo ? `
            <header>
              <h1>${data.personalInfo.fullName}</h1>
              <div class="contact-info">
                ${data.personalInfo.email ? `<div>${data.personalInfo.email}</div>` : ''}
                ${data.personalInfo.phone ? `<div>${data.personalInfo.phone}</div>` : ''}
                ${data.personalInfo.location ? `<div>${data.personalInfo.location}</div>` : ''}
                ${data.personalInfo.github ? `<div><a href="${data.personalInfo.github}">GitHub</a></div>` : ''}
                ${data.personalInfo.linkedin ? `<div><a href="${data.personalInfo.linkedin}">LinkedIn</a></div>` : ''}
              </div>
            </header>
          ` : ''}

          ${data.experience?.length ? `
            <section>
              <h2>Experience</h2>
              ${data.experience.map((exp: any) => `
                <div class="experience-item">
                  <div style="display: flex; justify-content: space-between;">
                    <strong>${exp.position}</strong>
                    <span class="date">${exp.startDate} - ${exp.endDate || 'Present'}</span>
                  </div>
                  <div>${exp.company}</div>
                  <p>${exp.description}</p>
                  ${exp.keyResponsibilities?.length ? `
                    <ul>
                      ${exp.keyResponsibilities.map((resp: string) => `<li>${resp}</li>`).join('')}
                    </ul>
                  ` : ''}
                </div>
              `).join('')}
            </section>
          ` : ''}

          ${data.education?.length ? `
            <section>
              <h2>Education</h2>
              ${data.education.map((edu: any) => `
                <div class="education-item">
                  <div style="display: flex; justify-content: space-between;">
                    <strong>${edu.school}</strong>
                    <span class="date">${edu.startDate} - ${edu.endDate || 'Present'}</span>
                  </div>
                  <div>${edu.degree} in ${edu.field}</div>
                </div>
              `).join('')}
            </section>
          ` : ''}

          ${data.skills?.length ? `
            <section>
              <h2>Skills</h2>
              <div class="skills">
                ${data.skills.map((skill: string) => `
                  <span class="skill-tag">${skill}</span>
                `).join('')}
              </div>
            </section>
          ` : ''}
        </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  const styles = {
    container: `max-w-4xl mx-auto p-8 ${themeSettings?.colors?.background || 'bg-white'}`,
    content: `space-y-${themeSettings?.spacing?.sectionGap || '8'}`,
    text: {
      fontFamily: themeSettings?.font?.family || 'Inter',
      fontSize: themeSettings?.font?.size?.body || '16px',
      lineHeight: themeSettings?.spacing?.lineHeight || '1.6',
      color: themeSettings?.colors?.primary || '#1a1a1a'
    }
  };

  return (
    <div className={styles.container} style={styles.text}>
      <div className="flex justify-end mb-4">
        <Button onClick={downloadPDF} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>

      <div id="resume-content" className={styles.content}>
        <ResumeHeader data={data.personalInfo} themeSettings={themeSettings} />
        <ResumeExperience data={data.experience} themeSettings={themeSettings} />
        <ResumeEducation data={data.education} themeSettings={themeSettings} />
        <ResumeSkills data={data.skills} themeSettings={themeSettings} />
      </div>
    </div>
  );
};
