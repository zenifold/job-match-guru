import { saveProfileData, getProfileData } from './utils/profile.js';
import { showLoadingState, hideLoadingState, showError, showSuccess } from './utils/ui.js';

// Initialize the popup UI
document.addEventListener('DOMContentLoaded', async () => {
  const profileForm = document.getElementById('profileForm');
  const setupSection = document.getElementById('setupSection');
  const mainSection = document.getElementById('mainSection');
  const editProfileButton = document.getElementById('editProfile');
  const fillButton = document.getElementById('fillButton');
  
  // Check if profile exists
  const profileData = await getProfileData();
  if (profileData) {
    setupSection.classList.remove('active');
    mainSection.classList.add('active');
    
    // Pre-fill form if editing
    const populateForm = () => {
      document.getElementById('firstName').value = profileData.personalInfo.firstName || '';
      document.getElementById('lastName').value = profileData.personalInfo.lastName || '';
      document.getElementById('email').value = profileData.personalInfo.email || '';
      document.getElementById('phone').value = profileData.personalInfo.phone || '';
      document.getElementById('location').value = profileData.personalInfo.location || '';
    };
    
    editProfileButton.addEventListener('click', () => {
      setupSection.classList.add('active');
      mainSection.classList.remove('active');
      populateForm();
    });
  }

  // Handle profile form submission
  profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    showLoadingState();

    try {
      const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        location: document.getElementById('location').value
      };

      await saveProfileData(formData);
      showSuccess('Profile saved successfully!');
      setupSection.classList.remove('active');
      mainSection.classList.add('active');
    } catch (error) {
      showError(error.message || 'Failed to save profile');
    } finally {
      hideLoadingState();
    }
  });

  // Handle form auto-fill
  fillButton.addEventListener('click', async () => {
    try {
      const profileData = await getProfileData();
      if (!profileData) {
        showError('Please set up your profile first');
        return;
      }

      // Send message to content script to fill form
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'autoFill',
          profile: profileData
        });
      });
      
      showSuccess('Form filled successfully!');
    } catch (error) {
      showError(error.message || 'Failed to fill form');
    }
  });
});