# 🎯 Aggiornamento Modello Dati - Struttura Normalizzata

## ✅ Cosa è Cambiato

Il sistema è stato aggiornato per utilizzare un **modello dati normalizzato** che separa le valutazioni in componenti gerarchiche:

### Nuova Architettura
```
candidates
    ↓
evaluations ← jobs (job offers)
    ↓
evaluation_sections
    ↓
├── evaluation_dimensions (score 1-5 per criterio)
└── evaluation_questions (domande AI per approfondimenti)
```

### Vantaggi
- ✅ **Flessibilità**: Aggiungi nuove sezioni/dimensioni senza modificare lo schema
- ✅ **Precisione**: Score granulari per ogni criterio di valutazione
- ✅ **Tracciabilità**: Justifications e data sources per ogni dimension
- ✅ **Workflow**: Gestione completa delle domande AI e risposte candidati

## 🚨 Setup Database (5-10 minuti)

### Passo 1: Crea l'Enum per Confidence

1. **Apri il SQL Editor di Supabase**  
   👉 https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij/sql/new

2. **Crea l'enum type:**

```sql
-- Crea enum per i livelli di confidenza
CREATE TYPE confidence_enum AS ENUM ('Low', 'Med', 'High');
```

### Passo 2: Crea le Tabelle Complete

**Copia e incolla questo SQL completo** (oppure vedi `/docs/DATABASE_SETUP.md` per il dettaglio):

```sql
-- ==================== CANDIDATES ====================
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

CREATE INDEX IF NOT EXISTS idx_candidates_email ON candidates(email);
CREATE INDEX IF NOT EXISTS idx_candidates_job_offer_id ON candidates(job_offer_id);
CREATE INDEX IF NOT EXISTS idx_candidates_created_at ON candidates(created_at DESC);

ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated read access" ON candidates FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow service_role full access" ON candidates FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ==================== JOBS ====================
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

ALTER TABLE jobs ADD CONSTRAINT weights_has_all_keys CHECK (
  weights ? 'professional_experience' AND weights ? 'technical_skills' AND 
  weights ? 'motivation' AND weights ? 'education_learning' AND weights ? 'soft_skills_behavioral'
);

ALTER TABLE jobs ADD CONSTRAINT weights_sum_one CHECK (
  ABS(COALESCE((weights->>'professional_experience')::NUMERIC,0) + 
      COALESCE((weights->>'technical_skills')::NUMERIC,0) + 
      COALESCE((weights->>'motivation')::NUMERIC,0) + 
      COALESCE((weights->>'education_learning')::NUMERIC,0) + 
      COALESCE((weights->>'soft_skills_behavioral')::NUMERIC,0) - 1.0) <= 0.001
);

CREATE INDEX IF NOT EXISTS idx_jobs_job_key ON jobs(job_key);
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated read access" ON jobs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow service_role full access" ON jobs FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ==================== EVALUATIONS ====================
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
  CONSTRAINT fk_candidate FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_evaluations_candidate_id ON evaluations(candidate_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_job_id ON evaluations(job_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_timestamp ON evaluations(timestamp_utc DESC);

ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated read access" ON evaluations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow service_role full access" ON evaluations FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ==================== EVALUATION SECTIONS ====================
CREATE TABLE IF NOT EXISTS evaluation_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evaluation_id UUID NOT NULL REFERENCES evaluations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  section_score NUMERIC(5,3) NOT NULL,
  notes TEXT[] NOT NULL DEFAULT '{}',
  UNIQUE (evaluation_id, name)
);

CREATE INDEX IF NOT EXISTS idx_evaluation_sections_evaluation_id ON evaluation_sections(evaluation_id);
ALTER TABLE evaluation_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated read access" ON evaluation_sections FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow service_role full access" ON evaluation_sections FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ==================== EVALUATION DIMENSIONS ====================
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

CREATE INDEX IF NOT EXISTS idx_evaluation_dimensions_section_id ON evaluation_dimensions(evaluation_section_id);
ALTER TABLE evaluation_dimensions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated read access" ON evaluation_dimensions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow service_role full access" ON evaluation_dimensions FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ==================== EVALUATION QUESTIONS ====================
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

CREATE INDEX IF NOT EXISTS idx_evaluation_questions_section_id ON evaluation_questions(evaluation_section_id);
ALTER TABLE evaluation_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated read access" ON evaluation_questions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow service_role full access" ON evaluation_questions FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ==================== EVIDENCE ITEMS (Opzionale) ====================
CREATE TABLE IF NOT EXISTS evidence_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evaluation_dimension_id UUID NOT NULL REFERENCES evaluation_dimensions(id) ON DELETE CASCADE,
  url TEXT,
  excerpt TEXT
);

CREATE INDEX IF NOT EXISTS idx_evidence_items_dimension_id ON evidence_items(evaluation_dimension_id);
ALTER TABLE evidence_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated read access" ON evidence_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow service_role full access" ON evidence_items FOR ALL TO service_role USING (true) WITH CHECK (true);
```

3. **Clicca su "RUN"**

4. **Verifica le tabelle create**  
   👉 https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij/database/tables  
   Dovresti vedere: `candidates`, `jobs`, `evaluations`, `evaluation_sections`, `evaluation_dimensions`, `evaluation_questions`, `evidence_items`

### Passo 2: Deploya la Edge Function Aggiornata (2 minuti)

```bash
# Se hai Supabase CLI installato
supabase functions deploy make-server-2a12511d
```

**Oppure**, se non hai CLI:
1. Vai a https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij/functions
2. Seleziona la funzione `make-server-2a12511d`
3. Aggiorna il codice con il contenuto di `/supabase/functions/server/index.tsx`
4. Deploya

### Passo 3: Testa che Funzioni (1 minuto)

1. Apri il dashboard
2. Attiva il toggle **"Dati Reali"**
3. ✅ Non dovresti vedere errori
4. ✅ Prova ad applicare per un ruolo - il candidato dovrebbe apparire nella tabella `candidates`

---

## 📚 Documentazione Completa

Per maggiori dettagli, consulta:

- **📄 `/docs/DATABASE_SETUP.md`** - Setup completo del database con script SQL
- **📊 `/docs/DATA_MODEL.md`** - Spiegazione dettagliata del modello dati
- **🔧 `/docs/TROUBLESHOOTING.md`** - Risoluzione problemi
- **🚀 `/MIGRATION_GUIDE.md`** - Guida completa alla migrazione
- **📝 `/CHANGELOG.md`** - Changelog versioni

---

## 🎯 Cosa È Cambiato Tecnicamente

### Prima (Struttura Piatta)
```
evaluations (tabella singola)
├── id
├── candidate_id
├── job_id
├── api_response (JSONB generico)
├── scores (JSONB generico)
└── total_score
```

### Ora (Struttura Normalizzata)
```
evaluations
├── id, candidate_id, job_id, run_id
├── total_score, confidence_overall
├── pillar_weights, pillar_scores
└── evaluation_sections[]
    ├── name, section_score, notes[]
    ├── evaluation_dimensions[]
    │   ├── name, score (1-5), confidence
    │   ├── justification, data_sources[]
    │   └── evidence_items[] (opzionale)
    └── evaluation_questions[]
        ├── question_text, status
        └── asked_at, answered_at
```

---

## ✨ Vantaggi della Nuova Struttura

| Aspetto | Prima | Ora |
|---------|-------|-----|
| **Tabelle** | 2 base (candidates, evaluations) | 7 normalizzate + relazioni |
| **Granularità** | ❌ Solo score totale | ✅ Score per dimension (1-5) |
| **Justifications** | ❌ Nascoste in JSONB | ✅ Campo dedicato per dimension |
| **Questions AI** | ❌ Non gestite | ✅ Tabella dedicata con workflow |
| **Flessibilità** | ❌ Schema fisso | ✅ Sezioni/dimensions dinamiche |
| **Performance** | ⚠️ JOIN su JSONB | ✅ Indici ottimizzati su FK |
| **Integrità** | ⚠️ Foreign key base | ✅ CASCADE DELETE completo |
| **Data Sources** | ❌ Non tracciati | ✅ Array per dimension |

---

## ❓ FAQ Rapide

**Q: Devo modificare i file TypeScript esistenti?**  
A: No! I tipi in `/types/Evaluation.ts` e `/types/JobOffer.ts` sono già aggiornati. Devi solo creare le tabelle nel database.

**Q: Come funziona la conversione Map ↔ Array?**  
A: Il TypeScript usa `Map<string, Section>` ma il backend gestisce automaticamente la conversione da/a array per il database.

**Q: I dati vecchi andranno persi?**  
A: No, le vecchie tabelle rimangono intatte. Quando sei pronto, puoi eliminarle con `DROP TABLE kv_store_2a12511d`.

**Q: L'API SmartReq è compatibile?**  
A: Sì! Il form di candidatura estrae automaticamente i dati dalla risposta SmartReq e li salva nella nuova struttura.

**Q: Quanto tempo ci vuole?**  
A: 5-10 minuti totali (5 minuti setup SQL + 2 minuti deploy + 2 minuti test).

**Q: Cosa faccio se ho errori?**  
A: Consulta `/docs/TROUBLESHOOTING.md` e `/docs/DATA_MODEL.md` per dettagli.

---

## 🆘 Supporto Immediato

Se hai problemi:

1. ✅ Verifica che le tabelle esistano nel Table Editor
2. ✅ Verifica che la Edge Function sia deployata
3. ✅ Guarda la console del browser (F12) per errori
4. ✅ Consulta `/docs/TROUBLESHOOTING.md`

---

**🎉 Dopo questi 3 passaggi, il sistema funzionerà perfettamente!**

---

_Ultimo aggiornamento: 26 Ottobre 2025 - v1.1.0_
