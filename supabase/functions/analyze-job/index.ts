import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Comprehensive list of high-value keywords
const HIGH_VALUE_KEYWORDS = {
  technical: [
    "python", "javascript", "typescript", "react", "node.js", "aws", "docker",
    "kubernetes", "ci/cd", "git", "sql", "nosql", "rest api", "graphql",
    "machine learning", "ai", "cloud computing", "microservices", "devops",
    "java", "c++", "ruby", "php", "swift", "kotlin", "mobile development",
    "web development", "database", "api", "frontend", "backend", "full stack"
  ],
  soft_skills: [
    "leadership", "communication", "problem-solving", "teamwork", "collaboration",
    "project management", "agile", "scrum", "time management", "analytical",
    "strategic thinking", "innovation", "creativity", "attention to detail",
    "presentation", "negotiation", "mentoring", "team building", "adaptability"
  ],
  business: [
    "strategy", "analytics", "optimization", "stakeholder management",
    "budget management", "risk management", "product management",
    "business development", "client relations", "market analysis",
    "digital transformation", "process improvement", "data analysis",
    "customer experience", "operations management", "strategic planning"
  ]
};

function extractKeywords(text: string): string[] {
  const normalizedText = text.toLowerCase();
  const allKeywords = [
    ...HIGH_VALUE_KEYWORDS.technical,
    ...HIGH_VALUE_KEYWORDS.soft_skills,
    ...HIGH_VALUE_KEYWORDS.business
  ];
  
  return allKeywords.filter(keyword => normalizedText.includes(keyword.toLowerCase()));
}

function calculateMatchScore(jobKeywords: string[], resumeKeywords: string[]): {
  score: number;
  matched: string[];
  missing: string[];
} {
  const matched = jobKeywords.filter(keyword => 
    resumeKeywords.includes(keyword.toLowerCase())
  );
  
  const missing = jobKeywords.filter(keyword => 
    !resumeKeywords.includes(keyword.toLowerCase())
  );

  const score = (matched.length / jobKeywords.length) * 100;

  return {
    score: Math.round(score),
    matched,
    missing
  };
}

function generateAnalysisText(matchResult: { score: number; matched: string[]; missing: string[] }): string {
  const { score, matched, missing } = matchResult;
  
  let analysis = `Match Score Analysis:\n\n`;
  analysis += `Overall Match: ${score}%\n\n`;
  
  if (matched.length > 0) {
    analysis += `Strong Matches:\n`;
    matched.forEach(keyword => {
      analysis += `✓ ${keyword}\n`;
    });
  }
  
  if (missing.length > 0) {
    analysis += `\nSuggested Improvements:\n`;
    missing.forEach(keyword => {
      analysis += `• Consider adding experience or skills related to: ${keyword}\n`;
    });
  }
  
  analysis += `\nRecommendations:\n`;
  if (score < 50) {
    analysis += `• Focus on acquiring skills in: ${missing.slice(0, 3).join(', ')}\n`;
    analysis += `• Consider taking relevant courses or certifications\n`;
  } else if (score < 75) {
    analysis += `• Highlight your experience with: ${matched.slice(0, 3).join(', ')}\n`;
    analysis += `• Look for opportunities to gain experience in: ${missing.slice(0, 2).join(', ')}\n`;
  } else {
    analysis += `• You're a strong match! Consider highlighting your expertise in: ${matched.slice(0, 3).join(', ')}\n`;
  }

  return analysis;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { jobId, userId } = await req.json();
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`Starting analysis for job ${jobId} and user ${userId}`);

    // Fetch job details
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (jobError) throw jobError;

    // Fetch user's resume data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('content')
      .eq('user_id', userId)
      .single();

    if (profileError) throw profileError;

    console.log('Successfully fetched job and profile data');

    // Extract keywords from job description
    const jobKeywords = extractKeywords(job.description + ' ' + job.title);
    console.log('Extracted job keywords:', jobKeywords);

    // Extract keywords from resume
    const resumeContent = profile.content;
    const resumeText = [
      ...resumeContent.skills,
      ...(resumeContent.experience || []).map((exp: any) => exp.description),
      ...(resumeContent.projects || []).map((proj: any) => proj.description)
    ].join(' ');
    
    const resumeKeywords = extractKeywords(resumeText);
    console.log('Extracted resume keywords:', resumeKeywords);

    // Calculate match score and get matched/missing keywords
    const matchResult = calculateMatchScore(jobKeywords, resumeKeywords);
    console.log('Match result:', matchResult);
    
    // Generate detailed analysis text
    const analysisText = generateAnalysisText(matchResult);

    // Store analysis results
    const { error: analysisError } = await supabase
      .from('job_analyses')
      .upsert({
        job_id: jobId,
        user_id: userId,
        analysis_text: analysisText,
        match_score: matchResult.score
      });

    if (analysisError) throw analysisError;

    console.log(`Analysis completed for job ${jobId} with score ${matchResult.score}%`);

    return new Response(
      JSON.stringify({ 
        score: matchResult.score,
        message: 'Analysis completed successfully',
        matched: matchResult.matched,
        missing: matchResult.missing
      }),
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