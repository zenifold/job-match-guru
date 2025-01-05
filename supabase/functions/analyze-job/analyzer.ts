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

You MUST provide the analysis in EXACTLY this format:

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

Suggested Improvements:
- [Improvement suggestion] (Priority Level)
[List each suggestion with - prefix and priority level in parentheses]

Priority levels MUST be one of: Critical, High, Medium, or Standard.
Each section MUST be present and formatted exactly as shown above.
Use clear section headers and consistent formatting throughout.`;
}

export function parseAIResponse(aiData: any): string {
  console.log('Parsing AI response:', aiData);
  
  if (aiData.choices?.[0]?.message?.content) {
    return aiData.choices[0].message.content;
  } 
  if (aiData.choices?.[0]?.content) {
    return aiData.choices[0].content;
  } 
  if (typeof aiData.choices?.[0] === 'string') {
    return aiData.choices[0];
  }
  
  console.error('Unexpected AI response format:', aiData);
  throw new Error('Invalid AI response format');
}

export function extractMatchScore(analysisText: string): number {
  const matchScoreMatch = analysisText.match(/Overall Match: (\d+)%/);
  if (!matchScoreMatch) {
    console.error('Failed to extract match score from:', analysisText);
    throw new Error('Invalid analysis format - missing match score');
  }
  return parseInt(matchScoreMatch[1]);
}

export function extractCompany(analysisText: string): string | null {
  const companySection = analysisText.split('\n').find(line => line.startsWith('Company:'));
  if (!companySection) {
    console.error('Failed to extract company from:', analysisText);
    throw new Error('Invalid analysis format - missing company section');
  }
  
  const company = companySection.replace('Company:', '').trim();
  return company === 'Not specified' ? null : company;
}