# 📚 Documentazione SmartReq Analytics Dashboard

Benvenuto nella documentazione completa del sistema di reclutamento SmartReq per Crédit Agricole.

## 📖 Indice Documenti

### [API_INTEGRATION.md](./API_INTEGRATION.md)
Documentazione completa dell'integrazione tra:
- API SmartReq per la valutazione AI dei candidati
- Supabase per database e persistenza
- Backend server con Hono.js
- KV Store per archiviazione dati

**Argomenti trattati:**
- Architettura del sistema
- Credenziali Supabase
- Endpoint API SmartReq
- Routes del server backend
- Flusso di candidatura
- Modalità Demo vs Live
- Sicurezza e autenticazione
- Struttura dati

### [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
Guida completa alla risoluzione dei problemi comuni.

**Problemi risolti:**
- ❌ Errore 401: Unauthorized
- ❌ Tabella KV Store mancante
- ❌ Edge Function non deployata
- ❌ Dati non si aggiornano
- 🔧 Debugging generale
- 🧪 Test manuali con curl/Postman

## 🚀 Quick Start

### 1. Verifica Setup Supabase

Prima di utilizzare la modalità "Dati Reali", assicurati che:

✅ La tabella `kv_store_2a12511d` esista nel database  
✅ La Edge Function `make-server-2a12511d` sia deployata  
✅ Gli header di autenticazione siano configurati correttamente

### 2. Modalità Demo (Default)

Il dashboard parte in modalità Demo con dati hardcoded. Perfetto per:
- Presentazioni
- Pitch a clienti
- Test dell'interfaccia
- Demo senza bisogno di backend

**Come usarla:**
- Il toggle "Modalità Dati" è già in Demo di default
- Tutti i grafici e KPI mostrano dati di esempio
- Non richiede connessione a Supabase

### 3. Modalità Dati Reali

Per visualizzare candidature e valutazioni reali da Supabase:

1. Nel dashboard, trova il componente "Modalità Dati"
2. Clicca su "Dati Reali (Supabase)"
3. Se vedi un errore, segui la [Guida al Troubleshooting](./TROUBLESHOOTING.md)

## 🔑 Configurazione Supabase

### Credenziali (già configurate)

```
URL: https://evsymppxmhfvfgmkviij.supabase.co
Project ID: evsymppxmhfvfgmkviij
```

Le chiavi sono in `/utils/supabase/info.tsx`

### Setup Iniziale Database

**IMPORTANTE:** Il database richiede due tabelle principali: `candidates` e `evaluations`.

Per lo script SQL completo con indici, foreign keys e policy RLS, consulta:
📄 **`/docs/DATABASE_SETUP.md`** - Guida completa al setup del database

Script rapido per iniziare:

```sql
-- Crea la tabella candidati
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

-- Crea la tabella valutazioni
CREATE TABLE IF NOT EXISTS evaluations (
  id TEXT NOT NULL PRIMARY KEY,
  evaluation_id TEXT NOT NULL,
  candidate_id TEXT NOT NULL,
  job_id TEXT NOT NULL,
  api_response JSONB DEFAULT '{}',
  scores JSONB DEFAULT '{}',
  total_score NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

Vai al [SQL Editor](https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij/sql/new) per eseguire lo script.

### Deploy Edge Function

La Edge Function è in `/supabase/functions/server/index.tsx`

**Deploy tramite Supabase CLI:**
```bash
supabase functions deploy make-server-2a12511d
```

## 🎯 Flusso Utente

### Per i Candidati

1. **Accesso:** Visita `/apply/{job_id}` (es. `/apply/1`)
2. **Landing Page:** Visualizza informazioni sul ruolo
3. **Form Step 1:** Inserisci dati personali (nome, email, telefono, link social)
4. **Form Step 2:** Carica CV PDF e accetta consenso GDPR
5. **Invio:** Il sistema:
   - Estrae testo dal CV usando PDF.js
   - Invia i dati all'API SmartReq per la valutazione AI
   - Salva candidato e valutazione in Supabase
6. **Conferma:** Ricevi messaggio di conferma

**Privacy:** I candidati NON vedono mai i criteri di valutazione o i pesi.

### Per HR / Hiring Manager

1. **Dashboard:** Accedi al dashboard analytics
2. **Modalità:** Scegli tra Demo o Dati Reali
3. **Visualizzazione:**
   - 4 KPI principali (totale candidati, media punteggi, ecc.)
   - Distribuzione dei punteggi (istogramma)
   - Radar chart delle dimensioni di valutazione
   - Funnel del processo di candidatura
   - Tabella top candidati con dettagli
4. **Filtri:** Filtra per ruolo, punteggio, data
5. **Dettagli:** Clicca su un candidato per vedere valutazione completa
6. **Gestione Ruoli:** Aggiungi nuovi ruoli e condividili tramite link/email/WhatsApp

## 🔒 Sicurezza & Privacy

### Per i Candidati
- ✅ I dati sono protetti con GDPR
- ✅ CV e dati personali crittografati
- ❌ NON possono vedere criteri di valutazione
- ❌ NON possono vedere pesi delle dimensioni
- ❌ NON possono vedere valutazioni di altri candidati

### Per HR
- ✅ Accesso completo a tutte le valutazioni
- ✅ Visualizzazione criteri e pesi
- ✅ Export dati (futuro)
- ⚠️ Credenziali protette (service role key solo su server)

## 🎨 Design System

### Colori Crédit Agricole

```css
Verde Oscuro: #006F4E (primary, bottoni principali)
Turquesa: #009B9D (accenti, highlight)
Rosso: #ED1C24 (alert, warning)
```

### Logo
Importato da Figma: `figma:asset/51571be080406a0b3f76c0cbe126391b2cff8b63.png`

## 📊 Struttura Componenti

### Dashboard (`/App.tsx`)
- `KPICard` - Metriche principali
- `ScoreDistributionChart` - Distribuzione punteggi (Recharts)
- `DimensionsRadarChart` - Radar delle dimensioni
- `CandidateFunnelChart` - Funnel processo
- `TopCandidatesTable` - Tabella candidati
- `DataModeToggle` - Toggle Demo/Live
- `FilterBar` - Filtri avanzati

### Candidati
- `CandidateLandingPage` - Landing page pubblica
- `CandidateApplicationForm` - Form 2-step con upload CV
- `PublicJobApplication` - Wrapper pubblico
- `CandidateDetailDialog` - Dettagli candidato (HR)
- `CandidatePreviewDialog` - Preview rapida

### Ruoli
- `RolesManagement` - Gestione ruoli
- `AddRoleDialog` - Aggiungi nuovo ruolo
- `ShareRoleDialog` - Condividi ruolo (link/email/WhatsApp)
- `RolePreviewDialog` - Anteprima ruolo

### Utility
- `SupabaseErrorHelper` - Aiuto errori Supabase (NEW!)
- `AllCandidatesView` - Vista tutti candidati

## 🧪 Testing

### Test Locale

1. **Test Form Candidatura:**
   ```
   Vai a: /apply/1
   Compila: dati fittizi
   CV: usa un PDF di test
   Verifica: console del browser per conferma salvataggio
   ```

2. **Test API Diretta:**
   ```bash
   curl -X GET \
     'https://evsymppxmhfvfgmkviij.supabase.co/functions/v1/make-server-2a12511d/candidates' \
     -H 'Authorization: Bearer {publicAnonKey}' \
     -H 'apikey: {publicAnonKey}'
   ```

3. **Test Modalità Dati:**
   - Avvia in Demo → verifica dati hardcoded
   - Switcha a Live → verifica caricamento da Supabase
   - In caso di errore → usa SupabaseErrorHelper

## 📈 Roadmap & TODO

### Completato ✅
- [x] Integrazione API SmartReq
- [x] Backend Supabase con KV Store
- [x] Form candidatura 2-step
- [x] Dashboard analytics completo
- [x] Modalità Demo/Live
- [x] Gestione ruoli
- [x] Condivisione ruoli
- [x] Error handling migliorato
- [x] Documentazione completa

### Future Features 🚀
- [ ] Export dati in CSV/Excel
- [ ] Email automatiche ai candidati
- [ ] Notifiche in-app
- [ ] Filtri avanzati salvati
- [ ] Commenti HR su candidati
- [ ] Confronto candidati side-by-side
- [ ] Integrazione calendario per colloqui
- [ ] Analytics avanzate (trend temporali)

## 🆘 Supporto

### Hai un problema?

1. **Errore 401:** Vai a [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) → Sezione "Errore 401"
2. **Tabella mancante:** [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) → "Tabella non trovata"
3. **Dati non si aggiornano:** [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) → "I dati non si aggiornano"
4. **Altro:** Controlla console browser (F12) e cerca errori

### Link Utili

- [Supabase Dashboard](https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij)
- [Database Tables](https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij/database/tables)
- [Edge Functions](https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij/functions)
- [SQL Editor](https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij/sql/new)

### Contatti Tecnici

- Documentazione Supabase: https://supabase.com/docs
- Status Supabase: https://status.supabase.com/
- API SmartReq: https://primary-production-6beb.up.railway.app/

---

**Ultima modifica:** 26 Ottobre 2025  
**Versione:** 1.0.0  
**Autore:** SmartReq Team per Crédit Agricole
