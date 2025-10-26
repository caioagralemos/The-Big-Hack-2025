# 🚀 Guida Completa al Deployment del Dashboard Analytics

Questa guida ti accompagnerà passo-passo nel deployment della tua applicazione di reclutamento Crédit Agricole con integrazione Supabase e API SmartReq.

---

## 📋 Prerequisiti

Prima di iniziare, assicurati di avere:

- ✅ Un account Supabase (https://supabase.com)
- ✅ Node.js installato (versione 18 o superiore)
- ✅ Git installato
- ✅ Un editor di codice (VS Code consigliato)
- ✅ Accesso all'API SmartReq: `https://primary-production-6beb.up.railway.app/webhook/smartreq`

---

## 🔧 FASE 1: Configurazione del Database Supabase

### 1.1 Accesso al Progetto Supabase

1. Vai su https://supabase.com/dashboard
2. Accedi al tuo progetto: `evsymppxmhfvfgmkviij`
3. Oppure crea un nuovo progetto se preferisci iniziare da zero

### 1.2 Creazione delle Tabelle

1. Nel pannello di sinistra, clicca su **"SQL Editor"**
2. Clicca su **"New Query"**
3. Copia e incolla il seguente SQL:

```sql
-- ============================================
-- TABELLA CANDIDATES (Candidati)
-- ============================================
CREATE TABLE IF NOT EXISTS candidates (
  id TEXT NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone_number TEXT NOT NULL,
  cv_text TEXT DEFAULT '',
  linkedin_text TEXT DEFAULT '',
  job_offer_id TEXT NOT NULL,
  github TEXT DEFAULT '',
  website TEXT DEFAULT '',
  instagram TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indici per migliorare le performance
CREATE INDEX IF NOT EXISTS idx_candidates_job_offer_id ON candidates(job_offer_id);
CREATE INDEX IF NOT EXISTS idx_candidates_email ON candidates(email);
CREATE INDEX IF NOT EXISTS idx_candidates_created_at ON candidates(created_at DESC);

-- ============================================
-- TABELLA EVALUATIONS (Valutazioni AI)
-- ============================================
CREATE TABLE IF NOT EXISTS evaluations (
  id TEXT NOT NULL PRIMARY KEY,
  evaluation_id TEXT NOT NULL,
  candidate_id TEXT NOT NULL,
  job_id TEXT NOT NULL,
  api_response JSONB DEFAULT '{}',
  scores JSONB DEFAULT '{}',
  total_score NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);

-- Indici per migliorare le performance
CREATE INDEX IF NOT EXISTS idx_evaluations_candidate_id ON evaluations(candidate_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_job_id ON evaluations(job_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_total_score ON evaluations(total_score DESC);
CREATE INDEX IF NOT EXISTS idx_evaluations_created_at ON evaluations(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS) - Sicurezza
-- ============================================

-- Abilita RLS per entrambe le tabelle
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

-- Policy per permettere lettura pubblica (per il dashboard)
CREATE POLICY "Enable read access for all users" ON candidates
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON evaluations
  FOR SELECT USING (true);

-- Policy per permettere inserimento solo tramite service_role
CREATE POLICY "Enable insert for service role only" ON candidates
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable insert for service role only" ON evaluations
  FOR INSERT WITH CHECK (true);
```

4. Clicca su **"Run"** per eseguire lo script
5. Verifica che appaia il messaggio "Success. No rows returned"

### 1.3 Verifica delle Tabelle Create

1. Nel pannello di sinistra, clicca su **"Table Editor"**
2. Dovresti vedere le due tabelle:
   - `candidates`
   - `evaluations`
3. Clicca su ciascuna tabella per verificare che abbiano le colonne corrette

---

## 🔑 FASE 2: Ottenere le Credenziali

### 2.1 URL e API Keys

1. Nel pannello di sinistra, clicca su **"Project Settings"** (icona ingranaggio)
2. Clicca su **"API"**
3. Troverai:
   - **Project URL**: `https://evsymppxmhfvfgmkviij.supabase.co`
   - **anon public key**: Una chiave che inizia con `eyJ...`
   - **service_role key**: Una chiave segreta (NON condividerla mai!)

### 2.2 Copia le Credenziali

Mantieni aperta questa pagina, ti servirà nella prossima fase.

---

## 🌐 FASE 3: Deploy della Edge Function

Le Edge Functions permettono di chiamare l'API SmartReq in modo sicuro senza esporre le credenziali.

### 3.1 Installare Supabase CLI

Apri il terminale e installa la CLI di Supabase:

```bash
# macOS / Linux
brew install supabase/tap/supabase

# Windows (PowerShell)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Oppure con npm (tutti i sistemi)
npm install -g supabase
```

### 3.2 Login a Supabase

```bash
supabase login
```

Si aprirà il browser per autenticarti. Accedi con le tue credenziali Supabase.

### 3.3 Collegare il Progetto

```bash
# Vai nella cartella del progetto
cd /path/to/your/project

# Collega il progetto Supabase
supabase link --project-ref evsymppxmhfvfgmkviij
```

Ti verrà chiesta la password del database. La trovi in:
- Dashboard Supabase → Project Settings → Database → Database password

### 3.4 Deploy della Edge Function

Ora devi deployare la funzione che gestisce le chiamate all'API SmartReq:

```bash
# Deploy della funzione "server"
supabase functions deploy server
```

### 3.5 Configurare i Secrets per la Edge Function

La Edge Function ha bisogno di accedere al database. Configura il secret:

```bash
supabase secrets set SUPABASE_SERVICE_ROLE_KEY="la-tua-service-role-key-qui"
```

Sostituisci `la-tua-service-role-key-qui` con la **service_role key** che hai copiato al punto 2.1.

### 3.6 Verifica del Deploy

1. Vai su Dashboard Supabase → **Edge Functions**
2. Dovresti vedere la funzione **"server"** con stato "Deployed"
3. Clicca sulla funzione per vedere i dettagli
4. Annota l'URL della funzione, sarà simile a:
   ```
   https://evsymppxmhfvfgmkviij.supabase.co/functions/v1/server
   ```

---

## 💻 FASE 4: Configurazione dell'Applicazione React

### 4.1 Crea il File di Environment Variables

Nella root del tuo progetto, crea un file chiamato `.env.local`:

```bash
# Vai nella cartella del progetto
cd /path/to/your/project

# Crea il file .env.local
touch .env.local
```

### 4.2 Aggiungi le Variabili d'Ambiente

Apri il file `.env.local` con il tuo editor e aggiungi:

```env
# Supabase Configuration
REACT_APP_SUPABASE_URL=https://evsymppxmhfvfgmkviij.supabase.co
REACT_APP_SUPABASE_ANON_KEY=la-tua-anon-key-qui

# SmartReq API
REACT_APP_SMARTREQ_API_URL=https://primary-production-6beb.up.railway.app/webhook/smartreq
```

**IMPORTANTE**: Sostituisci `la-tua-anon-key-qui` con la **anon public key** che hai copiato al punto 2.1.

### 4.3 Verifica il File `utils/supabase/client.tsx`

Assicurati che il file `/utils/supabase/client.tsx` usi le variabili d'ambiente:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://evsymppxmhfvfgmkviij.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

---

## 🎯 FASE 5: Test dell'Integrazione

### 5.1 Avvia l'Applicazione in Locale

```bash
# Installa le dipendenze (se non l'hai già fatto)
npm install

# Avvia l'app in modalità sviluppo
npm start
```

L'app si aprirà su `http://localhost:3000`

### 5.2 Testa la Connessione al Database

1. Nell'header dell'applicazione, clicca sull'icona **Settings** (⚙️)
2. Si aprirà un dialog con due pulsanti
3. Clicca su **"Database Reale"**
4. Se tutto è configurato correttamente, vedrai:
   - ✅ "Connesso a Supabase"
   - Il numero di candidati e valutazioni (probabilmente 0 all'inizio)

### 5.3 Invia una Candidatura di Test

1. Vai alla sezione **"Gestione Ruoli"**
2. Seleziona uno dei ruoli disponibili
3. Clicca su **"Condividi"** → **"Copia Link"**
4. Apri il link in una nuova finestra/tab del browser
5. Compila il form di candidatura con dati di test
6. Carica un CV di esempio
7. Accetta i termini GDPR e invia

### 5.4 Verifica che i Dati Siano Salvati

1. Torna al dashboard principale
2. Clicca su **Settings** nell'header
3. Seleziona **"Database Reale"**
4. Dovresti vedere almeno 1 candidato e 1 valutazione

Oppure verifica direttamente su Supabase:
1. Dashboard Supabase → **Table Editor**
2. Clicca sulla tabella `candidates`
3. Dovresti vedere il candidato appena inserito
4. Clicca sulla tabella `evaluations`
5. Dovresti vedere la valutazione AI del CV

---

## 🚢 FASE 6: Deploy in Produzione

### 6.1 Deploy su Vercel (Consigliato)

Vercel è la piattaforma ideale per applicazioni React/Next.js.

#### Preparazione

1. Fai commit di tutti i file (incluso `.env.local`)
2. Pusha il codice su GitHub:

```bash
git add .
git commit -m "Setup completo con Supabase"
git push origin main
```

#### Deploy

1. Vai su https://vercel.com
2. Clicca su **"New Project"**
3. Importa il repository da GitHub
4. In **"Environment Variables"**, aggiungi:
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`
   - `REACT_APP_SMARTREQ_API_URL`
5. Clicca su **"Deploy"**

### 6.2 Deploy su Netlify (Alternativa)

1. Vai su https://netlify.com
2. Clicca su **"Add new site"** → **"Import an existing project"**
3. Connetti il repository GitHub
4. In **"Build settings"**:
   - Build command: `npm run build`
   - Publish directory: `build`
5. In **"Environment variables"**, aggiungi le stesse variabili di Vercel
6. Clicca su **"Deploy site"**

### 6.3 Deploy su un Server Custom

Se preferisci un server tuo:

```bash
# Build dell'applicazione
npm run build

# La cartella "build" contiene i file statici da hostare
# Caricali sul tuo server web (Apache, Nginx, ecc.)
```

---

## 🔒 FASE 7: Sicurezza e Best Practices

### 7.1 Proteggi i Secrets

- ⚠️ **MAI** committare file `.env` con secrets su Git
- ✅ Aggiungi `.env.local` al file `.gitignore`
- ✅ Usa variabili d'ambiente diverse per sviluppo e produzione

### 7.2 Configura CORS per la Edge Function

Se hai problemi di CORS:

1. Modifica il file `/supabase/functions/server/index.tsx`
2. Assicurati che gli headers CORS siano configurati:

```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
```

### 7.3 Monitora l'Uso

1. Dashboard Supabase → **Reports**
2. Monitora:
   - Numero di richieste API
   - Uso del database
   - Invocazioni delle Edge Functions

---

## 🐛 FASE 8: Troubleshooting

### Errore: "Load failed" o "Failed to fetch"

**Causa**: La Edge Function non è stata deployata correttamente

**Soluzione**:
1. Verifica su Dashboard Supabase → Edge Functions
2. Ri-deploya: `supabase functions deploy server`
3. Verifica i logs: `supabase functions logs server`

### Errore: "401 Unauthorized"

**Causa**: Problemi con le API keys o RLS policies

**Soluzione**:
1. Verifica che `REACT_APP_SUPABASE_ANON_KEY` sia corretta
2. Verifica che le RLS policies siano attive (vedi FASE 1.2)
3. Controlla Dashboard Supabase → Authentication → Policies

### Errore: "relation does not exist"

**Causa**: Le tabelle non sono state create

**Soluzione**:
1. Torna alla FASE 1.2
2. Esegui nuovamente lo script SQL
3. Verifica in Table Editor che le tabelle esistano

### Edge Function non risponde

**Causa**: Secrets non configurati correttamente

**Soluzione**:
```bash
# Verifica i secrets
supabase secrets list

# Se manca SUPABASE_SERVICE_ROLE_KEY, aggiungilo:
supabase secrets set SUPABASE_SERVICE_ROLE_KEY="la-tua-service-role-key"
```

### Candidature non vengono salvate

**Causa**: Problemi con la chiamata alla Edge Function

**Soluzione**:
1. Apri la Console del browser (F12) → Network
2. Invia una candidatura di test
3. Cerca la chiamata a `/functions/v1/server`
4. Verifica lo status code e la risposta
5. Controlla i logs della Edge Function:
   ```bash
   supabase functions logs server --tail
   ```

---

## 📚 Risorse Aggiuntive

### Documentazione Ufficiale

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Supabase CLI](https://supabase.com/docs/guides/cli)

### File di Riferimento nel Progetto

- `/docs/DATABASE_SETUP.md` - Schema completo del database
- `/docs/API_INTEGRATION.md` - Dettagli integrazione SmartReq
- `/docs/TROUBLESHOOTING.md` - Guida alla risoluzione dei problemi
- `/docs/EDGE_FUNCTION_DEPLOYMENT.md` - Deployment avanzato Edge Functions

### Supporto

Se hai problemi non risolti da questa guida:

1. Controlla i logs di Supabase: Dashboard → Logs
2. Controlla i logs della Edge Function: `supabase functions logs server`
3. Verifica la documentazione ufficiale di Supabase
4. Apri una issue su GitHub (se il progetto è open source)

---

## ✅ Checklist Finale

Prima di andare in produzione, verifica che:

- [ ] Le tabelle `candidates` e `evaluations` esistano su Supabase
- [ ] Le RLS policies siano configurate correttamente
- [ ] La Edge Function `server` sia deployata e funzionante
- [ ] Le variabili d'ambiente siano configurate sia in locale che in produzione
- [ ] L'invio di candidature di test funzioni correttamente
- [ ] La valutazione AI tramite SmartReq ritorni risultati
- [ ] Il dashboard mostri correttamente i dati dal database
- [ ] Il toggle tra modalità Demo e Database Reale funzioni
- [ ] I link di condivisione dei ruoli siano accessibili pubblicamente
- [ ] Il form GDPR sia compilabile e i consensi vengano salvati

---

## 🎉 Congratulazioni!

Hai completato il setup del tuo Analytics Dashboard per il reclutamento di Crédit Agricole!

L'applicazione è ora pronta per:
- ✅ Ricevere candidature reali
- ✅ Valutare CV con l'AI di SmartReq
- ✅ Salvare dati su database Supabase
- ✅ Visualizzare analytics e KPI in tempo reale
- ✅ Gestire ruoli e condividere offerte di lavoro

**Prossimi passi suggeriti:**
1. Personalizza i ruoli nella sezione "Gestione Ruoli"
2. Condividi i link delle offerte sui canali di recruiting
3. Monitora le candidature in arrivo
4. Analizza i KPI e ottimizza il processo di selezione

---

**Ultimo aggiornamento**: Ottobre 2025  
**Versione**: 2.0.0
