# 📡 Edge Function Deployment Guide

Questa guida spiega come deployare la Edge Function `make-server-2a12511d` su Supabase.

---

## 🎯 Panoramica

La Edge Function gestisce tutte le operazioni CRUD per:
- ✅ Candidati (`candidates`)
- ✅ Valutazioni (`evaluations`)
- ✅ Sezioni di valutazione (`evaluation_sections`)
- ✅ Dimensioni di valutazione (`evaluation_dimensions`)
- ✅ Domande AI (`evaluation_questions`)

**Nome Function**: `make-server-2a12511d`
**Runtime**: Deno
**Framework**: Hono
**Autenticazione**: Service Role Key (backend) + Anon Key (frontend)

---

## 🚀 Metodo 1: Deploy via Supabase CLI (Raccomandato)

### Prerequisiti

```bash
# 1. Installa Node.js (se non già presente)
# Vai su https://nodejs.org e scarica l'ultima LTS

# 2. Installa Supabase CLI globalmente
npm install -g supabase

# 3. Verifica installazione
supabase --version
```

### Passo 1: Login a Supabase

```bash
# Login con il tuo account Supabase
supabase login

# Ti aprirà il browser per autenticarti
# Copia il token di accesso che ricevi
```

### Passo 2: Link al Progetto

```bash
# Link al progetto specifico
supabase link --project-ref evsymppxmhfvfgmkviij

# Ti chiederà la database password
# La trovi in: https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij/settings/database
```

### Passo 3: Deploy la Function

```bash
# Deploy della function specifica
supabase functions deploy make-server-2a12511d

# Output atteso:
# ✓ Function deployed successfully
# URL: https://evsymppxmhfvfgmkviij.supabase.co/functions/v1/make-server-2a12511d
```

### Passo 4: Imposta le Secrets (Environment Variables)

```bash
# Imposta la Service Role Key (importante!)
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

# Trova la Service Role Key qui:
# https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij/settings/api
# Cerca "service_role" → "secret"
```

### Passo 5: Test Deployment

```bash
# Test Health Check
curl https://evsymppxmhfvfgmkviij.supabase.co/functions/v1/make-server-2a12511d/health

# Output atteso: {"status":"ok"}
```

---

## 🌐 Metodo 2: Deploy Manuale dalla Dashboard

### Passo 1: Crea la Function

1. Vai a: https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij/functions
2. Clicca **Create a new function**
3. Inserisci:
   - **Name**: `make-server-2a12511d`
   - **Runtime**: Deno (default)

### Passo 2: Copia il Codice

1. Apri il file `/supabase/functions/server/index.tsx` nel tuo editor
2. Copia tutto il contenuto
3. Incollalo nell'editor della dashboard

### Passo 3: Deploy

1. Clicca **Deploy function**
2. Attendi il completamento (~ 30 secondi)

### Passo 4: Configura le Variabili d'Ambiente

1. Nella stessa pagina della function, vai a **Settings** o **Environment Variables**
2. Aggiungi:
   - **Key**: `SUPABASE_URL`
   - **Value**: `https://evsymppxmhfvfgmkviij.supabase.co`
3. Aggiungi:
   - **Key**: `SUPABASE_SERVICE_ROLE_KEY`
   - **Value**: (copia da https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij/settings/api)
4. Salva le modifiche

### Passo 5: Redeploy (se necessario)

Se hai modificato le env vars, potrebbe essere necessario redeployare:
1. Torna all'editor della function
2. Clicca **Deploy function** di nuovo

---

## 🔍 Verifica Deployment

### Test 1: Health Check

```bash
curl -X GET https://evsymppxmhfvfgmkviij.supabase.co/functions/v1/make-server-2a12511d/health \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2c3ltcHB4bWhmdmZnbWt2aWlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzODQ1NDksImV4cCI6MjA3Njk2MDU0OX0.u-tHPSxJDgvMZkOGWN_JKaVV49cWuA8Z0I02KHhF8Sc"
```

**Output Atteso:**
```json
{"status":"ok"}
```

### Test 2: GET Candidates

```bash
curl -X GET https://evsymppxmhfvfgmkviij.supabase.co/functions/v1/make-server-2a12511d/candidates \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2c3ltcHB4bWhmdmZnbWt2aWlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzODQ1NDksImV4cCI6MjA3Njk2MDU0OX0.u-tHPSxJDgvMZkOGWN_JKaVV49cWuA8Z0I02KHhF8Sc" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2c3ltcHB4bWhmdmZnbWt2aWlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzODQ1NDksImV4cCI6MjA3Njk2MDU0OX0.u-tHPSxJDgvMZkOGWN_JKaVV49cWuA8Z0I02KHhF8Sc"
```

**Output Atteso:**
```json
{
  "ok": true,
  "candidates": []
}
```

O con dati:
```json
{
  "ok": true,
  "candidates": [
    {
      "id": "test@example.com",
      "name": "Test User",
      "email": "test@example.com",
      "phone_number": "+39 340 123 4567",
      "cv_text": "...",
      "created_at": "2025-10-26T..."
    }
  ]
}
```

### Test 3: POST Test Candidate

```bash
curl -X POST https://evsymppxmhfvfgmkviij.supabase.co/functions/v1/make-server-2a12511d/candidates \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2c3ltcHB4bWhmdmZnbWt2aWlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzODQ1NDksImV4cCI6MjA3Njk2MDU0OX0.u-tHPSxJDgvMZkOGWN_JKaVV49cWuA8Z0I02KHhF8Sc" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2c3ltcHB4bWhmdmZnbWt2aWlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzODQ1NDksImV4cCI6MjA3Njk2MDU0OX0.u-tHPSxJDgvMZkOGWN_JKaVV49cWuA8Z0I02KHhF8Sc" \
  -d '{
    "name": "Test Candidate",
    "email": "test-deploy@example.com",
    "phone_number": "+39 340 999 8888",
    "cv_text": "Sample CV text",
    "linkedin_text": "",
    "job_offer_id": "test-job-1"
  }'
```

**Output Atteso:**
```json
{
  "ok": true,
  "candidate_id": "test-deploy@example.com"
}
```

---

## 🔧 Troubleshooting

### Errore: "Function not found" (404)

**Causa**: La function non è stata deployata o il nome è sbagliato

**Soluzione**:
1. Verifica in https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij/functions
2. Controlla che il nome sia esattamente: `make-server-2a12511d`
3. Redeploya la function

### Errore: "relation candidates does not exist"

**Causa**: Le tabelle del database non sono create

**Soluzione**:
1. Segui la guida `/docs/DATABASE_SETUP.md`
2. Esegui gli script SQL per creare le tabelle

### Errore: "permission denied" o "insufficient privileges"

**Causa**: La `SUPABASE_SERVICE_ROLE_KEY` non è configurata

**Soluzione**:
1. Vai a https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij/settings/api
2. Copia la **service_role key** (secret)
3. Imposta come environment variable nella function

### Errore: "Internal Server Error" (500)

**Causa**: Errore nel codice della function

**Soluzione**:
1. Controlla i logs: https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij/functions/logs
2. Cerca messaggi di errore specifici
3. Verifica che tutte le dipendenze siano corrette

### Errore: CORS

**Causa**: Il frontend non può chiamare la function

**Soluzione**:
Il codice include già configurazione CORS corretta:
```typescript
app.use("/*", cors({
  origin: "*",
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));
```

Se persiste, verifica che stai usando gli header corretti:
- `Authorization: Bearer <anon-key>`
- `apikey: <anon-key>`

---

## 📊 Monitoraggio

### Logs in Tempo Reale

Vai a: https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij/functions/logs

Filtra per: `make-server-2a12511d`

### Metriche Utili

La function logga automaticamente:
- ✅ Ogni richiesta ricevuta (con metodo e path)
- ✅ Successi di salvataggio dati
- ❌ Errori con stack trace
- 📊 Conteggi di record salvati/recuperati

Esempi di log:
```
[make-server-2a12511d] GET /candidates
[make-server-2a12511d] Retrieved 15 candidates
[make-server-2a12511d] POST /candidates
[make-server-2a12511d] Candidate saved successfully: test@example.com
```

---

## 🔐 Sicurezza

### RLS (Row Level Security)

La function usa `service_role_key` che bypassa RLS. Assicurati che:
1. La chiave sia configurata come **secret** (non visibile nel codice)
2. Le policy RLS siano configurate per proteggere l'accesso diretto alle tabelle
3. Il frontend usi solo `anon_key` per chiamare la function

### Best Practices

1. **Mai esporre** la `service_role_key` nel frontend
2. **Usa** sempre gli header corretti per l'autenticazione
3. **Valida** i dati in input prima di salvarli
4. **Monitora** i log per attività sospette

---

## 📚 Riferimenti

### Codice Sorgente
- **Function Code**: `/supabase/functions/server/index.tsx`
- **Database Schema**: `/docs/DATABASE_SETUP.md`
- **API Integration**: `/docs/API_INTEGRATION.md`

### Dashboard Links
- **Functions**: https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij/functions
- **Logs**: https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij/functions/logs
- **API Settings**: https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij/settings/api

### Documentazione Ufficiale
- **Supabase Edge Functions**: https://supabase.com/docs/guides/functions
- **Deno Deploy**: https://deno.com/deploy/docs
- **Hono Framework**: https://hono.dev/

---

## ✅ Checklist Pre-Deployment

Prima di deployare, verifica:

- [ ] Database tables create (`candidates`, `evaluations`, ecc.)
- [ ] Policy RLS configurate
- [ ] `SUPABASE_URL` impostato
- [ ] `SUPABASE_SERVICE_ROLE_KEY` impostato (secret!)
- [ ] Codice testato localmente (se possibile)
- [ ] Dipendenze corrette nel codice
- [ ] CORS configurato correttamente

---

**✨ Una volta deployata, la function gestirà automaticamente tutto il flusso di dati tra frontend e database!**
