# Setup Database Supabase

Questo documento contiene le istruzioni per configurare le tabelle necessarie nel database Supabase secondo il nuovo schema normalizzato.

## Architettura del Database

Il sistema utilizza un'architettura normalizzata con le seguenti tabelle:

### Tabelle Principali
1. **candidates** - Dati dei candidati
2. **jobs** - Job offers con pesi di valutazione
3. **evaluations** - Valutazioni principali con punteggi aggregati
4. **evaluation_sections** - Sezioni di valutazione (es. Esperienza Professionale, Competenze Tecniche)
5. **evaluation_dimensions** - Dimensioni specifiche per ogni sezione con score 1-5
6. **evaluation_questions** - Domande generate dall'AI per approfondimenti
7. **evidence_items** - (Opzionale) Evidenze e fonti per le valutazioni

## Script SQL per la Creazione delle Tabelle

Esegui questi comandi SQL nel **SQL Editor** del tuo progetto Supabase (https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij/sql/new):

### 1. Tipo Enum per Confidence

```sql
-- Crea enum per i livelli di confidenza
CREATE TYPE confidence_enum AS ENUM ('Low', 'Med', 'High');
```

### 2. Tabella Candidates

```sql
-- Crea la tabella per i candidati
CREATE TABLE IF NOT EXISTS candidates (
  id TEXT NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  cv_text TEXT DEFAULT '',
  linkedin_text TEXT DEFAULT '',
  job_offer_id TEXT NOT NULL,
  github TEXT DEFAULT '',
  website TEXT DEFAULT '',
  instagram TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crea indici per migliorare le performance
CREATE INDEX IF NOT EXISTS idx_candidates_email ON candidates(email);
CREATE INDEX IF NOT EXISTS idx_candidates_job_offer_id ON candidates(job_offer_id);
CREATE INDEX IF NOT EXISTS idx_candidates_created_at ON candidates(created_at DESC);

-- Abilita Row Level Security (RLS)
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;

-- Policy per permettere lettura a tutti gli utenti autenticati
CREATE POLICY "Allow authenticated read access" ON candidates
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy per permettere inserimento via service_role (dal server backend)
CREATE POLICY "Allow service_role full access" ON candidates
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
```

### 3. Tabella Jobs (Job Offers)

```sql
-- Crea la tabella per le job offers
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  job_key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  scoring_scale TEXT NOT NULL DEFAULT '1–5',
  rubric TEXT NOT NULL DEFAULT '1=Insufficient | 2=Basic | 3=Solid | 4=Strong | 5=Exceptional',
  eligibility_filters TEXT[] NOT NULL DEFAULT '{}',
  weights JSONB NOT NULL DEFAULT '{"professional_experience":0.30,"technical_skills":0.35,"motivation":0.15,"education_learning":0.10,"soft_skills_behavioral":0.10}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Guardrails per validare i pesi
ALTER TABLE jobs ADD CONSTRAINT weights_has_all_keys CHECK (
  weights ? 'professional_experience'
  AND weights ? 'technical_skills'
  AND weights ? 'motivation'
  AND weights ? 'education_learning'
  AND weights ? 'soft_skills_behavioral'
);

ALTER TABLE jobs ADD CONSTRAINT weights_sum_one CHECK (
  ABS( 
    COALESCE((weights->>'professional_experience')::NUMERIC, 0) +
    COALESCE((weights->>'technical_skills')::NUMERIC, 0) +
    COALESCE((weights->>'motivation')::NUMERIC, 0) +
    COALESCE((weights->>'education_learning')::NUMERIC, 0) +
    COALESCE((weights->>'soft_skills_behavioral')::NUMERIC, 0) - 1.0
  ) <= 0.001
);

-- Indici
CREATE INDEX IF NOT EXISTS idx_jobs_job_key ON jobs(job_key);
CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON jobs(company_id);

-- Abilita RLS
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read access" ON jobs
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow service_role full access" ON jobs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
```

### 4. Tabella Evaluations

```sql
-- Crea la tabella principale per le valutazioni
CREATE TABLE IF NOT EXISTS evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id TEXT NOT NULL,
  job_id TEXT NOT NULL,
  run_id TEXT NOT NULL,
  scoring_scale TEXT NOT NULL DEFAULT '1–5',
  rubric TEXT NOT NULL DEFAULT '1=Insufficient | 2=Basic | 3=Solid | 4=Strong | 5=Exceptional',
  timestamp_utc TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  pillar_weights JSONB,
  pillar_scores JSONB,
  total_score NUMERIC(5,3),
  confidence_overall confidence_enum,
  eligibility_filters JSONB,
  meta JSONB,
  UNIQUE (candidate_id, job_id, run_id),
  CONSTRAINT fk_candidate
    FOREIGN KEY (candidate_id)
    REFERENCES candidates(id)
    ON DELETE CASCADE
);

-- Indici
CREATE INDEX IF NOT EXISTS idx_evaluations_candidate_id ON evaluations(candidate_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_job_id ON evaluations(job_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_run_id ON evaluations(run_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_timestamp ON evaluations(timestamp_utc DESC);

-- Abilita RLS
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read access" ON evaluations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow service_role full access" ON evaluations
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
```

### 5. Tabella Evaluation Sections

```sql
-- Crea la tabella per le sezioni di valutazione
CREATE TABLE IF NOT EXISTS evaluation_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evaluation_id UUID NOT NULL REFERENCES evaluations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  section_score NUMERIC(5,3) NOT NULL,
  notes TEXT[] NOT NULL DEFAULT '{}',
  UNIQUE (evaluation_id, name)
);

-- Indici
CREATE INDEX IF NOT EXISTS idx_evaluation_sections_evaluation_id ON evaluation_sections(evaluation_id);
CREATE INDEX IF NOT EXISTS idx_evaluation_sections_name ON evaluation_sections(name);

-- Abilita RLS
ALTER TABLE evaluation_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read access" ON evaluation_sections
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow service_role full access" ON evaluation_sections
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
```

### 6. Tabella Evaluation Dimensions

```sql
-- Crea la tabella per le dimensioni di valutazione
CREATE TABLE IF NOT EXISTS evaluation_dimensions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evaluation_section_id UUID NOT NULL REFERENCES evaluation_sections(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  score SMALLINT NOT NULL CHECK (score BETWEEN 1 AND 5),
  confidence confidence_enum,
  justification TEXT,
  data_sources TEXT[] DEFAULT '{}',
  UNIQUE (evaluation_section_id, name)
);

-- Indici
CREATE INDEX IF NOT EXISTS idx_evaluation_dimensions_section_id ON evaluation_dimensions(evaluation_section_id);
CREATE INDEX IF NOT EXISTS idx_evaluation_dimensions_score ON evaluation_dimensions(score);

-- Abilita RLS
ALTER TABLE evaluation_dimensions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read access" ON evaluation_dimensions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow service_role full access" ON evaluation_dimensions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
```

### 7. Tabella Evaluation Questions

```sql
-- Crea la tabella per le domande di approfondimento
CREATE TABLE IF NOT EXISTS evaluation_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evaluation_section_id UUID NOT NULL REFERENCES evaluation_sections(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  channel TEXT NOT NULL DEFAULT 'whatsapp',
  source_auto BOOLEAN NOT NULL DEFAULT TRUE,
  asked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  answered_at TIMESTAMP WITH TIME ZONE
);

-- Indici
CREATE INDEX IF NOT EXISTS idx_evaluation_questions_section_id ON evaluation_questions(evaluation_section_id);
CREATE INDEX IF NOT EXISTS idx_evaluation_questions_status ON evaluation_questions(status);

-- Abilita RLS
ALTER TABLE evaluation_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read access" ON evaluation_questions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow service_role full access" ON evaluation_questions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
```

### 8. Tabella Evidence Items (Opzionale)

```sql
-- Crea la tabella per le evidenze (opzionale)
CREATE TABLE IF NOT EXISTS evidence_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evaluation_dimension_id UUID NOT NULL REFERENCES evaluation_dimensions(id) ON DELETE CASCADE,
  url TEXT,
  excerpt TEXT
);

-- Indici
CREATE INDEX IF NOT EXISTS idx_evidence_items_dimension_id ON evidence_items(evaluation_dimension_id);

-- Abilita RLS
ALTER TABLE evidence_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read access" ON evidence_items
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow service_role full access" ON evidence_items
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
```

### 9. (Opzionale) Elimina vecchie tabelle

Se non hai altri dati importanti nelle tabelle vecchie, puoi eliminarle:

```sql
-- ATTENZIONE: Questo comando eliminerà tutti i dati nelle tabelle vecchie
DROP TABLE IF EXISTS kv_store_2a12511d CASCADE;
```

## Verifica

Dopo aver eseguito gli script SQL, verifica che le tabelle siano state create correttamente:

```sql
-- Verifica tutte le tabelle create
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('candidates', 'jobs', 'evaluations', 'evaluation_sections', 'evaluation_dimensions', 'evaluation_questions', 'evidence_items')
ORDER BY table_name;

-- Verifica la struttura della tabella evaluations
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'evaluations'
ORDER BY ordinal_position;

-- Verifica le foreign keys
SELECT
  tc.table_name, 
  kcu.column_name, 
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name LIKE 'evaluation%'
ORDER BY tc.table_name;
```

## Inserimento Dati di Test (Opzionale)

Per verificare che il sistema funzioni correttamente, puoi inserire dati di test:

```sql
-- Inserisci un job offer di test
INSERT INTO jobs (id, company_id, job_key, title, description, weights)
VALUES (
  gen_random_uuid(),
  gen_random_uuid(),
  'senior_backend_engineer_2025',
  'Senior Backend Engineer',
  'Posizione per sviluppatore backend senior con esperienza in microservizi e cloud',
  '{"professional_experience":0.30,"technical_skills":0.35,"motivation":0.15,"education_learning":0.10,"soft_skills_behavioral":0.10}'::jsonb
)
RETURNING id, job_key;

-- Inserisci un candidato di test
INSERT INTO candidates (id, name, email, phone_number, job_offer_id, cv_text)
VALUES (
  'test@example.com',
  'Mario Rossi',
  'test@example.com',
  '+39 340 123 4567',
  'senior_backend_engineer_2025',
  'Esperienza di 8 anni in sviluppo backend con Java e Spring...'
);
```

## Troubleshooting

### Errore: "relation candidates does not exist"
- Assicurati di aver eseguito gli script SQL per creare le tabelle
- Verifica di essere connesso al progetto Supabase corretto

### Errore: "permission denied"
- Verifica che le policy RLS siano configurate correttamente
- Assicurati che il server backend stia usando `SUPABASE_SERVICE_ROLE_KEY` e non la chiave anon

### I dati non vengono salvati
- Controlla i log della Edge Function in Supabase Dashboard
- Verifica che le variabili d'ambiente `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` siano configurate correttamente nella Edge Function

## Collegamenti Utili

- Dashboard Supabase: https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij
- SQL Editor: https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij/sql/new
- Database Tables: https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij/database/tables
- Edge Functions: https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij/functions
