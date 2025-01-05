export async function generateOptimizedResume(
  originalContent: any,
  job: { title: string; description: string },
  analysisText: string
) {
  console.log('Generating optimized resume for job:', job.title);
  console.log('Original content:', originalContent);
  console.log('Analysis text:', analysisText);
  
  try {
    // Parse the analysis text to extract keywords and their priorities
    const keywordsMatch = analysisText.match(/Consider adding experience or skills related to:.*?\((.*?) Priority\)/g);
    const keywords = keywordsMatch
      ? keywordsMatch.map(match => {
          const priorityMatch = match.match(/\((.*?) Priority\)/);
          const priority = priorityMatch ? priorityMatch[1].toLowerCase() : 'standard';
          const keyword = match
            .replace('Consider adding experience or skills related to:', '')
            .replace(/\(.*?\)/, '')
            .trim();
          return { keyword: keyword.toLowerCase(), priority };
        })
      : [];

    console.log('Extracted keywords with priorities:', keywords);

    // Sort keywords by priority
    const priorityOrder = { critical: 3, high: 2, medium: 1, standard: 0 };
    keywords.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);

    // Create a deep copy of the original content
    const optimizedContent = JSON.parse(JSON.stringify(originalContent));

    // Enhance the summary if it exists
    if (optimizedContent.personalInfo?.summary) {
      const highPriorityKeywords = keywords
        .filter(k => k.priority === 'critical' || k.priority === 'high')
        .slice(0, 3)
        .map(k => k.keyword)
        .join(', ');
      
      if (highPriorityKeywords) {
        optimizedContent.personalInfo.summary += ` Actively developing expertise in ${highPriorityKeywords} to stay at the forefront of industry developments.`;
      }
    }

    // Add relevant skills, prioritizing high-priority keywords
    if (optimizedContent.skills) {
      const existingSkills = new Set(optimizedContent.skills.map((s: string) => s.toLowerCase()));
      keywords.forEach(({ keyword, priority }) => {
        if (!existingSkills.has(keyword) && (priority === 'critical' || priority === 'high')) {
          optimizedContent.skills.push(keyword);
        }
      });
    }

    // Enhance experience descriptions
    if (optimizedContent.experience && optimizedContent.experience.length > 0) {
      optimizedContent.experience = optimizedContent.experience.map((exp: any) => {
        // Filter for high-priority keywords not already mentioned
        const relevantKeywords = keywords
          .filter(({ keyword, priority }) => 
            (priority === 'critical' || priority === 'high') &&
            !exp.description.toLowerCase().includes(keyword)
          )
          .slice(0, 2);

        if (relevantKeywords.length > 0) {
          const keywordPhrase = relevantKeywords.map(k => k.keyword).join(' and ');
          exp.description += ` Leveraged ${keywordPhrase} to drive project success.`;
        }

        // Add relevant keywords to responsibilities, prioritizing critical ones
        if (exp.keyResponsibilities && exp.keyResponsibilities.length > 0) {
          const criticalKeyword = keywords.find(({ keyword, priority }) => 
            priority === 'critical' &&
            !exp.keyResponsibilities.some((resp: string) => 
              resp.toLowerCase().includes(keyword)
            )
          );

          if (criticalKeyword) {
            exp.keyResponsibilities.push(
              `Utilized ${criticalKeyword.keyword} to enhance project outcomes and team efficiency.`
            );
          }
        }

        return exp;
      });
    }

    console.log('Optimized content:', optimizedContent);

    return {
      ...optimizedContent,
      metadata: {
        optimizedFor: job.title,
        optimizationDate: new Date().toISOString(),
        analysisUsed: analysisText,
        keywordsWithPriority: keywords
      }
    };
  } catch (error) {
    console.error('Error generating optimized resume:', error);
    throw new Error('Failed to generate optimized resume');
  }
}