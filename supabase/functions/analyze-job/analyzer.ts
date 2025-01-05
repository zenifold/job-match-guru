export function createSystemPrompt(jobTitle: string, jobDescription: string, resumeText: string) {
  return `You are an AI assistant analyzing job requirements and resume match. Follow this format EXACTLY:

Company: [Company Name or "Not specified"]

Match Score Analysis:
Overall Match: [X]%

Strong Matches:
✓ [Matching skill/experience] (Priority Level)
[Continue listing matches]

Target Keywords:
- [Required skill/keyword] (Priority Level)
[Continue listing keywords]

Required Experience:
- [Required experience] (Priority Level)
[Continue listing experience]

Analyze this job:
Title: ${jobTitle}
Description: ${jobDescription}

Against this resume:
${resumeText}

Priority levels MUST be one of: Critical, High, Medium, or Standard.
Each section MUST start with the exact headers shown above.
Use ✓ for matches and - for other items.
Keep responses clear and concise.`;
}

export function parseAIResponse(aiData: any): string {
  console.log('Parsing AI response:', JSON.stringify(aiData, null, 2));
  
  let content = '';
  
  if (aiData.choices?.[0]?.message?.content) {
    content = aiData.choices[0].message.content;
  } else if (aiData.choices?.[0]?.content) {
    content = aiData.choices[0].content;
  } else if (typeof aiData.choices?.[0] === 'string') {
    content = aiData.choices[0];
  } else {
    console.error('Unexpected AI response format:', aiData);
    throw new Error('Invalid AI response format');
  }

  // Validate required sections
  const requiredSections = [
    'Company:',
    'Match Score Analysis:',
    'Overall Match:',
    'Strong Matches:',
    'Target Keywords:',
    'Required Experience:'
  ];

  const missingSection = requiredSections.find(section => !content.includes(section));
  if (missingSection) {
    console.error('Missing required section:', missingSection);
    console.error('Content received:', content);
    throw new Error(`Missing required section "${missingSection}"`);
  }

  return content;
}

export function extractMatchScore(analysisText: string): number {
  const matchScoreMatch = analysisText.match(/Overall Match:\s*(\d+)%/);
  if (!matchScoreMatch) {
    console.error('Failed to extract match score from:', analysisText);
    throw new Error('Missing match score');
  }
  return parseInt(matchScoreMatch[1]);
}

export function extractCompany(analysisText: string): string | null {
  const companySection = analysisText.split('\n').find(line => line.trim().startsWith('Company:'));
  if (!companySection) {
    console.error('Failed to extract company from:', analysisText);
    throw new Error('Missing company section');
  }
  
  const company = companySection.replace('Company:', '').trim();
  return company === 'Not specified' ? null : company;
}