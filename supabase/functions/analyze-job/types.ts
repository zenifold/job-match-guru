export interface JobAnalysis {
  score: number;
  message: string;
  matched: string[];
  missing: string[];
  importance: { [key: string]: string };
}

export interface KeywordCategory {
  weight: number;
  keywords: string[];
}

export interface KeywordWithWeight {
  keyword: string;
  weight: number;
}