import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { jobId, userId } = await req.json();
    
    console.log(`Starting resume optimization for job ${jobId} and user ${userId}`);
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: analysis, error: analysisError } = await supabase
      .from('job_analyses')
      .select('*')
      .eq('job_id', jobId)
      .eq('user_id', userId)
      .single();

    if (analysisError) throw analysisError;
    if (!analysis) throw new Error('No analysis found for this job');

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (profileError) throw profileError;
    if (!profile) throw new Error('No profile found for this user');

    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('title, description')
      .eq('id', jobId)
      .single();

    if (jobError) throw jobError;

    // Extract missing keywords from analysis text
    const missingKeywords = extractMissingKeywords(analysis.analysis_text);
    console.log('Missing keywords:', missingKeywords);

    // Check if an optimized resume already exists
    const { data: existingOptimizedResume, error: existingError } = await supabase
      .from('optimized_resumes')
      .select('*')
      .eq('user_id', userId)
      .eq('job_id', jobId)
      .single();

    if (existingError && existingError.code !== 'PGRST116') {
      throw existingError;
    }

    // Create optimized version of the resume content
    const resumeContent = profile.content;
    const optimizedContent = {
      ...resumeContent,
      skills: [...new Set([...resumeContent.skills, ...extractSkillsFromAnalysis(analysis.analysis_text)])],
      experience: optimizeExperience(resumeContent.experience, missingKeywords, job.description),
    };

    let optimizedResume;
    
    if (existingOptimizedResume) {
      console.log(`Updating existing optimized resume for job ${jobId}`);
      const { data: updatedResume, error: updateError } = await supabase
        .from('optimized_resumes')
        .update({
          content: optimizedContent,
          match_score: analysis.match_score,
          optimization_status: 'completed',
          version_name: `Optimized for ${job.title} (Updated)`
        })
        .eq('id', existingOptimizedResume.id)
        .select()
        .single();

      if (updateError) throw updateError;
      optimizedResume = updatedResume;
    } else {
      console.log(`Creating new optimized resume for job ${jobId}`);
      const { data: newResume, error: insertError } = await supabase
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
      optimizedResume = newResume;
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
      const skill = line.replace('✓', '').split('(')[0].trim();
      skills.push(skill);
    }
  }
  
  return skills;
}

// Helper function to extract missing keywords from analysis text
function extractMissingKeywords(analysisText: string): { keyword: string, priority: string }[] {
  const lines = analysisText.split('\n');
  const keywords: { keyword: string, priority: string }[] = [];
  
  let isSuggestedSection = false;
  for (const line of lines) {
    if (line.includes('Suggested Improvements:')) {
      isSuggestedSection = true;
      continue;
    }
    if (line.includes('Recommendations:')) {
      isSuggestedSection = false;
      continue;
    }
    if (isSuggestedSection && line.includes('Consider adding experience or skills related to:')) {
      const parts = line.split(':')[1].split('(');
      const keyword = parts[0].trim();
      const priority = parts[1]?.split(')')[0].trim() || 'Standard';
      keywords.push({ keyword, priority });
    }
  }
  
  return keywords;
}

// Helper function to optimize experience entries
function optimizeExperience(experience: any[], missingKeywords: { keyword: string, priority: string }[], jobDescription: string): any[] {
  return experience.map(exp => {
    // Enhance existing responsibilities with relevant keywords
    const enhancedResponsibilities = exp.keyResponsibilities.map((resp: string) => {
      let enhanced = resp;
      missingKeywords.forEach(({ keyword }) => {
        if (jobDescription.toLowerCase().includes(keyword.toLowerCase()) &&
            !enhanced.toLowerCase().includes(keyword.toLowerCase())) {
          // Add keyword naturally to the responsibility
          enhanced = enhanced.replace(/\.$/, '') + ` utilizing ${keyword}.`;
        }
      });
      return enhanced;
    });

    // Add new responsibilities based on missing keywords
    const newResponsibilities = missingKeywords
      .filter(({ keyword, priority }) => 
        priority === 'Critical' || priority === 'High' &&
        !exp.keyResponsibilities.some((resp: string) => 
          resp.toLowerCase().includes(keyword.toLowerCase())
        )
      )
      .map(({ keyword }) => {
        const contextWords = extractContextWords(jobDescription, keyword);
        return generateResponsibility(keyword, contextWords, exp.position);
      });

    return {
      ...exp,
      keyResponsibilities: [...enhancedResponsibilities, ...newResponsibilities]
    };
  });
}

// Helper function to extract context words around a keyword
function extractContextWords(text: string, keyword: string): string[] {
  const words = text.toLowerCase().split(/\s+/);
  const keywordIndex = words.findIndex(w => w.includes(keyword.toLowerCase()));
  if (keywordIndex === -1) return [];
  
  const start = Math.max(0, keywordIndex - 3);
  const end = Math.min(words.length, keywordIndex + 4);
  return words.slice(start, end);
}

// Helper function to generate a new responsibility based on keyword and context
function generateResponsibility(keyword: string, context: string[], position: string): string {
  const templates = [
    `Led initiatives to implement ${keyword} solutions, improving team efficiency and project outcomes`,
    `Developed and executed ${keyword} strategies aligned with business objectives`,
    `Collaborated with cross-functional teams to integrate ${keyword} best practices`,
    `Spearheaded the adoption of ${keyword} methodologies to enhance project delivery`,
  ];

  // Select template based on position and context
  const template = templates[Math.floor(Math.random() * templates.length)];
  return template;
}