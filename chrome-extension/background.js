chrome.runtime.onInstalled.addListener(() => {
  console.log('Resume Optimizer Extension installed');
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "LOG") {
    console.log("Content script log:", request.message);
  }
});