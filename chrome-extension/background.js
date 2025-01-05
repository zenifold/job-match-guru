chrome.runtime.onInstalled.addListener(() => {
  console.log('Resume Optimizer Extension installed');
  
  // Initialize storage with empty state
  chrome.storage.local.set({
    optimizedResume: null,
    currentJob: null,
    supabaseSession: null
  });
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "LOG") {
    console.log("Content script log:", request.message);
  } else if (request.type === "ANALYZE_JOB") {
    handleJobAnalysis(request.data);
  } else if (request.type === "SET_SESSION") {
    handleSetSession(request.session);
  } else if (request.type === "GET_PROFILE") {
    fetchUserProfile();
  }
});

async function handleSetSession(session) {
  await chrome.storage.local.set({ supabaseSession: session });
  console.log("Supabase session stored");
}

async function handleJobAnalysis(jobData) {
  console.log("Processing job data:", jobData);
  
  try {
    // Store the current job data
    await chrome.storage.local.set({ currentJob: jobData });
    
    const session = await getSupabaseSession();
    if (!session) {
      throw new Error('No active session found. Please log in to ResumeAI first.');
    }

    // Fetch the user's profile from Supabase
    const response = await fetch('https://qqbulzzezbcwstrhfbco.supabase.co/rest/v1/profiles?select=*&is_master=eq.true', {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxYnVsenplemJjd3N0cmhmYmNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5MjA0MzcsImV4cCI6MjA1MTQ5NjQzN30.vUmslRzwtXxNEjOQXFbRnMHd-ZoghRFmBbqJn2l2g8c',
        'Authorization': `Bearer ${session}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    const profiles = await response.json();
    const masterProfile = profiles[0];

    if (!masterProfile) {
      throw new Error('No master profile found');
    }

    // Map profile data to Workday format
    const optimizedResume = mapProfileToWorkdayFormat(masterProfile.content);
    await chrome.storage.local.set({ optimizedResume });
    
    // Notify that analysis is complete
    chrome.runtime.sendMessage({
      type: "ANALYSIS_COMPLETE",
      success: true
    });
  } catch (error) {
    console.error("Error in job analysis:", error);
    chrome.runtime.sendMessage({
      type: "ANALYSIS_COMPLETE",
      success: false,
      error: error.message
    });
  }
}

async function getSupabaseSession() {
  const { supabaseSession } = await chrome.storage.local.get(['supabaseSession']);
  return supabaseSession;
}

function mapProfileToWorkdayFormat(profileContent) {
  return {
    personalInfo: {
      firstName: profileContent.personalInfo?.fullName?.split(' ')[0] || '',
      lastName: profileContent.personalInfo?.fullName?.split(' ').slice(1).join(' ') || '',
      email: profileContent.personalInfo?.email || '',
      phone: profileContent.personalInfo?.phone || '',
      address: profileContent.personalInfo?.address || '',
      city: profileContent.personalInfo?.city || '',
      state: profileContent.personalInfo?.state || '',
      zipCode: profileContent.personalInfo?.zipCode || '',
    },
    experience: profileContent.experience?.map(exp => ({
      company: exp.company,
      title: exp.position,
      startDate: exp.startDate,
      endDate: exp.endDate,
      current: !exp.endDate,
      description: exp.description,
      location: exp.location
    })) || [],
    education: profileContent.education?.map(edu => ({
      school: edu.school,
      degree: edu.degree,
      field: edu.field,
      startDate: edu.startDate,
      endDate: edu.endDate,
      gpa: edu.finalEvaluationGrade
    })) || [],
    skills: profileContent.skills || []
  };
}