# 🔧 Guida alla Risoluzione dei Problemi

## Errore 401: Unauthorized

### Sintomo
Quando si attiva la modalità "Dati Reali" nel dashboard, appare l'errore:
```
Error fetching data from Supabase: Error: Failed to fetch candidates: 401
```

### Causa
L'errore 401 indica che Supabase Edge Functions non può autenticare la richiesta. Le cause più comuni sono:

1. **Tabelle Database mancanti** nel database Supabase
2. **Edge Function non deployata** correttamente
3. **Headers di autenticazione mancanti o errati**

### Soluzione Passo-Passo

#### 1. Verifica le Tabelle Database

1. Vai al [Supabase Dashboard](https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij/database/tables)
2. Verifica che esistano le tabelle `candidates` e `evaluations`
3. Se le tabelle **NON** esistono, segui la guida completa in `/docs/DATABASE_SETUP.md` per crearle

   **Script SQL rapido:**
   ```sql
   -- Crea tabella candidates
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

   -- Crea tabella evaluations
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

   Per eseguire il SQL:
   - Vai a [SQL Editor](https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij/sql/new)
   - Incolla il comando SQL completo da `/docs/DATABASE_SETUP.md`
   - Clicca su "Run"

#### 2. Verifica l'Edge Function

1. Vai alle [Edge Functions](https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij/functions)
2. Verifica che esista la funzione `make-server-2a12511d`
3. Se la funzione **NON** esiste o non è aggiornata, devi deployarla

   **Deploy tramite CLI Supabase:**
   ```bash
   # Installa Supabase CLI se non l'hai già fatto
   npm install -g supabase
   
   # Login a Supabase
   supabase login
   
   # Link al progetto
   supabase link --project-ref evsymppxmhfvfgmkviij
   
   # Deploy la funzione
   supabase functions deploy make-server-2a12511d
   ```

   **Deploy tramite Dashboard:**
   - Copia il contenuto di `/supabase/functions/server/index.tsx`
   - Crea una nuova funzione chiamata `make-server-2a12511d`
   - Incolla il codice
   - Salva e deploya

#### 3. Verifica gli Headers

Il frontend deve inviare questi headers per ogni richiesta:

```javascript
{
  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  'Content-Type': 'application/json'
}
```

Questi sono già configurati in:
- `/hooks/useSupabaseData.tsx`
- `/components/CandidateApplicationForm.tsx`

#### 4. Test Manuale

Puoi testare l'endpoint direttamente con curl:

```bash
curl -X GET \
  'https://evsymppxmhfvfgmkviij.supabase.co/functions/v1/make-server-2a12511d/candidates' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2c3ltcHB4bWhmdmZnbWt2aWlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzODQ1NDksImV4cCI6MjA3Njk2MDU0OX0.u-tHPSxJDgvMZkOGWN_JKaVV49cWuA8Z0I02KHhF8Sc' \
  -H 'apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2c3ltcHB4bWhmdmZnbWt2aWlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzODQ1NDksImV4cCI6MjA3Njk2MDU0OX0.u-tHPSxJDgvMZkOGWN_JKaVV49cWuA8Z0I02KHhF8Sc'
```

**Risposta attesa (se OK):**
```json
{
  "ok": true,
  "candidates": []
}
```

**Se ricevi 401**, il problema è nella configurazione di Supabase (tabella o funzione).

---

## Errore: Tabella non trovata

### Sintomo
```
Error: relation "candidates" does not exist
Error: relation "evaluations" does not exist
```

### Soluzione
Le tabelle `candidates` e `evaluations` devono essere create nel database Supabase. Segui la guida completa in `/docs/DATABASE_SETUP.md` per creare tutte le tabelle necessarie con indici e policy RLS corrette.

---

## Errore: Function not found

### Sintomo
```
Error: Function "make-server-2a12511d" not found
```

### Soluzione
Segui il punto 2 della sezione "Errore 401" sopra per deployare la funzione.

---

## I dati non si aggiornano

### Sintomo
Dopo aver inviato una candidatura, i dati non appaiono nel dashboard in modalità "Dati Reali".

### Soluzione
1. Clicca sul pulsante "Riprova" nel componente DataModeToggle
2. Verifica che la candidatura sia stata salvata correttamente:
   - Apri la Console del browser (F12)
   - Guarda i log: dovresti vedere "Candidate saved to database successfully"
3. Verifica i dati direttamente nel database:
   - Vai a [Table Editor](https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij/editor)
   - Apri la tabella `candidates` per vedere i candidati
   - Apri la tabella `evaluations` per vedere le valutazioni

---

## Debugging Generale

### Console del Browser
Apri sempre la console del browser (F12 → Console) per vedere:
- Errori di rete
- Log dell'applicazione
- Dettagli delle chiamate API

### Log del Server
Se hai accesso ai log di Supabase Edge Functions:
1. Vai a [Edge Functions Logs](https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij/functions)
2. Seleziona `make-server-2a12511d`
3. Guarda i log in tempo reale

### Test con Postman
Puoi usare Postman o un tool simile per testare gli endpoint:

**GET Candidates:**
```
GET https://evsymppxmhfvfgmkviij.supabase.co/functions/v1/make-server-2a12511d/candidates

Headers:
  Authorization: Bearer {publicAnonKey}
  apikey: {publicAnonKey}
```

**POST Candidate:**
```
POST https://evsymppxmhfvfgmkviij.supabase.co/functions/v1/make-server-2a12511d/candidates

Headers:
  Authorization: Bearer {publicAnonKey}
  apikey: {publicAnonKey}
  Content-Type: application/json

Body:
{
  "name": "Test User",
  "email": "test@example.com",
  "phone_number": "+39 123 456 7890",
  "cv_text": "Test CV",
  "linkedin_text": "",
  "job_offer_id": "test-job-1"
}
```

---

## Contatti & Supporto

Per ulteriore assistenza:
- Controlla la documentazione Supabase: https://supabase.com/docs
- Verifica lo stato dei servizi: https://status.supabase.com/
- Rivedi la documentazione dell'integrazione: `/docs/API_INTEGRATION.md`
- Rivedi il setup del database: `/docs/DATABASE_SETUP.md`
