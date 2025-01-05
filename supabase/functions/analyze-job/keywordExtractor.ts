import { KeywordCategory, KeywordWithWeight } from './types.ts';

// Enhanced keyword categories with industry-specific terms
export const KEYWORD_CATEGORIES: { [key: string]: KeywordCategory } = {
  technical: {
    weight: 1.2,
    keywords: [
      "python", "javascript", "typescript", "react", "node.js", "aws", "docker",
      "kubernetes", "ci/cd", "git", "sql", "nosql", "rest api", "graphql",
      "machine learning", "ai", "cloud computing", "microservices", "devops",
      "java", "c++", "ruby", "php", "swift", "kotlin", "mobile development",
      "web development", "database", "api", "frontend", "backend", "full stack",
      "data engineering", "etl", "data warehouse", "big data", "spark", "hadoop",
      "airflow", "kafka", "elasticsearch", "tableau", "power bi", "jira"
    ]
  },
  soft_skills: {
    weight: 0.8,
    keywords: [
      "leadership", "communication", "problem-solving", "teamwork", "collaboration",
      "project management", "agile", "scrum", "time management", "analytical",
      "strategic thinking", "innovation", "creativity", "attention to detail",
      "presentation", "negotiation", "mentoring", "team building", "adaptability",
      "stakeholder management", "cross-functional"
    ]
  },
  business: {
    weight: 1.0,
    keywords: [
      "strategy", "analytics", "optimization", "stakeholder management",
      "budget management", "risk management", "product management",
      "business development", "client relations", "market analysis",
      "digital transformation", "process improvement", "data analysis",
      "customer experience", "operations management", "strategic planning",
      "partnerships", "channel management", "revenue growth", "go-to-market",
      "requirements gathering", "business intelligence", "data governance"
    ]
  }
};

export function extractSpecializedKeywords(title: string, description: string): KeywordWithWeight[] {
  const specializedKeywords: KeywordWithWeight[] = [];
  const titleWords = title.toLowerCase()
    .split(/[-–—,|&\s]/)
    .map(word => word.trim())
    .filter(word => word.length > 2);

  const descriptionWords = description.toLowerCase()
    .split(/[\s,.\n]/)
    .map(word => word.trim())
    .filter(word => word.length > 2);

  // Create a frequency map for all words
  const wordFrequency: { [key: string]: number } = {};
  [...titleWords, ...descriptionWords].forEach(word => {
    wordFrequency[word] = (wordFrequency[word] || 0) + 1;
  });

  // Add high-frequency words as specialized keywords
  Object.entries(wordFrequency)
    .filter(([word, freq]) => {
      // Ignore common words and short words
      const commonWords = ['the', 'and', 'for', 'with', 'this', 'that', 'have', 'will'];
      return !commonWords.includes(word) && freq >= 2;
    })
    .forEach(([word, freq]) => {
      specializedKeywords.push({
        keyword: word,
        weight: 1.0 + (freq * 0.2) // Weight increases with frequency
      });
    });

  return specializedKeywords;
}

export function analyzeKeywordImportance(text: string, jobTitle: string): KeywordWithWeight[] {
  console.log(`Analyzing keywords for job: ${jobTitle}`);
  const words = text.toLowerCase();
  const keywordScores: { [key: string]: number } = {};

  // Process predefined keywords from categories
  Object.entries(KEYWORD_CATEGORIES).forEach(([category, { keywords, weight }]) => {
    keywords.forEach(keyword => {
      const keywordLower = keyword.toLowerCase();
      if (words.includes(keywordLower)) {
        const frequency = (words.match(new RegExp(keywordLower, 'g')) || []).length;
        const score = frequency * weight;
        keywordScores[keyword] = score;
        console.log(`Found keyword: ${keyword} (${category}) with score: ${score}`);
      }
    });
  });

  // Add specialized keywords
  const specializedKeywords = extractSpecializedKeywords(jobTitle, text);
  specializedKeywords.forEach(({ keyword, weight }) => {
    if (words.includes(keyword)) {
      keywordScores[keyword] = (keywordScores[keyword] || 0) + weight;
      console.log(`Found specialized keyword: ${keyword} with weight: ${weight}`);
    }
  });

  return Object.entries(keywordScores)
    .map(([keyword, weight]) => ({ keyword, weight }))
    .sort((a, b) => b.weight - a.weight);
}