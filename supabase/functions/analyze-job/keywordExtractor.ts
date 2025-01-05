import { KeywordCategory, KeywordWithWeight } from './types.ts';

// Enhanced keyword categories with industry-specific terms and weights
export const KEYWORD_CATEGORIES: { [key: string]: KeywordCategory } = {
  web_development: {
    weight: 1.5,
    keywords: [
      "chief technology officer", "cto", "r&d", "architect", "database administrator",
      "information technology", "it manager", "it specialist", "it administrator",
      "software engineer", "programmer", "developer", "coder", "backend", "frontend",
      "web developer", "web engineer", "seo", "python", "django", "ruby", "rails",
      "php", "javascript", "react", "reactjs", "angular", "angularjs", "js", "java",
      "html", "css", "c#", "c++", "sql", "mysql", "quality assurance", "qa"
    ]
  },
  mobile_development: {
    weight: 1.5,
    keywords: [
      "mobile engineer", "objective c", "swift", "ios", "android", "cordova",
      "phonegap", "react native", "ionic", "xcode"
    ]
  },
  data_science: {
    weight: 1.6, // Higher weight for data science skills
    keywords: [
      "data science", "data scientist", "machine learning", "deep learning",
      "analytics", "analyst", "statistics", "spark", "hadoop", "tensorflow",
      "keras", "scikit", "azure ml", "ml studio", "nlp", "natural language processing",
      "etl", "data engineering", "data warehouse", "big data"
    ]
  },
  design: {
    weight: 1.4,
    keywords: [
      "ui", "ux", "user interface", "user experience", "prototyping", "prototype",
      "photoshop", "sketch", "indesign", "adobe", "figma", "wireframe", "design system"
    ]
  },
  product_management: {
    weight: 1.5,
    keywords: [
      "product management", "project management", "product manager", "project manager",
      "team lead", "scrum", "kanban", "pm", "pmm", "jira", "confluence", "agile",
      "sprint planning", "backlog", "roadmap", "stakeholder management"
    ]
  },
  business_skills: {
    weight: 1.4,
    keywords: [
      "business analytics", "market research", "business strategy", "operations",
      "lead generation", "sales", "marketing", "branding", "communications",
      "strategic planning", "go-to-market", "gtm", "competitive analysis"
    ]
  },
  analytics_tools: {
    weight: 1.4,
    keywords: [
      "tableau", "power bi", "looker", "qlikview", "quicksight", "google analytics",
      "mixpanel", "amplitude", "hotjar", "segment", "google ads", "search ads 360"
    ]
  },
  cloud_infrastructure: {
    weight: 1.5,
    keywords: [
      "aws", "amazon web services", "google cloud", "gcp", "azure", "kubernetes",
      "docker", "terraform", "ci/cd", "devops", "infrastructure", "cloud architecture"
    ]
  },
  enterprise_software: {
    weight: 1.3,
    keywords: [
      "salesforce", "servicenow", "sap", "netsuite", "workday", "hris", "hubspot",
      "zapier", "atlassian", "wordpress", "webflow", "adobe", "erp", "crm"
    ]
  }
};

export function extractSpecializedKeywords(title: string, description: string): KeywordWithWeight[] {
  console.log('Extracting specialized keywords from title:', title);
  
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

  console.log('Word frequency map:', wordFrequency);

  // Add high-frequency words as specialized keywords
  Object.entries(wordFrequency)
    .filter(([word, freq]) => {
      const commonWords = ['the', 'and', 'for', 'with', 'this', 'that', 'have', 'will', 'our', 'who'];
      return !commonWords.includes(word) && freq >= 2;
    })
    .forEach(([word, freq]) => {
      const weight = 1.0 + (freq * 0.2); // Base weight plus frequency bonus
      specializedKeywords.push({
        keyword: word,
        weight: Math.min(weight, 2.0) // Cap weight at 2.0
      });
      console.log(`Added specialized keyword: ${word} with weight ${weight} (frequency: ${freq})`);
    });

  return specializedKeywords;
}

function findMultiWordMatches(text: string, keywords: string[]): string[] {
  const matches: string[] = [];
  const textLower = text.toLowerCase();
  
  keywords.forEach(keyword => {
    // Handle both single words and arrays of words that form a phrase
    if (Array.isArray(keyword)) {
      const phrase = keyword.join(' ').toLowerCase();
      if (textLower.includes(phrase)) {
        matches.push(phrase);
      }
    } else if (typeof keyword === 'string' && textLower.includes(keyword.toLowerCase())) {
      matches.push(keyword);
    }
  });
  
  return matches;
}

export function analyzeKeywordImportance(text: string, jobTitle: string): KeywordWithWeight[] {
  console.log(`Analyzing keywords for job: ${jobTitle}`);
  const textLower = text.toLowerCase();
  const titleLower = jobTitle.toLowerCase();
  const keywordScores: { [key: string]: number } = {};

  // Process predefined keywords from categories
  Object.entries(KEYWORD_CATEGORIES).forEach(([category, { keywords, weight }]) => {
    const matches = findMultiWordMatches(text, keywords);
    matches.forEach(keyword => {
      const keywordLower = keyword.toLowerCase();
      
      // Calculate base score from category weight
      let score = weight;
      
      // Boost score based on frequency
      const regex = new RegExp(keywordLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      const frequency = (text.match(regex) || []).length;
      score *= (1 + (frequency - 1) * 0.2); // Diminishing returns for frequency
      
      // Boost score if keyword appears in title
      if (titleLower.includes(keywordLower)) {
        score *= 1.5;
      }
      
      // Additional context-based boosts
      if (category === 'data_science' && titleLower.includes('data')) {
        score *= 1.2;
      } else if (category === 'product_management' && titleLower.includes('product')) {
        score *= 1.2;
      }
      
      keywordScores[keyword] = score;
      console.log(`Found keyword: ${keyword} (${category}) with score: ${score} (frequency: ${frequency})`);
    });
  });

  // Add specialized keywords
  const specializedKeywords = extractSpecializedKeywords(jobTitle, text);
  specializedKeywords.forEach(({ keyword, weight }) => {
    if (textLower.includes(keyword.toLowerCase())) {
      keywordScores[keyword] = (keywordScores[keyword] || 0) + weight;
      console.log(`Found specialized keyword: ${keyword} with weight: ${weight}`);
    }
  });

  // Sort keywords by score and return
  return Object.entries(keywordScores)
    .map(([keyword, weight]) => ({ keyword, weight }))
    .sort((a, b) => b.weight - a.weight);
}