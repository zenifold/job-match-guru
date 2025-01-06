import { handleAuthRequest, handleSignOut, isAuthenticated } from './utils/auth.js';
import { showLoadingState, hideLoadingState, showError, showSuccess } from './utils/ui.js';

// Initialize the popup UI
document.addEventListener('DOMContentLoaded', async () => {
  const loginForm = document.getElementById('loginForm');
  const logoutButton = document.getElementById('logoutButton');
  const loginSection = document.getElementById('loginSection');
  const mainSection = document.getElementById('mainSection');
  
  // Check authentication status
  const authenticated = await isAuthenticated();
  if (authenticated) {
    loginSection.style.display = 'none';
    mainSection.style.display = 'block';
  } else {
    loginSection.style.display = 'block';
    mainSection.style.display = 'none';
  }

  // Handle login form submission
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    showLoadingState();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const result = await handleAuthRequest(email, password);
      if (result.success) {
        showSuccess('Successfully logged in!');
        loginSection.style.display = 'none';
        mainSection.style.display = 'block';
      } else {
        showError(result.error || 'Failed to login');
      }
    } catch (error) {
      showError(error.message);
    } finally {
      hideLoadingState();
    }
  });

  // Handle logout
  logoutButton.addEventListener('click', async () => {
    showLoadingState();
    try {
      const result = await handleSignOut();
      if (result.success) {
        showSuccess('Successfully logged out!');
        loginSection.style.display = 'block';
        mainSection.style.display = 'none';
      } else {
        showError(result.error || 'Failed to logout');
      }
    } catch (error) {
      showError(error.message);
    } finally {
      hideLoadingState();
    }
  });
});