# Struttura del Progetto - Analytics Dashboard Crédit Agricole

Documentazione completa dell'organizzazione del codice e dei file del progetto.

## 📁 Directory Structure

```
├── App.tsx                          # Componente principale dell'app
├── components/                      # Componenti React
│   ├── ui/                         # Componenti UI da shadcn
│   ├── figma/                      # Componenti helper di Figma Make
│   ├── AddRoleDialog.tsx           # Dialog per aggiungere nuovi ruoli
│   ├── AllCandidatesView.tsx       # Vista completa di tutti i candidati
│   ├── CandidateApplicationForm.tsx # Form di candidatura 2-step
│   ├── CandidateDetailDialog.tsx   # Dialog dettagli candidato con sections
│   ├── CandidateFunnelChart.tsx    # Funnel processo candidatura
│   ├── CandidateLandingPage.tsx    # Landing page per candidati
│   ├── CandidatePreviewDialog.tsx  # Preview candidato
│   ├── DataModeToggle.tsx          # Toggle Demo/Live mode
│   ├── DimensionsRadarChart.tsx    # Radar chart dimensioni
│   ├── FilterBar.tsx               # Barra filtri dashboard
│   ├── KPICard.tsx                 # Card per KPI
│   ├── PitchPresentation.tsx       # Presentazione pitch
│   ├── PublicJobApplication.tsx    # Form pubblico candidatura
│   ├── RolePreviewDialog.tsx       # Preview ruolo
│   ├── RolesManagement.tsx         # Gestione ruoli
│   ├── ScoreDistributionChart.tsx  # Distribuzione punteggi
│   ├── ShareRoleDialog.tsx         # Dialog condivisione ruolo
│   ├── SupabaseErrorHelper.tsx     # Helper diagnostica errori
│   └── TopCandidatesTable.tsx      # Tabella top candidati
├── contexts/
│   └── DataContext.tsx             # Context per gestione stato globale
├── hooks/
│   └── useSupabaseData.tsx         # Hook per fetch dati da Supabase
├── types/
│   ├── Evaluation.ts               # Type/Class per Evaluation
│   └── JobOffer.ts                 # Type/Class per JobOffer
├── utils/
│   └── supabase/
│       ├── client.tsx              # Supabase client per frontend
│       └── info.tsx                # Project ID e keys
├── supabase/
│   └── functions/
│       └── server/
│           ├── index.tsx           # Edge Function principale
│           └── kv_store.tsx        # Helper KV store (legacy)
├── styles/
│   └── globals.css                 # Stili globali e Tailwind config
├── docs/
│   ├── API_INTEGRATION.md          # Documentazione API
│   ├── DATA_MODEL.md               # Spiegazione modello dati
│   ├── DATABASE_SETUP.md           # Script SQL setup database
│   ├── PROJECT_STRUCTURE.md        # Questo file
│   ├── README.md                   # Overview documentazione
│   ├── TROUBLESHOOTING.md          # Risoluzione problemi
│   └── USAGE_EXAMPLES.md           # Esempi codice TypeScript
├── guidelines/
│   └── Guidelines.md               # Linee guida sviluppo
├── CHANGELOG.md                     # Storia modifiche versioni
├── MIGRATION_GUIDE.md              # Guida migrazione
└── README_AGGIORNAMENTO.md         # Istruzioni setup rapido
```

---

## 🎯 File Chiave

### Frontend Core

#### `/App.tsx`
Componente radice dell'applicazione. Gestisce il routing tra:
- Dashboard principale
- Gestione ruoli
- Vista candidati
- Presentazione pitch

**Dipendenze:**
- `DataProvider` per stato globale
- Components per le diverse viste
- shadcn/ui per UI base

---

#### `/types/Evaluation.ts`
Definisce il modello dati per le valutazioni.

**Export principali:**
```typescript
export type Confidence = 'Low' | 'Med' | 'High';
export type Dimension = { name, score, confidence, justification, data_sources };
export type Section = { name, dimensions, section_score, questions, notes };
export type EligibilityFlag = { rule, ok };
export class Evaluation { ... }
```

**Metodi chiave:**
- `setSection(name, dimensions, questions, notes)` - Aggiunge una sezione
- `calcSectionScore(dimensions)` - Calcola media score
- `calcTotalFromWeights()` - Calcola punteggio totale ponderato

**Uso:**
```typescript
const eval = new Evaluation({ candidate_id, job_id, run_id });
eval.setSection('professional_experience', dimensions, questions);
eval.pillar_weights = jobOffer.weights;
eval.calcTotalFromWeights(); // -> total_score
```

---

#### `/types/JobOffer.ts`
Definisce il modello dati per le job offers.

**Export principali:**
```typescript
export type JobOfferWeights = {
  professional_experience, technical_skills, motivation,
  education_learning, soft_skills_behavioral
};
export class JobOffer { ... }
```

**Metodi chiave:**
- `weightsSumIsValid()` - Valida che i pesi sommino a 1.0

**Uso:**
```typescript
const job = new JobOffer({
  id, company_id, job_key, title, description,
  weights: { professional_experience: 0.30, ... }
});
if (!job.weightsSumIsValid()) throw new Error('Invalid weights');
```

---

#### `/hooks/useSupabaseData.tsx`
Custom hook per fetchare dati da Supabase via Edge Functions.

**Return value:**
```typescript
{
  candidates: Candidate[],
  evaluations: EvaluationData[],
  loading: boolean,
  error: string | null,
  refetch: () => void
}
```

**Endpoints chiamati:**
- `GET /make-server-2a12511d/candidates`
- `GET /make-server-2a12511d/evaluations`

**Uso:**
```typescript
const { candidates, evaluations, loading, error, refetch } = useSupabaseData();
```

---

#### `/contexts/DataContext.tsx`
Context React per gestire stato globale e modalità Demo/Live.

**Provider:**
```typescript
<DataProvider>
  <App />
</DataProvider>
```

**Hook:**
```typescript
const { mode, setMode, candidates, evaluations, loading } = useData();
```

**Mode:**
- `'demo'` - Usa dati hardcoded per presentazioni
- `'live'` - Usa dati reali da Supabase

---

### Backend

#### `/supabase/functions/server/index.tsx`
Edge Function principale (Deno + Hono) che espone API REST.

**Endpoints:**

**Candidates:**
- `POST /make-server-2a12511d/candidates` - Crea candidato
- `GET /make-server-2a12511d/candidates` - Lista tutti
- `GET /make-server-2a12511d/candidates/:email` - Get by email

**Evaluations:**
- `POST /make-server-2a12511d/evaluations` - Salva evaluation completa (+ sections + dimensions + questions)
- `GET /make-server-2a12511d/evaluations` - Lista tutte (con join)
- `GET /make-server-2a12511d/evaluations/candidate/:email` - Get by candidate (con join)

**Features:**
- CORS configurato per tutti i metodi
- Logging dettagliato
- Service role key per auth
- Transazioni per salvataggio atomico
- Join automatici per arricchire i dati

**Esempio POST /evaluations:**
```typescript
{
  candidate_id: "email@example.com",
  job_id: "uuid",
  run_id: "eval_123",
  sections: [
    {
      name: "professional_experience",
      section_score: 4.75,
      dimensions: [
        { name: "Anni esperienza", score: 5, confidence: "High", ... }
      ],
      questions: ["..."],
      notes: []
    }
  ],
  pillar_weights: { ... },
  total_score: 4.65
}
```

---

### Components Principali

#### `/components/CandidateApplicationForm.tsx`
Form 2-step per candidature con:
- Step 1: Dati personali (nome, email, telefono)
- Step 2: Upload CV + consenso GDPR

**Features:**
- Parsing PDF con PDF.js
- Estrazione testo da CV e LinkedIn
- Chiamata a SmartReq API per valutazione
- Salvataggio in Supabase via Edge Function
- Error handling robusto

**Flow:**
```
User compila form → Parse PDF → POST SmartReq API → POST /candidates → POST /evaluations → Success screen
```

---

#### `/components/TopCandidatesTable.tsx`
Tabella interattiva dei migliori candidati.

**Features:**
- Ordinamento per score
- Badge per weakest criteria
- Status domande (pending/answered)
- Dialog dettagli candidato
- Indicatori confidence
- Tooltips informativi

**Data:**
Usa dati demo hardcoded con struttura completa sections/dimensions.

---

#### `/components/CandidateDetailDialog.tsx`
Dialog modale per visualizzare dettagli completi di un candidato.

**Features:**
- Tab per ogni section
- Visualizzazione dimensions con score e justification
- Domande AI generate
- Note/risposte candidato
- Badge confidence per ogni dimension
- Indicatori data sources

---

#### `/components/DataModeToggle.tsx`
Toggle per switchare tra modalità Demo e Live.

**Features:**
- Switch elegante con animazione
- Contatori candidati/evaluations
- Loading state
- Error display con SupabaseErrorHelper
- Pulsante "Riprova Connessione"

---

### Database

Le tabelle sono definite in `/docs/DATABASE_SETUP.md`:

**Schema:**
```sql
candidates (id PK, name, email, phone_number, cv_text, linkedin_text, job_offer_id, ...)
  ↓ FK
evaluations (id PK, candidate_id FK, job_id, run_id, total_score, confidence_overall, ...)
  ↓ FK
evaluation_sections (id PK, evaluation_id FK, name, section_score, notes[])
  ↓ FK
├─ evaluation_dimensions (id PK, evaluation_section_id FK, name, score, confidence, justification, data_sources[])
└─ evaluation_questions (id PK, evaluation_section_id FK, question_text, status, channel, asked_at, answered_at)
```

---

## 🔄 Data Flow

### 1. Candidatura

```
Candidato → Landing Page → Application Form
                                ↓
                        Parse CV (PDF.js)
                                ↓
                        SmartReq API POST
                        /webhook/smartreq
                                ↓
                    Response con evaluation data
                                ↓
            ┌──────────────────┴──────────────────┐
            ↓                                     ↓
    POST /candidates                    POST /evaluations
            ↓                                     ↓
    Supabase DB                         Supabase DB
    'candidates' table          'evaluations' + 'sections' + 'dimensions' + 'questions'
```

### 2. Dashboard View

```
User apre dashboard → DataContext
                         ↓
                   mode === 'demo'?
                    ↙         ↘
                 YES          NO
                  ↓            ↓
            Hardcoded    useSupabaseData()
              data            ↓
                     GET /evaluations
                     GET /candidates
                            ↓
                    Supabase DB (JOIN completo)
                            ↓
                      Components render
                      (KPI, Charts, Table)
```

### 3. Evaluation Processing

```
SmartReq API response
        ↓
Extract: sections, pillar_weights, pillar_scores, total_score
        ↓
Backend POST /evaluations
        ↓
┌───────┴────────┐
↓                ↓
Save evaluation  Save sections
                 ↓
         ┌───────┴────────┐
         ↓                ↓
    Save dimensions   Save questions
```

---

## 🎨 Styling

### Tailwind CSS v4.0
Configurazione in `/styles/globals.css`:

```css
@import "tailwindcss";

/* Custom tokens */
--color-ca-green-dark: #006F4E;
--color-ca-turquoise: #009B9D;
--color-ca-red: #ED1C24;

/* Typography */
h1, h2, h3, h4, h5, h6 { ... }
```

**Palette Crédit Agricole:**
- Verde Oscuro: `#006F4E` - Primary, CTA
- Turquesa: `#009B9D` - Accents, charts
- Rosso: `#ED1C24` - Alerts, important

**Note:**
Non usare classi Tailwind per typography (text-2xl, font-bold, leading-none) a meno che esplicitamente richiesto. I default in globals.css gestiscono tutto.

---

## 📦 Dependencies

### Production
```json
{
  "react": "^18.x",
  "lucide-react": "Icons",
  "recharts": "Charts",
  "pdfjs-dist": "PDF parsing",
  "react-hook-form@7.55.0": "Forms",
  "sonner@2.0.3": "Toasts"
}
```

### Backend (Deno)
```typescript
import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
```

---

## 🔒 Security

### Environment Variables
```
SUPABASE_URL=https://evsymppxmhfvfgmkviij.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<secret>  # Server-side only
```

### Public Keys
```typescript
// In /utils/supabase/info.tsx
export const projectId = "evsymppxmhfvfgmkviij";
export const publicAnonKey = "eyJ...";  # Safe for client
```

### Row Level Security (RLS)
Tutte le tabelle hanno RLS abilitato:
- `authenticated` role: SELECT access
- `service_role`: Full access (INSERT, UPDATE, DELETE)

**Privacy:**
- Candidati NON vedono criteri di valutazione
- Candidati NON vedono pesi delle dimensioni
- Candidati NON vedono justifications
- Solo HR/Hiring Manager vedono dati completi

---

## 🧪 Testing

### Manual Testing Checklist

**Candidatura:**
- [ ] Form validation funziona
- [ ] Upload PDF estrae testo correttamente
- [ ] SmartReq API risponde
- [ ] Dati salvati in database
- [ ] Success screen mostrato

**Dashboard:**
- [ ] Toggle Demo/Live funziona
- [ ] KPI calcolati correttamente
- [ ] Charts renderizzano
- [ ] Filtri funzionano
- [ ] Dettagli candidato mostrano tutte le sections

**Ruoli:**
- [ ] Creazione ruolo funziona
- [ ] Validazione pesi (sum = 1.0)
- [ ] Condivisione genera link corretto
- [ ] Preview mostra dati corretti

---

## 📊 Performance

### Optimization Strategies

**Frontend:**
- Lazy loading per components pesanti
- Memoization con React.memo dove appropriato
- Debounce su filtri/search
- Virtual scrolling per liste lunghe (future)

**Backend:**
- Indici su foreign keys
- SELECT solo campi necessari
- JOIN ottimizzati
- Connection pooling di Supabase

**Database:**
- Indici su `candidate_id`, `job_id`, `evaluation_id`
- CHECK constraints per validazione
- CASCADE DELETE per cleanup automatico

---

## 🚀 Deployment

### Frontend
Deploy automatico da Figma Make (no build step manuale).

### Backend (Edge Functions)
```bash
# Con Supabase CLI
supabase functions deploy make-server-2a12511d

# Verifica deployment
curl https://evsymppxmhfvfgmkviij.supabase.co/functions/v1/make-server-2a12511d/health
```

### Database Migrations
```bash
# Esegui SQL scripts manualmente in Supabase Dashboard
# SQL Editor: https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij/sql/new
```

---

## 📚 Documentazione Correlata

- **[DATA_MODEL.md](./DATA_MODEL.md)** - Architettura database dettagliata
- **[DATABASE_SETUP.md](./DATABASE_SETUP.md)** - Script SQL setup completo
- **[USAGE_EXAMPLES.md](./USAGE_EXAMPLES.md)** - Esempi codice TypeScript
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Risoluzione problemi comuni
- **[API_INTEGRATION.md](./API_INTEGRATION.md)** - Documentazione API
- **[CHANGELOG.md](../CHANGELOG.md)** - Storia versioni

---

## 🤝 Contributing

### Code Style
- TypeScript strict mode
- ESLint + Prettier (configurazione automatica)
- Naming conventions:
  - Components: PascalCase (e.g., `CandidateDetailDialog`)
  - Hooks: camelCase con prefix `use` (e.g., `useSupabaseData`)
  - Types: PascalCase (e.g., `EvaluationData`)
  - Constants: UPPER_SNAKE_CASE (e.g., `SERVER_URL`)

### Commit Messages
```
feat: Add candidate detail dialog
fix: Correct score calculation in evaluations
docs: Update DATA_MODEL.md with new schema
refactor: Simplify backend evaluation saving
```

### Pull Requests
1. Fork del repo
2. Branch da `main`
3. Commit con messaggi descrittivi
4. Test manuali
5. PR con descrizione chiara

---

**Ultimo aggiornamento:** 26 Ottobre 2025 - v1.2.0
