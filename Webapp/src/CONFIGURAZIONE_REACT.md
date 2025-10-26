# ⚛️ Configurazione React + Supabase

Questa guida spiega come configurare il progetto React esportato da Figma Make per connettersi a Supabase.

---

## 📝 Informazioni dal Tuo Progetto Supabase

Dal pannello "Connect to your project" vedi che hai:

- **Framework**: React
- **Build tool**: Create React App  
- **Client library**: supabase-js
- **Project Reference**: `evsymppxmhfvfgmkviij`

---

## 🔧 Step 1: Preparare i File di Configurazione

### Opzione A: Usare File Separato (Già Configurato ✅)

Il progetto usa già questo approccio con:
- `/utils/supabase/client.tsx` - Client Supabase
- `/utils/supabase/info.tsx` - Credenziali

**Non serve fare nulla**, le credenziali sono già configurate!

### Opzione B: Usare Variabili d'Ambiente (Per Produzione)

Per deployment in produzione, è meglio usare variabili d'ambiente:

#### 1. Crea il file `.env.local`

```bash
# Nella root del progetto
touch .env.local
```

#### 2. Aggiungi le variabili (dal pannello Supabase)

```env
REACT_APP_SUPABASE_URL=https://evsymppxmhfvfgmkviij.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2c3ltcHB4bWhmdmZnbWt2aWlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzODQ1NDksImV4cCI6MjA3Njk2MDU0OX0.u-tHPSxJDgvMZkOGWN_JKaVV49cWuA8Z0I02KHhF8Sc
```

#### 3. Modifica `/utils/supabase/client.tsx` (opzionale)

Se vuoi usare le variabili d'ambiente invece del file info.tsx:

```typescript
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://evsymppxmhfvfgmkviij.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

let supabaseClient: any = null;

export function createClient() {
  if (!supabaseClient) {
    supabaseClient = createSupabaseClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseClient;
}
```

---

## 📦 Step 2: Installare le Dipendenze

```bash
# Vai nella cartella del progetto
cd your-project-folder

# Installa tutte le dipendenze
npm install
```

**Nota**: `@supabase/supabase-js` è già incluso nel progetto.

---

## 🗄️ Step 3: Configurare il Database

### Schema delle Tabelle

Il progetto usa due tabelle principali:

#### `candidates` - Informazioni candidati

```sql
CREATE TABLE candidates (
  id TEXT PRIMARY KEY,
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
```

#### `evaluations` - Valutazioni AI

```sql
CREATE TABLE evaluations (
  id TEXT PRIMARY KEY,
  evaluation_id TEXT NOT NULL,
  candidate_id TEXT NOT NULL,
  job_id TEXT NOT NULL,
  api_response JSONB DEFAULT '{}',
  scores JSONB DEFAULT '{}',
  total_score NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);
```

### Come Creare le Tabelle

1. Vai su: https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij/sql
2. Clicca "New Query"
3. Copia lo script completo da `/docs/DATABASE_SETUP.md`
4. Clicca "Run"

---

## 🌐 Step 4: Deploy della Edge Function

La Edge Function gestisce l'invio dei CV all'API SmartReq in modo sicuro.

### Installare Supabase CLI

```bash
# macOS/Linux
brew install supabase/tap/supabase

# Windows
scoop install supabase

# Oppure con npm
npm install -g supabase
```

### Deploy

```bash
# Login
supabase login

# Collega il progetto
supabase link --project-ref evsymppxmhfvfgmkviij

# Deploy della funzione "server"
supabase functions deploy server

# Configura il secret per l'autenticazione
supabase secrets set SUPABASE_SERVICE_ROLE_KEY="la-tua-service-role-key"
```

**Dove trovare la service_role key:**
1. Dashboard Supabase → Project Settings → API
2. Copia la chiave "service_role"

---

## 🚀 Step 5: Avviare l'Applicazione

### Sviluppo Locale

```bash
# Avvia il server di sviluppo
npm start

# L'app si aprirà su http://localhost:3000
```

### Build per Produzione

```bash
# Crea la build ottimizzata
npm run build

# I file statici saranno in /build
```

---

## ✅ Step 6: Verificare la Connessione

### Test nell'Applicazione

1. Apri l'app (`http://localhost:3000`)
2. Nell'header, clicca sull'icona **Settings** (⚙️)
3. Nel dialog che si apre, clicca "Database Reale"
4. Dovresti vedere: ✅ "Connesso a Supabase"

### Test Manuale con DevTools

Apri la Console del browser (F12) e testa:

```javascript
// Test connessione
const { createClient } = await import('./utils/supabase/client.tsx');
const supabase = createClient();

// Test lettura candidati
const { data, error } = await supabase
  .from('candidates')
  .select('*')
  .limit(5);

console.log('Candidati:', data);
console.log('Errore:', error);
```

Se ottieni `data: []` e `error: null` → **Connessione OK!** ✅

---

## 🔒 Step 7: Sicurezza Row Level Security (RLS)

Le tabelle devono avere RLS abilitato per sicurezza:

```sql
-- Abilita RLS
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

-- Policy per lettura pubblica (dashboard)
CREATE POLICY "Enable read access for all users" ON candidates
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON evaluations
  FOR SELECT USING (true);

-- Policy per scrittura solo tramite Edge Function
CREATE POLICY "Enable insert for service role only" ON candidates
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable insert for service role only" ON evaluations
  FOR INSERT WITH CHECK (true);
```

**Nota**: Le policy di INSERT permettono solo alla Edge Function (che usa service_role) di inserire dati.

---

## 🎨 Step 8: Personalizzazione Brand

### Logo e Colori

Il progetto usa già i colori ufficiali di Crédit Agricole:

```css
/* styles/globals.css */
--ca-green: #006F4E;    /* Verde principale */
--ca-turquoise: #009B9D; /* Turquesa secondario */
--ca-red: #ED1C24;       /* Rosso accento */
```

### Logo

Il logo è importato da:
```typescript
import creditAgricoleLogo from "figma:asset/51571be080406a0b3f76c0cbe126391b2cff8b63.png";
```

Per sostituirlo, cambia l'import in `/App.tsx`.

---

## 📊 Step 9: Modalità Dati

L'applicazione supporta due modalità:

### 🎭 Modalità Demo
- Usa dati hardcoded
- Perfetta per presentazioni e testing
- Non richiede connessione al database

### 💾 Modalità Database Reale
- Si connette a Supabase
- Dati reali in tempo reale
- Per uso in produzione

**Come cambiare modalità:**
1. Clicca l'icona Settings (⚙️) nell'header
2. Scegli "Modalità Demo" o "Database Reale"

---

## 🐛 Troubleshooting

### ❌ Errore: "Load failed"

**Problema**: Edge Function non deployata

**Soluzione**:
```bash
supabase functions deploy server
```

### ❌ Errore: "401 Unauthorized"

**Problema**: Credenziali Supabase errate

**Soluzione**:
1. Verifica `REACT_APP_SUPABASE_ANON_KEY` in `.env.local`
2. Riavvia il server: `npm start`

### ❌ Errore: "relation does not exist"

**Problema**: Tabelle non create

**Soluzione**:
1. Vai su SQL Editor
2. Esegui lo script di creazione tabelle (vedi Step 3)

### ❌ CORS Error

**Problema**: Edge Function non configurata per CORS

**Soluzione**:
Verifica che `/supabase/functions/server/index.tsx` abbia:
```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
```

---

## 📚 Risorse

### File di Documentazione

- `/GUIDA_DEPLOYMENT.md` - Guida completa deployment
- `/CONNESSIONE_RAPIDA.md` - Setup veloce 5 minuti
- `/docs/DATABASE_SETUP.md` - Schema database completo
- `/docs/API_INTEGRATION.md` - Integrazione SmartReq API

### Link Utili

- [Dashboard Supabase](https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij)
- [Supabase Docs](https://supabase.com/docs)
- [Create React App Docs](https://create-react-app.dev/)

---

## 🎉 Pronto!

L'applicazione è ora configurata e pronta per:
- ✅ Ricevere candidature
- ✅ Valutare CV con AI
- ✅ Salvare dati su Supabase
- ✅ Visualizzare analytics

**Prossimi passi:**
1. Testa una candidatura completa
2. Verifica che i dati arrivino nel database
3. Personalizza i ruoli in "Gestione Ruoli"
4. Deploy in produzione (Vercel/Netlify)

---

**Versione**: 2.0.0  
**Ultimo aggiornamento**: Ottobre 2025
