import { saveProfileData, getProfileData } from './utils/profile.js';
import { showLoadingState, hideLoadingState, showError, showSuccess } from './utils/ui.js';

// Initialize the popup UI
document.addEventListener('DOMContentLoaded', async () => {
  const profileForm = document.getElementById('profileForm');
  const setupSection = document.getElementById('setupSection');
  const mainSection = document.getElementById('mainSection');
  const editProfileButton = document.getElementById('editProfile');
  const fillButton = document.getElementById('fillButton');
  const tabs = document.querySelectorAll('.tab');
  
  // Handle tab switching
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Show corresponding content
      const tabContents = document.querySelectorAll('.tab-content');
      tabContents.forEach(content => {
        content.style.display = content.dataset.tab === tab.dataset.tab ? 'block' : 'none';
      });
    });
  });
  
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
      document.getElementById('address').value = profileData.personalInfo.address || '';
      document.getElementById('city').value = profileData.personalInfo.city || '';
      document.getElementById('state').value = profileData.personalInfo.state || '';
      document.getElementById('zipCode').value = profileData.personalInfo.zipCode || '';
      document.getElementById('country').value = profileData.personalInfo.country || 'United States';
      document.getElementById('linkedin').value = profileData.personalInfo.linkedin || '';
      document.getElementById('github').value = profileData.personalInfo.github || '';
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
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        zipCode: document.getElementById('zipCode').value,
        country: document.getElementById('country').value,
        linkedin: document.getElementById('linkedin').value,
        github: document.getElementById('github').value
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