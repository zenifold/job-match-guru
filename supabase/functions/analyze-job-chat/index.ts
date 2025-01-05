import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, context } = await req.json();
    const openRouterApiKey = Deno.env.get('OPENROUTER_API_KEY');

    if (!openRouterApiKey) {
      throw new Error('OpenRouter API key not found');
    }

    const systemPrompt = `You are an AI assistant helping with job application analysis. 
    You have access to the following context about a job analysis:
    
    Job Title: ${context.jobTitle}
    Match Score: ${context.matchScore}%
    
    Matched Skills:
    ${context.matchedKeywords.join('\n')}
    
    Missing Skills:
    ${context.missingKeywords.join('\n')}
    
    Provide helpful, actionable advice based on this analysis. Focus on:
    1. Explaining the match score and its implications
    2. Suggesting ways to acquire missing skills
    3. Highlighting the strengths from matched skills
    4. Providing industry-specific career advice
    
    Keep responses concise but informative.`;

    console.log('Sending request to OpenRouter API with context:', {
      jobTitle: context.jobTitle,
      matchScore: context.matchScore,
      matchedKeywordsCount: context.matchedKeywords.length,
      missingKeywordsCount: context.missingKeywords.length
    });

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
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
          { role: 'user', content: message }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenRouter API Error:', errorData);
      throw new Error('Failed to get AI response');
    }

    const data = await response.json();
    console.log('OpenRouter API Response received');

    return new Response(
      JSON.stringify({ response: data.choices[0].message.content }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in analyze-job-chat function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});