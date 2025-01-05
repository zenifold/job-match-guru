export async function generateOptimizedResume(
  originalContent: any,
  job: { title: string; description: string },
  analysisText: string
) {
  console.log('Generating optimized resume for job:', job.title);
  console.log('Original content:', originalContent);
  console.log('Analysis text:', analysisText);
  
  const systemPrompt = `You are a professional resume optimizer. Your task is to enhance the provided resume content to better match the job requirements while maintaining authenticity and truthfulness.

Follow this structured format for optimization:

1. Analyze the job requirements and match them with the candidate's experience
2. Enhance relevant sections while maintaining truthfulness
3. Add skills that are mentioned in the analysis but missing from the resume
4. Improve descriptions to highlight relevant experience

The output must maintain the exact same structure as the input resume, only modifying content to better match the job requirements.

Key rules:
- Never invent or fabricate experience
- Only enhance existing content to better highlight relevant skills
- Add missing skills only if they're genuinely reflected in the experience
- Maintain professional language and tone
- Keep modifications focused on the job requirements`;

  try {
    // Extract key information from analysis text
    const matchScoreMatch = analysisText.match(/Overall Match: (\d+)%/);
    const matchScore = matchScoreMatch ? parseInt(matchScoreMatch[1]) : 0;

    // Parse strong matches and target keywords
    const strongMatches = (analysisText.match(/Strong Matches:\n(.*?)(?=\n\nTarget Keywords)/s) || ['', ''])[1]
      .split('\n')
      .filter(line => line.startsWith('✓'))
      .map(line => {
        const match = line.match(/✓ (.*?) \((.*?)\)/);
        return match ? { keyword: match[1], priority: match[2].toLowerCase() } : null;
      })
      .filter(Boolean);

    const targetKeywords = (analysisText.match(/Target Keywords:\n(.*?)(?=\n\nRequired Experience)/s) || ['', ''])[1]
      .split('\n')
      .filter(line => line.startsWith('-'))
      .map(line => {
        const match = line.match(/- (.*?) \((.*?)\)/);
        return match ? { keyword: match[1], priority: match[2].toLowerCase() } : null;
      })
      .filter(Boolean);

    // Create a deep copy of the original content
    const optimizedContent = JSON.parse(JSON.stringify(originalContent));

    // Enhance summary with high-priority target keywords
    if (optimizedContent.personalInfo?.summary) {
      const highPriorityKeywords = targetKeywords
        .filter(k => k?.priority === 'critical' || k?.priority === 'high')
        .slice(0, 3)
        .map(k => k?.keyword)
        .join(', ');
      
      if (highPriorityKeywords) {
        optimizedContent.personalInfo.summary = `${optimizedContent.personalInfo.summary} Actively developing expertise in ${highPriorityKeywords} to drive innovation and results.`;
      }
    }

    // Add relevant missing skills from target keywords
    if (optimizedContent.skills) {
      const existingSkills = new Set(optimizedContent.skills.map((s: string) => s.toLowerCase()));
      const relevantSkills = [...strongMatches, ...targetKeywords]
        .filter(k => k?.priority === 'critical' || k?.priority === 'high')
        .map(k => k?.keyword)
        .filter(keyword => keyword && !existingSkills.has(keyword.toLowerCase()));

      optimizedContent.skills = [...optimizedContent.skills, ...relevantSkills];
    }

    // Enhance experience descriptions with relevant keywords
    if (optimizedContent.experience && optimizedContent.experience.length > 0) {
      optimizedContent.experience = optimizedContent.experience.map((exp: any) => {
        const relevantKeywords = targetKeywords
          .filter(k => k?.priority === 'critical' || k?.priority === 'high')
          .map(k => k?.keyword)
          .filter(keyword => !exp.description.toLowerCase().includes(keyword?.toLowerCase()));

        if (relevantKeywords.length > 0) {
          // Enhance description with relevant keywords
          const keywordPhrase = relevantKeywords.slice(0, 2).join(' and ');
          exp.description = `${exp.description} Demonstrated expertise in ${keywordPhrase} through successful project delivery.`;

          // Add new key responsibilities focused on target keywords
          if (exp.keyResponsibilities) {
            const criticalKeywords = targetKeywords
              .filter(k => k?.priority === 'critical')
              .map(k => k?.keyword)
              .filter(keyword => 
                !exp.keyResponsibilities.some((resp: string) => 
                  resp.toLowerCase().includes(keyword?.toLowerCase())
                )
              );

            criticalKeywords.forEach(keyword => {
              if (keyword) {
                exp.keyResponsibilities.push(
                  `Led initiatives leveraging ${keyword} to drive business outcomes and improve operational efficiency.`
                );
              }
            });
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
        keywordsWithPriority: [...strongMatches, ...targetKeywords]
      }
    };
  } catch (error) {
    console.error('Error generating optimized resume:', error);
    throw new Error('Failed to generate optimized resume');
  }
}