# 🚀 Guida Rapida - Setup Completo Sistema

Questa guida ti aiuterà a configurare completamente il sistema di reclutamento con AI in **10 minuti**.

## ✅ Pre-requisiti

- Accesso al progetto Supabase: `evsymppxmhfvfgmkviij`
- Dashboard URL: https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij

---

## 📋 Passo 1: Verifica Tabelle Database (2 min)

### 1.1 Controlla se le tabelle esistono

Vai a: https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij/database/tables

Verifica che esistano queste tabelle:
- ✅ `candidates`
- ✅ `evaluations`
- ✅ `evaluation_sections`
- ✅ `evaluation_dimensions`
- ✅ `evaluation_questions`
- ✅ (Opzionale) `jobs`
- ✅ (Opzionale) `evidence_items`

### 1.2 Se le tabelle NON esistono

**Metodo A: Creazione Automatica tramite SQL Editor**

1. Apri: https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij/sql/new
2. Copia e incolla lo script SQL completo da `/docs/DATABASE_SETUP.md`
3. Clicca **RUN** per eseguire

**Metodo B: Creazione Manuale**

Segui la guida dettagliata in `/docs/DATABASE_SETUP.md` sezioni 1-8.

---

## 🚀 Passo 2: Deploy Edge Function (3 min)

### 2.1 Verifica se la Edge Function esiste

Vai a: https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij/functions

Cerca la function: `make-server-2a12511d`

### 2.2 Se la Edge Function NON esiste, creala

#### Opzione A: Deploy da Supabase CLI (Raccomandato)

```bash
# 1. Installa Supabase CLI (se non già fatto)
npm install -g supabase

# 2. Login a Supabase
supabase login

# 3. Link al progetto
supabase link --project-ref evsymppxmhfvfgmkviij

# 4. Deploy la function
supabase functions deploy make-server-2a12511d
```

#### Opzione B: Deploy Manuale dalla Dashboard

1. Vai a: https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij/functions
2. Clicca **Create a new function**
3. Nome: `make-server-2a12511d`
4. Copia il codice da `/supabase/functions/server/index.tsx`
5. Clicca **Deploy**

### 2.3 Configura le variabili d'ambiente della Edge Function

1. Vai alle impostazioni della function
2. Aggiungi queste variabili (se non presenti):
   - `SUPABASE_URL`: `https://evsymppxmhfvfgmkviij.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY`: (trovalo in Settings → API → service_role key)

---

## 🧪 Passo 3: Test Connessione (2 min)

### 3.1 Usa il Panel di Test Integrato

1. Apri l'applicazione dashboard
2. Vai alla tab **🔧 Test Connessione**
3. Clicca **Esegui Test Completo**
4. Verifica che tutti i test siano ✅ verdi

### 3.2 Test Manuale con cURL

```bash
# Test 1: Health Check
curl https://evsymppxmhfvfgmkviij.supabase.co/functions/v1/make-server-2a12511d/health \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2c3ltcHB4bWhmdmZnbWt2aWlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzODQ1NDksImV4cCI6MjA3Njk2MDU0OX0.u-tHPSxJDgvMZkOGWN_JKaVV49cWuA8Z0I02KHhF8Sc" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2c3ltcHB4bWhmdmZnbWt2aWlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzODQ1NDksImV4cCI6MjA3Njk2MDU0OX0.u-tHPSxJDgvMZkOGWN_JKaVV49cWuA8Z0I02KHhF8Sc"

# Risultato atteso: {"status":"ok"}

# Test 2: Lettura Candidati
curl https://evsymppxmhfvfgmkviij.supabase.co/functions/v1/make-server-2a12511d/candidates \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2c3ltcHB4bWhmdmZnbWt2aWlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzODQ1NDksImV4cCI6MjA3Njk2MDU0OX0.u-tHPSxJDgvMZkOGWN_JKaVV49cWuA8Z0I02KHhF8Sc" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2c3ltcHB4bWhmdmZnbWt2aWlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzODQ1NDksImV4cCI6MjA3Njk2MDU0OX0.u-tHPSxJDgvMZkOGWN_JKaVV49cWuA8Z0I02KHhF8Sc"

# Risultato atteso: {"ok":true,"candidates":[...]}
```

---

## 🎯 Passo 4: Test Candidatura Completa (3 min)

### 4.1 Apri il form candidato

1. Vai all'applicazione
2. Tab **Gestione Ruoli**
3. Clicca su un ruolo → **Visualizza Landing Page**
4. Clicca **Candidati Ora**

### 4.2 Compila il form

**Step 1: Informazioni**
- Nome: `Test Candidate`
- Email: `test@example.com`
- Telefono: `+39 340 123 4567`
- LinkedIn (opzionale): `https://linkedin.com/in/test`

**Step 2: Documenti**
- Carica un CV PDF (qualsiasi PDF di test)
- ✅ Accetta consenso GDPR
- Clicca **Invia Candidatura**

### 4.3 Verifica il Risultato

**Scenario A: Tutto Funziona ✅**
- Vedi messaggio "Candidatura Inviata!"
- Console mostra: "Candidate saved to database successfully"
- SmartReq API risponde con evaluation_id

**Scenario B: Errore SmartReq API ⚠️**
- SmartReq potrebbe non rispondere o dare errore
- **Ma il candidato viene comunque salvato nel DB**
- Verifica in tab "Tutti i Candidati" o "🔧 Test Connessione"

**Scenario C: Errore Database ❌**
- Messaggio di errore nel form
- Controlla tab "🔧 Test Connessione"
- Rivedi Passo 1 e 2

---

## 📊 Passo 5: Visualizza i Dati (1 min)

### 5.1 Dashboard Analytics

1. Tab **Statistiche**
2. Attiva **Dati Reali (Supabase)** nel toggle
3. Se ci sono candidati, vedrai:
   - Numero candidati salvati
   - Numero valutazioni ricevute

### 5.2 Visualizza Tutti i Candidati

1. Tab **Tutti i Candidati**
2. Vedi la lista completa
3. Clicca su un candidato per vedere i dettagli

### 5.3 Verifica Direttamente nel Database

https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij/editor

Query SQL utili:

```sql
-- Conta candidati
SELECT COUNT(*) FROM candidates;

-- Ultimi 10 candidati
SELECT * FROM candidates 
ORDER BY created_at DESC 
LIMIT 10;

-- Conta valutazioni
SELECT COUNT(*) FROM evaluations;

-- Valutazioni complete con dettagli
SELECT 
  e.id,
  e.candidate_id,
  e.total_score,
  e.timestamp_utc,
  COUNT(DISTINCT s.id) as sections_count,
  COUNT(DISTINCT d.id) as dimensions_count
FROM evaluations e
LEFT JOIN evaluation_sections s ON s.evaluation_id = e.id
LEFT JOIN evaluation_dimensions d ON d.evaluation_section_id = s.id
GROUP BY e.id
ORDER BY e.timestamp_utc DESC;
```

---

## 🔧 Troubleshooting Rapido

### Problema: "Edge Function not found" o 404

**Soluzione:**
1. Verifica che la function esista: https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij/functions
2. Se non esiste, segui Passo 2.2
3. Se esiste ma da errore, verifica le env variables (Passo 2.3)

### Problema: "relation candidates does not exist"

**Soluzione:**
1. Le tabelle non sono create → segui Passo 1.2
2. Esegui lo script SQL completo da `/docs/DATABASE_SETUP.md`

### Problema: "permission denied" o 401/403

**Soluzione:**
1. Verifica le RLS policies nelle tabelle
2. Esegui le policy SQL da `/docs/DATABASE_SETUP.md`
3. Verifica che la Edge Function usi `SUPABASE_SERVICE_ROLE_KEY`

### Problema: SmartReq API non risponde

**Soluzione:**
1. Questo è normale se l'API è in sleep/cold start
2. **Il candidato viene comunque salvato nel database**
3. La valutazione AI arriverà in un secondo momento
4. Verifica che il candidato sia salvato: tab "Tutti i Candidati"

### Problema: Dati non si vedono nel dashboard

**Soluzione:**
1. Verifica di essere in modalità **Dati Reali (Supabase)**
2. Clicca il pulsante refresh/refetch
3. Controlla la console browser per errori
4. Esegui test in tab "🔧 Test Connessione"

---

## 📚 Link Utili

### Dashboard Supabase
- **Progetto**: https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij
- **Database Tables**: https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij/database/tables
- **SQL Editor**: https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij/sql/new
- **Edge Functions**: https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij/functions
- **Table Editor**: https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij/editor
- **API Settings**: https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij/settings/api
- **Function Logs**: https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij/functions/logs

### Documentazione Progetto
- **Setup Database Completo**: `/docs/DATABASE_SETUP.md`
- **Modello Dati**: `/docs/DATA_MODEL.md`
- **Esempi API**: `/docs/USAGE_EXAMPLES.md`
- **Troubleshooting**: `/docs/TROUBLESHOOTING.md`
- **Integrazione API**: `/docs/API_INTEGRATION.md`

### API Endpoints
- **SmartReq API**: `https://primary-production-6beb.up.railway.app/webhook/smartreq`
- **Edge Function Base**: `https://evsymppxmhfvfgmkviij.supabase.co/functions/v1/make-server-2a12511d`

---

## ✨ Prossimi Passi

Una volta completato il setup:

1. **Testa con candidati reali**: Usa il form pubblico con CV veri
2. **Monitora le valutazioni**: Controlla le risposte dell'AI in tempo reale
3. **Personalizza i ruoli**: Aggiungi nuove posizioni con criteri specifici
4. **Condividi link**: Usa la funzione "Condividi" per diffondere l'annuncio
5. **Analizza i dati**: Usa il dashboard per insights sui candidati

---

## 🆘 Serve Aiuto?

1. Consulta `/docs/TROUBLESHOOTING.md` per problemi comuni
2. Controlla i log della Edge Function
3. Verifica la console del browser per errori JavaScript
4. Usa il panel "🔧 Test Connessione" per diagnostica automatica

**Buon reclutamento! 🚀**
