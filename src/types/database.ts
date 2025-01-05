export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          content: Json;
          created_at: string;
          career_focus: string | null;
          is_master: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          content: Json;
          created_at?: string;
          career_focus?: string | null;
          is_master?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          content?: Json;
          created_at?: string;
          career_focus?: string | null;
          is_master?: boolean;
        };
      };
      job_analyses: {
        Row: {
          analysis_text: string;
          created_at: string;
          id: string;
          job_id: string | null;
          match_score: number | null;
          user_id: string | null;
        }
        Insert: {
          analysis_text: string;
          created_at?: string;
          id?: string;
          job_id?: string | null;
          match_score?: number | null;
          user_id?: string | null;
        }
        Update: {
          analysis_text?: string;
          created_at?: string;
          id?: string;
          job_id?: string | null;
          match_score?: number | null;
          user_id?: string | null;
        }
        Relationships: [
          {
            foreignKeyName: "job_analyses_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          company: string | null;
          date_added: string;
          description: string;
          id: string;
          status: string | null;
          title: string;
          user_id: string | null;
        }
        Insert: {
          company?: string | null;
          date_added?: string;
          description: string;
          id?: string;
          status?: string | null;
          title: string;
          user_id?: string | null;
        }
        Update: {
          company?: string | null;
          date_added?: string;
          description?: string;
          id?: string;
          status?: string | null;
          title?: string;
          user_id?: string | null;
        }
        Relationships: []
      }
      optimized_resumes: {
        Row: {
          content: Json;
          created_at: string;
          id: string;
          job_id: string | null;
          match_score: number | null;
          optimization_status: string | null;
          original_resume_id: string | null;
          user_id: string | null;
          version_name: string;
        }
        Insert: {
          content: Json;
          created_at?: string;
          id?: string;
          job_id?: string | null;
          match_score?: number | null;
          optimization_status?: string | null;
          original_resume_id?: string | null;
          user_id?: string | null;
          version_name: string;
        }
        Update: {
          content?: Json;
          created_at?: string;
          id?: string;
          job_id?: string | null;
          match_score?: number | null;
          optimization_status?: string | null;
          original_resume_id?: string | null;
          user_id?: string | null;
          version_name?: string;
        }
        Relationships: [
          {
            foreignKeyName: "optimized_resumes_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "optimized_resumes_original_resume_id_fkey"
            columns: ["original_resume_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      certifications: {
        Row: {
          created_at: string;
          credential_id: string | null;
          expiry_date: string | null;
          id: string;
          issue_date: string | null;
          issuer: string;
          name: string;
          url: string | null;
          user_id: string | null;
        }
        Insert: {
          created_at?: string;
          credential_id?: string | null;
          expiry_date?: string | null;
          id?: string;
          issue_date?: string | null;
          issuer: string;
          name: string;
          url?: string | null;
          user_id?: string | null;
        }
        Update: {
          created_at?: string;
          credential_id?: string | null;
          expiry_date?: string | null;
          id?: string;
          issue_date?: string | null;
          issuer?: string;
          name?: string;
          url?: string | null;
          user_id?: string | null;
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string;
          description: string | null;
          end_date: string | null;
          id: string;
          name: string;
          start_date: string | null;
          technologies: string[] | null;
          url: string | null;
          user_id: string | null;
        }
        Insert: {
          created_at?: string;
          description?: string | null;
          end_date?: string | null;
          id?: string;
          name: string;
          start_date?: string | null;
          technologies?: string[] | null;
          url?: string | null;
          user_id?: string | null;
        }
        Update: {
          created_at?: string;
          description?: string | null;
          end_date?: string | null;
          id?: string;
          name?: string;
          start_date?: string | null;
          technologies?: string[] | null;
          url?: string | null;
          user_id?: string | null;
        }
        Relationships: []
      }
      resume_themes: {
        Row: {
          created_at: string;
          id: string;
          is_default: boolean | null;
          name: string;
          settings: Json;
          user_id: string;
        }
        Insert: {
          created_at?: string;
          id?: string;
          is_default?: boolean | null;
          name: string;
          settings?: Json;
          user_id: string;
        }
        Update: {
          created_at?: string;
          id?: string;
          is_default?: boolean | null;
          name?: string;
          settings?: Json;
          user_id?: string;
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
