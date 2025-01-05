export interface BaseResume {
  id: string;
  created_at: string;
  user_id: string;
}

export interface RegularResume extends BaseResume {
  type: 'regular';
  name: string;
  content: any;
  career_focus: string | null;
  is_master: boolean;
}

export interface OptimizedResume extends BaseResume {
  type: 'optimized';
  version_name: string;
  content: any;
  job_id: string;
  original_resume_id: string;
  match_score: number;
  optimization_status: string;
  jobTitle: string;
  jobs: {
    title: string;
  };
}

export type CombinedResume = RegularResume | OptimizedResume;