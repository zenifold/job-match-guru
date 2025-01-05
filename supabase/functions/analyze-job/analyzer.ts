export function createSystemPrompt(jobTitle: string, jobDescription: string, resumeText: string) {
  return `You are an AI assistant analyzing job requirements and resume match.
    
Job Title: ${jobTitle}
Job Description: ${jobDescription}

Resume Content: ${resumeText}

First, extract the company name from the job description if present.
Then analyze the match between the job requirements and resume, focusing on:
1. Required technical skills and tools
2. Industry experience and expertise
3. Soft skills and qualifications
4. Years of experience if specified

You MUST provide the analysis in EXACTLY this format with no deviations:

Company: [Company Name or "Not specified"]

Match Score Analysis:
Overall Match: [X]%

Strong Matches:
✓ [Matching skill/experience] (Priority Level)
[List each match with ✓ prefix and priority level in parentheses]

Target Keywords:
- [Required skill/keyword] (Priority Level)
[List each keyword with - prefix and priority level in parentheses]

Required Experience:
- [Required experience] (Priority Level)
[List each experience with - prefix and priority level in parentheses]

Priority levels MUST be one of: Critical, High, Medium, or Standard.
Each section MUST be present and formatted exactly as shown above.
Use clear section headers and consistent formatting throughout.`;
}

export function parseAIResponse(aiData: any): string {
  console.log('Parsing AI response:', JSON.stringify(aiData, null, 2));
  
  let content = '';
  
  // Handle different response formats
  if (aiData.choices?.[0]?.message?.content) {
    content = aiData.choices[0].message.content;
  } else if (aiData.choices?.[0]?.content) {
    content = aiData.choices[0].content;
  } else if (typeof aiData.choices?.[0] === 'string') {
    content = aiData.choices[0];
  } else {
    console.error('Unexpected AI response format:', aiData);
    throw new Error('Failed to parse AI response: Invalid AI response format');
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
    throw new Error(`Failed to parse AI response: Missing required section "${missingSection}"`);
  }

  return content;
}

export function extractMatchScore(analysisText: string): number {
  const matchScoreMatch = analysisText.match(/Overall Match:\s*(\d+)%/);
  if (!matchScoreMatch) {
    console.error('Failed to extract match score from:', analysisText);
    throw new Error('Failed to parse AI response: Missing match score');
  }
  return parseInt(matchScoreMatch[1]);
}

export function extractCompany(analysisText: string): string | null {
  const companySection = analysisText.split('\n').find(line => line.trim().startsWith('Company:'));
  if (!companySection) {
    console.error('Failed to extract company from:', analysisText);
    throw new Error('Failed to parse AI response: Missing company section');
  }
  
  const company = companySection.replace('Company:', '').trim();
  return company === 'Not specified' ? null : company;
}