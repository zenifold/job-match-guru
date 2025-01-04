import { Button } from "@/components/ui/button";
import { Download, Mail, Phone, MapPin, Github, Linkedin } from "lucide-react";
import { ResumeThemeStyles } from "./ResumeThemeStyles";
import { useResumeTheme } from "@/contexts/ThemeContext";

interface ResumeTemplateProps {
  data: any;
}

export const ResumeTemplate = ({ data }: ResumeTemplateProps) => {
  const { theme } = useResumeTheme();
  const styles = getThemeStyles(theme);

  const downloadPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups for this website');
      return;
    }

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
            ${theme === 'modern' ? `
              h1 { color: #6366f1; }
              .section-heading { color: #6366f1; border-bottom: 2px solid #6366f1; }
            ` : theme === 'classic' ? `
              h1 { font-family: Georgia, serif; }
              .section-heading { font-family: Georgia, serif; border-bottom: 1px solid #333; }
            ` : theme === 'minimal' ? `
              h1 { font-weight: 300; }
              .section-heading { font-weight: 300; }
            ` : `
              h1 { color: #2563eb; }
              .section-heading { color: #2563eb; border-bottom: 2px solid #2563eb; }
            `}
            h1 { font-size: 24px; margin-bottom: 8px; }
            h2 { font-size: 20px; margin-top: 24px; margin-bottom: 16px; padding-bottom: 8px; }
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

  return (
    <ResumeThemeStyles>
      <div className="flex justify-end mb-4">
        <Button onClick={downloadPDF} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>

      <div id="resume-content" className="space-y-8">
        {data.personalInfo && (
          <div className={styles.header}>
            <h1 className={styles.heading}>
              {data.personalInfo.fullName}
            </h1>
            <div className={styles.contactInfo}>
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

        {data.experience && data.experience.length > 0 && (
          <div className="space-y-4">
            <h2 className={styles.sectionHeading}>Experience</h2>
            <div className="space-y-6">
              {data.experience.map((exp: any, index: number) => (
                <div key={index} className={styles.experienceItem}>
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
    </ResumeThemeStyles>
  );
};
