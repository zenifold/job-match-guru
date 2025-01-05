import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://qqbulzzezbcwstrhfbco.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxYnVsenplemJjd3N0cmhmYmNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5MjA0MzcsImV4cCI6MjA1MTQ5NjQzN30.vUmslRzwtXxNEjOQXFbRnMHd-ZoghRFmBbqJn2l2g8c";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function saveJobAnalysis(jobData: any, userId: string) {
  try {
    // First save the job
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .insert({
        title: jobData.jobTitle,
        description: jobData.description,
        company: jobData.company,
        user_id: userId,
      })
      .select()
      .single();

    if (jobError) throw jobError;

    // Then save the analysis
    const { data: analysis, error: analysisError } = await supabase
      .from('job_analyses')
      .insert({
        job_id: job.id,
        user_id: userId,
        analysis_text: jobData.analysisText,
        match_score: jobData.matchScore,
      })
      .select()
      .single();

    if (analysisError) throw analysisError;

    return { job, analysis };
  } catch (error) {
    console.error('Error saving job analysis:', error);
    throw error;
  }
}

export async function createOptimizedResume(userId: string, jobId: string, originalResume: any) {
  try {
    const { data: optimizedResume, error } = await supabase
      .from('optimized_resumes')
      .insert({
        user_id: userId,
        job_id: jobId,
        content: originalResume,
        version_name: 'Optimized Resume',
        optimization_status: 'completed',
      })
      .select()
      .single();

    if (error) throw error;
    return optimizedResume;
  } catch (error) {
    console.error('Error creating optimized resume:', error);
    throw error;
  }
}