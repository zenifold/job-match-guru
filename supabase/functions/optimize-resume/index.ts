import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from './cors.ts'
import { fetchJobAnalysis, fetchProfile, fetchJob, checkExistingOptimizedResume, updateOptimizedResume, createOptimizedResume } from './db.ts'
import { generateOptimizedResume } from './optimizer.ts'

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { jobId } = await req.json()
    console.log('Received request to optimize resume for job:', jobId)

    // Get user ID from auth header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }
    const userId = authHeader.replace('Bearer ', '')
    console.log('User ID:', userId)

    // Fetch required data
    const [jobAnalysis, profile, job] = await Promise.all([
      fetchJobAnalysis(jobId, userId),
      fetchProfile(userId),
      fetchJob(jobId),
    ])

    // Validate required data
    if (!jobAnalysis?.data) {
      console.error('No job analysis found')
      throw new Error('No job analysis found. Please analyze the job first.')
    }

    if (!profile?.data?.content) {
      console.error('No profile found')
      throw new Error('No resume profile found. Please create a resume first.')
    }

    if (!job?.data) {
      console.error('No job found')
      throw new Error('Job not found')
    }

    console.log('Successfully fetched all required data')

    // Check for existing optimized resume
    const existingResume = await checkExistingOptimizedResume(jobId, userId)
    console.log('Existing resume check:', existingResume?.data ? 'Found' : 'Not found')

    // Generate optimized content
    const optimizedContent = await generateOptimizedResume(
      profile.data.content,
      job.data,
      jobAnalysis.data.analysis_text
    )

    // Prepare resume data
    const resumeData = {
      user_id: userId,
      job_id: jobId,
      content: optimizedContent,
      match_score: jobAnalysis.data.match_score || 0,
      optimization_status: 'completed',
      version_name: 'Optimized Resume',
    }

    // Update or create optimized resume
    let result
    if (existingResume?.data?.id) {
      console.log('Updating existing optimized resume')
      result = await updateOptimizedResume(existingResume.data.id, resumeData)
    } else {
      console.log('Creating new optimized resume')
      result = await createOptimizedResume(resumeData)
    }

    if (!result?.data) {
      throw new Error('Failed to save optimized resume')
    }

    console.log('Successfully saved optimized resume')

    return new Response(
      JSON.stringify(result.data),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error in optimize-resume function:', error)
    
    return new Response(
      JSON.stringify({
        error: error.message || 'An unexpected error occurred',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: error.status || 500,
      },
    )
  }
})