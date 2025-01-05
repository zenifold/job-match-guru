// Function to fetch profile data from Supabase
async function fetchProfileData(authToken) {
  try {
    const response = await fetch('https://qqbulzzezbcwstrhfbco.supabase.co/rest/v1/profiles?select=*&is_master=eq.true', {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxYnVsenplemJjd3N0cmhmYmNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5MjA0MzcsImV4cCI6MjA1MTQ5NjQzN30.vUmslRzwtXxNEjOQXFbRnMHd-ZoghRFmBbqJn2l2g8c',
        'Authorization': `Bearer ${authToken}`,
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }
    
    const data = await response.json();
    return data[0]?.content || null;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

// Function to map profile data to Workday fields
function mapProfileToWorkdayFields(profileData) {
  if (!profileData) return null;
  
  return {
    personalInfo: {
      firstName: profileData.personalInfo?.fullName?.split(' ')[0] || '',
      lastName: profileData.personalInfo?.fullName?.split(' ').slice(1).join(' ') || '',
      email: profileData.personalInfo?.email || '',
      phone: profileData.personalInfo?.phone || '',
      address: profileData.personalInfo?.address || '',
      city: profileData.personalInfo?.city || '',
      state: '', // Add state mapping if available
      zipCode: profileData.personalInfo?.zipCode || '',
    },
    experience: profileData.experience?.map(exp => ({
      jobTitle: exp.position,
      company: exp.company,
      location: exp.location,
      currentlyWorkHere: !exp.endDate,
      startDate: exp.startDate,
      endDate: exp.endDate,
      description: exp.description
    })) || [],
    education: profileData.education?.map(edu => ({
      school: edu.school,
      degree: edu.degree,
      field: edu.field,
      startDate: edu.startDate,
      endDate: edu.endDate,
      gpa: edu.finalEvaluationGrade
    })) || []
  };
}

export { fetchProfileData, mapProfileToWorkdayFields };