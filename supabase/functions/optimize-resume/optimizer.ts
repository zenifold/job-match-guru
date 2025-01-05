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

async function getAIOptimizedContent(
  resumeContent: any, 
  jobDescription: string, 
  analysis: JobAnalysis,
  selectedSections: string[]
) {
  const openRouterApiKey = Deno.env.get('OPENROUTER_API_KEY');
  const selectedModel = Deno.env.get('SELECTED_MODEL') || 'google/gemini-2.0-flash-exp:free';

  console.log('Using AI model:', selectedModel);
  console.log('Selected sections for optimization:', selectedSections);

  const sectionInstructions = selectedSections.map(section => {
    switch(section) {
      case 'summary':
        return "- Enhance the summary to better align with the job requirements while maintaining authenticity";
      case 'experience':
        return "- Rewrite experience descriptions to highlight relevant skills and achievements that match the job requirements";
      case 'skills':
        return "- Add relevant missing skills and reorder existing skills based on job importance";
      default:
        return `- Optimize the ${section} section to better match the job requirements`;
    }
  }).join('\n');

  const prompt = `
    As an AI resume optimizer, analyze this job description and resume, then optimize ONLY the following sections:
    ${sectionInstructions}

    Job Description:
    ${jobDescription}

    Current Resume Content:
    ${JSON.stringify(resumeContent, null, 2)}

    Analysis Results:
    ${analysis.analysis_text}

    Important Guidelines:
    1. Only modify the sections specified above
    2. Maintain truthfulness and professional standards
    3. Keep the same structure and format
    4. Preserve all other sections exactly as they are
    5. For experience entries:
       - Highlight relevant achievements
       - Use strong action verbs
       - Quantify results where possible
    6. For skills:
       - Add missing relevant skills
       - Prioritize skills mentioned in the job description
    7. For summary:
       - Focus on relevant experience and skills
       - Keep it concise and impactful

    Return only the optimized resume content in valid JSON format, matching the original structure exactly.
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
    console.log('AI Response received, parsing optimized content...');
    const optimizedContent = JSON.parse(data.choices[0].message.content);
    return optimizedContent;
  } catch (error) {
    console.error('Error in AI optimization:', error);
    throw error;
  }
}

export async function optimizeContent(
  resumeContent: any, 
  missingKeywords: { keyword: string; priority: string }[], 
  jobDescription: string, 
  analysis: JobAnalysis,
  selectedSections: string[]
) {
  console.log('Starting resume optimization with AI...');
  console.log('Selected sections:', selectedSections);
  
  try {
    // Get AI-optimized content with selected sections
    const aiOptimizedContent = await getAIOptimizedContent(
      resumeContent, 
      jobDescription, 
      analysis,
      selectedSections
    );
    
    // Merge the optimized content with original content
    const finalContent = { ...resumeContent };
    
    // Only update the selected sections
    selectedSections.forEach(section => {
      if (aiOptimizedContent[section]) {
        finalContent[section] = aiOptimizedContent[section];
      }
    });

    // Always ensure skills are properly merged
    if (selectedSections.includes('skills')) {
      finalContent.skills = [...new Set([
        ...(finalContent.skills || []),
        ...missingKeywords.map(k => k.keyword)
      ])];
    }

    console.log('Resume optimization completed successfully');
    return finalContent;
  } catch (error) {
    console.error('Failed to optimize resume with AI:', error);
    // Fallback to basic optimization if AI fails
    const finalContent = { ...resumeContent };
    if (selectedSections.includes('skills')) {
      finalContent.skills = [...new Set([
        ...(resumeContent.skills || []),
        ...missingKeywords.map(k => k.keyword)
      ])];
    }
    return finalContent;
  }
}