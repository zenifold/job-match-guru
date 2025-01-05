import { JobAnalysis, Profile, Job } from './types.ts';

export function extractMissingKeywords(analysisText: string): { keyword: string; priority: string }[] {
  const lines = analysisText.split('\n');
  const keywords: { keyword: string; priority: string }[] = [];
  
  let isSuggestedSection = false;
  for (const line of lines) {
    if (line.includes('Suggested Improvements:')) {
      isSuggestedSection = true;
      continue;
    }
    if (line.includes('Recommendations:')) {
      isSuggestedSection = false;
      continue;
    }
    if (isSuggestedSection && line.includes('Consider adding experience or skills related to:')) {
      const parts = line.split(':')[1].split('(');
      const keyword = parts[0].trim();
      const priority = parts[1]?.split(')')[0].trim() || 'Standard';
      keywords.push({ keyword, priority });
    }
  }
  
  return keywords;
}

async function getAIOptimizedContent(resumeContent: any, jobDescription: string, analysis: JobAnalysis) {
  const openRouterApiKey = Deno.env.get('OPENROUTER_API_KEY');
  const selectedModel = Deno.env.get('SELECTED_MODEL') || 'google/gemini-2.0-flash-exp:free';

  console.log('Using AI model:', selectedModel);

  const prompt = `
    As an AI resume optimizer, analyze this job description and resume, then suggest specific improvements:

    Job Description:
    ${jobDescription}

    Current Resume Content:
    ${JSON.stringify(resumeContent, null, 2)}

    Analysis Results:
    ${analysis.analysis_text}

    Please optimize the resume content to better match the job requirements while maintaining truthfulness and professional standards. Focus on:
    1. Enhancing skill descriptions
    2. Rephrasing experience to highlight relevant capabilities
    3. Adding missing keywords naturally
    4. Maintaining the original structure and truthfulness

    Return only the optimized resume content in valid JSON format, matching the original structure.
  `;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'HTTP-Referer': 'https://lovable.dev',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [
          { role: 'system', content: 'You are a professional resume optimizer that helps improve resumes while maintaining truthfulness.' },
          { role: 'user', content: prompt }
        ]
      })
    });

    if (!response.ok) {
      console.error('AI API Error:', await response.text());
      throw new Error('Failed to get AI optimization');
    }

    const data = await response.json();
    const optimizedContent = JSON.parse(data.choices[0].message.content);
    return optimizedContent;
  } catch (error) {
    console.error('Error in AI optimization:', error);
    throw error;
  }
}

export async function optimizeContent(resumeContent: any, missingKeywords: { keyword: string; priority: string }[], jobDescription: string, analysis: JobAnalysis) {
  console.log('Starting resume optimization with AI...');
  
  try {
    // Get AI-optimized content
    const aiOptimizedContent = await getAIOptimizedContent(resumeContent, jobDescription, analysis);
    
    // Ensure all missing keywords are included
    const finalContent = {
      ...aiOptimizedContent,
      skills: [...new Set([...aiOptimizedContent.skills, ...missingKeywords.map(k => k.keyword)])],
    };

    console.log('Resume optimization completed successfully');
    return finalContent;
  } catch (error) {
    console.error('Failed to optimize resume with AI:', error);
    // Fallback to basic optimization if AI fails
    return {
      ...resumeContent,
      skills: [...new Set([...resumeContent.skills, ...missingKeywords.map(k => k.keyword)])],
    };
  }
}