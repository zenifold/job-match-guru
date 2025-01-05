export function updateUIForAuthenticatedUser(currentUser: any) {
  document.getElementById('auth-section')!.innerHTML = `
    <div class="flex items-center justify-between mb-4">
      <div>
        <p class="text-sm text-gray-600">Logged in as ${currentUser.email}</p>
        <p class="text-xs text-gray-400">Click buttons below to get started</p>
      </div>
      <button id="logout" class="text-sm text-red-600 hover:text-red-700">Logout</button>
    </div>
  `;
  document.getElementById('main-content')!.style.display = 'block';
}

export function updateUIForUnauthenticatedUser() {
  document.getElementById('auth-section')!.innerHTML = `
    <div class="text-center p-4 space-y-2">
      <p class="text-sm text-gray-600">Please log in to use the extension</p>
      <button id="login" class="button">Login to Resume Autofill</button>
      <p class="text-xs text-gray-400">One-time login required to access your resumes</p>
    </div>
  `;
  document.getElementById('main-content')!.style.display = 'none';
}