export const showMessage = (messageEl, message, type = 'info') => {
  messageEl.textContent = message;
  messageEl.className = type;
  messageEl.style.display = 'block';
  
  setTimeout(() => {
    messageEl.style.display = 'none';
  }, 3000);
};

export const updateHistoryDisplay = (historyContainer, history) => {
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