export function calculateYearsOfExperience(experience: any[]): string {
  if (!experience?.length) return '0-2';
  
  const totalMonths = experience.reduce((total, exp) => {
    const startDate = new Date(exp.startDate);
    const endDate = exp.endDate ? new Date(exp.endDate) : new Date();
    const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                  (endDate.getMonth() - startDate.getMonth());
    return total + months;
  }, 0);
  
  const years = Math.floor(totalMonths / 12);
  
  if (years < 2) return '0-2';
  if (years < 5) return '3-5';
  if (years < 10) return '5-10';
  return '10+';
}