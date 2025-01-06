// Function to fetch profile data from Supabase
async function fetchProfileData(authToken) {
  try {
    // First try to get the optimized resume if it exists
    const { optimizedResume } = await chrome.storage.local.get(['optimizedResume']);
    if (optimizedResume) {
      console.log('Using optimized resume:', optimizedResume);
      return optimizedResume;
    }

    // Otherwise fetch the master profile
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
  
  try {
    // Extract first and last name from full name
    const fullNameParts = profileData.personalInfo?.fullName?.split(' ') || [];
    const firstName = fullNameParts[0] || '';
    const lastName = fullNameParts.slice(1).join(' ') || '';
    
    // Format phone number
    const phone = profileData.personalInfo?.phone?.replace(/\D/g, '');
    const formattedPhone = phone ? `${phone.slice(0,3)}-${phone.slice(3,6)}-${phone.slice(6)}` : '';

    // Map experience data with proper formatting
    const mappedExperience = (profileData.experience || []).map(exp => {
      // Format dates to match Workday's expected format (MM/YYYY)
      const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
      };

      // Format description with bullet points if needed
      const formatDescription = (desc) => {
        if (Array.isArray(desc)) {
          return desc.join('\n• ');
        }
        return desc || '';
      };

      return {
        jobTitle: exp.position || '',
        company: exp.company || '',
        location: exp.location || '',
        currentlyWorkHere: !exp.endDate,
        startDate: formatDate(exp.startDate),
        endDate: formatDate(exp.endDate),
        description: formatDescription(exp.description)
      };
    });
    
    return {
      personalInfo: {
        firstName,
        lastName,
        email: profileData.personalInfo?.email || '',
        phone: formattedPhone,
        address: profileData.personalInfo?.address || '',
        city: profileData.personalInfo?.city || '',
        state: profileData.personalInfo?.state || '',
        zipCode: profileData.personalInfo?.zipCode || '',
        country: profileData.personalInfo?.country || '',
        linkedin: profileData.personalInfo?.linkedin || '',
        github: profileData.personalInfo?.github || ''
      },
      experience: mappedExperience,
      education: (profileData.education || []).map(edu => ({
        school: edu.school || '',
        degree: edu.degree || '',
        field: edu.field || '',
        startDate: edu.startDate || '',
        endDate: edu.endDate || '',
        gpa: edu.finalEvaluationGrade || ''
      })),
      skills: profileData.skills || [],
      certifications: (profileData.certifications || []).map(cert => ({
        name: cert.name || '',
        issuer: cert.issuer || '',
        issueDate: cert.issueDate || '',
        expiryDate: cert.expiryDate || '',
        credentialId: cert.credentialId || '',
        url: cert.url || ''
      }))
    };
  } catch (error) {
    console.error('Error mapping profile data:', error);
    return null;
  }
}

export { fetchProfileData, mapProfileToWorkdayFields };
