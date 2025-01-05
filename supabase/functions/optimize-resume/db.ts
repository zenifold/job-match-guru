import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { JobAnalysis, Profile, Job, OptimizedResume } from './types.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function getJobAnalysis(jobId: string, userId: string): Promise<JobAnalysis> {
  const { data, error } = await supabase
    .from('job_analyses')
    .select('analysis_text, match_score')
    .eq('job_id', jobId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error('No analysis found for this job');
  
  return data;
}

export async function getProfile(userId: string): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .select('content')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error('No profile found for this user');
  
  return data;
}

export async function getJob(jobId: string): Promise<Job> {
  const { data, error } = await supabase
    .from('jobs')
    .select('title, description')
    .eq('id', jobId)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error('Job not found');
  
  return data;
}

export async function getExistingOptimizedResume(userId: string, jobId: string): Promise<OptimizedResume | null> {
  const { data, error } = await supabase
    .from('optimized_resumes')
    .select('*')
    .eq('user_id', userId)
    .eq('job_id', jobId)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function updateOptimizedResume(id: string, data: Partial<OptimizedResume>) {
  const { data: updatedResume, error } = await supabase
    .from('optimized_resumes')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
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
  const { data: newResume, error } = await supabase
    .from('optimized_resumes')
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return newResume;
}