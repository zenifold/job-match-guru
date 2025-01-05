import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Enhanced keyword categories with weights
const KEYWORD_CATEGORIES = {
  technical: {
    weight: 1.0,
    keywords: [
      "python", "javascript", "typescript", "react", "node.js", "aws", "docker",
      "kubernetes", "ci/cd", "git", "sql", "nosql", "rest api", "graphql",
      "machine learning", "ai", "cloud computing", "microservices", "devops",
      "java", "c++", "ruby", "php", "swift", "kotlin", "mobile development",
      "web development", "database", "api", "frontend", "backend", "full stack"
    ]
  },
  soft_skills: {
    weight: 0.8,
    keywords: [
      "leadership", "communication", "problem-solving", "teamwork", "collaboration",
      "project management", "agile", "scrum", "time management", "analytical",
      "strategic thinking", "innovation", "creativity", "attention to detail",
      "presentation", "negotiation", "mentoring", "team building", "adaptability"
    ]
  },
  business: {
    weight: 0.9,
    keywords: [
      "strategy", "analytics", "optimization", "stakeholder management",
      "budget management", "risk management", "product management",
      "business development", "client relations", "market analysis",
      "digital transformation", "process improvement", "data analysis",
      "customer experience", "operations management", "strategic planning",
      "partnerships", "channel management", "revenue growth", "go-to-market"
    ]
  }
};

// Function to extract specialized keywords from job title
function extractSpecializedKeywords(title: string): { keyword: string; weight: number }[] {
  const specializedKeywords: { keyword: string; weight: number }[] = [];
  
  // Split the title by common separators and remove common words
  const parts = title.toLowerCase()
    .split(/[-–—,|&]/)
    .map(part => part.trim())
    .filter(part => part.length > 0);

  // Common job title prefixes to ignore
  const commonPrefixes = ['senior', 'junior', 'lead', 'principal', 'staff'];
  
  // Process each part of the title
  parts.forEach((part, index) => {
    // Skip the first part if it's a common job title
    if (index === 0 && ['engineer', 'developer', 'manager', 'analyst'].some(title => part.includes(title))) {
      return;
    }
    
    // Skip if it's a common prefix
    if (commonPrefixes.includes(part)) {
      return;
    }
    
    // Add specialized keywords with high weight
    if (part.length > 3) { // Avoid short words
      specializedKeywords.push({
        keyword: part,
        weight: index === 0 ? 2.0 : 1.5 // Higher weight for first specialized keyword
      });
    }
  });

  return specializedKeywords;
}

// Function to analyze keyword frequency and importance
function analyzeKeywordImportance(text: string, jobTitle: string): { keyword: string; weight: number }[] {
  const words = text.toLowerCase().split(/\s+/);
  const wordFrequency: { [key: string]: number } = {};
  const keywordScores: { [key: string]: number } = {};

  // Count word frequency
  words.forEach(word => {
    wordFrequency[word] = (wordFrequency[word] || 0) + 1;
  });

  // Process keywords from each category
  Object.entries(KEYWORD_CATEGORIES).forEach(([category, { keywords, weight }]) => {
    keywords.forEach(keyword => {
      const keywordLower = keyword.toLowerCase();
      if (text.toLowerCase().includes(keywordLower)) {
        const frequency = wordFrequency[keywordLower] || 1;
        const score = frequency * weight;
        keywordScores[keyword] = score;
      }
    });
  });

  // Add specialized keywords from job title
  const specializedKeywords = extractSpecializedKeywords(jobTitle);
  specializedKeywords.forEach(({ keyword, weight }) => {
    if (text.toLowerCase().includes(keyword)) {
      keywordScores[keyword] = (keywordScores[keyword] || 0) + weight;
    }
  });

  // Convert scores to sorted array
  return Object.entries(keywordScores)
    .map(([keyword, weight]) => ({ keyword, weight }))
    .sort((a, b) => b.weight - a.weight);
}

function calculateMatchScore(jobKeywords: { keyword: string; weight: number }[], resumeText: string): {
  score: number;
  matched: string[];
  missing: string[];
  importance: { [key: string]: string };
} {
  const resumeLower = resumeText.toLowerCase();
  const matched: string[] = [];
  const missing: string[] = [];
  const importance: { [key: string]: string } = {};

  let totalWeight = 0;
  let matchedWeight = 0;

  jobKeywords.forEach(({ keyword, weight }) => {
    totalWeight += weight;
    
    if (resumeLower.includes(keyword.toLowerCase())) {
      matched.push(keyword);
      matchedWeight += weight;
    } else {
      missing.push(keyword);
    }

    // Categorize importance based on weight
    if (weight >= 2.0) {
      importance[keyword] = "Critical";
    } else if (weight >= 1.5) {
      importance[keyword] = "High";
    } else if (weight >= 1.0) {
      importance[keyword] = "Medium";
    } else {
      importance[keyword] = "Standard";
    }
  });

  const score = (matchedWeight / totalWeight) * 100;

  return {
    score: Math.round(score),
    matched,
    missing,
    importance
  };
}

function generateAnalysisText(
  matchResult: { 
    score: number; 
    matched: string[]; 
    missing: string[]; 
    importance: { [key: string]: string }; 
  }
): string {
  const { score, matched, missing, importance } = matchResult;
  
  let analysis = `Match Score Analysis:\n\nOverall Match: ${score}%\n\n`;
  
  if (matched.length > 0) {
    analysis += `Strong Matches:\n`;
    matched.forEach(keyword => {
      analysis += `✓ ${keyword} (${importance[keyword]} Priority)\n`;
    });
  }
  
  if (missing.length > 0) {
    analysis += `\nSuggested Improvements:\n`;
    // Sort missing keywords by importance
    const sortedMissing = missing.sort((a, b) => {
      const importanceOrder = { "Critical": 0, "High": 1, "Medium": 2, "Standard": 3 };
      return importanceOrder[importance[a]] - importanceOrder[importance[b]];
    });
    
    sortedMissing.forEach(keyword => {
      analysis += `• Consider adding experience or skills related to: ${keyword} (${importance[keyword]} Priority)\n`;
    });
  }
  
  analysis += `\nRecommendations:\n`;
  if (score < 50) {
    const criticalMissing = missing.filter(k => importance[k] === "Critical" || importance[k] === "High").slice(0, 3);
    analysis += `• Focus on acquiring skills in: ${criticalMissing.join(', ')}\n`;
    analysis += `• Consider taking relevant courses or certifications\n`;
  } else if (score < 75) {
    const highMatches = matched.filter(k => importance[k] === "High" || importance[k] === "Critical").slice(0, 2);
    const highMissing = missing.filter(k => importance[k] === "High" || importance[k] === "Critical").slice(0, 2);
    analysis += `• Highlight your experience with: ${highMatches.join(', ')}\n`;
    analysis += `• Look for opportunities to gain experience in: ${highMissing.join(', ')}\n`;
  } else {
    const topMatches = matched.filter(k => importance[k] === "Critical" || importance[k] === "High").slice(0, 3);
    analysis += `• You're a strong match! Consider highlighting your expertise in: ${topMatches.join(', ')}\n`;
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

    // Analyze keywords with importance
    const jobKeywords = analyzeKeywordImportance(job.description, job.title);
    console.log('Analyzed job keywords with importance:', jobKeywords);

    // Extract resume text
    const resumeContent = profile.content;
    const resumeText = [
      ...resumeContent.skills,
      ...(resumeContent.experience || []).map((exp: any) => exp.description),
      ...(resumeContent.projects || []).map((proj: any) => proj.description)
    ].join(' ');
    
    // Calculate match score with importance
    const matchResult = calculateMatchScore(jobKeywords, resumeText);
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
        missing: matchResult.missing,
        importance: matchResult.importance
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