# Modello Dati - Analytics Dashboard Crédit Agricole

## Panoramica

Il sistema utilizza un modello di dati normalizzato che separa le valutazioni in componenti gerarchiche per maggiore flessibilità e scalabilità.

## Architettura del Modello

```
candidates
    ↓
evaluations ← jobs (job offers)
    ↓
evaluation_sections
    ↓
├── evaluation_dimensions
└── evaluation_questions
    ↓
evidence_items (opzionale)
```

## Entità Principali

### 1. Candidates (Candidati)

Memorizza le informazioni base dei candidati che si applicano alle posizioni.

**Campi chiave:**
- `id` (TEXT) - Email del candidato (chiave primaria)
- `name`, `email`, `phone_number` - Dati di contatto
- `cv_text`, `linkedin_text` - Testo estratto dai documenti
- `job_offer_id` - Riferimento alla posizione a cui si candida
- `github`, `website`, `instagram` - Link opzionali

### 2. Jobs (Posizioni/Ruoli)

Definisce le job offers con i criteri di valutazione e i pesi delle dimensioni.

**Campi chiave:**
- `id` (UUID) - Identificatore univoco
- `job_key` (TEXT) - Chiave testuale unica (es. "senior_backend_engineer_2025")
- `title` - Titolo della posizione
- `description` - Descrizione dettagliata
- `scoring_scale` - Scala di valutazione (default: "1–5")
- `rubric` - Rubrica di valutazione
- `eligibility_filters` - Array di filtri di eligibilità
- `weights` - JSONB con i pesi delle 5 dimensioni:
  ```json
  {
    "professional_experience": 0.30,
    "technical_skills": 0.35,
    "motivation": 0.15,
    "education_learning": 0.10,
    "soft_skills_behavioral": 0.10
  }
  ```

**Vincoli:**
- I pesi devono sommare a 1.0 (±0.001)
- Tutte le 5 chiavi devono essere presenti

### 3. Evaluations (Valutazioni)

Rappresenta una valutazione completa di un candidato per una posizione specifica.

**Campi chiave:**
- `id` (UUID) - Identificatore univoco
- `candidate_id` - Riferimento al candidato
- `job_id` - Riferimento alla job offer
- `run_id` - Identificatore della run di valutazione
- `scoring_scale`, `rubric` - Copiate dalla job offer o custom
- `timestamp_utc` - Data/ora della valutazione
- `pillar_weights` - JSONB con i pesi usati per questa valutazione
- `pillar_scores` - JSONB con i punteggi aggregati per pillar
- `total_score` - Punteggio totale finale (0-5, 3 decimali)
- `confidence_overall` - Livello di confidenza ('Low', 'Med', 'High')
- `eligibility_filters` - Array di oggetti `{rule: string, ok: boolean}`

**Vincolo UNIQUE:** `(candidate_id, job_id, run_id)` - Un candidato può avere più valutazioni per lo stesso job se cambia il run_id

### 4. Evaluation Sections (Sezioni di Valutazione)

Ogni valutazione è divisa in sezioni tematiche (es. "Esperienza Professionale", "Competenze Tecniche").

**Campi chiave:**
- `id` (UUID) - Identificatore univoco
- `evaluation_id` - Riferimento alla valutazione principale
- `name` - Nome della sezione (es. "professional_experience", "technical_skills")
- `section_score` - Punteggio medio delle dimensions (0-5, 3 decimali)
- `notes` - Array di note/risposte del candidato dopo follow-up

**Sezioni Standard:**
1. `professional_experience` - Esperienza Professionale
2. `technical_skills` - Competenze Tecniche
3. `motivation` - Motivazione
4. `education_learning` - Istruzione e Apprendimento
5. `soft_skills_behavioral` - Competenze Trasversali

### 5. Evaluation Dimensions (Dimensioni di Valutazione)

Criteri specifici valutati all'interno di ogni sezione.

**Campi chiave:**
- `id` (UUID) - Identificatore univoco
- `evaluation_section_id` - Riferimento alla sezione
- `name` - Nome della dimensione (es. "Java/Spring Boot", "Anni di esperienza")
- `score` - Punteggio 1-5 (SMALLINT con CHECK constraint)
- `confidence` - Livello di confidenza ('Low', 'Med', 'High')
- `justification` - Spiegazione testuale del punteggio
- `data_sources` - Array di fonti (es. ["CV", "LinkedIn"])

**Esempi di dimensions per sezione:**

**Professional Experience:**
- Anni di esperienza rilevante
- Progetti comparabili
- Progressione di carriera
- Leadership tecnica

**Technical Skills:**
- Linguaggi e framework specifici
- Cloud e containerizzazione
- Database e SQL
- DevOps e CI/CD

**Motivation:**
- Interesse per il ruolo
- Allineamento con i valori
- Aspettative di carriera

### 6. Evaluation Questions (Domande di Approfondimento)

Domande generate dall'AI per chiarire aspetti della candidatura.

**Campi chiave:**
- `id` (UUID) - Identificatore univoco
- `evaluation_section_id` - Riferimento alla sezione
- `question_text` - Testo della domanda
- `status` - Stato ('pending', 'answered', 'dismissed')
- `channel` - Canale di invio ('whatsapp', 'email', 'none')
- `source_auto` - Se generata automaticamente dall'AI (boolean)
- `asked_at`, `answered_at` - Timestamp

**Workflow:**
1. L'AI genera domande durante la valutazione iniziale
2. Le domande vengono inviate via WhatsApp/Email
3. Le risposte vengono salvate in `evaluation_sections.notes`
4. Lo status viene aggiornato a 'answered'

### 7. Evidence Items (Evidenze - Opzionale)

Collegamenti a evidenze specifiche per supportare le valutazioni.

**Campi chiave:**
- `id` (UUID) - Identificatore univoco
- `evaluation_dimension_id` - Riferimento alla dimension
- `url` - Link alla fonte
- `excerpt` - Estratto di testo

## Flusso di Dati

### 1. Creazione Job Offer
```typescript
const jobOffer = new JobOffer({
  id: uuid(),
  company_id: uuid(),
  job_key: "senior_backend_engineer_2025",
  title: "Senior Backend Engineer",
  description: "...",
  weights: {
    professional_experience: 0.30,
    technical_skills: 0.35,
    motivation: 0.15,
    education_learning: 0.10,
    soft_skills_behavioral: 0.10
  }
});
```

### 2. Candidatura e Valutazione AI
```typescript
// 1. Salva candidato
POST /make-server-2a12511d/candidates
{
  name: "Mario Rossi",
  email: "mario@example.com",
  phone_number: "+39 340 123 4567",
  cv_text: "...",
  job_offer_id: jobOffer.id
}

// 2. Chiama API SmartReq per valutazione
POST https://primary-production-6beb.up.railway.app/webhook/smartreq
{
  name: "Mario Rossi",
  email: "mario@example.com",
  phone_number: "+39 340 123 4567",
  cv: "...",
  job_offer: { ... }
}

// 3. Salva valutazione nel database
POST /make-server-2a12511d/evaluations
{
  candidate_id: "mario@example.com",
  job_id: jobOffer.id,
  run_id: "eval_20251026_001",
  sections: {
    professional_experience: {
      dimensions: [
        { name: "Anni esperienza", score: 5, confidence: "High", ... }
      ],
      questions: ["Puoi descrivere il progetto più complesso?"],
      notes: []
    },
    ...
  },
  pillar_weights: { ... },
  total_score: 4.65,
  confidence_overall: "High"
}
```

### 3. Recupero Dati per Dashboard
```typescript
// Il backend arricchisce automaticamente le evaluations con sezioni/dimensioni
GET /make-server-2a12511d/evaluations

Response:
{
  ok: true,
  evaluations: [
    {
      id: "uuid",
      candidate_id: "mario@example.com",
      total_score: 4.65,
      sections: [
        {
          name: "professional_experience",
          section_score: 4.9,
          dimensions: [
            { name: "Anni esperienza", score: 5, confidence: "High", ... }
          ],
          questions: ["..."],
          notes: ["..."]
        }
      ]
    }
  ]
}
```

## Calcolo dei Punteggi

### Section Score
```typescript
section_score = mean(dimensions.map(d => d.score))
// Arrotondato a 2 decimali
```

### Total Score
```typescript
total_score = sum(
  pillar_weights[section_name] * section.section_score
  for each section
)
// Arrotondato a 4 decimali
```

**Esempio:**
```typescript
weights = {
  professional_experience: 0.30,
  technical_skills: 0.35,
  motivation: 0.15,
  education_learning: 0.10,
  soft_skills_behavioral: 0.10
}

scores = {
  professional_experience: 4.9,
  technical_skills: 4.8,
  motivation: 4.7,
  education_learning: 4.5,
  soft_skills_behavioral: 3.2
}

total = 0.30*4.9 + 0.35*4.8 + 0.15*4.7 + 0.10*4.5 + 0.10*3.2
      = 1.47 + 1.68 + 0.705 + 0.45 + 0.32
      = 4.625
```

## Note di Implementazione

### Conversione Map ↔ Array
Il TypeScript `Evaluation` class usa `Map<string, Section>` per le sezioni, ma il database e le API REST usano array. Il backend gestisce automaticamente la conversione.

### Row Level Security (RLS)
Tutte le tabelle hanno RLS abilitato con:
- Policy `authenticated` per lettura
- Policy `service_role` per tutte le operazioni (usata dal backend)

### Privacy e GDPR
- I candidati NON vedono mai i criteri di valutazione, i pesi o i punteggi
- Solo HR e Hiring Manager hanno accesso ai dati completi
- Le justifications e data_sources sono visibili solo internamente

## Estensibilità

### Aggiungere nuove sezioni
```sql
-- Non richiede modifiche allo schema, basta inserire
INSERT INTO evaluation_sections (evaluation_id, name, section_score, notes)
VALUES (eval_id, 'communication_skills', 4.2, '{}');
```

### Aggiungere nuove dimensioni
```sql
-- Anche questo è completamente flessibile
INSERT INTO evaluation_dimensions (evaluation_section_id, name, score, confidence, justification)
VALUES (section_id, 'Presentation Skills', 4, 'Med', 'Good slide decks in portfolio');
```

### Custom Job Offers
Ogni job offer può avere pesi diversi e filtri di eligibilità specifici senza modificare il codice.

## Performance

### Indici Critici
- `evaluations(candidate_id)` - Per lookup rapido
- `evaluations(timestamp_utc DESC)` - Per ordinamento cronologico
- `evaluation_sections(evaluation_id)` - Per join rapidi
- `evaluation_dimensions(evaluation_section_id)` - Per join rapidi

### Query Ottimizzate
Il backend usa query con join impliciti per ridurre il numero di round-trip al database.

## Riferimenti

- Schema SQL completo: `/docs/DATABASE_SETUP.md`
- TypeScript types: `/types/Evaluation.ts`, `/types/JobOffer.ts`
- Backend API: `/supabase/functions/server/index.tsx`
