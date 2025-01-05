import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from './cors.ts'
import { fetchJobAnalysis, fetchProfile, fetchJob, checkExistingOptimizedResume, updateOptimizedResume, createOptimizedResume } from './db.ts'
import { generateOptimizedResume } from './optimizer.ts'

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { jobId, userId, sections, originalResume } = await req.json()
    console.log('Received request to optimize resume for job:', jobId)
    console.log('User ID:', userId)
    console.log('Sections to optimize:', sections)

    if (!jobId || !userId) {
      throw new Error('Missing required parameters: jobId or userId')
    }

    // Fetch job analysis first
    const jobAnalysisResult = await fetchJobAnalysis(jobId, userId)
    console.log('Job analysis result:', jobAnalysisResult)
    
    if (jobAnalysisResult.error) {
      console.error('Error fetching job analysis:', jobAnalysisResult.error)
      return new Response(
        JSON.stringify({
          error: 'Failed to fetch job analysis',
          details: jobAnalysisResult.error
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      )
    }

    if (!jobAnalysisResult.data) {
      console.error('No job analysis found')
      return new Response(
        JSON.stringify({
          error: 'No job analysis found. Please analyze the job first.',
          details: null
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404
        }
      )
    }

    // Fetch profile and job in parallel after confirming job analysis exists
    const [profileResult, jobResult] = await Promise.all([
      fetchProfile(userId),
      fetchJob(jobId),
    ])

    // Handle profile error
    if (profileResult.error) {
      console.error('Error fetching profile:', profileResult.error)
      return new Response(
        JSON.stringify({
          error: 'Failed to fetch profile',
          details: profileResult.error
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      )
    }

    // Handle job error
    if (jobResult.error) {
      console.error('Error fetching job:', jobResult.error)
      return new Response(
        JSON.stringify({
          error: 'Failed to fetch job',
          details: jobResult.error
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      )
    }

    if (!jobResult.data) {
      console.error('No job found')
      return new Response(
        JSON.stringify({
          error: 'Job not found',
          details: null
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404
        }
      )
    }

    console.log('Successfully fetched all required data')

    // Check for existing optimized resume
    const existingResumeResult = await checkExistingOptimizedResume(jobId, userId)
    console.log('Existing resume check:', existingResumeResult.data ? 'Found' : 'Not found')

    try {
      // Generate optimized content
      const optimizedContent = await generateOptimizedResume(
        originalResume || profileResult.data?.content,
        jobResult.data,
        jobAnalysisResult.data.analysis_text
      )

      // Prepare resume data
      const resumeData = {
        user_id: userId,
        job_id: jobId,
        content: optimizedContent,
        match_score: jobAnalysisResult.data.match_score || 0,
        optimization_status: 'completed',
        version_name: 'Optimized Resume',
      }

      // Update or create optimized resume
      let result
      if (existingResumeResult.data?.id) {
        console.log('Updating existing optimized resume')
        result = await updateOptimizedResume(existingResumeResult.data.id, resumeData)
      } else {
        console.log('Creating new optimized resume')
        result = await createOptimizedResume(resumeData)
      }

      if (result.error) {
        throw result.error
      }

      console.log('Successfully saved optimized resume')

      return new Response(
        JSON.stringify({
          optimizedResume: result.data,
          message: 'Resume optimization completed successfully'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    } catch (error) {
      console.error('Error in resume optimization:', error)
      return new Response(
        JSON.stringify({
          error: 'Failed to optimize resume',
          details: error.message
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        }
      )
    }
  } catch (error) {
    console.error('Error in optimize-resume function:', error)
    
    return new Response(
      JSON.stringify({
        error: error.message || 'An unexpected error occurred',
        details: error.details || null
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: error.status || 500,
      },
    )
  }
})