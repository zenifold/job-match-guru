import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { ResumeHeader } from "./sections/ResumeHeader";
import { ResumeExperience } from "./sections/ResumeExperience";
import { ResumeEducation } from "./sections/ResumeEducation";
import { ResumeSkills } from "./sections/ResumeSkills";
import { useEffect } from "react";

interface ResumeTemplateProps {
  data: any;
  themeSettings?: any;
}

export const ResumeTemplate = ({ data, themeSettings }: ResumeTemplateProps) => {
  useEffect(() => {
    // Load font if specified in theme settings
    if (themeSettings?.font?.family) {
      const loadFont = async () => {
        try {
          // Check if font is already loaded
          const fonts = document.fonts.check(`12px "${themeSettings.font.family}"`);
          if (!fonts) {
            console.log(`Loading font: ${themeSettings.font.family}`);
            await document.fonts.load(`12px "${themeSettings.font.family}"`);
          }
        } catch (error) {
          console.error('Error loading font:', error);
        }
      };

      loadFont();
    }
  }, [themeSettings?.font?.family]);

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
            @import url('https://fonts.googleapis.com/css2?family=${themeSettings?.font?.family || 'Inter'}&display=swap');
            
            body {
              font-family: ${themeSettings?.font?.family || 'Inter'}, sans-serif;
              line-height: ${themeSettings?.spacing?.lineHeight || '1.6'};
              color: ${themeSettings?.colors?.primary || '#333'};
              max-width: 800px;
              margin: 40px auto;
              padding: 20px;
            }
            h1 { 
              font-size: ${themeSettings?.font?.size?.heading || '24px'}; 
              margin-bottom: 8px; 
              color: ${themeSettings?.colors?.primary || '#333'};
            }
            h2 { 
              font-size: ${themeSettings?.font?.size?.subheading || '20px'}; 
              margin-top: 24px; 
              margin-bottom: 16px; 
              border-bottom: 2px solid ${themeSettings?.colors?.accent || '#eee'}; 
              padding-bottom: 8px;
              color: ${themeSettings?.colors?.primary || '#333'};
            }
            .contact-info { 
              color: ${themeSettings?.colors?.secondary || '#666'}; 
              margin-bottom: 24px; 
            }
            .experience-item, .education-item { margin-bottom: 20px; }
            .date { 
              color: ${themeSettings?.colors?.secondary || '#666'}; 
              font-size: 14px; 
            }
            .skills { 
              display: flex; 
              flex-wrap: wrap; 
              gap: 8px; 
            }
            .skill-tag {
              background: ${themeSettings?.colors?.accent ? themeSettings.colors.accent + '20' : '#f3f4f6'};
              padding: 4px 12px;
              border-radius: 4px;
              font-size: 14px;
              color: ${themeSettings?.colors?.primary || '#333'};
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

  const layoutType = themeSettings?.layout?.type || 'simple';
  const columns = themeSettings?.layout?.columns || 1;

  const styles = {
    container: `max-w-4xl mx-auto p-8 ${themeSettings?.colors?.background || 'bg-white'}`,
    content: `space-y-${themeSettings?.spacing?.sectionGap || '8'}`,
    text: {
      fontFamily: `${themeSettings?.font?.family || 'Inter'}, sans-serif`,
      fontSize: themeSettings?.font?.size?.body || '16px',
      lineHeight: themeSettings?.spacing?.lineHeight || '1.6',
      color: themeSettings?.colors?.primary || '#1a1a1a'
    },
    mainContent: columns === 2 ? 'w-2/3 pr-6' : 'w-full',
    sidebar: columns === 2 ? `w-1/3 pl-6 ${themeSettings?.colors?.sidebar ? 'bg-[' + themeSettings.colors.sidebar + ']' : 'bg-[#F1F0FB]'} p-4 rounded-lg` : ''
  };

  return (
    <div className={styles.container} style={styles.text}>
      <div className="flex justify-end mb-4">
        <Button onClick={downloadPDF} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>

      <div id="resume-content">
        <ResumeHeader 
          data={data.personalInfo} 
          themeSettings={themeSettings} 
        />
        
        <div className={`mt-6 ${columns === 2 ? 'flex gap-6' : ''}`}>
          <div className={styles.mainContent}>
            <ResumeExperience 
              data={data.experience} 
              themeSettings={themeSettings} 
            />
            {columns === 1 && (
              <>
                <ResumeEducation 
                  data={data.education} 
                  themeSettings={themeSettings} 
                />
                <ResumeSkills 
                  data={data.skills} 
                  themeSettings={themeSettings} 
                />
              </>
            )}
          </div>
          
          {columns === 2 && (
            <div className={styles.sidebar}>
              <ResumeEducation 
                data={data.education} 
                themeSettings={themeSettings} 
              />
              <div className="mt-6">
                <ResumeSkills 
                  data={data.skills} 
                  themeSettings={themeSettings} 
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};