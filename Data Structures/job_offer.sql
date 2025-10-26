-- Minimal Job Offer table (or extend your existing 'jobs')

create table jobs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null,
  job_key text unique not null,          -- e.g., 'ios_engineer_2025_09'
  title text not null,
  scoring_scale text not null default '1–5',
  rubric text not null default '1=Insufficient | 2=Basic | 3=Solid | 4=Strong | 5=Exceptional',
  eligibility_filters text[] not null default '{}',
  weights jsonb not null default
    '{"professional_experience":0.30,"technical_skills":0.35,"motivation":0.15,"education_learning":0.10,"soft_skills_behavioral":0.10}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Guardrails
alter table jobs add constraint weights_has_all_keys check (
  weights ? 'professional_experience'
  and weights ? 'technical_skills'
  and weights ? 'motivation'
  and weights ? 'education_learning'
  and weights ? 'soft_skills_behavioral'
);

alter table jobs add constraint weights_sum_one check (
  abs( 
    coalesce((weights->>'professional_experience')::numeric,0) +
    coalesce((weights->>'technical_skills')::numeric,0) +
    coalesce((weights->>'motivation')::numeric,0) +
    coalesce((weights->>'education_learning')::numeric,0) +
    coalesce((weights->>'soft_skills_behavioral')::numeric,0) - 1.0
  ) <= 0.001
);