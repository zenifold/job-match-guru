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

    // Enhanced system prompt for better structured analysis
    const systemPrompt = `You are an AI assistant analyzing job requirements and resume match.
    
    Job Title: ${job.title}
    Job Description: ${job.description}
    
    Resume Content: ${resumeText}
    
    Analyze the match between the job requirements and resume. Provide a detailed analysis in the following format:

    1. Start with "Match Score Analysis:"
    2. Calculate and show "Overall Match: X%" based on skills and experience match
    3. List sections in this order:

    "Strong Matches:"
    - List each matching skill/experience with ✓ prefix
    - Include priority level in parentheses (Critical, High, Medium, Standard)
    
    "Target Keywords:"
    - List specific technical skills and keywords from the job description
    - Include priority level in parentheses
    - Focus on concrete, actionable skills
    
    "Required Experience:"
    - List specific experience areas or subject matter expertise needed
    - Include years of experience if mentioned
    - Include priority level in parentheses
    
    "Suggested Improvements:"
    - List missing skills or areas for improvement with bullet points
    - Include priority level in parentheses
    - Focus on actionable items

    Keep the format consistent and structured for parsing. Use priority levels (Critical, High, Medium, Standard) for all items.`;

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

    if (!aiResponse.ok) {
      const errorData = await aiResponse.text();
      console.error('OpenRouter API Error:', errorData);
      throw new Error(`Failed to get AI analysis: ${errorData}`);
    }

    const aiData = await aiResponse.json();
    console.log('AI Response:', aiData);

    // Handle OpenRouter's specific response format
    let analysisText;
    if (aiData.choices?.[0]?.message?.content) {
      analysisText = aiData.choices[0].message.content;
    } else if (aiData.choices?.[0]?.content) {
      analysisText = aiData.choices[0].content;
    } else if (typeof aiData.choices?.[0] === 'string') {
      analysisText = aiData.choices[0];
    } else {
      console.error('Unexpected AI response format:', aiData);
      throw new Error('Unexpected AI response format. Response: ' + JSON.stringify(aiData));
    }

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