import { KeywordCategory, KeywordWithWeight } from './types.ts';

// Enhanced keyword categories with industry-specific terms and weights
export const KEYWORD_CATEGORIES: { [key: string]: KeywordCategory } = {
  technical_skills: {
    weight: 1.5, // Higher weight for technical skills
    keywords: [
      // Programming Languages
      "python", "javascript", "typescript", "java", "c++", "ruby", "php", "swift", "kotlin", "go",
      // Web Technologies
      "react", "angular", "vue.js", "node.js", "express.js", "django", "flask",
      // Cloud & Infrastructure
      "aws", "azure", "gcp", "docker", "kubernetes", "terraform", "jenkins",
      // Data & Analytics
      "sql", "nosql", "mongodb", "postgresql", "mysql", "data engineering", "etl",
      "data warehouse", "big data", "spark", "hadoop", "airflow", "kafka",
      "elasticsearch", "tableau", "power bi", "data visualization",
      // AI & ML
      "machine learning", "artificial intelligence", "deep learning", "nlp",
      "computer vision", "tensorflow", "pytorch", "scikit-learn",
      // DevOps & Tools
      "git", "ci/cd", "devops", "agile", "jira", "confluence", "bitbucket",
      // Architecture
      "microservices", "rest api", "graphql", "system design", "distributed systems"
    ]
  },
  product_management: {
    weight: 1.4,
    keywords: [
      "product strategy", "product roadmap", "product development", "product lifecycle",
      "market analysis", "competitive analysis", "user research", "user stories",
      "product metrics", "okrs", "kpis", "ab testing", "feature prioritization",
      "stakeholder management", "product vision", "go to market", "product launch",
      "customer journey", "user experience", "product analytics", "product marketing",
      "agile methodologies", "scrum", "kanban", "sprint planning", "backlog grooming",
      "requirements gathering", "product specifications", "mvp", "product innovation"
    ]
  },
  business_skills: {
    weight: 1.3,
    keywords: [
      "business strategy", "strategic planning", "business development",
      "revenue growth", "market expansion", "partnership development",
      "business analytics", "financial analysis", "budget management",
      "risk management", "operations management", "process improvement",
      "change management", "digital transformation", "customer success",
      "sales strategy", "marketing strategy", "growth hacking",
      "business intelligence", "data driven decision making"
    ]
  },
  soft_skills: {
    weight: 1.2,
    keywords: [
      "leadership", "communication", "problem solving", "critical thinking",
      "teamwork", "collaboration", "project management", "time management",
      "analytical skills", "strategic thinking", "innovation", "creativity",
      "attention to detail", "presentation skills", "negotiation",
      "mentoring", "team building", "adaptability", "emotional intelligence",
      "conflict resolution", "decision making", "interpersonal skills"
    ]
  },
  industry_knowledge: {
    weight: 1.3,
    keywords: [
      "saas", "fintech", "healthtech", "e commerce", "cybersecurity",
      "blockchain", "cryptocurrency", "iot", "augmented reality", "virtual reality",
      "mobile development", "web development", "cloud computing",
      "data privacy", "gdpr", "compliance", "information security",
      "digital marketing", "social media", "content strategy"
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