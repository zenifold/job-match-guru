import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { jobId, userId } = await req.json();
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch job details
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (jobError) throw jobError;

    // Fetch user's resume data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('content')
      .eq('user_id', userId)
      .single();

    if (profileError) throw profileError;

    // Prepare data for analysis
    const resumeContent = profile.content;
    const skills = resumeContent.skills || [];
    const experience = resumeContent.experience || [];

    // Simple scoring algorithm (we'll use GPT-4 for more sophisticated analysis later)
    let score = 0;
    const jobDescription = job.description.toLowerCase();
    const jobTitle = job.title.toLowerCase();

    // Score based on skills match
    skills.forEach((skill: string) => {
      if (jobDescription.includes(skill.toLowerCase())) {
        score += 10;
      }
    });

    // Score based on experience relevance
    experience.forEach((exp: any) => {
      if (jobDescription.includes(exp.position.toLowerCase()) || 
          jobTitle.includes(exp.position.toLowerCase())) {
        score += 15;
      }
    });

    // Normalize score to 0-100 range
    score = Math.min(100, score);

    // Store analysis results
    const { error: analysisError } = await supabase
      .from('job_analyses')
      .upsert({
        job_id: jobId,
        user_id: userId,
        analysis_text: `Match score: ${score}%`,
        match_score: score
      });

    if (analysisError) throw analysisError;

    return new Response(
      JSON.stringify({ score, message: 'Analysis completed successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});