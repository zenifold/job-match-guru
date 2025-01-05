chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "analyzeJob") {
    console.log("Analyzing job posting...");
    // Add job analysis logic here
  } else if (request.action === "autoFill") {
    console.log("Auto-filling application...");
    // Add auto-fill logic here
  }
});