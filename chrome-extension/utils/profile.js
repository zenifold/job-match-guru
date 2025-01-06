// Save profile data to Chrome storage
export const saveProfileData = async (formData) => {
  try {
    await chrome.storage.local.set({
      profileData: {
        personalInfo: {
          firstName: formData.firstName || '',
          lastName: formData.lastName || '',
          email: formData.email || '',
          phone: formData.phone || '',
          location: formData.location || '',
          address: formData.address || '',
          city: formData.city || '',
          state: formData.state || '',
          zipCode: formData.zipCode || '',
          country: formData.country || 'United States',
          linkedin: formData.linkedin || '',
          github: formData.github || ''
        },
        experience: formData.experience || [],
        education: formData.education || [],
        skills: formData.skills || [],
        certifications: formData.certifications || []
      }
    });
    return true;
  } catch (error) {
    console.error('Error saving profile:', error);
    throw new Error('Failed to save profile data');
  }
};

// Get profile data from Chrome storage
export const getProfileData = async () => {
  try {
    const data = await chrome.storage.local.get('profileData');
    return data.profileData || null;
  } catch (error) {
    console.error('Error getting profile:', error);
    throw new Error('Failed to get profile data');
  }
};