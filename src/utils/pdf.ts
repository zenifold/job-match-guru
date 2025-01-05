import { jsPDF } from 'jspdf';
import { supabase } from '@/integrations/supabase/client';

export const generatePDF = (resumeData: any) => {
  const doc = new jsPDF();
  
  // Set font
  doc.setFont('helvetica');
  
  // Personal Info
  if (resumeData.personalInfo) {
    doc.setFontSize(20);
    doc.text(resumeData.personalInfo.fullName || '', 20, 20);
    
    doc.setFontSize(10);
    let contactY = 30;
    if (resumeData.personalInfo.email) {
      doc.text(`Email: ${resumeData.personalInfo.email}`, 20, contactY);
      contactY += 5;
    }
    if (resumeData.personalInfo.phone) {
      doc.text(`Phone: ${resumeData.personalInfo.phone}`, 20, contactY);
      contactY += 5;
    }
    if (resumeData.personalInfo.location) {
      doc.text(`Location: ${resumeData.personalInfo.location}`, 20, contactY);
      contactY += 5;
    }
  }

  let currentY = 50;

  // Experience
  if (resumeData.experience?.length) {
    doc.setFontSize(14);
    doc.text('Experience', 20, currentY);
    currentY += 10;

    doc.setFontSize(10);
    resumeData.experience.forEach((exp: any) => {
      doc.setFont('helvetica', 'bold');
      doc.text(exp.position, 20, currentY);
      doc.setFont('helvetica', 'normal');
      doc.text(`${exp.company} (${exp.startDate} - ${exp.endDate || 'Present'})`, 20, currentY + 5);
      
      const descriptionLines = doc.splitTextToSize(exp.description, 170);
      doc.text(descriptionLines, 20, currentY + 10);
      
      currentY += 20 + (descriptionLines.length * 5);

      if (currentY > 270) {
        doc.addPage();
        currentY = 20;
      }
    });
  }

  // Education
  if (resumeData.education?.length) {
    doc.setFontSize(14);
    doc.text('Education', 20, currentY);
    currentY += 10;

    doc.setFontSize(10);
    resumeData.education.forEach((edu: any) => {
      doc.setFont('helvetica', 'bold');
      doc.text(edu.school, 20, currentY);
      doc.setFont('helvetica', 'normal');
      doc.text(`${edu.degree} in ${edu.field}`, 20, currentY + 5);
      doc.text(`${edu.startDate} - ${edu.endDate || 'Present'}`, 20, currentY + 10);
      
      currentY += 20;

      if (currentY > 270) {
        doc.addPage();
        currentY = 20;
      }
    });
  }

  // Skills
  if (resumeData.skills?.length) {
    doc.setFontSize(14);
    doc.text('Skills', 20, currentY);
    currentY += 10;

    doc.setFontSize(10);
    const skillsText = resumeData.skills.join(', ');
    const skillsLines = doc.splitTextToSize(skillsText, 170);
    doc.text(skillsLines, 20, currentY);
  }

  return doc;
};

export const uploadPDF = async (pdf: jsPDF, fileName: string, userId: string) => {
  try {
    const pdfBlob = pdf.output('blob');
    const filePath = `${userId}/${fileName}.pdf`;

    const { data, error } = await supabase.storage
      .from('resumes')
      .upload(filePath, pdfBlob, {
        contentType: 'application/pdf',
        upsert: true
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('resumes')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading PDF:', error);
    throw error;
  }
};