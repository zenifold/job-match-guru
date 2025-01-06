// Loading state management
export const showLoadingState = () => {
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    button.disabled = true;
    if (button.querySelector('.loading-spinner')) return;
    
    const spinner = document.createElement('span');
    spinner.className = 'loading-spinner';
    spinner.innerHTML = '↻';
    button.appendChild(spinner);
  });
};

export const hideLoadingState = () => {
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    button.disabled = false;
    const spinner = button.querySelector('.loading-spinner');
    if (spinner) spinner.remove();
  });
};

// Message display functions
const showMessage = (message, type = 'info') => {
  const messageEl = document.getElementById('message');
  if (!messageEl) return;

  messageEl.textContent = message;
  messageEl.className = `message ${type}`;
  messageEl.style.display = 'block';

  setTimeout(() => {
    messageEl.style.display = 'none';
  }, 3000);
};

export const showError = (message) => {
  showMessage(message, 'error');
};

export const showSuccess = (message) => {
  showMessage(message, 'success');
};

export const updateHistoryDisplay = (historyContainer, history) => {
  if (!historyContainer) return;
  
  historyContainer.innerHTML = '';
  
  if (history.length === 0) {
    const emptyMessage = document.createElement('div');
    emptyMessage.className = 'history-item';
    emptyMessage.textContent = 'No history yet';
    historyContainer.appendChild(emptyMessage);
    return;
  }
  
  history.forEach(entry => {
    const item = document.createElement('div');
    item.className = 'history-item';
    
    const date = new Date(entry.timestamp).toLocaleString();
    const status = entry.status === 'Success' 
      ? '<span style="color: #22c55e;">✓</span>' 
      : '<span style="color: #ef4444;">✗</span>';
    
    item.innerHTML = `
      ${status} ${entry.action}<br>
      <small>${date}</small>
    `;
    
    historyContainer.appendChild(item);
  });
};