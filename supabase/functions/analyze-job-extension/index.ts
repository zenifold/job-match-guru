import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { jobDescription, jobTitle, userId } = await req.json();

    if (!jobDescription || !jobTitle) {
      throw new Error('Missing required fields');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // First, save the job
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .insert({
        title: jobTitle,
        description: jobDescription,
        user_id: userId,
      })
      .select()
      .single();

    if (jobError) throw jobError;

    // Then analyze it using the existing analyze-job function
    const analysisResponse = await fetch(`${supabaseUrl}/functions/v1/analyze-job`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jobId: job.id,
        userId,
      }),
    });

    if (!analysisResponse.ok) {
      throw new Error('Failed to analyze job');
    }

    const analysisData = await analysisResponse.json();

    return new Response(
      JSON.stringify({
        success: true,
        job,
        analysis: analysisData,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});