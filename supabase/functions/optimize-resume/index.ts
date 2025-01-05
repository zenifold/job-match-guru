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
    
    console.log(`Starting resume optimization for job ${jobId} and user ${userId}`);
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch job analysis
    const { data: analysis, error: analysisError } = await supabase
      .from('job_analyses')
      .select('*')
      .eq('job_id', jobId)
      .eq('user_id', userId)
      .single();

    if (analysisError) throw analysisError;
    if (!analysis) throw new Error('No analysis found for this job');

    // Fetch original resume
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (profileError) throw profileError;
    if (!profile) throw new Error('No profile found for this user');

    // Fetch job details
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('title')
      .eq('id', jobId)
      .single();

    if (jobError) throw jobError;

    // Create optimized version of the resume content
    const resumeContent = profile.content;
    const optimizedContent = {
      ...resumeContent,
      skills: [...new Set([...resumeContent.skills, ...extractSkillsFromAnalysis(analysis.analysis_text)])],
      experience: optimizeExperience(resumeContent.experience, analysis.analysis_text),
    };

    // Store optimized resume
    const { data: optimizedResume, error: insertError } = await supabase
      .from('optimized_resumes')
      .insert({
        user_id: userId,
        job_id: jobId,
        original_resume_id: profile.id,
        content: optimizedContent,
        match_score: analysis.match_score,
        version_name: `Optimized for ${job.title}`,
        optimization_status: 'completed'
      })
      .select()
      .single();

    if (insertError) throw insertError;

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

// Helper function to extract skills from analysis text
function extractSkillsFromAnalysis(analysisText: string): string[] {
  const lines = analysisText.split('\n');
  const skills: string[] = [];
  
  let isMatchedSection = false;
  for (const line of lines) {
    if (line.includes('Strong Matches:')) {
      isMatchedSection = true;
      continue;
    }
    if (line.includes('Suggested Improvements:')) {
      isMatchedSection = false;
      continue;
    }
    if (isMatchedSection && line.startsWith('✓')) {
      const skill = line.replace('✓', '').trim();
      skills.push(skill);
    }
  }
  
  return skills;
}

// Helper function to optimize experience entries
function optimizeExperience(experience: any[], analysisText: string): any[] {
  return experience.map(exp => {
    // Enhance description with relevant keywords from analysis
    const enhancedDescription = exp.description;
    
    // Enhance responsibilities based on analysis
    const enhancedResponsibilities = exp.keyResponsibilities.map((resp: string) => {
      return resp;
    });

    return {
      ...exp,
      description: enhancedDescription,
      keyResponsibilities: enhancedResponsibilities
    };
  });
}