# ⚡ Connessione Rapida a Supabase

Guida veloce per connettere il progetto a Supabase dopo averlo esportato da Figma Make.

---

## 📦 1. Installare le Dipendenze

```bash
cd your-project-folder
npm install
```

---

## 🔑 2. Configurare le Variabili d'Ambiente

Crea un file `.env.local` nella root del progetto:

```env
REACT_APP_SUPABASE_URL=https://evsymppxmhfvfgmkviij.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
REACT_APP_SMARTREQ_API_URL=https://primary-production-6beb.up.railway.app/webhook/smartreq
```

**Dove trovare le credenziali:**
1. Vai su https://supabase.com/dashboard
2. Seleziona il progetto `evsymppxmhfvfgmkviij`
3. Vai in **Project Settings** → **API**
4. Copia:
   - **URL** → `REACT_APP_SUPABASE_URL`
   - **anon public** → `REACT_APP_SUPABASE_ANON_KEY`

---

## 🗄️ 3. Creare le Tabelle nel Database

1. Dashboard Supabase → **SQL Editor** → **New Query**
2. Copia e incolla questo SQL:

```sql
-- Tabella candidati
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

-- Tabella valutazioni
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

-- Indici
CREATE INDEX IF NOT EXISTS idx_candidates_job_offer_id ON candidates(job_offer_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_candidate_id ON evaluations(candidate_id);

-- RLS Policies
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON candidates FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON evaluations FOR SELECT USING (true);
CREATE POLICY "Enable insert for service role only" ON candidates FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for service role only" ON evaluations FOR INSERT WITH CHECK (true);
```

3. Clicca **Run**

---

## 🌐 4. Deployare la Edge Function

```bash
# Installare Supabase CLI (una volta sola)
npm install -g supabase

# Login
supabase login

# Collegare il progetto
supabase link --project-ref evsymppxmhfvfgmkviij

# Deploy della funzione
supabase functions deploy server

# Configurare il secret
supabase secrets set SUPABASE_SERVICE_ROLE_KEY="la-tua-service-role-key"
```

**Trovare la service_role key:**
Dashboard Supabase → Project Settings → API → **service_role key**

---

## 🚀 5. Avviare l'Applicazione

```bash
# Locale
npm start

# Build per produzione
npm run build
```

---

## ✅ 6. Testare

1. Avvia l'app: `http://localhost:3000`
2. Clicca sull'icona **Settings** (⚙️) nell'header
3. Seleziona **"Database Reale"**
4. Dovresti vedere: ✅ "Connesso a Supabase"

---

## 🐛 Problemi Comuni

### Errore "Load failed"
- **Causa**: Edge Function non deployata
- **Soluzione**: Esegui `supabase functions deploy server`

### Errore "401 Unauthorized"  
- **Causa**: API key sbagliata
- **Soluzione**: Verifica `REACT_APP_SUPABASE_ANON_KEY` nel file `.env.local`

### Tabelle non trovate
- **Causa**: SQL non eseguito
- **Soluzione**: Torna al punto 3 ed esegui lo script SQL

---

## 📚 Documentazione Completa

Per una guida dettagliata con spiegazioni approfondite:
→ **Vedi `/GUIDA_DEPLOYMENT.md`**

---

**Note:**
- Non committare mai il file `.env.local` su Git
- Usa variabili d'ambiente diverse per dev/prod
- Monitora l'uso su Dashboard Supabase → Reports
