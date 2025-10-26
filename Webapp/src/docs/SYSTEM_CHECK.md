# ✅ System Health Check - Checklist Rapida

Usa questa checklist per verificare rapidamente che tutto funzioni.

---

## 📋 Pre-Flight Checklist

### 1. Database Supabase ✅

Vai a: https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij/database/tables

**Verifica che esistano:**
- [ ] `candidates` table
- [ ] `evaluations` table
- [ ] `evaluation_sections` table
- [ ] `evaluation_dimensions` table
- [ ] `evaluation_questions` table
- [ ] (Opzionale) `jobs` table
- [ ] (Opzionale) `evidence_items` table

**Se mancano:** Segui `/docs/DATABASE_SETUP.md`

---

### 2. Edge Function Deployment ✅

Vai a: https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij/functions

**Verifica che esista:**
- [ ] Function: `make-server-2a12511d`
- [ ] Status: **deployed** (verde)
- [ ] Recent invocations visibili

**Verifica Environment Variables:**
- [ ] `SUPABASE_URL` = `https://evsymppxmhfvfgmkviij.supabase.co`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` = (secret configurato)

**Se manca o non funziona:** Segui `/docs/EDGE_FUNCTION_DEPLOYMENT.md`

---

### 3. API Connectivity ✅

**Test 1: Health Check**

```bash
curl https://evsymppxmhfvfgmkviij.supabase.co/functions/v1/make-server-2a12511d/health
```

✅ **Aspettato**: `{"status":"ok"}`  
❌ **Se fallisce**: Function non deployata o non raggiungibile

**Test 2: GET Candidates**

```bash
curl https://evsymppxmhfvfgmkviij.supabase.co/functions/v1/make-server-2a12511d/candidates \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2c3ltcHB4bWhmdmZnbWt2aWlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzODQ1NDksImV4cCI6MjA3Njk2MDU0OX0.u-tHPSxJDgvMZkOGWN_JKaVV49cWuA8Z0I02KHhF8Sc"
```

✅ **Aspettato**: `{"ok":true,"candidates":[...]}`  
❌ **Se fallisce**: Problemi con tabelle o RLS policies

**Test 3: POST Test Candidate**

```bash
curl -X POST https://evsymppxmhfvfgmkviij.supabase.co/functions/v1/make-server-2a12511d/candidates \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2c3ltcHB4bWhmdmZnbWt2aWlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzODQ1NDksImV4cCI6MjA3Njk2MDU0OX0.u-tHPSxJDgvMZkOGWN_JKaVV49cWuA8Z0I02KHhF8Sc" \
  -d '{
    "name": "Health Check Test",
    "email": "healthcheck@test.com",
    "phone_number": "+39 340 000 0000",
    "job_offer_id": "test",
    "cv_text": "Test CV"
  }'
```

✅ **Aspettato**: `{"ok":true,"candidate_id":"healthcheck@test.com"}`  
❌ **Se fallisce**: Problemi con insert permissions

---

### 4. Frontend Application ✅

Apri l'applicazione web.

**Dashboard Tab:**
- [ ] Dashboard si carica senza errori
- [ ] KPI cards visibili
- [ ] Grafici renderizzati

**Test Connessione Tab (🔧):**
- [ ] Tab "🔧 Test Connessione" presente
- [ ] Clicca "Esegui Test Completo"
- [ ] Tutti i test ritornano ✅ verde

**Gestione Ruoli Tab:**
- [ ] Lista ruoli visibile
- [ ] Puoi creare nuovo ruolo
- [ ] Puoi visualizzare landing page
- [ ] Puoi condividere link

**Modalità Dati:**
- [ ] Toggle "Demo / Dati Reali" funziona
- [ ] In modalità "Dati Reali", si connette a Supabase
- [ ] Mostra conteggio candidati e valutazioni

---

### 5. Candidate Application Flow ✅

**Step 1: Landing Page**
- [ ] Vai a tab "Gestione Ruoli"
- [ ] Scegli un ruolo → "Visualizza Landing Page"
- [ ] Landing page si carica con design Crédit Agricole
- [ ] Bottone "Candidati Ora" funziona

**Step 2: Form - Informazioni**
- [ ] Form Step 1 visibile
- [ ] Campi: Nome, Email, Telefono obbligatori
- [ ] Link opzionali: LinkedIn, GitHub, Website, Instagram
- [ ] Bottone "Continua al Passo 2" si abilita quando valido

**Step 3: Form - Documenti**
- [ ] Upload CV (PDF) funziona
- [ ] Upload LinkedIn PDF (opzionale) funziona
- [ ] Checkbox consenso GDPR presente
- [ ] Bottone "Invia Candidatura" si abilita quando valido

**Step 4: Submission**
- [ ] Click "Invia" → mostra "Analisi PDF..."
- [ ] Poi mostra "Invio in corso..."
- [ ] Console mostra: "Candidate saved to database successfully"
- [ ] Redirect a pagina "Candidatura Inviata!"

**Step 5: Verifica Database**
- [ ] Torna al dashboard
- [ ] Tab "Tutti i Candidati"
- [ ] Il nuovo candidato appare nella lista
- [ ] Puoi aprire i dettagli candidato

---

### 6. SmartReq API Integration ✅

**Test Diretto:**

```bash
curl -X POST https://primary-production-6beb.up.railway.app/webhook/smartreq \
  -H "Content-Type: application/json" \
  -d '{
    "name": "API Test",
    "phone_number": "+39 340 999 9999",
    "email": "apitest@example.com",
    "cv": "Backend Engineer with 5 years experience in Java and microservices",
    "job_offer": {
      "id": "test-1",
      "title": "Backend Engineer",
      "description": "Test position",
      "company_id": "test",
      "scoring_scale": "1–5",
      "rubric": "1=Insufficient | 2=Basic | 3=Solid | 4=Strong | 5=Exceptional",
      "eligibility_filters": ["5+ years experience"],
      "weights": {
        "professional_experience": 0.30,
        "technical_skills": 0.35,
        "motivation": 0.15,
        "education_learning": 0.10,
        "soft_skills_behavioral": 0.10
      },
      "created_at": "2025-10-26T10:00:00Z",
      "updated_at": "2025-10-26T10:00:00Z"
    }
  }'
```

✅ **Aspettato**: 
```json
{
  "ok": true,
  "candidate_id": "apitest@example.com",
  "evaluation_id": "...",
  "received": {
    "cv": true,
    "linkedin": false
  }
}
```

⚠️ **Se timeout/500**: Normale, API potrebbe essere in cold start. Riprova.

---

## 🔍 Diagnostica Rapida

### Problema: Dashboard non carica dati

**Check:**
1. Console browser → cerca errori JavaScript
2. Network tab → verifica chiamate API
3. Tab "🔧 Test Connessione" → esegui test
4. Modalità dati → assicurati sia su "Dati Reali (Supabase)"

### Problema: Form candidatura non salva

**Check:**
1. Console browser durante submit
2. Cerca errore "Failed to save candidate"
3. Verifica che Edge Function sia deployed
4. Test manuale POST `/candidates` con cURL

### Problema: "relation does not exist"

**Check:**
1. Tabelle create? → https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij/database/tables
2. RLS policies configurate? → Check in table settings
3. Service Role Key configurata nella Edge Function?

### Problema: "401 Unauthorized" o "403 Forbidden"

**Check:**
1. `publicAnonKey` corretto in `/utils/supabase/info.tsx`?
2. RLS policies permettono accesso?
3. Headers corretti in fetch? (`Authorization` + `apikey`)

---

## 📊 Success Criteria

### ✅ Sistema Completamente Funzionante:

- [x] Tutte le tabelle create
- [x] Edge Function deployed e raggiungibile
- [x] Health check ritorna `{"status":"ok"}`
- [x] GET /candidates ritorna array (anche vuoto)
- [x] POST /candidates salva correttamente
- [x] Dashboard mostra dati (se presenti)
- [x] Form candidatura completa tutto il flusso
- [x] Candidati visibili in "Tutti i Candidati"
- [x] SmartReq API risponde (o almeno il candidato viene salvato)

### ⚠️ Sistema Parzialmente Funzionante (Accettabile):

- [x] Database e Edge Function OK
- [x] Candidati vengono salvati
- [ ] SmartReq API potrebbe non rispondere sempre (normale, cold start)
- [x] Valutazioni possono arrivare in differita

### ❌ Sistema Non Funzionante (Richiede Fix):

- [ ] Tabelle non esistono
- [ ] Edge Function 404/500
- [ ] Impossibile salvare candidati
- [ ] Dashboard sempre in errore

---

## 🛠️ Tools di Diagnostica

### 1. Browser DevTools

**Console:**
- Messaggi "Candidate saved to database successfully" = OK
- Errori rossi = problema

**Network Tab:**
- Cerca chiamate a `make-server-2a12511d`
- Status 200 = OK
- Status 404 = Function non trovata
- Status 500 = Errore server

### 2. Supabase Dashboard Logs

https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij/functions/logs

Filtra per: `make-server-2a12511d`

Cerca:
- "Candidate saved successfully" = OK
- "Error saving candidate" = problema

### 3. SQL Query Direct

https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij/editor

```sql
-- Verifica candidati
SELECT * FROM candidates ORDER BY created_at DESC LIMIT 10;

-- Verifica valutazioni
SELECT * FROM evaluations ORDER BY timestamp_utc DESC LIMIT 10;

-- Conta record
SELECT 
  (SELECT COUNT(*) FROM candidates) as candidates_count,
  (SELECT COUNT(*) FROM evaluations) as evaluations_count;
```

### 4. Panel Test Integrato

Dentro l'app → Tab "🔧 Test Connessione" → "Esegui Test Completo"

Mostra in tempo reale:
- ✅ Health Check
- ✅ Tabella Candidates
- ✅ Tabella Evaluations
- ✅ Salvataggio Test
- ✅ Lettura Dati

---

## 📞 Next Steps se Tutto Funziona

1. **Test con CV Reali**: Usa PDF veri per testare SmartReq
2. **Crea Ruoli Personalizzati**: Aggiungi posizioni specifiche
3. **Invita Candidati**: Condividi link della landing page
4. **Monitora Dashboard**: Controlla le valutazioni in arrivo
5. **Analizza Insights**: Usa grafici per decisioni di hiring

---

## 🆘 Ancora Problemi?

1. ✅ Segui `/docs/QUICK_START.md` passo per passo
2. ✅ Leggi `/docs/TROUBLESHOOTING.md` per problemi comuni
3. ✅ Controlla logs Supabase per errori specifici
4. ✅ Verifica che TUTTE le env variables siano configurate

---

**Sistema testato e funzionante = Pronto per il reclutamento! 🚀**
