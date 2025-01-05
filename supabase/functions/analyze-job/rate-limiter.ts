import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const RATE_LIMIT_WINDOW = 60; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5;

export async function checkRateLimit(supabase: ReturnType<typeof createClient>, userId: string): Promise<boolean> {
  const windowStart = Math.floor(Date.now() / 1000) - RATE_LIMIT_WINDOW;
  
  // Use the job_analyses table to track request counts
  const { count } = await supabase
    .from('job_analyses')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', new Date(windowStart * 1000).toISOString());

  return (count || 0) >= RATE_LIMIT_MAX_REQUESTS;
}