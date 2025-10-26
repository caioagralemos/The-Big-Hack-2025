# 🤖 SmartReq API - Guida Test Completo

Questa guida spiega come testare l'integrazione con l'API SmartReq per la valutazione AI dei candidati.

---

## 📡 Endpoint SmartReq

```
POST https://primary-production-6beb.up.railway.app/webhook/smartreq
```

---

## 🧪 Test 1: Payload Minimo

### Request

```bash
curl -X POST https://primary-production-6beb.up.railway.app/webhook/smartreq \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mario Rossi",
    "phone_number": "+39 340 123 4567",
    "email": "mario.rossi@example.com",
    "cv": "Esperienza di 5 anni come Backend Engineer. Competenze: Java, Spring Boot, PostgreSQL, Docker, Kubernetes. Progetti: sistema di pagamenti ad alta disponibilità, migrazione da monolite a microservizi.",
    "job_offer": {
      "id": "backend-engineer-2025",
      "title": "Senior Backend Engineer",
      "description": "Cerchiamo un backend engineer con esperienza in microservizi",
      "company_id": "credit-agricole",
      "scoring_scale": "1–5",
      "rubric": "1=Insufficient | 2=Basic | 3=Solid | 4=Strong | 5=Exceptional",
      "eligibility_filters": ["5+ anni esperienza", "Java/Spring Boot", "Microservizi"],
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
  }'
```

### Response Attesa (Success)

```json
{
  "ok": true,
  "candidate_id": "mario.rossi@example.com",
  "evaluation_id": "3a94d60c-7b59-4e16-b3a5-12a532c93f4b",
  "received": {
    "cv": true,
    "linkedin": false
  },
  "next": "We'll send 0–2 clarifying questions if needed."
}
```

---

## 🧪 Test 2: Payload Completo con LinkedIn

### Request

```bash
curl -X POST https://primary-production-6beb.up.railway.app/webhook/smartreq \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Giulia Bianchi",
    "phone_number": "+39 349 888 7777",
    "email": "giulia.bianchi@example.com",
    "cv": "Frontend Developer con 4 anni di esperienza. Specializzata in React, TypeScript, Next.js. Ho lavorato su progetti enterprise per il settore bancario, implementando interfacce accessibili WCAG 2.1 AA. Esperienza con testing automatizzato (Jest, Cypress), state management (Redux, Zustand), e design systems. Partecipazione attiva a code review e mentorship di developer junior.",
    "linkedin": "https://linkedin.com/in/giuliabianchi-dev | Esperienza: 4 anni come Frontend Developer | Competenze: React, TypeScript, Next.js, Tailwind CSS | Progetti notevoli: Dashboard analytics per 100K+ utenti, Mobile banking app con 4.8 rating",
    "job_offer": {
      "id": "frontend-dev-2025",
      "title": "Frontend Developer - Digital Banking",
      "description": "Sviluppare interfacce moderne per la nostra app banking",
      "company_id": "credit-agricole",
      "scoring_scale": "1–5",
      "rubric": "1=Insufficient | 2=Basic | 3=Solid | 4=Strong | 5=Exceptional",
      "eligibility_filters": [
        "3+ anni esperienza frontend",
        "React expertise",
        "TypeScript",
        "Esperienza banking/fintech preferibile"
      ],
      "weights": {
        "professional_experience": 0.25,
        "technical_skills": 0.40,
        "motivation": 0.15,
        "education_learning": 0.10,
        "soft_skills_behavioral": 0.10
      },
      "created_at": "2025-10-25T10:00:00Z",
      "updated_at": "2025-10-25T10:00:00Z"
    }
  }'
```

### Response Attesa (Success con Evaluation Data)

```json
{
  "ok": true,
  "candidate_id": "giulia.bianchi@example.com",
  "evaluation_id": "7f8e2a1b-4c3d-9e8f-a5b6-c7d8e9f0a1b2",
  "run_id": "run_20251026_143022",
  "received": {
    "cv": true,
    "linkedin": true
  },
  "scoring_scale": "1–5",
  "rubric": "1=Insufficient | 2=Basic | 3=Solid | 4=Strong | 5=Exceptional",
  "pillar_weights": {
    "professional_experience": 0.25,
    "technical_skills": 0.40,
    "motivation": 0.15,
    "education_learning": 0.10,
    "soft_skills_behavioral": 0.10
  },
  "pillar_scores": {
    "professional_experience": 4.2,
    "technical_skills": 4.5,
    "motivation": 4.0,
    "education_learning": 3.8,
    "soft_skills_behavioral": 4.0
  },
  "total_score": 4.23,
  "confidence_overall": "High",
  "eligibility_filters": [
    {
      "criterion": "3+ anni esperienza frontend",
      "status": "pass",
      "evidence": "4 anni di esperienza documentata"
    },
    {
      "criterion": "React expertise",
      "status": "pass",
      "evidence": "Specializzata in React con progetti enterprise"
    },
    {
      "criterion": "TypeScript",
      "status": "pass",
      "evidence": "TypeScript menzionato come competenza core"
    },
    {
      "criterion": "Esperienza banking/fintech preferibile",
      "status": "pass",
      "evidence": "Esperienza nel settore bancario documentata"
    }
  ],
  "sections": [
    {
      "name": "professional_experience",
      "section_score": 4.2,
      "notes": [
        "4 anni di esperienza frontend con focus enterprise",
        "Esperienza specifica nel settore bancario"
      ],
      "dimensions": [
        {
          "name": "years_experience",
          "score": 4,
          "confidence": "High",
          "justification": "4 anni di esperienza professionale documentata",
          "data_sources": ["CV: 'Frontend Developer con 4 anni di esperienza'"]
        },
        {
          "name": "relevance_seniority",
          "score": 4,
          "confidence": "High",
          "justification": "Esperienza enterprise nel settore bancario altamente rilevante",
          "data_sources": ["CV: 'progetti enterprise per il settore bancario'"]
        },
        {
          "name": "career_progression",
          "score": 4,
          "confidence": "Med",
          "justification": "Progressione da developer a mentor/reviewer",
          "data_sources": ["CV: 'mentorship di developer junior'"]
        }
      ],
      "questions": [
        "Puoi descrivere il progetto più complesso su cui hai lavorato nel settore bancario?"
      ]
    },
    {
      "name": "technical_skills",
      "section_score": 4.5,
      "notes": [
        "Stack tecnologico completamente allineato",
        "Competenze testing e accessibility notevoli"
      ],
      "dimensions": [
        {
          "name": "core_technologies",
          "score": 5,
          "confidence": "High",
          "justification": "Padronanza completa dello stack richiesto: React, TypeScript, Next.js",
          "data_sources": [
            "CV: 'Specializzata in React, TypeScript, Next.js'",
            "LinkedIn: 'React, TypeScript, Next.js, Tailwind CSS'"
          ]
        },
        {
          "name": "testing_quality",
          "score": 5,
          "confidence": "High",
          "justification": "Esperienza estensiva con testing automatizzato",
          "data_sources": ["CV: 'testing automatizzato (Jest, Cypress)'"]
        },
        {
          "name": "modern_practices",
          "score": 4,
          "confidence": "High",
          "justification": "Familiarità con state management, design systems, accessibility",
          "data_sources": [
            "CV: 'state management (Redux, Zustand)'",
            "CV: 'interfacce accessibili WCAG 2.1 AA'"
          ]
        }
      ],
      "questions": []
    },
    {
      "name": "motivation",
      "section_score": 4.0,
      "notes": [
        "Esperienza rilevante nel settore banking",
        "Partecipazione attiva in team activities"
      ],
      "dimensions": [
        {
          "name": "alignment_role",
          "score": 4,
          "confidence": "Med",
          "justification": "Background perfettamente allineato con il ruolo",
          "data_sources": ["CV: 'progetti enterprise per il settore bancario'"]
        },
        {
          "name": "proactive_learning",
          "score": 4,
          "confidence": "Med",
          "justification": "Adozione di tecnologie moderne e mentorship indicano growth mindset",
          "data_sources": ["CV: 'mentorship di developer junior'"]
        }
      ],
      "questions": [
        "Cosa ti attrae maggiormente della posizione di Frontend Developer in Crédit Agricole?"
      ]
    }
  ],
  "next": "We'll send 2 clarifying questions via WhatsApp if needed."
}
```

---

## 🧪 Test 3: Test dal Frontend

### JavaScript Example (dal browser/React)

```javascript
// Test completo con parsing PDF
async function testSmartReqIntegration() {
  const testPayload = {
    name: "Test Candidate",
    phone_number: "+39 340 123 4567",
    email: `test-${Date.now()}@example.com`,
    cv: "Senior Backend Developer with 8 years of experience in Java, Spring Boot, microservices architecture, and cloud platforms (AWS, Azure). Led migration of monolithic applications to microservices, improving system scalability by 300%. Strong expertise in database design (PostgreSQL, MongoDB), message queuing (Kafka, RabbitMQ), and containerization (Docker, Kubernetes).",
    linkedin: "Experienced software architect passionate about building scalable systems. Previously worked at tech companies and banks.",
    job_offer: {
      id: "backend-senior-test",
      title: "Senior Backend Engineer",
      description: "Build scalable backend systems for banking applications",
      company_id: "credit-agricole",
      scoring_scale: "1–5",
      rubric: "1=Insufficient | 2=Basic | 3=Solid | 4=Strong | 5=Exceptional",
      eligibility_filters: ["5+ years experience", "Java/Spring Boot", "Microservices"],
      weights: {
        professional_experience: 0.30,
        technical_skills: 0.35,
        motivation: 0.15,
        education_learning: 0.10,
        soft_skills_behavioral: 0.10
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  };

  try {
    console.log('📤 Sending to SmartReq API...');
    
    const response = await fetch('https://primary-production-6beb.up.railway.app/webhook/smartreq', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(`HTTP ${response.status}: ${JSON.stringify(errorData)}`);
    }

    const result = await response.json();
    console.log('✅ SmartReq Response:', result);

    // Now save to our database
    const { projectId, publicAnonKey } = await import('../utils/supabase/info');
    const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-2a12511d`;

    console.log('💾 Saving candidate to database...');
    
    const candidateResponse = await fetch(`${serverUrl}/candidates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
        'apikey': publicAnonKey,
      },
      body: JSON.stringify({
        name: testPayload.name,
        email: testPayload.email,
        phone_number: testPayload.phone_number,
        cv_text: testPayload.cv,
        linkedin_text: testPayload.linkedin,
        job_offer_id: testPayload.job_offer.id,
      }),
    });

    if (!candidateResponse.ok) {
      throw new Error(`Failed to save candidate: ${await candidateResponse.text()}`);
    }

    console.log('✅ Candidate saved:', await candidateResponse.json());

    // Save evaluation if we got detailed results
    if (result.sections) {
      console.log('💾 Saving evaluation to database...');
      
      const evaluationResponse = await fetch(`${serverUrl}/evaluations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
          'apikey': publicAnonKey,
        },
        body: JSON.stringify({
          candidate_id: testPayload.email,
          job_id: testPayload.job_offer.id,
          run_id: result.run_id || result.evaluation_id || `test-${Date.now()}`,
          scoring_scale: result.scoring_scale || testPayload.job_offer.scoring_scale,
          rubric: result.rubric || testPayload.job_offer.rubric,
          sections: result.sections || {},
          pillar_weights: result.pillar_weights || testPayload.job_offer.weights,
          pillar_scores: result.pillar_scores || {},
          total_score: result.total_score || 0,
          confidence_overall: result.confidence_overall || 'Med',
          eligibility_filters: result.eligibility_filters || []
        }),
      });

      if (!evaluationResponse.ok) {
        throw new Error(`Failed to save evaluation: ${await evaluationResponse.text()}`);
      }

      console.log('✅ Evaluation saved:', await evaluationResponse.json());
    }

    console.log('🎉 Test completed successfully!');
    return result;

  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  }
}

// Run the test
testSmartReqIntegration();
```

---

## 📊 Formato Response Dettagliato

### Struttura `sections`

Ogni section contiene:
- `name`: Nome della sezione (es. "professional_experience")
- `section_score`: Punteggio medio della sezione (1-5)
- `notes`: Array di note testuali
- `dimensions`: Array di dimensioni valutate
- `questions`: Array di domande di follow-up

### Struttura `dimensions`

Ogni dimension contiene:
- `name`: Nome della dimensione
- `score`: Punteggio 1-5
- `confidence`: "Low" | "Med" | "High"
- `justification`: Spiegazione testuale
- `data_sources`: Array di citazioni dal CV/LinkedIn

### Struttura `eligibility_filters`

Ogni filtro contiene:
- `criterion`: Descrizione del requisito
- `status`: "pass" | "fail" | "unclear"
- `evidence`: Evidenza dal CV

---

## ⚠️ Gestione Errori

### Errore 400: Missing required fields

```json
{
  "error": "cv is required"
}
```

**Soluzione**: Verifica che tutti i campi obbligatori siano presenti (name, phone_number, email, cv, job_offer)

### Errore 422: Invalid job offer structure

```json
{
  "error": "weights must sum to 1.0"
}
```

**Soluzione**: Verifica che i weights sommino esattamente a 1.0:
```javascript
const weights = {
  professional_experience: 0.30,
  technical_skills: 0.35,
  motivation: 0.15,
  education_learning: 0.10,
  soft_skills_behavioral: 0.10
};
// Sum = 1.00 ✅
```

### Errore 500: Internal error

```json
{
  "error": "Evaluation pipeline failed to start"
}
```

**Soluzione**: L'API SmartReq potrebbe essere temporaneamente non disponibile. Riprova dopo qualche secondo.

---

## 🔄 Flusso Completo Integrato

```
1. User compila form candidatura
   ↓
2. Frontend parse PDF → plain text
   ↓
3. POST a SmartReq API con CV text + job offer
   ↓
4. SmartReq elabora (10-30 secondi)
   ↓
5. Risposta con evaluation_id e (opzionalmente) scores
   ↓
6. Frontend salva candidate nel nostro DB
   ↓
7. Se SmartReq ha ritornato valutazione completa:
   → Salva anche evaluation nel DB
   ↓
8. Se SmartReq ha solo confermato ricezione:
   → Valutazione arriverà async
   → Si può implementare webhook per riceverla
```

---

## 🎯 Best Practices

### 1. CV Text Quality

- ✅ Parse PDF client-side con PDF.js
- ✅ Rimuovi caratteri speciali strani
- ✅ Mantieni formattazione base (newlines)
- ❌ Non inviare PDF binari

### 2. Job Offer Consistency

- Usa sempre lo stesso `job_offer.id` per la stessa posizione
- Mantieni i weights consistenti
- Aggiorna `updated_at` se modifichi i criteri

### 3. Error Handling

```javascript
try {
  const result = await callSmartReqAPI(data);
  
  // Always save candidate first
  await saveCandidateToOurDB(data);
  
  // Then try to save evaluation if available
  if (result.sections) {
    await saveEvaluationToOurDB(result);
  }
} catch (error) {
  // Log error but don't fail the whole submission
  console.error('SmartReq error:', error);
  
  // User still gets confirmation
  showSuccessMessage("Application received!");
}
```

### 4. Rate Limiting

- L'API SmartReq potrebbe avere rate limits
- Implementa retry logic con backoff
- Non fare chiamate parallele massive

---

## 📚 Riferimenti

- **API Docs**: Vedi documentazione fornita dall'utente
- **Frontend Integration**: `/components/CandidateApplicationForm.tsx`
- **Backend Save**: `/supabase/functions/server/index.tsx`
- **Database Schema**: `/docs/DATABASE_SETUP.md`

---

**🚀 Happy Testing!**
