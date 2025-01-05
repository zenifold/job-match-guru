import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { analyzeKeywordImportance } from './keywordExtractor.ts';

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

    if (!job) {
      throw new Error('Job not found');
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

    if (!profile) {
      throw new Error('Profile not found');
    }

    // Extract resume text
    const resumeContent = profile.content;
    const resumeText = [
      ...(resumeContent.skills || []),
      ...(resumeContent.experience || []).map((exp: any) => exp.description || ''),
      ...(resumeContent.projects || []).map((proj: any) => proj.description || '')
    ].filter(Boolean).join(' ');

    // Use AI to analyze the job and resume
    const systemPrompt = `You are an AI assistant analyzing job requirements and resume match.
    
    Job Title: ${job.title}
    Job Description: ${job.description}
    
    Resume Content: ${resumeText}
    
    Analyze the match between the job requirements and resume. Focus on:
    1. Key skills and experience required by the job
    2. Matching skills found in the resume
    3. Missing skills or areas for improvement
    4. Priority level of each skill (Critical, High, Medium, Standard)
    
    Format the response as follows:
    - Start with "Match Score Analysis:"
    - Include an "Overall Match" percentage
    - List "Strong Matches:" with ✓ prefix and priority in parentheses
    - List "Suggested Improvements:" with bullet points and priority in parentheses`;

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
          { role: 'user', content: 'Analyze the job match and provide detailed feedback.' }
        ]
      })
    });

    if (!aiResponse.ok) {
      const errorData = await aiResponse.text();
      console.error('OpenRouter API Error:', errorData);
      throw new Error(`Failed to get AI analysis: ${errorData}`);
    }

    const aiData = await aiResponse.json();
    console.log('AI Response:', aiData);

    if (!aiData.choices || !aiData.choices[0] || !aiData.choices[0].message) {
      console.error('Invalid AI response format:', aiData);
      throw new Error('Invalid AI response format');
    }

    const analysisText = aiData.choices[0].message.content;
    console.log('AI Analysis:', analysisText);

    // Extract match score from AI response
    const matchScoreMatch = analysisText.match(/Overall Match: (\d+)%/);
    const matchScore = matchScoreMatch ? parseInt(matchScoreMatch[1]) : 0;

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
        analysisText
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