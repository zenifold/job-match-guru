export function formatFormData(data: any) {
  return {
    name: `${data.personalInfo?.fullName || ''}`,
    email: data.personalInfo?.email || '',
    phone: data.personalInfo?.phone || '',
    linkedin: data.personalInfo?.linkedin || '',
    website: data.personalInfo?.website || '',
    experience: data.experience?.map((exp: any) => 
      `${exp.position} at ${exp.company} (${exp.startDate} - ${exp.endDate || 'Present'})\n${exp.description}`
    ).join('\n\n'),
    education: data.education?.map((edu: any) =>
      `${edu.degree} in ${edu.field} from ${edu.school} (${edu.startDate} - ${edu.endDate || 'Present'})`
    ).join('\n\n'),
    skills: data.skills?.join(', ') || '',
    visaStatus: data.personalInfo?.visaStatus || '',
    yearsOfExperience: calculateYearsOfExperience(data.experience)
  };
}