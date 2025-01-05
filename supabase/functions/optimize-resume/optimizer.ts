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

export function extractContextWords(text: string, keyword: string): string[] {
  const words = text.toLowerCase().split(/\s+/);
  const keywordIndex = words.findIndex(w => w.includes(keyword.toLowerCase()));
  if (keywordIndex === -1) return [];
  
  const start = Math.max(0, keywordIndex - 3);
  const end = Math.min(words.length, keywordIndex + 4);
  return words.slice(start, end);
}

export function generateResponsibility(keyword: string, context: string[], position: string): string {
  const templates = [
    `Led initiatives to implement ${keyword} solutions, improving team efficiency and project outcomes`,
    `Developed and executed ${keyword} strategies aligned with business objectives`,
    `Collaborated with cross-functional teams to integrate ${keyword} best practices`,
    `Spearheaded the adoption of ${keyword} methodologies to enhance project delivery`,
  ];

  return templates[Math.floor(Math.random() * templates.length)];
}

export function optimizeExperience(experience: any[], missingKeywords: { keyword: string; priority: string }[], jobDescription: string): any[] {
  return experience.map(exp => {
    // Enhance existing responsibilities with relevant keywords
    const enhancedResponsibilities = exp.keyResponsibilities.map((resp: string) => {
      let enhanced = resp;
      missingKeywords.forEach(({ keyword }) => {
        if (jobDescription.toLowerCase().includes(keyword.toLowerCase()) &&
            !enhanced.toLowerCase().includes(keyword.toLowerCase())) {
          enhanced = enhanced.replace(/\.$/, '') + ` utilizing ${keyword}.`;
        }
      });
      return enhanced;
    });

    // Add new responsibilities based on missing keywords
    const newResponsibilities = missingKeywords
      .filter(({ keyword, priority }) => 
        priority === 'Critical' || priority === 'High' &&
        !exp.keyResponsibilities.some((resp: string) => 
          resp.toLowerCase().includes(keyword.toLowerCase())
        )
      )
      .map(({ keyword }) => {
        const contextWords = extractContextWords(jobDescription, keyword);
        return generateResponsibility(keyword, contextWords, exp.position);
      });

    return {
      ...exp,
      keyResponsibilities: [...enhancedResponsibilities, ...newResponsibilities]
    };
  });
}

export function optimizeContent(resumeContent: any, missingKeywords: { keyword: string; priority: string }[], jobDescription: string) {
  return {
    ...resumeContent,
    skills: [...new Set([...resumeContent.skills, ...missingKeywords.map(k => k.keyword)])],
    experience: optimizeExperience(resumeContent.experience, missingKeywords, jobDescription),
  };
}