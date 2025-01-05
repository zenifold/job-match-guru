import { KeywordCategory, KeywordWithWeight } from './types.ts';

// Enhanced keyword categories with industry-specific terms and weights
export const KEYWORD_CATEGORIES: { [key: string]: KeywordCategory } = {
  technical_skills: {
    weight: 1.5,
    keywords: [
      "Python", "Java", "JavaScript", "SQL", "C++", "HTML", "CSS", "Git", 
      "AWS", "Docker", "Linux", "React", "Angular", "Node.js", "TypeScript",
      "AutoCAD", "CAD", "CNC Programming", "SCADA"
    ]
  },
  business_skills: {
    weight: 1.4,
    keywords: [
      "Project Management", "Business Development", "Strategic Planning",
      "Business Strategy", "Leadership", "Negotiation", "Business Intelligence",
      "Change Management", "Risk Management", "Business Analysis"
    ]
  },
  industry_knowledge: {
    weight: 1.3,
    keywords: [
      "Manufacturing", "Supply Chain", "Logistics", "Healthcare", "Finance",
      "Retail", "Construction", "Automotive", "Energy", "Telecommunications",
      "Maritime", "Aviation", "Real Estate", "Mining"
    ]
  },
  soft_skills: {
    weight: 1.2,
    keywords: [
      "Communication", "Problem Solving", "Team Leadership", "Analytical Skills",
      "Customer Service", "Time Management", "Collaboration", "Innovation",
      "Adaptability", "Critical Thinking"
    ]
  },
  certifications: {
    weight: 1.6,
    keywords: [
      "PMP", "Six Sigma", "ITIL", "CISSP", "CPA", "AWS Certified",
      "Scrum Master", "Professional Engineer", "ISO"
    ]
  }
};

function normalizeText(text: string): string {
  return text.toLowerCase().replace(/[^\w\s]/g, ' ');
}

export function extractSpecializedKeywords(title: string, description: string): KeywordWithWeight[] {
  console.log('Extracting specialized keywords from:', { title, descriptionLength: description.length });
  
  const specializedKeywords: KeywordWithWeight[] = [];
  const normalizedTitle = normalizeText(title);
  const normalizedDesc = normalizeText(description);
  
  // Create a frequency map for all words
  const wordFrequency: { [key: string]: number } = {};
  const words = [...normalizedTitle.split(/\s+/), ...normalizedDesc.split(/\s+/)]
    .filter(word => word.length > 2);
  
  words.forEach(word => {
    wordFrequency[word] = (wordFrequency[word] || 0) + 1;
  });

  // Add high-frequency words as specialized keywords
  Object.entries(wordFrequency)
    .filter(([word, freq]) => {
      const commonWords = new Set(['the', 'and', 'for', 'with', 'this', 'that', 'have', 'will']);
      return !commonWords.has(word) && freq >= 2;
    })
    .forEach(([word, freq]) => {
      const weight = 1.0 + (freq * 0.1); // Base weight plus frequency bonus
      specializedKeywords.push({
        keyword: word,
        weight: Math.min(weight, 2.0) // Cap weight at 2.0
      });
    });

  return specializedKeywords;
}

export function analyzeKeywordImportance(text: string, jobTitle: string): KeywordWithWeight[] {
  console.log(`Analyzing keywords for job: ${jobTitle}`);
  const normalizedText = normalizeText(text);
  const normalizedTitle = normalizeText(jobTitle);
  const keywordScores: { [key: string]: number } = {};

  // Process predefined keywords from categories
  Object.entries(KEYWORD_CATEGORIES).forEach(([category, { keywords, weight }]) => {
    keywords.forEach(keyword => {
      const normalizedKeyword = normalizeText(keyword);
      
      if (normalizedText.includes(normalizedKeyword)) {
        // Calculate base score from category weight
        let score = weight;
        
        // Boost score based on frequency
        const keywordRegex = new RegExp(`\\b${normalizedKeyword}\\b`, 'gi');
        const frequency = (text.match(keywordRegex) || []).length;
        score *= (1 + (frequency - 1) * 0.1); // Diminishing returns for frequency
        
        // Boost score if keyword appears in title
        if (normalizedTitle.includes(normalizedKeyword)) {
          score *= 1.5;
        }
        
        // Additional context-based boosts
        if (category === 'technical_skills' && normalizedTitle.includes('engineer')) {
          score *= 1.2;
        } else if (category === 'business_skills' && normalizedTitle.includes('manager')) {
          score *= 1.2;
        }
        
        keywordScores[keyword] = score;
        console.log(`Found keyword: ${keyword} (${category}) with score: ${score}`);
      }
    });
  });

  // Add specialized keywords
  const specializedKeywords = extractSpecializedKeywords(jobTitle, text);
  specializedKeywords.forEach(({ keyword, weight }) => {
    if (normalizedText.includes(normalizeText(keyword))) {
      keywordScores[keyword] = (keywordScores[keyword] || 0) + weight;
    }
  });

  // Sort keywords by score and return
  return Object.entries(keywordScores)
    .map(([keyword, weight]) => ({ keyword, weight }))
    .sort((a, b) => b.weight - a.weight);
}