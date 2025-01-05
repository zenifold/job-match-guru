import { saveJobAnalysis, createOptimizedResume } from './supabaseService';

export async function handleAnalysis(jobData: any, authToken: string, userId: string) {
  try {
    // Send message to background script for analysis
    const response = await chrome.runtime.sendMessage({
      action: 'analyzeJob',
      data: {
        ...jobData,
        authToken,
        userId
      }
    });

    if (response.error) {
      throw new Error(response.error);
    }

    // Save job and analysis to database
    const { job, analysis } = await saveJobAnalysis({
      ...jobData,
      analysisText: response.analysis.analysisText,
      matchScore: response.analysis.matchScore
    }, userId);

    // Create optimized resume
    const optimizedResume = await createOptimizedResume(
      userId,
      job.id,
      response.optimizedResume
    );

    return {
      job,
      analysis,
      optimizedResume
    };
  } catch (error) {
    console.error('Error in analysis flow:', error);
    throw error;
  }
}