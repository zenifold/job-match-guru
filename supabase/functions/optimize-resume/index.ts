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

    // Fetch required data
    const [jobAnalysisResult, profileResult, jobResult] = await Promise.all([
      fetchJobAnalysis(jobId, userId),
      fetchProfile(userId),
      fetchJob(jobId),
    ])

    // Handle potential errors
    if (jobAnalysisResult.error) {
      console.error('Error fetching job analysis:', jobAnalysisResult.error)
      throw new Error('Failed to fetch job analysis')
    }

    if (profileResult.error) {
      console.error('Error fetching profile:', profileResult.error)
      throw new Error('Failed to fetch profile')
    }

    if (jobResult.error) {
      console.error('Error fetching job:', jobResult.error)
      throw new Error('Failed to fetch job')
    }

    // Validate required data
    if (!jobAnalysisResult.data) {
      console.error('No job analysis found')
      throw new Error('No job analysis found. Please analyze the job first.')
    }

    if (!jobResult.data) {
      console.error('No job found')
      throw new Error('Job not found')
    }

    console.log('Successfully fetched all required data')

    // Check for existing optimized resume
    const existingResumeResult = await checkExistingOptimizedResume(jobId, userId)
    console.log('Existing resume check:', existingResumeResult.data ? 'Found' : 'Not found')

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

    if (!result.data) {
      throw new Error('Failed to save optimized resume')
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