import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { createSystemPrompt, parseAIResponse, extractMatchScore, extractCompany } from './analyzer.ts';

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
    console.log(`Starting analysis for job ${jobId} and user ${userId}`);
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openRouterApiKey = Deno.env.get('OPENROUTER_API_KEY');

    if (!openRouterApiKey) {
      throw new Error('OpenRouter API key not found');
    }

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
      ...(resumeContent.experience || []).map((exp: any) => exp.description || ''),
      ...(resumeContent.projects || []).map((proj: any) => proj.description || '')
    ].filter(Boolean).join(' ');

    const systemPrompt = createSystemPrompt(job.title, job.description, resumeText);

    console.log('Sending analysis request to OpenRouter API');

    const aiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'HTTP-Referer': 'https://lovable.dev',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-exp:free',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: 'Analyze the job match and provide detailed feedback following the specified format.' }
        ]
      })
    });

    const aiData = await aiResponse.json();
    console.log('AI Response:', aiData);

    // Check for rate limit error
    if (aiData.error?.code === 429) {
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded',
          message: 'Please wait a moment and try again',
          retryAfter: 60,
        }),
        { 
          status: 429,
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json',
            'Retry-After': '60'
          }
        }
      );
    }

    if (!aiResponse.ok) {
      console.error('OpenRouter API Error:', aiData);
      throw new Error(`Failed to get AI analysis: ${JSON.stringify(aiData)}`);
    }

    const analysisText = parseAIResponse(aiData);
    console.log('AI Analysis:', analysisText);

    const matchScore = extractMatchScore(analysisText);
    const company = extractCompany(analysisText);

    // Update job with company if found
    if (company) {
      const { error: updateError } = await supabase
        .from('jobs')
        .update({ company })
        .eq('id', jobId);

      if (updateError) {
        console.error('Error updating job company:', updateError);
      }
    }

    // Store analysis results
    const { error: analysisError } = await supabase
      .from('job_analyses')
      .upsert({
        job_id: jobId,
        user_id: userId,
        analysis_text: analysisText,
        match_score: matchScore
      });

    if (analysisError) {
      console.error('Error storing analysis:', analysisError);
      throw analysisError;
    }

    console.log('Analysis completed and stored successfully');

    return new Response(
      JSON.stringify({ 
        message: 'Analysis completed successfully',
        matchScore,
        analysisText,
        company
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in analyze-job function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString()
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});