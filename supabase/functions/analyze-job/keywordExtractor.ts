import { KeywordCategory, KeywordWithWeight } from './types.ts';

// Enhanced keyword categories with industry-specific terms and weights
export const KEYWORD_CATEGORIES: { [key: string]: KeywordCategory } = {
  technical_skills: {
    weight: 1.5, // Higher weight for technical skills
    keywords: [
      // Programming Languages & Frameworks
      "javascript", "typescript", "python", "java", "c#", "ruby", "rust", "php",
      "jquery", ".net", "vue.js", "ruby on rails", "flutter", "d3.js",
      
      // Web Technologies
      "html/css", "web development", "rest apis", "firebase", "vercel",
      
      // Cloud & Infrastructure
      "aws", "google cloud platform", "terraform", "firebase", "blockchain",
      "development operations", "devops",
      
      // Data & Analytics
      "sql", "mysql", "mongodb", "bigquery", "snowflake", "rdbms",
      "data structures", "algorithms", "data science", "data analysis",
      "natural language processing", "nlp", "tensorflow",
      
      // Tools & Platforms
      "github", "gitlab", "bitbucket", "datadog", "netlify", "docker",
      "kubernetes", "jenkins", "circleci", "nginx", "redis"
    ]
  },
  analytics_tools: {
    weight: 1.4,
    keywords: [
      "tableau", "power bi", "looker", "qlikview", "amazon quicksight",
      "google analytics", "mixpanel", "amplitude", "hotjar", "segment",
      "google adwords", "search ads 360", "google analytics"
    ]
  },
  product_management: {
    weight: 1.4,
    keywords: [
      "product management", "product design", "agile", "scrum", "jira",
      "confluence", "asana", "product strategy", "roadmap", "backlog",
      "user stories", "sprint planning", "product metrics", "okrs",
      "stakeholder management", "product vision", "go to market",
      "usability testing", "user research", "wireframe", "figma",
      "information architecture", "ui/ux design", "interaction design"
    ]
  },
  business_skills: {
    weight: 1.3,
    keywords: [
      "business strategy", "business analytics", "market research",
      "lead generation", "operations research", "financial analysis",
      "mergers & acquisitions", "m&a", "supply chain management",
      "inventory management", "sales", "branding", "brand strategy",
      "marketing", "seo", "social media", "communications"
    ]
  },
  enterprise_software: {
    weight: 1.3,
    keywords: [
      "salesforce", "servicenow", "sap", "netsuite", "workday",
      "hris", "hubspot", "zapier", "hootsuite", "atlassian",
      "wordpress", "webflow", "canva", "adobe after effects"
    ]
  },
  soft_skills: {
    weight: 1.2,
    keywords: [
      "leadership", "management", "communication", "problem solving",
      "critical thinking", "teamwork", "collaboration", "project management",
      "time management", "analytical skills", "strategic thinking",
      "innovation", "creativity", "presentation skills", "negotiation"
    ]
  },
  quality_assurance: {
    weight: 1.3,
    keywords: [
      "quality assurance", "qa", "software testing", "test automation",
      "selenium", "cypress", "jest", "unit testing", "integration testing",
      "performance testing", "load testing", "stress testing", "regression testing"
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
      // Ignore common words and short words
      const commonWords = ['the', 'and', 'for', 'with', 'this', 'that', 'have', 'will', 'our', 'who'];
      return !commonWords.includes(word) && freq >= 2;
    })
    .forEach(([word, freq]) => {
      const weight = 1.0 + (freq * 0.2); // Base weight plus frequency bonus
      specializedKeywords.push({
        keyword: word,
        weight: weight
      });
      console.log(`Added specialized keyword: ${word} with weight ${weight} (frequency: ${freq})`);
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
        // Calculate frequency-based score
        const regex = new RegExp(keywordLower, 'g');
        const frequency = (words.match(regex) || []).length;
        const score = frequency * weight * (
          // Boost score if keyword appears in title
          jobTitle.toLowerCase().includes(keywordLower) ? 1.5 : 1.0
        );
        keywordScores[keyword] = score;
        console.log(`Found keyword: ${keyword} (${category}) with score: ${score} (frequency: ${frequency})`);
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

  // Sort keywords by score and return
  return Object.entries(keywordScores)
    .map(([keyword, weight]) => ({ keyword, weight }))
    .sort((a, b) => b.weight - a.weight);
}