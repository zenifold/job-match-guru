import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

export interface CacheResult {
  analysisText: string;
  matchScore: number;
  company: string | null;
  timestamp: number;
}

const CACHE_DURATION = 3600000; // 1 hour in milliseconds

export async function getCachedAnalysis(supabase: ReturnType<typeof createClient>, jobId: string, userId: string): Promise<CacheResult | null> {
  const { data: analysis } = await supabase
    .from('job_analyses')
    .select('*')
    .eq('job_id', jobId)
    .eq('user_id', userId)
    .single();

  if (!analysis) return null;

  // Check if cache is still valid (less than 1 hour old)
  const timestamp = new Date(analysis.created_at).getTime();
  if (Date.now() - timestamp > CACHE_DURATION) return null;

  return {
    analysisText: analysis.analysis_text,
    matchScore: analysis.match_score,
    company: null, // Will be extracted from analysis text
    timestamp
  };
}

export async function cacheAnalysis(
  supabase: ReturnType<typeof createClient>, 
  jobId: string, 
  userId: string,
  analysisText: string,
  matchScore: number
): Promise<void> {
  await supabase
    .from('job_analyses')
    .upsert({
      job_id: jobId,
      user_id: userId,
      analysis_text: analysisText,
      match_score: matchScore,
      created_at: new Date().toISOString()
    });
}