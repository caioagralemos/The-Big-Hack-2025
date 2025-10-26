/**
 * Database Types
 * TypeScript interfaces for jobs and evaluations tables
 */

// Job table structure based on the database schema
export interface Job {
  id: string; // uuid, primary key
  company_id: string; // uuid, nullable
  job_key: string; // text, nullable  
  title: string; // text, nullable
  scoring_scale: string; // text, default "1–5"
  rubric: string; // text, default "1=Insufficient | 2=Basic..."
  eligibility_filters: string[]; // jsonb, nullable, array format
  weights: JobWeights; // jsonb, for scoring weights
  created_at: string; // timestamp, default now()
  updated_at: string; // timestamp, default now()
  description: string; // text, nullable
}

// Job weights structure for scoring pillars
export interface JobWeights {
  motivation: number;
  technical_skills: number;
  professional_experience: number;
  education_learning: number;
  soft_skills_behavioral: number;
}

// Evaluation table structure based on the database schema
export interface Evaluation {
  id: string; // uuid, primary key
  candidate_id: string; // text, nullable
  job_id: string; // text, nullable
  run_id: string; // text, nullable
  scoring_scale: string; // text, nullable
  rubric: string; // text, nullable
  timestamp_utc: string; // timestamp, default now()
  professional_experience: any; // jsonb, nullable
  technical_skills: any; // jsonb, nullable
  motivation: any; // jsonb, nullable
  education_learning: any; // jsonb, nullable
  soft_skills_behavioral: any; // jsonb, nullable
  eligibility_filters: any; // jsonb, nullable
  overall: any; // jsonb, nullable
  candidate_name: string; // text, nullable
  candidate_phone: string; // text, nullable
}

// Input types for creating new records
export interface CreateJobInput {
  company_id?: string;
  job_key?: string;
  title: string;
  scoring_scale?: string;
  rubric?: string;
  eligibility_filters?: string[];
  weights: JobWeights;
  description?: string;
}

export interface CreateEvaluationInput {
  candidate_id: string;
  job_id: string;
  run_id?: string;
  scoring_scale?: string;
  rubric?: string;
  professional_experience?: any;
  technical_skills?: any;
  motivation?: any;
  education_learning?: any;
  soft_skills_behavioral?: any;
  eligibility_filters?: any;
  overall?: any;
  candidate_name?: string;
  candidate_phone?: string;
}

// API response types
export interface DatabaseResponse<T> {
  data: T | null;
  error: string | null;
}

export interface DatabaseListResponse<T> {
  data: T[];
  error: string | null;
  count?: number;
}