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

// Function to extract specialized keywords from job title and description
function extractSpecializedKeywords(title: string, description: string): { keyword: string; weight: number }[] {
  const specializedKeywords: { keyword: string; weight: number }[] = [];
  
  // Process the title
  const titleParts = title.toLowerCase()
    .split(/[-–—,|&]/)
    .map(part => part.trim())
    .filter(part => part.length > 0);

  // Common words to ignore
  const commonWords = ['senior', 'junior', 'lead', 'principal', 'staff', 'engineer', 'developer', 'manager', 'analyst'];
  
  // Add title keywords
  titleParts.forEach(part => {
    if (!commonWords.includes(part) && part.length > 3) {
      specializedKeywords.push({
        keyword: part,
        weight: 2.0 // High weight for title keywords
      });
    }
  });

  // Extract potential keywords from description
  const descriptionWords = description.toLowerCase()
    .split(/[\s,.]/)
    .map(word => word.trim())
    .filter(word => word.length > 3 && !commonWords.includes(word));

  // Count word frequency in description
  const wordFrequency: { [key: string]: number } = {};
  descriptionWords.forEach(word => {
    wordFrequency[word] = (wordFrequency[word] || 0) + 1;
  });

  // Add high-frequency words as specialized keywords
  Object.entries(wordFrequency)
    .filter(([_, freq]) => freq > 1) // Only consider words that appear more than once
    .forEach(([word, freq]) => {
      if (!specializedKeywords.some(k => k.keyword === word)) {
        specializedKeywords.push({
          keyword: word,
          weight: 1.0 + (freq * 0.1) // Weight increases with frequency
        });
      }
    });

  return specializedKeywords;
}

// Function to analyze keyword importance
function analyzeKeywordImportance(text: string, jobTitle: string): { keyword: string; weight: number }[] {
  console.log(`Analyzing keywords for job: ${jobTitle}`);
  console.log(`Job description length: ${text.length} characters`);

  const words = text.toLowerCase().split(/\s+/);
  const wordFrequency: { [key: string]: number } = {};
  const keywordScores: { [key: string]: number } = {};

  // Count word frequency
  words.forEach(word => {
    wordFrequency[word] = (wordFrequency[word] || 0) + 1;
  });

  // Process predefined keywords
  Object.entries(KEYWORD_CATEGORIES).forEach(([category, { keywords, weight }]) => {
    keywords.forEach(keyword => {
      const keywordLower = keyword.toLowerCase();
      if (text.toLowerCase().includes(keywordLower)) {
        const frequency = wordFrequency[keywordLower] || 1;
        const score = frequency * weight;
        keywordScores[keyword] = score;
        console.log(`Found keyword: ${keyword} (${category}) with score: ${score}`);
      }
    });
  });

  // Add specialized keywords
  const specializedKeywords = extractSpecializedKeywords(jobTitle, text);
  specializedKeywords.forEach(({ keyword, weight }) => {
    if (text.toLowerCase().includes(keyword)) {
      keywordScores[keyword] = (keywordScores[keyword] || 0) + weight;
      console.log(`Found specialized keyword: ${keyword} with weight: ${weight}`);
    }
  });

  return Object.entries(keywordScores)
    .map(([keyword, weight]) => ({ keyword, weight }))
    .sort((a, b) => b.weight - a.weight);
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

    // Fetch job details with a fresh query
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (jobError) {
      console.error('Error fetching job:', jobError);
      throw jobError;
    }

    console.log('Job details:', {
      title: job.title,
      descriptionLength: job.description.length,
      dateAdded: job.date_added
    });

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

    console.log('Successfully fetched job and profile data');

    // Analyze keywords with importance
    const jobKeywords = analyzeKeywordImportance(job.description, job.title);
    console.log('Analyzed job keywords:', jobKeywords);

    // Extract resume text
    const resumeContent = profile.content;
    const resumeText = [
      ...(resumeContent.skills || []),
      ...(resumeContent.experience || []).map((exp: any) => exp.description),
      ...(resumeContent.projects || []).map((proj: any) => proj.description)
    ].join(' ');
    
    console.log('Resume text length:', resumeText.length);

    // Calculate match score
    let totalWeight = 0;
    let matchedWeight = 0;
    const matched: string[] = [];
    const missing: string[] = [];
    const importance: { [key: string]: string } = {};

    jobKeywords.forEach(({ keyword, weight }) => {
      totalWeight += weight;
      
      if (resumeText.toLowerCase().includes(keyword.toLowerCase())) {
        matched.push(keyword);
        matchedWeight += weight;
        console.log(`Matched keyword: ${keyword} with weight ${weight}`);
      } else {
        missing.push(keyword);
        console.log(`Missing keyword: ${keyword} with weight ${weight}`);
      }

      // Categorize importance based on weight
      if (weight >= 2.0) importance[keyword] = "Critical";
      else if (weight >= 1.5) importance[keyword] = "High";
      else if (weight >= 1.0) importance[keyword] = "Medium";
      else importance[keyword] = "Standard";
    });

    const matchScore = totalWeight > 0 ? (matchedWeight / totalWeight) * 100 : 0;
    console.log(`Final match score: ${matchScore}%`);

    // Generate analysis text
    let analysisText = `Match Score Analysis:\n\nOverall Match: ${Math.round(matchScore)}%\n\n`;
    
    if (matched.length > 0) {
      analysisText += `Strong Matches:\n`;
      matched.forEach(keyword => {
        analysisText += `✓ ${keyword} (${importance[keyword]} Priority)\n`;
      });
    }
    
    if (missing.length > 0) {
      analysisText += `\nSuggested Improvements:\n`;
      missing
        .sort((a, b) => {
          const importanceOrder = { "Critical": 0, "High": 1, "Medium": 2, "Standard": 3 };
          return importanceOrder[importance[a]] - importanceOrder[importance[b]];
        })
        .forEach(keyword => {
          analysisText += `• Consider adding experience or skills related to: ${keyword} (${importance[keyword]} Priority)\n`;
        });
    }
    
    analysisText += `\nRecommendations:\n`;
    const criticalMissing = missing
      .filter(k => importance[k] === "Critical" || importance[k] === "High")
      .slice(0, 2);
    
    if (criticalMissing.length > 0) {
      analysisText += `• Focus on acquiring skills in: ${criticalMissing.join(', ')}\n`;
    }
    analysisText += `• Consider taking relevant courses or certifications\n`;

    // Store analysis results
    const { error: analysisError } = await supabase
      .from('job_analyses')
      .upsert({
        job_id: jobId,
        user_id: userId,
        analysis_text: analysisText,
        match_score: Math.round(matchScore)
      });

    if (analysisError) {
      console.error('Error storing analysis:', analysisError);
      throw analysisError;
    }

    console.log('Analysis completed and stored successfully');

    return new Response(
      JSON.stringify({ 
        score: Math.round(matchScore),
        message: 'Analysis completed successfully',
        matched,
        missing,
        importance
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