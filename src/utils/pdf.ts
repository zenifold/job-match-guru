import { jsPDF } from 'jspdf';
import { supabase } from '@/integrations/supabase/client';

export const generatePDF = (resumeData: any, themeSettings?: any) => {
  const doc = new jsPDF();
  
  // Apply theme settings if available
  if (themeSettings?.font?.family) {
    doc.setFont(themeSettings.font.family.toLowerCase() || 'helvetica');
  } else {
    doc.setFont('helvetica');
  }
  
  // Personal Info
  if (resumeData.personalInfo) {
    const { fullName, email, phone, location } = resumeData.personalInfo;
    doc.setFontSize(20);
    doc.text(fullName || '', 20, 20);
    doc.setFontSize(12);
    doc.text([
      email || '',
      phone || '',
      location || ''
    ], 20, 30);
  }

  // Experience
  if (resumeData.experience && resumeData.experience.length > 0) {
    doc.setFontSize(16);
    doc.text('Experience', 20, 60);
    doc.setFontSize(12);
    let yPos = 70;

    resumeData.experience.forEach((exp: any) => {
      doc.text(`${exp.position} at ${exp.company}`, 20, yPos);
      yPos += 10;
      doc.text(`${exp.startDate} - ${exp.endDate || 'Present'}`, 20, yPos);
      yPos += 10;
      doc.text(exp.description || '', 20, yPos, { maxWidth: 170 });
      yPos += 20;
    });
  }

  // Education
  if (resumeData.education && resumeData.education.length > 0) {
    doc.setFontSize(16);
    let yPos = doc.internal.pageSize.height - 100;
    doc.text('Education', 20, yPos);
    doc.setFontSize(12);
    yPos += 10;

    resumeData.education.forEach((edu: any) => {
      doc.text(`${edu.degree} in ${edu.field}`, 20, yPos);
      yPos += 10;
      doc.text(`${edu.school}`, 20, yPos);
      yPos += 10;
      doc.text(`${edu.startDate} - ${edu.endDate || 'Present'}`, 20, yPos);
      yPos += 20;
    });
  }

  return doc;
};

export const uploadPDF = async (
  doc: jsPDF,
  fileName: string,
  userId: string
): Promise<string> => {
  try {
    const pdfOutput = doc.output('blob');
    const filePath = `${userId}/${fileName}.pdf`;

    const { data, error } = await supabase.storage
      .from('resumes')
      .upload(filePath, pdfOutput, {
        contentType: 'application/pdf',
        upsert: true
      });

    if (error) {
      throw error;
    }

    const { data: publicUrl } = supabase.storage
      .from('resumes')
      .getPublicUrl(filePath);

    return publicUrl.publicUrl;
  } catch (error) {
    console.error('Error uploading PDF:', error);
    throw error;
  }
};