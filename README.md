# 🤖 SmartReq - Sistema di Valutazione Intelligente dei Candidati

SmartReq è una piattaforma innovativa che utilizza l'intelligenza artificiale per rivoluzionare il processo di recruiting, combinando analisi automatizzata dei CV con conversazioni intelligenti su WhatsApp per una valutazione completa e trasparente dei candidati.

## 📋 Panoramica del Progetto

SmartReq trasforma il recruiting tradizionale attraverso:

- **5 Robot Specializzati**: Ogni dimensione della valutazione è gestita da un AI agent specifico
- **Analisi Multi-Fonte**: CV, LinkedIn, GitHub, portfolio e certificazioni
- **Conversazioni Intelligenti**: Chatbot WhatsApp che completa le informazioni mancanti
- **Dashboard Analytics**: Visualizzazione avanzata dei dati e comparazioni
- **Processo Automatizzato**: Dal caricamento CV alla valutazione finale

## 🏗️ Struttura del Progetto

```
📁 The Big Hack 2025/
├── 📁 Data Structures/          # Schemi database e modelli dati
│   ├── evaluation.sql           # Schema tabella valutazioni
│   ├── evaluation.ts           # Tipo TypeScript per valutazioni
│   ├── job_offer.sql           # Schema tabella offerte lavoro
│   └── job_offer.ts            # Tipo TypeScript per offerte
├── 📁 Integration/             # Documentazione API e integrazioni
│   ├── api documentation.md    # Documentazione API SmartReq
│   └── supabase.txt           # Credenziali database Supabase
├── 📁 Models/                  # Workflow n8n e automazioni
│   ├── Smartreq - Chatbot.json    # Workflow chatbot WhatsApp
│   └── Smartreq - Evaluation.json # Workflow valutazione AI
├── 📁 Presentation/            # Materiali di presentazione
│   ├── Presentation.key        # Slides di presentazione
│   └── script.txt             # Script di presentazione
├── 📁 Prompts/                 # Prompt per i modelli AI
├── 📁 Resources/               # Documentazione e risorse
│   ├── detailed_model.txt      # Modello dettagliato del sistema
│   ├── userflow.txt           # Flusso utente del sistema
│   └── whatsapp.txt           # Configurazione WhatsApp
└── 📁 Webapp/                  # Applicazione web React
    ├── public/                 # File statici
    ├── src/                   # Codice sorgente
    │   ├── components/        # Componenti React
    │   ├── contexts/         # Context providers
    │   ├── types/            # Definizioni TypeScript
    │   └── utils/            # Utility e API clients
    └── build/                 # Build di produzione
```

## 🎯 Funzionalità Principali

### 🤖 I Cinque Robot Specializzati

1. **Pro** - Esperto di Esperienza Professionale
   - Valuta rilevanza e impatto dell'esperienza lavorativa
   - Analizza progressione di carriera e responsabilità

2. **Tech** - Ingegnere Tecnico
   - Misura profondità delle competenze tecniche
   - Valuta qualità del codice e progetti GitHub

3. **Moty** - Motivatore
   - Osserva passione e costanza nei progetti
   - Analizza commitment e dedizione

4. **Edu** - Mentore Educativo
   - Analizza formazione e certificazioni
   - Valuta capacità di apprendimento continuo

5. **Softy** - Empatico delle Soft Skills
   - Valuta collaborazione e comunicazione
   - Analizza valori personali e fit culturale

### 💬 Agente Conversazionale WhatsApp

**Mia** - L'assistente AI che:
- Contatta automaticamente i candidati per informazioni mancanti
- Conduce conversazioni naturali e fluide
- Aggiorna in tempo reale le valutazioni
- Mantiene il contatto umano nel processo digitale

### 📊 Dashboard Analytics

- **Vista Candidati**: Panoramica completa di tutti i candidati
- **Gestione Ruoli**: Creazione e modifica delle posizioni aperte
- **KPI e Metriche**: Statistiche avanzate sui processi di recruiting
- **Confronti**: Comparazione visuale tra candidati
- **Radar Chart**: Visualizzazione delle dimensioni di valutazione

## 🚀 Installazione e Setup

### Prerequisiti

- Node.js (versione 18 o superiore)
- npm o yarn
- Account Supabase
- Accesso alle API SmartReq

### 1. Clona il Repository

```bash
git clone [url-repository]
cd "The Big Hack 2025"
```

### 2. Installazione Dipendenze

```bash
cd Webapp
npm install
```

### 3. Configurazione Variabili d'Ambiente

Crea un file `.env` nella cartella `Webapp` con le seguenti variabili:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://evsymppxmhfvfgmkviij.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2c3ltcHB4bWhmdmZnbWt2aWlqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTM4NDU0OSwiZXhwIjoyMDc2OTYwNTQ5fQ.NIsjmggybDcuZvZSSqvt7tIloC4gxdeTr3FPCwNoxII

# SmartReq API
VITE_SMARTREQ_API_URL=https://primary-production-6beb.up.railway.app

# WhatsApp Integration (opzionale)
VITE_WHATSAPP_WEBHOOK_URL=your_whatsapp_webhook_url

# Other Configuration
VITE_APP_NAME=SmartReq
VITE_COMPANY_ID=your_company_id
```

### 4. Setup Database

Le strutture del database sono disponibili in `Data Structures/`:

```bash
# Esegui gli script SQL su Supabase
# 1. evaluation.sql - Crea tabella valutazioni
# 2. job_offer.sql - Crea tabella offerte lavoro
```

### 5. Avvio dell'Applicazione

```bash
# Modalità sviluppo
npm run dev

# Build per produzione
npm run build
```

L'applicazione sarà disponibile su `http://localhost:5173`

## 🔧 Configurazione Avanzata

### Integrazione n8n

I workflow n8n sono disponibili in `Models/`:

1. **Smartreq - Chatbot.json**: Gestisce le conversazioni WhatsApp
2. **Smartreq - Evaluation.json**: Orchestrazione del processo di valutazione

Importa questi file nella tua istanza n8n per abilitare l'automazione completa.

### API SmartReq

Consulta `Integration/api documentation.md` per:
- Endpoint disponibili
- Schema delle richieste
- Esempi di codice
- Gestione degli errori

## 📱 Utilizzo del Sistema

### Per le Aziende

1. **Creazione Ruolo**: Definisci posizione, competenze e pesi delle dimensioni
2. **Generazione Link**: Ottieni link sicuro per i candidati
3. **Monitoraggio**: Visualizza candidature e valutazioni in tempo reale
4. **Analisi**: Confronta candidati e prendi decisioni informate

### Per i Candidati

1. **Accesso tramite Link**: Clicca sul link ricevuto dall'azienda
2. **Caricamento Documenti**: Invia CV, LinkedIn, portfolio
3. **Conversazione WhatsApp**: Completa informazioni se richiesto
4. **Risultati**: Ricevi feedback trasparente sulla valutazione

## 🔄 User Flow Completo

```
Company Dashboard → Create New Role
       ↓
Fill Role Info + Core Skills + Dimension Weight
       ↓
Generate Secure Candidate Link
       ↓
Candidate Clicks Link → Views Role Description
       ↓
Candidate Fills Form (CV + Links)
       ↓
AI Extracts & Evaluates → Detects Missing Data
       ↓
WhatsApp AI Chat Fills Gaps
       ↓
Complete Candidate Profile → Stored in Company Dashboard
       ↓
Company Views Analytics & Comparisons
```

## 🛠️ Tecnologie Utilizzate

### Frontend
- **React 18** - Framework UI
- **TypeScript** - Type safety
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Styling
- **Radix UI** - Componenti accessibili
- **Recharts** - Visualizzazione dati
- **React Hook Form** - Gestione form

### Backend & Infrastruttura
- **Supabase** - Database e autenticazione
- **n8n** - Automazione workflow
- **Railway** - Hosting API
- **WhatsApp Business API** - Messaggistica

### AI & ML
- **SmartReq AI Pipeline** - Valutazione candidati
- **Natural Language Processing** - Analisi CV e conversazioni
- **Multi-Agent System** - 5 robot specializzati

## 📚 Documentazione Aggiuntiva

- `Webapp/src/docs/` - Documentazione tecnica completa
- `Resources/detailed_model.txt` - Modello di sistema dettagliato
- `Integration/api documentation.md` - Documentazione API
- `Presentation/script.txt` - Script di presentazione del progetto

## 🤝 Contribuzioni

Questo progetto è stato sviluppato per **The Big Hack 2025**. Per contribuire:

1. Fork del repository
2. Crea un branch per le tue modifiche
3. Commit delle modifiche con messaggi descrittivi
4. Push del branch
5. Apri una Pull Request

## 📞 Supporto

Per supporto tecnico o domande sul progetto:

- Consulta la documentazione in `Webapp/src/docs/`
- Verifica i file di troubleshooting
- Controlla le configurazioni in `Integration/`

## 📄 Licenza

Progetto sviluppato per The Big Hack 2025. Tutti i diritti riservati.

---

**SmartReq** - Rivoluzionando il recruiting con l'intelligenza artificiale 🚀