import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { JobAnalysis, Profile, Job, OptimizedResume } from './types.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function getJobAnalysis(jobId: string, userId: string): Promise<JobAnalysis> {
  console.log(`Fetching job analysis for job ${jobId} and user ${userId}`);
  const { data, error } = await supabase
    .from('job_analyses')
    .select('analysis_text, match_score')
    .eq('job_id', jobId)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })  // Get the most recent analysis
    .maybeSingle();  // Changed from single() to maybeSingle()

  if (error) {
    console.error('Error fetching job analysis:', error);
    throw error;
  }
  if (!data) {
    console.error('No analysis found for this job');
    throw new Error('No analysis found for this job');
  }
  
  return data;
}

export async function getProfile(userId: string): Promise<Profile> {
  console.log(`Fetching profile for user ${userId}`);
  const { data, error } = await supabase
    .from('profiles')
    .select('content')
    .eq('user_id', userId)
    .maybeSingle();  // Changed from single() to maybeSingle()

  if (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
  if (!data) {
    console.error('No profile found for this user');
    throw new Error('No profile found for this user');
  }
  
  return data;
}

export async function getJob(jobId: string): Promise<Job> {
  console.log(`Fetching job ${jobId}`);
  const { data, error } = await supabase
    .from('jobs')
    .select('title, description')
    .eq('id', jobId)
    .maybeSingle();  // Changed from single() to maybeSingle()

  if (error) {
    console.error('Error fetching job:', error);
    throw error;
  }
  if (!data) {
    console.error('Job not found');
    throw new Error('Job not found');
  }
  
  return data;
}

export async function getExistingOptimizedResume(userId: string, jobId: string): Promise<OptimizedResume | null> {
  console.log(`Checking for existing optimized resume for user ${userId} and job ${jobId}`);
  const { data, error } = await supabase
    .from('optimized_resumes')
    .select('*')
    .eq('user_id', userId)
    .eq('job_id', jobId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();  // Changed from single() to maybeSingle()

  if (error) {
    console.error('Error checking for existing optimized resume:', error);
    throw error;
  }
  return data;
}

export async function updateOptimizedResume(id: string, data: Partial<OptimizedResume>) {
  console.log(`Updating optimized resume ${id}`);
  const { data: updatedResume, error } = await supabase
    .from('optimized_resumes')
    .update(data)
    .eq('id', id)
    .select()
    .maybeSingle();  // Changed from single() to maybeSingle()

  if (error) {
    console.error('Error updating optimized resume:', error);
    throw error;
  }
  return updatedResume;
}

export async function createOptimizedResume(data: {
  user_id: string;
  job_id: string;
  original_resume_id: string;
  content: any;
  match_score: number;
  version_name: string;
  optimization_status: string;
}) {
  console.log(`Creating new optimized resume for user ${data.user_id} and job ${data.job_id}`);
  const { data: newResume, error } = await supabase
    .from('optimized_resumes')
    .insert(data)
    .select()
    .maybeSingle();  // Changed from single() to maybeSingle()

  if (error) {
    console.error('Error creating optimized resume:', error);
    throw error;
  }
  return newResume;
}