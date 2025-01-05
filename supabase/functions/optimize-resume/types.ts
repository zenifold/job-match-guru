export type JobAnalysis = {
  analysis_text: string;
  match_score: number;
};

export type Profile = {
  content: {
    skills: string[];
    experience: Array<{
      keyResponsibilities: string[];
      position: string;
      [key: string]: any;
    }>;
    [key: string]: any;
  };
};

export type Job = {
  title: string;
  description: string;
};

export type OptimizedResume = {
  id?: string;
  content: any;
  match_score: number;
  optimization_status: string;
  version_name: string;
};