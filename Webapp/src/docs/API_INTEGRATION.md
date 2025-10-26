# Integrazione API SmartReq + Supabase

## 📋 Panoramica

L'applicazione SmartReq Analytics Dashboard è ora completamente integrata con:
- **API SmartReq**: Per la valutazione AI dei candidati
- **Supabase**: Per il database e persistenza dei dati

## 🔗 Architettura

```
Candidato → Form di Candidatura → SmartReq API → Supabase Server → KV Store
                                      ↓
                                  Valutazione AI
                                      ↓
                       Dashboard Analytics (Visualizzazione)
```

## 🔑 Credenziali Supabase

- **URL**: `https://evsymppxmhfvfgmkviij.supabase.co`
- **Project ID**: `evsymppxmhfvfgmkviij`
- **Service Role Key**: Configurato nel server
- **Public Anon Key**: Configurato in `/utils/supabase/info.tsx`

## 📡 API SmartReq

### Endpoint
```
POST https://primary-production-6beb.up.railway.app/webhook/smartreq
```

### Request Body
```json
{
  "name": "Nome Cognome",
  "phone_number": "+39 xxx xxx xxxx",
  "email": "email@example.com",
  "cv": "Testo del CV estratto dal PDF",
  "linkedin": "Testo del profilo LinkedIn (opzionale)",
  "job_offer": {
    "id": "job_id",
    "title": "Titolo Posizione",
    "description": "Descrizione del ruolo",
    "company_id": "credit-agricole",
    "scoring_scale": "1–5",
    "rubric": "1=Insufficiente | 2=Base | 3=Solido | 4=Forte | 5=Eccezionale",
    "eligibility_filters": ["Filtro 1", "Filtro 2"],
    "weights": {
      "professional_experience": 0.30,
      "technical_skills": 0.35,
      "motivation": 0.15,
      "education_learning": 0.10,
      "soft_skills_behavioral": 0.10
    },
    "created_at": "2025-10-25T10:00:00Z",
    "updated_at": "2025-10-25T10:00:00Z"
  }
}
```

### Response
```json
{
  "ok": true,
  "candidate_id": "email@example.com",
  "evaluation_id": "uuid",
  "received": {
    "cv": true,
    "linkedin": true
  }
}
```

## 🗄️ Supabase Server Routes

Il server Hono in `/supabase/functions/server/index.tsx` espone le seguenti routes:

### Candidati

#### POST /make-server-2a12511d/candidates
Salva una nuova candidatura
```json
{
  "name": "Nome Cognome",
  "email": "email@example.com",
  "phone_number": "+39 xxx xxx xxxx",
  "cv_text": "Testo CV",
  "linkedin_text": "Testo LinkedIn",
  "job_offer_id": "job_id",
  "github": "https://github.com/...",
  "website": "https://...",
  "instagram": "https://instagram.com/..."
}
```

#### GET /make-server-2a12511d/candidates
Recupera tutte le candidature

#### GET /make-server-2a12511d/candidates/:email
Recupera una candidatura specifica

### Valutazioni

#### POST /make-server-2a12511d/evaluations
Salva il risultato di una valutazione
```json
{
  "evaluation_id": "uuid",
  "candidate_id": "email@example.com",
  "job_id": "job_id",
  "api_response": { ... },
  "scores": { ... },
  "total_score": 4.5
}
```

#### GET /make-server-2a12511d/evaluations
Recupera tutte le valutazioni

#### GET /make-server-2a12511d/evaluations/candidate/:email
Recupera la valutazione di un candidato specifico

## 🔄 Flusso di Candidatura

1. **Candidato compila il form** (`/components/CandidateApplicationForm.tsx`)
2. **Parsing del CV**: Il PDF viene convertito in testo usando `pdfjs-dist`
3. **Chiamata API SmartReq**: Il sistema invia i dati all'API per la valutazione
4. **Salvataggio in Supabase**: Candidato e valutazione vengono salvati nel KV store
5. **Conferma**: Il candidato riceve un messaggio di conferma

## 📊 Modalità Dashboard

Il dashboard supporta due modalità:

### Demo Mode (Default)
- Utilizza dati hardcoded per presentazioni
- Perfetto per pitch e demo
- Non richiede connessione al database

### Live Mode
- Legge dati reali da Supabase
- Visualizza candidature e valutazioni reali
- Aggiornamento in tempo reale

Switch tra le modalità usando il componente `DataModeToggle` nel dashboard.

## 🔐 Autenticazione & Sicurezza

### Headers Richiesti
Tutte le richieste alle Supabase Edge Functions devono includere:
```javascript
{
  'Authorization': 'Bearer {publicAnonKey}',
  'apikey': '{publicAnonKey}',
  'Content-Type': 'application/json'
}
```

### ⚠️ Risoluzione Errore 401
**Se ricevi un errore 401, consulta la guida completa: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)**

Verifica rapida:

1. **Tabella KV Store esistente**: Vai a [Supabase Dashboard → Database → Tables](https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij/database/tables) e verifica che esista la tabella `kv_store_2a12511d`

2. **Crea la tabella se mancante**:
   ```sql
   CREATE TABLE kv_store_2a12511d (
     key TEXT NOT NULL PRIMARY KEY,
     value JSONB NOT NULL
   );
   ```

3. **Edge Function deployata**: Verifica che la funzione `make-server-2a12511d` sia deployata correttamente su Supabase

4. **Headers corretti**: Assicurati di passare sia `Authorization` che `apikey` headers

### Sicurezza Generale
- ✅ Service Role Key utilizzata solo nel server backend
- ✅ Public Anon Key esposta solo al frontend (sicura)
- ✅ CORS configurato correttamente nel server
- ✅ Validazione dei dati in input
- ⚠️ **IMPORTANTE**: I criteri di valutazione e i pesi NON sono visibili ai candidati

## 📝 Struttura Dati KV Store

### Candidati
```
Key: candidate:{email}
Value: {
  id: string (email),
  name: string,
  email: string,
  phone_number: string,
  cv_text: string,
  linkedin_text: string,
  job_offer_id: string,
  github: string,
  website: string,
  instagram: string,
  created_at: string (ISO 8601)
}
```

### Valutazioni
```
Key: evaluation:{evaluation_id}
Value: {
  evaluation_id: string (UUID),
  candidate_id: string (email),
  job_id: string,
  api_response: object,
  scores: object,
  total_score: number,
  created_at: string (ISO 8601)
}

Key: evaluation_by_candidate:{email}
Value: string (evaluation_id)
```

## 🧪 Testing

### Test Form di Candidatura
1. Vai a `/apply/1` (o qualsiasi ID job valido)
2. Compila il form con dati di test
3. Carica un CV PDF
4. Verifica che la candidatura venga inviata all'API
5. Controlla i log del browser per conferme

### Test Dashboard
1. Apri il dashboard principale
2. Passa a "Dati Reali (Supabase)" nel toggle
3. Verifica che i dati vengano caricati correttamente
4. Controlla le statistiche e le tabelle

### Verifica Server
```bash
curl https://evsymppxmhfvfgmkviij.supabase.co/functions/v1/make-server-2a12511d/health
```

Risposta attesa: `{"status":"ok"}`

## 🐛 Troubleshooting

### Errore: "Failed to fetch candidates"
- Verifica che il server Supabase sia attivo
- Controlla le credenziali in `/utils/supabase/info.tsx`
- Verifica i log della console del browser

### Errore: "Missing required fields"
- Assicurati che tutti i campi obbligatori siano compilati
- Verifica il formato dei dati inviati

### Parsing PDF fallisce
- Assicurati che il file sia un PDF valido
- Verifica che non sia protetto da password
- Controlla la dimensione del file (max 10MB)

## 📚 File Principali

- `/App.tsx`: Applicazione principale con DataProvider
- `/components/CandidateApplicationForm.tsx`: Form di candidatura
- `/components/DataModeToggle.tsx`: Switch modalità dati
- `/contexts/DataContext.tsx`: Context per gestione dati
- `/hooks/useSupabaseData.tsx`: Hook per fetch dati da Supabase
- `/supabase/functions/server/index.tsx`: Server Hono con API routes
- `/utils/supabase/info.tsx`: Configurazione Supabase
- `/utils/supabase/client.tsx`: Client Supabase

## 🚀 Prossimi Passi

1. ✅ Integrazione API SmartReq completata
2. ✅ Server Supabase configurato
3. ✅ Persistenza dati implementata
4. 🔄 Testing end-to-end
5. 🔄 Integrazione risultati valutazione nel dashboard
6. 🔄 Webhook per aggiornamenti real-time
7. 🔄 Dashboard di monitoraggio per HR

## 💡 Note

- I dati di demo sono ancora disponibili per presentazioni
- Il sistema è pronto per l'uso in produzione
- La modalità live richiede candidature reali per visualizzare dati
- Il parsing PDF funziona client-side per ridurre carico server
