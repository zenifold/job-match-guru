import { KeywordCategory, KeywordWithWeight } from './types.ts';

// Common words to exclude from analysis
const COMMON_WORDS = new Set([
  // Articles and prepositions
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
  // Common verbs
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
  // Common adjectives
  'good', 'better', 'best', 'bad', 'worse', 'worst', 'high', 'low', 'many', 'much',
  // Common job posting words
  'need', 'needed', 'needs', 'required', 'must', 'should', 'will', 'can', 'able', 'position',
  'job', 'role', 'opportunity', 'candidate', 'applicant', 'experience', 'work', 'working',
  'team', 'company', 'organization', 'responsibilities', 'qualifications', 'requirements',
  // Time-related
  'year', 'years', 'month', 'months', 'day', 'days', 'time', 'daily', 'weekly', 'monthly',
  // Common quantities
  'one', 'two', 'three', 'first', 'second', 'third', 'multiple', 'several', 'various',
]);

// Enhanced keyword categories with industry-specific terms and weights
export const KEYWORD_CATEGORIES: { [key: string]: KeywordCategory } = {
  technical_skills: {
    weight: 1.5,
    keywords: [
      "Python", "Java", "JavaScript", "SQL", "C++", "HTML", "CSS", "Git", 
      "AWS", "Docker", "Linux", "React", "Angular", "Node.js", "TypeScript",
      "AutoCAD", "CAD", "CNC Programming", "SCADA", "API", "Cloud", "DevOps",
      "Kubernetes", "Microservices", "REST", "GraphQL", "CI/CD", "Jenkins",
      "Machine Learning", "AI", "Data Science", "Big Data", "Hadoop", "Spark",
      "TensorFlow", "PyTorch", "Computer Vision", "NLP", "Blockchain",
      "iOS", "Android", "Mobile Development", "Flutter", "React Native"
    ]
  },
  business_skills: {
    weight: 1.4,
    keywords: [
      "Project Management", "Business Development", "Strategic Planning",
      "Business Strategy", "Leadership", "Negotiation", "Business Intelligence",
      "Change Management", "Risk Management", "Business Analysis", "Agile",
      "Scrum", "Product Management", "Process Improvement", "Six Sigma",
      "Stakeholder Management", "Budget Management", "Resource Planning",
      "Market Analysis", "Competitive Analysis", "ROI Analysis", "KPI",
      "Digital Transformation", "Innovation Management", "Portfolio Management"
    ]
  },
  soft_skills: {
    weight: 1.2,
    keywords: [
      "Communication", "Problem Solving", "Team Leadership", "Analytical Skills",
      "Customer Service", "Time Management", "Collaboration", "Innovation",
      "Adaptability", "Critical Thinking", "Interpersonal Skills", "Mentoring",
      "Decision Making", "Conflict Resolution", "Emotional Intelligence",
      "Cross-functional", "Self-motivated", "Detail-oriented", "Results-driven",
      "Strategic Thinking", "Presentation Skills", "Written Communication"
    ]
  }
};

function normalizeText(text: string): string {
  return text.toLowerCase()
    .replace(/[^\w\s-]/g, ' ')  // Replace non-word chars (except hyphen) with space
    .replace(/\s+/g, ' ')       // Replace multiple spaces with single space
    .trim();
}

function findKeywordMatches(normalizedText: string, keyword: string): number {
  const normalizedKeyword = normalizeText(keyword);
  const keywordWords = normalizedKeyword.split(' ');
  
  // For single-word keywords, use word boundary check
  if (keywordWords.length === 1) {
    const regex = new RegExp(`\\b${normalizedKeyword}\\b`, 'gi');
    const matches = normalizedText.match(regex);
    return matches ? matches.length : 0;
  }
  
  // For multi-word keywords, check for exact phrase
  const regex = new RegExp(normalizedKeyword, 'gi');
  const matches = normalizedText.match(regex);
  return matches ? matches.length : 0;
}

export function analyzeKeywordImportance(text: string, jobTitle: string): KeywordWithWeight[] {
  console.log(`Analyzing keywords for job: ${jobTitle}`);
  const normalizedText = normalizeText(text);
  const normalizedTitle = normalizeText(jobTitle);
  const keywordScores: { [key: string]: number } = {};

  // Process predefined keywords from categories
  Object.entries(KEYWORD_CATEGORIES).forEach(([category, { keywords, weight }]) => {
    keywords.forEach(keyword => {
      const matches = findKeywordMatches(normalizedText, keyword);
      
      if (matches > 0) {
        // Calculate base score from category weight
        let score = weight;
        
        // Boost score based on frequency with diminishing returns
        score *= (1 + Math.log(matches + 1));
        
        // Boost score if keyword appears in title
        if (findKeywordMatches(normalizedTitle, keyword) > 0) {
          score *= 1.5;
        }
        
        // Additional context-based boosts
        if (category === 'technical_skills' && normalizedTitle.includes('engineer')) {
          score *= 1.2;
        } else if (category === 'business_skills' && 
                  (normalizedTitle.includes('manager') || normalizedTitle.includes('lead'))) {
          score *= 1.2;
        }
        
        keywordScores[keyword] = score;
        console.log(`Found keyword: ${keyword} (${category}) with score: ${score} (${matches} matches)`);
      }
    });
  });

  // Extract specialized keywords from the job description
  const words = normalizedText.split(/\s+/);
  const wordFrequency: { [key: string]: number } = {};
  
  // Only count words that aren't in the common words list
  words.forEach(word => {
    if (word.length > 3 && !COMMON_WORDS.has(word)) {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    }
  });

  // Add high-frequency specialized keywords that aren't common words
  Object.entries(wordFrequency)
    .filter(([word, freq]) => freq >= 2)
    .forEach(([word, freq]) => {
      // Check if the word isn't already part of our predefined keywords
      if (!Object.values(KEYWORD_CATEGORIES).some(cat => 
        cat.keywords.some(k => normalizeText(k).includes(word))
      )) {
        const weight = 1.0 + (Math.log(freq) * 0.1);
        keywordScores[word] = Math.min(weight, 2.0);
      }
    });

  // Sort keywords by score and return
  return Object.entries(keywordScores)
    .map(([keyword, weight]) => ({ keyword, weight }))
    .sort((a, b) => b.weight - a.weight);
}