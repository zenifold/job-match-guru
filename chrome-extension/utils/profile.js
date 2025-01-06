// Save profile data to Chrome storage
export const saveProfileData = async (profileData) => {
  return chrome.storage.local.set({
    profileData: {
      personalInfo: {
        firstName: profileData.firstName || '',
        lastName: profileData.lastName || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
        location: profileData.location || '',
      },
      experience: profileData.experience || [],
      education: profileData.education || [],
      skills: profileData.skills || []
    }
  });
};

// Get profile data from Chrome storage
export const getProfileData = async () => {
  const data = await chrome.storage.local.get('profileData');
  return data.profileData || null;
};