# 🏦 Crédit Agricole - Analytics Dashboard Reclutamento AI

Sistema completo di reclutamento con valutazione AI dei candidati, integrato con SmartReq API e database Supabase.

---

## 🎯 Panoramica

Dashboard professionale per HR e Hiring Manager che trasforma candidature e punteggi AI in visualizzazioni chiare. Include:

- ✅ **Dashboard Analytics** con 4 KPI, grafici distribuzione, radar chart dimensioni
- ✅ **Gestione Ruoli** con possibilità di creare e condividere posizioni
- ✅ **Landing Page Candidato** professionale e form in 2 step
- ✅ **Integrazione SmartReq API** per valutazione automatica CV
- ✅ **Database Supabase** con schema normalizzato completo
- ✅ **GDPR Compliance** con consenso esplicito
- ✅ **Multi-lingua** (Italiano)

---

## 🚀 Quick Start

### 📦 Hai appena esportato il progetto da Figma Make?

**Segui questa guida rapida per connettere Supabase:**

👉 **[CONNESSIONE_RAPIDA.md](./CONNESSIONE_RAPIDA.md)** - 5 minuti per iniziare

### 🔧 Vuoi una guida completa passo-passo?

👉 **[GUIDA_DEPLOYMENT.md](./GUIDA_DEPLOYMENT.md)** - Deployment completo in produzione

---

## ⚡ Setup Veloce (Sviluppo Locale)

### 1️⃣ Verifica le Tabelle Database (2 min)

Vai a: https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij/database/tables

**Tabelle richieste:**
- ✅ `candidates`
- ✅ `evaluations`
- ✅ `evaluation_sections`
- ✅ `evaluation_dimensions`
- ✅ `evaluation_questions`

**❌ Se NON esistono**:
1. Apri: https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij/sql/new
2. Copia lo script SQL da `/docs/DATABASE_SETUP.md`
3. Clicca **RUN**

### 2️⃣ Verifica la Edge Function (3 min)

Vai a: https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij/functions

Cerca: `make-server-2a12511d`

**❌ Se NON esiste**, hai 2 opzioni:

**A) Via CLI (Raccomandato):**
```bash
npm install -g supabase
supabase login
supabase link --project-ref evsymppxmhfvfgmkviij
supabase functions deploy make-server-2a12511d
```

**B) Manuale:** Segui `/docs/EDGE_FUNCTION_DEPLOYMENT.md`

### 3️⃣ Testa il Sistema (2 min)

Apri l'applicazione → tab **🔧 Test Connessione** → **Esegui Test Completo**

**Tutti i test devono essere ✅ verdi.**

Se vedi ❌ rossi:
- Click su "Mostra guida alla risoluzione"
- Segui i link diretti alle soluzioni

### 4️⃣ Prova una Candidatura (3 min)

1. Tab **Gestione Ruoli** → Scegli un ruolo → **Visualizza Landing Page**
2. Compila il form (usa dati di test)
3. Carica un CV PDF qualsiasi
4. ✅ Accetta consenso GDPR
5. **Invia Candidatura**
6. Verifica in **Tutti i Candidati** che sia salvata

**✨ Se tutto funziona, sei pronto per usare il sistema!**

---

## 📁 Struttura del Progetto

```
/
├── App.tsx                          # Main app con routing
├── components/
│   ├── CandidateApplicationForm.tsx # Form candidatura 2-step
│   ├── CandidateLandingPage.tsx     # Landing page pubblica
│   ├── ConnectionTestPanel.tsx      # 🔧 Panel test connessione
│   ├── DataModeToggle.tsx           # Toggle Demo/Live data
│   ├── AllCandidatesView.tsx        # Vista tutti candidati
│   ├── RolesManagement.tsx          # Gestione posizioni
│   ├── TopCandidatesTable.tsx       # Tabella top candidati
│   ├── DimensionsRadarChart.tsx     # Radar chart dimensioni
│   └── ...altri componenti UI
├── contexts/
│   └── DataContext.tsx              # Context per gestione dati
├── hooks/
│   └── useSupabaseData.tsx          # Hook per fetch dati
├── types/
│   ├── Evaluation.ts                # Tipi per valutazioni
│   └── JobOffer.ts                  # Tipi per job offers
├── utils/supabase/
│   ├── client.tsx                   # Supabase client
│   └── info.tsx                     # Credenziali progetto
├── supabase/functions/server/
│   └── index.tsx                    # Edge Function backend
└── docs/
    ├── QUICK_START.md               # ⭐ Guida rapida setup
    ├── DATABASE_SETUP.md            # SQL per creare tabelle
    ├── EDGE_FUNCTION_DEPLOYMENT.md  # Deploy Edge Function
    ├── SMARTREQ_API_TEST.md         # Test API SmartReq
    ├── DATA_MODEL.md                # Schema dati normalizzato
    └── TROUBLESHOOTING.md           # Risoluzione problemi
```

---

## 🛠️ Tecnologie Utilizzate

### Frontend
- **React** + **TypeScript**
- **Tailwind CSS** per styling
- **Shadcn/ui** per componenti UI
- **Recharts** per grafici
- **PDF.js** per parsing CV
- **Lucide React** per icone

### Backend
- **Supabase** per database e autenticazione
- **Edge Functions** (Deno) per API backend
- **Hono** framework per routing
- **PostgreSQL** per storage dati

### AI & APIs
- **SmartReq API** per valutazione CV
- **Railway** hosting API SmartReq

---

## 🎨 Palette Colori Crédit Agricole

```css
--verde-scuro: #006F4E;   /* Primary brand, header, CTA */
--turquesa: #009B9D;      /* Secondary accent, highlights */
--rosso: #ED1C24;         /* Alerts, negative trends */
```

---

## 📊 Features Principali

### Dashboard Analytics
- **4 KPI Cards**: Candidature totali, tasso corrispondenza, profili contattati, tempo medio
- **Grafici Interattivi**: Distribuzione punteggi, radar dimensioni, funnel candidature
- **Filtri Avanzati**: Per ruolo e periodo temporale
- **Modalità Dati**: Toggle tra dati demo e dati reali Supabase

### Gestione Candidati
- **Vista Completa**: Tabella sortabile con tutti i candidati
- **Dettagli Candidato**: Dialog con CV, LinkedIn, punteggi, dimensioni
- **Filtri e Ricerca**: Per nome, email, ruolo, punteggio
- **Export Dati**: (Future feature)

### Gestione Ruoli
- **CRUD Completo**: Crea, modifica, elimina posizioni
- **Pesi Personalizzati**: Configura importanza dimensioni di valutazione
- **Criteri Eligibilità**: Lista filtri obbligatori
- **Condivisione**: Link pubblico, email, WhatsApp

### Esperienza Candidato
- **Landing Page Professionale**: Design Crédit Agricole branded
- **Form 2-Step**: 
  - Step 1: Dati personali + link social
  - Step 2: Upload CV + consenso GDPR
- **Upload PDF**: Parse automatico con PDF.js
- **Feedback Immediato**: Conferma invio con status AI

### Valutazione AI (SmartReq)
- **Parsing CV Automatico**: Estrazione testo da PDF
- **Valutazione Multi-Dimensionale**: 5 pilastri di valutazione
- **Punteggi Granulari**: Score 1-5 per ogni dimensione
- **Giustificazioni**: Spiegazioni testuali per ogni punteggio
- **Domande Follow-up**: AI genera domande di approfondimento
- **Filtri Eligibilità**: Verifica automatica requisiti

---

## 🔐 Privacy e GDPR

- ✅ **Consenso Esplicito**: Checkbox obbligatorio nel form
- ✅ **Testo GDPR**: Dichiarazione conforme
- ✅ **Dati Sensibili Nascosti**: I candidati NON vedono criteri di valutazione e pesi
- ✅ **Accesso Controllato**: Solo HR vede dashboard completo

---

## 🧪 Testing

### Panel Test Integrato

Tab **🔧 Test Connessione** nell'applicazione:
1. Health check Edge Function
2. Verifica tabella Candidates
3. Verifica tabella Evaluations
4. Test salvataggio candidato
5. Test lettura dati

### Test Manuale API

```bash
# Health Check
curl https://evsymppxmhfvfgmkviij.supabase.co/functions/v1/make-server-2a12511d/health

# GET Candidates
curl https://evsymppxmhfvfgmkviij.supabase.co/functions/v1/make-server-2a12511d/candidates \
  -H "Authorization: Bearer <anon-key>" \
  -H "apikey: <anon-key>"
```

Vedi `/docs/SMARTREQ_API_TEST.md` per test completi.

---

## 🐛 Troubleshooting

### Problema: "Edge Function not found"
**Soluzione**: Deploya la function seguendo `/docs/EDGE_FUNCTION_DEPLOYMENT.md`

### Problema: "relation candidates does not exist"
**Soluzione**: Crea le tabelle seguendo `/docs/DATABASE_SETUP.md`

### Problema: "permission denied"
**Soluzione**: Verifica le policy RLS e la `SUPABASE_SERVICE_ROLE_KEY`

### Problema: SmartReq API non risponde
**Soluzione**: Normale, l'API potrebbe essere in cold start. Il candidato viene comunque salvato.

Guida completa: `/docs/TROUBLESHOOTING.md`

---

## 📚 Documentazione

| Documento | Descrizione |
|-----------|-------------|
| [QUICK_START.md](./docs/QUICK_START.md) | ⭐ Setup completo in 10 minuti |
| [DATABASE_SETUP.md](./docs/DATABASE_SETUP.md) | Script SQL per creare tabelle |
| [EDGE_FUNCTION_DEPLOYMENT.md](./docs/EDGE_FUNCTION_DEPLOYMENT.md) | Deploy Edge Function |
| [SMARTREQ_API_TEST.md](./docs/SMARTREQ_API_TEST.md) | Test integrazione SmartReq |
| [DATA_MODEL.md](./docs/DATA_MODEL.md) | Schema dati normalizzato |
| [TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) | Risoluzione problemi comuni |
| [API_INTEGRATION.md](./docs/API_INTEGRATION.md) | Documentazione API |

---

## 🔗 Link Utili

### Dashboard Supabase
- [Progetto](https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij)
- [Database Tables](https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij/database/tables)
- [SQL Editor](https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij/sql/new)
- [Edge Functions](https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij/functions)
- [Table Editor](https://supabase.com/dashboard/project/evsymppxmhfvfgmkviij/editor)

### API Endpoints
- **SmartReq**: `https://primary-production-6beb.up.railway.app/webhook/smartreq`
- **Edge Function**: `https://evsymppxmhfvfgmkviij.supabase.co/functions/v1/make-server-2a12511d`

---

## 📈 Roadmap Features

- [ ] Export candidati in CSV/Excel
- [ ] Filtri avanzati e ricerca full-text
- [ ] Dashboard per singolo ruolo
- [ ] Notifiche email automatiche
- [ ] Calendario colloqui integrato
- [ ] Multi-language support
- [ ] Mobile app companion
- [ ] AI Interview suggestions

---

## 👥 Team

Progetto sviluppato per **Crédit Agricole Italia** - Sistema di Reclutamento AI-powered

---

## 📄 Licenza

© 2025 Crédit Agricole - Tutti i diritti riservati

---

## 🆘 Supporto

Per problemi o domande:
1. Consulta `/docs/TROUBLESHOOTING.md`
2. Verifica i logs in Supabase Dashboard
3. Usa il panel **🔧 Test Connessione** per diagnostica

**Buon reclutamento! 🚀**
