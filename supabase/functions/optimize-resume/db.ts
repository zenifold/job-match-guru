import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { JobAnalysis, Profile, Job, OptimizedResume } from './types.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function fetchJobAnalysis(jobId: string, userId: string): Promise<{ data: JobAnalysis | null; error: any }> {
  console.log(`Fetching job analysis for job ${jobId} and user ${userId}`)
  
  const { data, error } = await supabase
    .from('job_analyses')
    .select('analysis_text, match_score')
    .eq('job_id', jobId)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('Error fetching job analysis:', error)
    return { data: null, error }
  }

  return { data, error: null }
}

export async function fetchProfile(userId: string): Promise<{ data: Profile | null; error: any }> {
  console.log(`Fetching profile for user ${userId}`)
  
  const { data, error } = await supabase
    .from('profiles')
    .select('content')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('Error fetching profile:', error)
    return { data: null, error }
  }

  return { data, error: null }
}

export async function fetchJob(jobId: string): Promise<{ data: Job | null; error: any }> {
  console.log(`Fetching job ${jobId}`)
  
  const { data, error } = await supabase
    .from('jobs')
    .select('title, description')
    .eq('id', jobId)
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('Error fetching job:', error)
    return { data: null, error }
  }

  return { data, error: null }
}

export async function checkExistingOptimizedResume(jobId: string, userId: string): Promise<{ data: OptimizedResume | null; error: any }> {
  console.log(`Checking for existing optimized resume for user ${userId} and job ${jobId}`)
  
  const { data, error } = await supabase
    .from('optimized_resumes')
    .select('*')
    .eq('user_id', userId)
    .eq('job_id', jobId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('Error checking for existing optimized resume:', error)
    return { data: null, error }
  }

  return { data, error: null }
}

export async function updateOptimizedResume(id: string, data: Partial<OptimizedResume>): Promise<{ data: OptimizedResume | null; error: any }> {
  console.log(`Updating optimized resume ${id}`)
  
  const { data: updatedResume, error } = await supabase
    .from('optimized_resumes')
    .update(data)
    .eq('id', id)
    .select()
    .maybeSingle()

  if (error) {
    console.error('Error updating optimized resume:', error)
    return { data: null, error }
  }

  return { data: updatedResume, error: null }
}

export async function createOptimizedResume(data: {
  user_id: string;
  job_id: string;
  content: any;
  match_score: number;
  version_name: string;
  optimization_status: string;
}): Promise<{ data: OptimizedResume | null; error: any }> {
  console.log(`Creating new optimized resume for user ${data.user_id} and job ${data.job_id}`)
  
  const { data: newResume, error } = await supabase
    .from('optimized_resumes')
    .insert(data)
    .select()
    .maybeSingle()

  if (error) {
    console.error('Error creating optimized resume:', error)
    return { data: null, error }
  }

  return { data: newResume, error: null }
}