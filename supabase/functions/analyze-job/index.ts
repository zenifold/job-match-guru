import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { createSystemPrompt, parseAIResponse, extractMatchScore, extractCompany } from './analyzer.ts';
import { getCachedAnalysis, cacheAnalysis } from './cache.ts';
import { checkRateLimit } from './rate-limiter.ts';

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

    // Check cache first
    const cachedResult = await getCachedAnalysis(supabase, jobId, userId);
    if (cachedResult) {
      console.log('Returning cached analysis');
      return new Response(
        JSON.stringify({
          message: 'Analysis retrieved from cache',
          ...cachedResult
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check rate limit
    const isRateLimited = await checkRateLimit(supabase, userId);
    if (isRateLimited) {
      console.log(`Rate limit exceeded for user ${userId}`);
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
        ],
        temperature: 0.7, // Add temperature for more consistent outputs
        max_tokens: 1000, // Limit response length
      })
    });

    if (!aiResponse.ok) {
      console.error('OpenRouter API Error:', await aiResponse.text());
      throw new Error(`OpenRouter API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    console.log('Raw AI Response:', JSON.stringify(aiData, null, 2));

    try {
      const analysisText = parseAIResponse(aiData);
      
      // Validate analysis text format
      if (!analysisText.includes('Match Score Analysis:') || 
          !analysisText.includes('Strong Matches:') ||
          !analysisText.includes('Target Keywords:') ||
          !analysisText.includes('Required Experience:')) {
        console.error('Invalid analysis format:', analysisText);
        throw new Error('Invalid analysis format - missing required sections');
      }

      const matchScore = extractMatchScore(analysisText);
      const company = extractCompany(analysisText);

      // Cache the results
      await cacheAnalysis(supabase, jobId, userId, analysisText, matchScore);

      return new Response(
        JSON.stringify({ 
          message: 'Analysis completed successfully',
          analysisText,
          matchScore,
          company
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      throw new Error(`Failed to parse AI response: ${parseError.message}`);
    }

  } catch (error) {
    console.error('Error in analyze-job function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        details: error.toString()
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});