-- Core tables for one evaluation run (with per-section notes)

create type confidence_enum as enum ('Low','Med','High');

create table evaluations (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null,
  job_id uuid not null,
  run_id text not null,
  scoring_scale text not null default '1–5',
  rubric text not null default '1=Insufficient | 2=Basic | 3=Solid | 4=Strong | 5=Exceptional',
  timestamp_utc timestamptz not null default now(),
  pillar_weights jsonb,
  pillar_scores jsonb,
  total_score numeric(5,3),
  confidence_overall confidence_enum,
  eligibility_filters jsonb,            -- e.g. [{"rule":"Canada-based","ok":true}, ...]
  meta jsonb,
  unique (candidate_id, job_id, run_id)
);

create table evaluation_sections (
  id uuid primary key default gen_random_uuid(),
  evaluation_id uuid not null references evaluations(id) on delete cascade,
  name text not null,                   -- e.g., 'professional_experience'
  section_score numeric(5,3) not null,  -- mean of 1–5 ints from dimensions
  notes text[] not null default '{}',   -- answers gathered post-WhatsApp
  unique (evaluation_id, name)
);

create table evaluation_dimensions (
  id uuid primary key default gen_random_uuid(),
  evaluation_section_id uuid not null references evaluation_sections(id) on delete cascade,
  name text not null,                   -- 'relevance','impact','depth',...
  score smallint not null check (score between 1 and 5),
  confidence confidence_enum,
  justification text,
  data_sources text[] default '{}',
  unique (evaluation_section_id, name)
);

create table evaluation_questions (
  id uuid primary key default gen_random_uuid(),
  evaluation_section_id uuid not null references evaluation_sections(id) on delete cascade,
  question_text text not null,
  status text not null default 'pending',       -- 'pending' | 'answered' | 'dismissed'
  channel text not null default 'whatsapp',     -- 'whatsapp' | 'email' | 'none'
  source_auto boolean not null default true,
  asked_at timestamptz default now(),
  answered_at timestamptz
);

create table evidence_items (
  id uuid primary key default gen_random_uuid(),
  evaluation_dimension_id uuid not null references evaluation_dimensions(id) on delete cascade,
  url text,
  excerpt text
);