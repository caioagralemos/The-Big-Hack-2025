# Changelog

## [1.2.0] - 2025-10-26

### 🔄 BREAKING CHANGES
- **Modello dati normalizzato**: Il sistema ora utilizza un'architettura normalizzata con 7 tabelle relazionali
- **Schema SQL aggiornato**: Completamente ridisegnato per supportare valutazioni granulari
- **Setup database richiesto**: È necessario eseguire i nuovi script SQL in `/docs/DATABASE_SETUP.md`

### ✨ Added
- **Nuova architettura database normalizzata**:
  - `candidates`: Dati candidati
  - `jobs`: Job offers con pesi configurabili
  - `evaluations`: Valutazioni principali
  - `evaluation_sections`: Sezioni di valutazione (5 standard: professional_experience, technical_skills, motivation, education_learning, soft_skills_behavioral)
  - `evaluation_dimensions`: Criteri specifici con score 1-5, confidence, justification, data_sources
  - `evaluation_questions`: Domande AI con workflow status e timestamp
  - `evidence_items`: Collegamenti a evidenze (opzionale)

- **TypeScript types aggiornati**:
  - `Evaluation` class con metodi `setSection()`, `calcTotalFromWeights()`, `calcSectionScore()`
  - `JobOffer` class con metodo `weightsSumIsValid()`
  - Type `Section`, `Dimension`, `Confidence`, `EligibilityFlag`
  - Supporto per `Map<string, Section>` nelle evaluations

- **Documentazione completa**:
  - `/docs/DATA_MODEL.md`: Spiegazione dettagliata dell'architettura
  - `/docs/USAGE_EXAMPLES.md`: Esempi pratici d'uso delle classi TypeScript
  - `/docs/DATABASE_SETUP.md`: Script SQL completi con constraints e indici
  - `/README_AGGIORNAMENTO.md`: Guida quick-start aggiornata

### 🔧 Changed
- **server/index.tsx**: Completamente riscritto per gestire il modello normalizzato
  - POST `/evaluations`: Salva evaluation + sections + dimensions + questions in transazioni
  - GET `/evaluations`: Restituisce dati arricchiti con join automatici
  - GET `/evaluations/candidate/:email`: Fetch completo con tutte le relazioni
  - Conversione automatica Map ↔ Array per JSON serialization

- **CandidateApplicationForm.tsx**: Aggiornato per estrarre dati dalla risposta SmartReq
  - Estrae `sections`, `pillar_weights`, `pillar_scores`, `run_id`
  - Passa struttura completa al backend invece di solo `api_response`
  - Gestisce sia risposte legacy che nuove

- **useSupabaseData.tsx**: Refactoring per nuovi tipi
  - Interfaccia `EvaluationData` sostituisce vecchia `Evaluation`
  - Importa tipi da `/types/Evaluation.ts`
  - Sections come array invece di Map (per compatibilità JSON)

- **DataContext.tsx**: Aggiornato per usare `EvaluationData`

### 🎯 Benefits
- **Granularità**: Score 1-5 per ogni singolo criterio di valutazione
- **Tracciabilità**: Justification e data_sources per ogni dimension
- **Flessibilità**: Aggiungi nuove sections/dimensions senza modificare lo schema
- **Workflow AI**: Gestione completa delle domande generate dall'AI con status tracking
- **Performance**: Indici ottimizzati su foreign keys per query veloci
- **Integrità**: CASCADE DELETE completo su tutta la gerarchia
- **Scalabilità**: Ogni job offer può avere pesi custom senza modificare il codice

### 📊 Data Model Evolution

**v1.1.0 (Flat):**
```
evaluations { id, candidate_id, job_id, api_response, scores, total_score }
```

**v1.2.0 (Normalized):**
```
evaluations { id, candidate_id, job_id, run_id, total_score, confidence_overall }
  ↓
evaluation_sections { evaluation_id, name, section_score, notes[] }
  ↓
├─ evaluation_dimensions { section_id, name, score, confidence, justification, data_sources[] }
└─ evaluation_questions { section_id, question_text, status, channel, asked_at, answered_at }
```

### 📋 Migration Guide
Per migrare dalla versione 1.1.0:
1. **Backup dati esistenti** (se presenti)
2. Leggi `/docs/DATABASE_SETUP.md` per lo schema completo
3. Crea l'enum: `CREATE TYPE confidence_enum AS ENUM ('Low', 'Med', 'High');`
4. Esegui gli script SQL per creare tutte le 7 tabelle
5. Verifica le foreign keys e gli indici
6. Deploya la nuova versione dell'Edge Function
7. Testa con una candidatura reale
8. Consulta `/docs/DATA_MODEL.md` per dettagli sul funzionamento
9. Vedi `/docs/USAGE_EXAMPLES.md` per esempi di codice

### 🔍 Technical Details

**Calcolo Punteggi:**
- `section_score` = mean dei `dimension.score` (arrotondato a 2 decimali)
- `total_score` = sum(weight × section_score) per tutte le sezioni (arrotondato a 4 decimali)

**Esempio:**
```typescript
weights = { professional_experience: 0.30, technical_skills: 0.35, ... }
scores = { professional_experience: 4.75, technical_skills: 4.80, ... }
total_score = 0.30×4.75 + 0.35×4.80 + ... = 4.5475
```

**Constraints SQL:**
- `evaluation_dimensions.score` CHECK (score BETWEEN 1 AND 5)
- `jobs.weights` CHECK (sum = 1.0 ± 0.001)
- `jobs.weights` CHECK (has all 5 required keys)
- UNIQUE constraints su (evaluation_id, name) per sections
- UNIQUE constraints su (section_id, name) per dimensions

---

## [1.1.0] - 2025-10-26

### 🔄 BREAKING CHANGES
- **Migrazione da KV Store a tabelle dedicate**: Il sistema ora utilizza tabelle `candidates` e `evaluations` invece della generica `kv_store_2a12511d`
- **Setup database richiesto**: È necessario eseguire gli script SQL in `/docs/DATABASE_SETUP.md` per creare le nuove tabelle

### ✨ Added
- **DATABASE_SETUP.md**: Nuova documentazione completa per il setup del database
  - Script SQL per creare tabelle `candidates` e `evaluations`
  - Indici ottimizzati per performance
  - Foreign keys per integrità referenziale
  - Row Level Security (RLS) policies
  - Script di migrazione dalla vecchia KV Store
- **Tabelle database strutturate**:
  - `candidates`: Tabella dedicata per i candidati con campi tipizzati
  - `evaluations`: Tabella dedicata per le valutazioni con relazione a candidates

### 🔧 Changed
- **server/index.tsx**: Completamente refactorizzato per usare Supabase client diretto
  - Rimosso kv_store.tsx per candidates ed evaluations
  - Usati metodi Supabase nativi (.from(), .select(), .upsert())
  - Migliorata gestione errori con logging dettagliato
  - Aggiunto supporto foreign keys e relazioni
- **SupabaseErrorHelper.tsx**: Aggiornato per riflettere le nuove tabelle
  - Messaggi di errore specifici per `candidates` e `evaluations`
  - SQL snippets aggiornati con script creazione tabelle
  - Link a DATABASE_SETUP.md per documentazione completa
- **Documentazione**: Aggiornata per riflettere la nuova architettura
  - TROUBLESHOOTING.md aggiornato con nuovi nomi tabelle
  - README.md con istruzioni setup database aggiornate

### 🎯 Benefits
- **Performance migliorate**: Indici dedicati per query ottimizzate
- **Integrità dati**: Foreign keys garantiscono coerenza referenziale
- **Scalabilità**: Struttura normalizzata per crescita futura
- **Manutenibilità**: Schema chiaro e tipizzato invece di JSONB generico
- **Sicurezza**: RLS policies per controllo accessi granulare

### 📋 Migration Guide
Per migrare dalla versione 1.0.1:
1. Leggi `/docs/DATABASE_SETUP.md`
2. Esegui gli script SQL per creare le nuove tabelle
3. (Opzionale) Esegui lo script di migrazione per spostare i dati da kv_store
4. Deploya la nuova versione dell'Edge Function
5. Testa la connessione con il toggle "Dati Reali"

---

## [1.0.1] - 2025-10-26

### 🔧 Fixed
- **Errore 401 Supabase**: Aggiunto header `apikey` mancante nelle richieste alle Edge Functions
- **Autenticazione**: Migliorata la gestione dell'autenticazione Supabase con headers corretti
- **Error handling**: Aggiunto logging dettagliato degli errori nelle chiamate API

### ✨ Added
- **SupabaseErrorHelper**: Nuovo componente che fornisce guida interattiva alla risoluzione errori
  - Diagnostica automatica del tipo di errore (401, tabella mancante, funzione non trovata)
  - Link diretti al Supabase Dashboard
  - SQL snippets per creare la tabella KV Store
  - Guida passo-passo alla risoluzione
- **Documentazione completa**:
  - `/docs/README.md` - Panoramica generale del sistema
  - `/docs/TROUBLESHOOTING.md` - Guida completa risoluzione problemi
  - `/docs/API_INTEGRATION.md` - Aggiornata con sezione autenticazione
- **DataModeToggle migliorato**:
  - Integrato SupabaseErrorHelper per errori chiari
  - Pulsante "Riprova Connessione" più prominente
  - Messaggi di errore più informativi

### 🔄 Changed
- **useSupabaseData.tsx**: 
  - Aggiunto header `apikey` a tutte le richieste GET
  - Migliorato error logging con dettagli della risposta
  - Aggiunto metodo GET esplicito nelle richieste
- **CandidateApplicationForm.tsx**:
  - Aggiunto header `apikey` alle richieste POST
  - Mantenuta backward compatibility
- **server/index.tsx**:
  - Semplificato middleware di autenticazione
  - Aggiunto logging dell'auth header per debugging
  - Migliorato supporto CORS con `credentials: true`

### 📚 Documentation
- Creata struttura documentazione completa in `/docs/`
- Aggiunta guida troubleshooting con esempi pratici
- Documentati tutti gli endpoint API con esempi curl
- Aggiunte istruzioni SQL per setup database
- Creato indice navigabile della documentazione

---

## [1.0.0] - 2025-10-25

### 🎉 Initial Release

#### Core Features
- **Dashboard Analytics**
  - 4 KPI principali (Totale Candidati, Media Punteggio, Tasso Idoneità, Candidati Strong+)
  - Distribuzione punteggi con istogramma interattivo
  - Radar chart per visualizzazione dimensioni di valutazione
  - Funnel processo candidatura
  - Tabella top candidati con dettagli completi
  
- **Sistema di Candidatura**
  - Landing page professionale per ogni ruolo
  - Form 2-step con validazione
  - Upload CV PDF con parsing automatico (PDF.js)
  - Upload LinkedIn PDF opzionale
  - Consenso GDPR obbligatorio
  - Integrazione SmartReq API per valutazione AI
  
- **Gestione Ruoli**
  - Creazione ruoli personalizzati
  - Configurazione criteri di valutazione
  - Pesi personalizzabili per dimensioni
  - Condivisione ruoli via link/email/WhatsApp
  - Preview ruoli prima della pubblicazione
  
- **Modalità Demo/Live**
  - Modalità Demo con dati hardcoded per presentazioni
  - Modalità Live con dati reali da Supabase
  - Toggle semplice tra le modalità
  - Indicatori di stato connessione

#### Integrations
- **SmartReq API**
  - Endpoint: `https://primary-production-6beb.up.railway.app/webhook/smartreq`
  - Valutazione AI automatica dei CV
  - Parsing intelligente di competenze e esperienza
  
- **Supabase Backend**
  - Project ID: `evsymppxmhfvfgmkviij`
  - Edge Functions con Hono.js
  - KV Store per persistenza dati
  - API RESTful per candidati e valutazioni
  
#### Design System
- **Palette Crédit Agricole**
  - Verde Oscuro (#006F4E)
  - Turquesa (#009B9D)
  - Rosso (#ED1C24)
- **Logo ufficiale** importato da Figma
- **Responsive design** ottimizzato per desktop e mobile
- **Typography** personalizzata secondo brand guidelines

#### Security & Privacy
- Service Role Key protetta (solo server-side)
- Public Anon Key sicura per client
- CORS configurato correttamente
- Criteri di valutazione nascosti ai candidati
- Consenso GDPR obbligatorio

#### Components
**Dashboard:**
- KPICard
- FilterBar
- ScoreDistributionChart (Recharts)
- DimensionsRadarChart (Recharts)
- CandidateFunnelChart (Recharts)
- TopCandidatesTable
- DataModeToggle

**Candidates:**
- CandidateLandingPage
- CandidateApplicationForm
- PublicJobApplication
- CandidateDetailDialog
- CandidatePreviewDialog
- AllCandidatesView

**Roles:**
- RolesManagement
- AddRoleDialog
- ShareRoleDialog
- RolePreviewDialog

**Presentation:**
- PitchPresentation

#### Technical Stack
- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS v4.0
- **Charts**: Recharts
- **Icons**: Lucide React
- **PDF Parsing**: PDF.js
- **Backend**: Supabase Edge Functions (Deno + Hono)
- **Database**: Supabase KV Store (PostgreSQL JSONB)
- **UI Components**: shadcn/ui

#### Data Flow
```
Candidato → Form → PDF Parser → SmartReq API → Supabase Server → KV Store
                                      ↓
                                 Valutazione AI
                                      ↓
                      Dashboard Analytics (Demo/Live Mode)
```

---

## Future Roadmap

### Planned Features
- [ ] Export dati (CSV/Excel)
- [ ] Email automatiche ai candidati
- [ ] Notifiche in-app
- [ ] Filtri salvati
- [ ] Commenti HR su candidati
- [ ] Confronto candidati
- [ ] Calendario colloqui
- [ ] Analytics temporali

### Under Consideration
- [ ] Mobile app
- [ ] Integrazione ATS esterni
- [ ] Video colloqui integrati
- [ ] AI interview chatbot
- [ ] Skill assessments interattivi

---

**Nota**: Questo changelog segue il formato [Keep a Changelog](https://keepachangelog.com/) e il progetto usa [Semantic Versioning](https://semver.org/).
