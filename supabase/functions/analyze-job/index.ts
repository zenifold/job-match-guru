import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { analyzeKeywordImportance } from './keywordExtractor.ts';
import { JobAnalysis } from './types.ts';

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
    console.log(`Starting analysis for job ${jobId} and user ${userId}`);
    
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

    if (jobError) {
      console.error('Error fetching job:', jobError);
      throw jobError;
    }

    console.log('Job details:', {
      title: job.title,
      descriptionLength: job.description.length
    });

    // Fetch user's resume data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('content')
      .eq('user_id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      throw profileError;
    }

    // Extract resume text
    const resumeContent = profile.content;
    const resumeText = [
      ...(resumeContent.skills || []),
      ...(resumeContent.experience || []).map((exp: any) => exp.description),
      ...(resumeContent.projects || []).map((proj: any) => proj.description)
    ].join(' ');
    
    console.log('Resume text length:', resumeText.length);

    // Analyze keywords with importance
    const jobKeywords = analyzeKeywordImportance(job.description, job.title);
    console.log('Analyzed job keywords:', jobKeywords);

    // Calculate match score
    let totalWeight = 0;
    let matchedWeight = 0;
    const matched: string[] = [];
    const missing: string[] = [];
    const importance: { [key: string]: string } = {};

    jobKeywords.forEach(({ keyword, weight }) => {
      totalWeight += weight;
      
      if (resumeText.toLowerCase().includes(keyword.toLowerCase())) {
        matched.push(keyword);
        matchedWeight += weight;
        console.log(`Matched keyword: ${keyword} with weight ${weight}`);
      } else {
        missing.push(keyword);
        console.log(`Missing keyword: ${keyword} with weight ${weight}`);
      }

      // Categorize importance based on weight
      if (weight >= 2.0) importance[keyword] = "Critical";
      else if (weight >= 1.5) importance[keyword] = "High";
      else if (weight >= 1.0) importance[keyword] = "Medium";
      else importance[keyword] = "Standard";
    });

    const matchScore = totalWeight > 0 ? (matchedWeight / totalWeight) * 100 : 0;
    console.log(`Final match score: ${matchScore}%`);

    // Generate analysis text
    let analysisText = `Match Score Analysis:\n\nOverall Match: ${Math.round(matchScore)}%\n\n`;
    
    if (matched.length > 0) {
      analysisText += `Strong Matches:\n`;
      matched.forEach(keyword => {
        analysisText += `✓ ${keyword} (${importance[keyword]} Priority)\n`;
      });
    }
    
    if (missing.length > 0) {
      analysisText += `\nSuggested Improvements:\n`;
      missing
        .sort((a, b) => {
          const importanceOrder = { "Critical": 0, "High": 1, "Medium": 2, "Standard": 3 };
          return importanceOrder[importance[a]] - importanceOrder[importance[b]];
        })
        .forEach(keyword => {
          analysisText += `• Consider adding experience or skills related to: ${keyword} (${importance[keyword]} Priority)\n`;
        });
    }
    
    analysisText += `\nRecommendations:\n`;
    const criticalMissing = missing
      .filter(k => importance[k] === "Critical" || importance[k] === "High")
      .slice(0, 2);
    
    if (criticalMissing.length > 0) {
      analysisText += `• Focus on acquiring skills in: ${criticalMissing.join(', ')}\n`;
    }
    analysisText += `• Consider taking relevant courses or certifications\n`;

    // Store analysis results
    const { error: analysisError } = await supabase
      .from('job_analyses')
      .upsert({
        job_id: jobId,
        user_id: userId,
        analysis_text: analysisText,
        match_score: Math.round(matchScore)
      });

    if (analysisError) {
      console.error('Error storing analysis:', analysisError);
      throw analysisError;
    }

    console.log('Analysis completed and stored successfully');

    const response: JobAnalysis = {
      score: Math.round(matchScore),
      message: 'Analysis completed successfully',
      matched,
      missing,
      importance
    };

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in analyze-job function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});