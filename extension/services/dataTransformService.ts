import { ResumeData } from '../types';

class DataTransformService {
  private static instance: DataTransformService;

  private constructor() {}

  public static getInstance(): DataTransformService {
    if (!DataTransformService.instance) {
      DataTransformService.instance = new DataTransformService();
    }
    return DataTransformService.instance;
  }

  public transformResumeData(resumeData: ResumeData): Record<string, any> {
    return {
      name: resumeData.personalInfo.fullName,
      email: resumeData.personalInfo.email,
      phone: resumeData.personalInfo.phone,
      linkedin: resumeData.personalInfo.linkedin,
      website: resumeData.personalInfo.website,
      experience: this.formatExperience(resumeData.experience),
      education: this.formatEducation(resumeData.education),
      skills: resumeData.skills.join(', ')
    };
  }

  private formatExperience(experience: ResumeData['experience']): string {
    return experience
      .map(exp => 
        `${exp.position} at ${exp.company} (${exp.startDate} - ${exp.endDate || 'Present'})\n${exp.description}`
      )
      .join('\n\n');
  }

  private formatEducation(education: ResumeData['education']): string {
    return education
      .map(edu =>
        `${edu.degree} in ${edu.field} from ${edu.school} (${edu.startDate} - ${edu.endDate || 'Present'})`
      )
      .join('\n\n');
  }
}

export const dataTransformService = DataTransformService.getInstance();