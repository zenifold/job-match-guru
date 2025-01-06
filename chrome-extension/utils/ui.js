export const showLoadingState = () => {
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    button.disabled = true;
    button.textContent = 'Loading...';
  });
};

export const hideLoadingState = () => {
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    button.disabled = false;
    button.textContent = button.getAttribute('data-original-text') || button.textContent.replace('Loading...', '');
  });
};

export const showError = (message) => {
  const messageEl = document.getElementById('message');
  if (!messageEl) return;
  
  messageEl.className = 'error';
  messageEl.textContent = message;
  setTimeout(() => {
    messageEl.textContent = '';
  }, 5000);
};

export const showSuccess = (message) => {
  const messageEl = document.getElementById('message');
  if (!messageEl) return;
  
  messageEl.className = 'success';
  messageEl.textContent = message;
  setTimeout(() => {
    messageEl.textContent = '';
  }, 5000);
};