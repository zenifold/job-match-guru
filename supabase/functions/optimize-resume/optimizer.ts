export async function generateOptimizedResume(
  originalContent: any,
  job: { title: string; description: string },
  analysisText: string
) {
  console.log('Generating optimized resume for job:', job.title);
  console.log('Original content:', originalContent);
  console.log('Analysis text:', analysisText);
  
  try {
    // Parse the analysis text to extract keywords and experience
    const keywordsMatch = analysisText.match(/Consider adding experience or skills related to: ([^•\n]+)/g);
    const keywords = keywordsMatch
      ? keywordsMatch.map(match => {
          const keyword = match.replace('Consider adding experience or skills related to: ', '').trim();
          return keyword.replace(/ \([^)]+\)/, '').toLowerCase(); // Remove priority in parentheses
        })
      : [];

    console.log('Extracted keywords to add:', keywords);

    // Create a deep copy of the original content
    const optimizedContent = JSON.parse(JSON.stringify(originalContent));

    // Enhance the summary if it exists
    if (optimizedContent.personalInfo?.summary) {
      const relevantKeywords = keywords.slice(0, 3).join(', '); // Take top 3 keywords
      optimizedContent.personalInfo.summary += ` Actively developing expertise in ${relevantKeywords} to stay at the forefront of industry developments.`;
    }

    // Add relevant skills
    if (optimizedContent.skills) {
      const existingSkills = new Set(optimizedContent.skills.map((s: string) => s.toLowerCase()));
      keywords.forEach(keyword => {
        if (!existingSkills.has(keyword.toLowerCase())) {
          optimizedContent.skills.push(keyword);
        }
      });
    }

    // Enhance experience descriptions
    if (optimizedContent.experience && optimizedContent.experience.length > 0) {
      optimizedContent.experience = optimizedContent.experience.map((exp: any) => {
        const relevantKeywords = keywords.filter(keyword => 
          !exp.description.toLowerCase().includes(keyword.toLowerCase())
        ).slice(0, 2); // Take up to 2 relevant keywords per experience

        if (relevantKeywords.length > 0) {
          const keywordPhrase = relevantKeywords.join(' and ');
          exp.description += ` Leveraged ${keywordPhrase} to drive project success.`;
        }

        // Add relevant keywords to responsibilities if they exist
        if (exp.keyResponsibilities && exp.keyResponsibilities.length > 0) {
          const relevantKeyword = keywords.find(keyword => 
            !exp.keyResponsibilities.some((resp: string) => 
              resp.toLowerCase().includes(keyword.toLowerCase())
            )
          );

          if (relevantKeyword) {
            exp.keyResponsibilities.push(
              `Utilized ${relevantKeyword} to enhance project outcomes and team efficiency.`
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
        keywordsAdded: keywords
      }
    };
  } catch (error) {
    console.error('Error generating optimized resume:', error);
    throw new Error('Failed to generate optimized resume');
  }
}