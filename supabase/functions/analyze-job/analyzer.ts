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

Provide a detailed analysis in the following format:

"Company:" (if found in the description)
- List the company name, or "Not specified" if not found

"Match Score Analysis:"
- Calculate and show "Overall Match: X%" based on skills and experience match

Then list sections in this order:

"Strong Matches:"
- List each matching skill/experience with ✓ prefix
- Include priority level in parentheses (Critical, High, Medium, Standard)
- Group by type: Technical Skills, Industry Experience, Soft Skills

"Target Keywords:"
- List specific technical skills and software from the job description
- Include priority level in parentheses
- Focus on concrete, actionable skills

"Required Experience:"
- List specific industry experience or expertise needed
- Include years of experience if mentioned
- Include priority level in parentheses

"Suggested Improvements:"
- List missing skills or areas for improvement with bullet points
- Include priority level in parentheses
- Focus on actionable items

Keep the format consistent and structured for parsing. Use priority levels (Critical, High, Medium, Standard) for all items.
Prioritize technical skills and specific experience requirements over generic terms.`;
}

export function parseAIResponse(aiData: any): string {
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
  return matchScoreMatch ? parseInt(matchScoreMatch[1]) : 0;
}

export function extractCompany(analysisText: string): string | null {
  const companySection = analysisText.split('\n').find(line => line.startsWith('Company:'));
  if (!companySection) return null;
  
  const company = companySection.replace('Company:', '').trim();
  return company === 'Not specified' ? null : company;
}