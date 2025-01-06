// Save profile data to Chrome storage
export const saveProfileData = async (profileData) => {
  try {
    await chrome.storage.local.set({
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