import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from './cors.ts';
import { 
  getJobAnalysis, 
  getProfile, 
  getJob, 
  getExistingOptimizedResume,
  updateOptimizedResume,
  createOptimizedResume 
} from './db.ts';
import { extractMissingKeywords, optimizeContent } from './optimizer.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { jobId, userId } = await req.json();
    console.log(`Starting resume optimization for job ${jobId} and user ${userId}`);

    // Get all necessary data
    const [analysis, profile, job] = await Promise.all([
      getJobAnalysis(jobId, userId),
      getProfile(userId),
      getJob(jobId)
    ]);

    // Extract missing keywords and optimize content
    const missingKeywords = extractMissingKeywords(analysis.analysis_text);
    console.log('Missing keywords:', missingKeywords);

    const optimizedContent = optimizeContent(profile.content, missingKeywords, job.description);

    // Check for existing optimized resume
    const existingOptimizedResume = await getExistingOptimizedResume(userId, jobId);

    let optimizedResume;
    if (existingOptimizedResume) {
      console.log(`Updating existing optimized resume for job ${jobId}`);
      optimizedResume = await updateOptimizedResume(existingOptimizedResume.id, {
        content: optimizedContent,
        match_score: analysis.match_score,
        optimization_status: 'completed',
        version_name: `Optimized for ${job.title} (Updated)`
      });
    } else {
      console.log(`Creating new optimized resume for job ${jobId}`);
      optimizedResume = await createOptimizedResume({
        user_id: userId,
        job_id: jobId,
        original_resume_id: profile.id,
        content: optimizedContent,
        match_score: analysis.match_score,
        version_name: `Optimized for ${job.title}`,
        optimization_status: 'completed'
      });
    }

    console.log(`Resume optimization completed for job ${jobId}`);

    return new Response(
      JSON.stringify({ 
        success: true,
        optimizedResume,
        message: 'Resume optimization completed successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in optimize-resume function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});