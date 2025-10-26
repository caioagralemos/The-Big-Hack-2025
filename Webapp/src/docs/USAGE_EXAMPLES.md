# Esempi d'Uso - Modello Dati Evaluation

Questa guida mostra come utilizzare le classi `Evaluation` e `JobOffer` nel codice TypeScript/JavaScript.

## Indice
- [Creare una Job Offer](#creare-una-job-offer)
- [Creare una Evaluation](#creare-una-evaluation)
- [Aggiungere Sezioni e Dimensioni](#aggiungere-sezioni-e-dimensioni)
- [Calcolare i Punteggi](#calcolare-i-punteggi)
- [Salvare nel Database](#salvare-nel-database)
- [Recuperare dal Database](#recuperare-dal-database)

---

## Creare una Job Offer

```typescript
import { JobOffer, JobOfferWeights } from '../types/JobOffer';

// Creare una nuova job offer
const jobOffer = new JobOffer({
  id: crypto.randomUUID(),
  company_id: crypto.randomUUID(),
  job_key: 'senior_backend_engineer_2025_09',
  title: 'Senior Backend Engineer',
  description: `
    Cerchiamo un Senior Backend Engineer con esperienza in:
    - Sviluppo microservizi con Java/Spring Boot
    - Architetture cloud (AWS/Azure)
    - Database relazionali e NoSQL
    - CI/CD e DevOps practices
  `,
  // I pesi sono opzionali, usa i default se non specificati
  weights: {
    professional_experience: 0.30,
    technical_skills: 0.35,
    motivation: 0.15,
    education_learning: 0.10,
    soft_skills_behavioral: 0.10
  }
});

// Validare che i pesi sommino a 1.0
if (!jobOffer.weightsSumIsValid()) {
  console.error('Errore: i pesi devono sommare a 1.0');
}

console.log(jobOffer);
// JobOffer {
//   id: '...',
//   title: 'Senior Backend Engineer',
//   scoring_scale: '1–5',
//   rubric: '1=Insufficient | 2=Basic | 3=Solid | 4=Strong | 5=Exceptional',
//   weights: { professional_experience: 0.30, ... }
// }
```

### Custom Weights per Ruolo Specifico

```typescript
// Frontend Developer - maggior peso su technical_skills e soft_skills
const frontendJob = new JobOffer({
  id: crypto.randomUUID(),
  company_id: crypto.randomUUID(),
  job_key: 'frontend_developer_2025',
  title: 'Frontend Developer',
  description: '...',
  weights: {
    professional_experience: 0.20,
    technical_skills: 0.40,      // Più importante
    motivation: 0.10,
    education_learning: 0.10,
    soft_skills_behavioral: 0.20  // Importante per collaborazione con design
  }
});

// Data Scientist - maggior peso su education e technical_skills
const dataScientistJob = new JobOffer({
  id: crypto.randomUUID(),
  company_id: crypto.randomUUID(),
  job_key: 'data_scientist_2025',
  title: 'Data Scientist',
  description: '...',
  weights: {
    professional_experience: 0.25,
    technical_skills: 0.40,
    motivation: 0.10,
    education_learning: 0.20,     // PhD preferito
    soft_skills_behavioral: 0.05
  }
});
```

---

## Creare una Evaluation

```typescript
import { Evaluation, Dimension, Section } from '../types/Evaluation';

// Creare una nuova valutazione
const evaluation = new Evaluation({
  candidate_id: 'mario.rossi@example.com',
  job_id: jobOffer.id,
  run_id: `eval_${Date.now()}`,
  scoring_scale: '1–5',
  rubric: '1=Insufficient | 2=Basic | 3=Solid | 4=Strong | 5=Exceptional',
});

console.log(evaluation);
// Evaluation {
//   candidate_id: 'mario.rossi@example.com',
//   job_id: '...',
//   run_id: 'eval_1730000000000',
//   sections: Map(0) {},
//   pillar_weights: {},
//   total_score: 0,
//   confidence_overall: 'Med'
// }
```

---

## Aggiungere Sezioni e Dimensioni

### Esempio Completo - Esperienza Professionale

```typescript
import { Dimension } from '../types/Evaluation';

// Definire le dimensioni per "Esperienza Professionale"
const experienceDimensions: Dimension[] = [
  {
    name: 'Anni di esperienza rilevante',
    score: 5,
    confidence: 'High',
    justification: '8 anni di esperienza in sviluppo backend enterprise con tecnologie Java',
    data_sources: ['CV', 'LinkedIn']
  },
  {
    name: 'Progetti comparabili',
    score: 5,
    confidence: 'High',
    justification: 'Ha lavorato su sistemi bancari simili in Intesa Sanpaolo',
    data_sources: ['CV']
  },
  {
    name: 'Progressione di carriera',
    score: 5,
    confidence: 'Med',
    justification: 'Crescita costante da junior (2015) a senior (2020) a tech lead (2023)',
    data_sources: ['LinkedIn']
  },
  {
    name: 'Leadership tecnica',
    score: 4,
    confidence: 'Med',
    justification: 'Ha guidato team di 5-8 sviluppatori su progetti complessi',
    data_sources: ['CV', 'LinkedIn']
  }
];

// Aggiungere la sezione all'evaluation
evaluation.setSection(
  'professional_experience',
  experienceDimensions,
  ['Puoi descrivere il progetto più complesso che hai guidato?'], // questions
  [] // notes (risposte arriveranno dopo)
);

console.log(evaluation.sections.get('professional_experience'));
// {
//   name: 'professional_experience',
//   section_score: 4.75,  // (5+5+5+4)/4 = 4.75
//   dimensions: [...],
//   questions: ['Puoi descrivere...'],
//   notes: []
// }
```

### Esempio - Competenze Tecniche

```typescript
const technicalDimensions: Dimension[] = [
  {
    name: 'Java/Spring Boot',
    score: 5,
    confidence: 'High',
    justification: 'Certificato Oracle Java SE 11, 6+ anni di esperienza con Spring Boot',
    data_sources: ['CV']
  },
  {
    name: 'Microservizi e Cloud',
    score: 5,
    confidence: 'High',
    justification: 'Esperto in architetture AWS, Kubernetes, ha implementato 20+ microservizi',
    data_sources: ['CV', 'LinkedIn']
  },
  {
    name: 'Database e SQL',
    score: 5,
    confidence: 'Med',
    justification: 'Ottima conoscenza di PostgreSQL, MongoDB, Redis',
    data_sources: ['CV']
  },
  {
    name: 'CI/CD e DevOps',
    score: 4,
    confidence: 'Med',
    justification: 'Esperienza con Jenkins, GitLab CI, Docker',
    data_sources: ['CV']
  }
];

evaluation.setSection(
  'technical_skills',
  technicalDimensions,
  ['Quale approccio usi per garantire la scalabilità dei microservizi?'],
  []
);
```

### Esempio - Motivazione

```typescript
const motivationDimensions: Dimension[] = [
  {
    name: 'Interesse per il ruolo',
    score: 5,
    confidence: 'High',
    justification: 'Lettera motivazionale dettagliata e personalizzata per Crédit Agricole',
    data_sources: ['Cover Letter']
  },
  {
    name: 'Allineamento con i valori',
    score: 5,
    confidence: 'Med',
    justification: 'Enfasi su stabilità, innovazione e impatto sociale nel settore bancario',
    data_sources: ['Cover Letter', 'LinkedIn']
  },
  {
    name: 'Aspettative di carriera',
    score: 4,
    confidence: 'Med',
    justification: 'Cerca crescita tecnica verso ruolo di architect e possibile track manageriale',
    data_sources: ['Cover Letter']
  }
];

evaluation.setSection(
  'motivation',
  motivationDimensions,
  ['Cosa ti attrae maggiormente del settore bancario?'],
  []
);
```

### Esempio - Istruzione e Apprendimento

```typescript
const educationDimensions: Dimension[] = [
  {
    name: 'Formazione accademica',
    score: 5,
    confidence: 'High',
    justification: 'Master in Computer Science, Università di Milano, 110 e lode',
    data_sources: ['CV']
  },
  {
    name: 'Certificazioni professionali',
    score: 4,
    confidence: 'High',
    justification: 'AWS Solutions Architect Associate, Oracle Certified Java Programmer',
    data_sources: ['CV']
  },
  {
    name: 'Apprendimento continuo',
    score: 4,
    confidence: 'Med',
    justification: 'Corsi recenti su Kafka, Event Sourcing, DDD',
    data_sources: ['LinkedIn Learning']
  }
];

evaluation.setSection(
  'education_learning',
  educationDimensions,
  [],
  []
);
```

### Esempio - Competenze Trasversali

```typescript
const softSkillsDimensions: Dimension[] = [
  {
    name: 'Comunicazione',
    score: 4,
    confidence: 'Med',
    justification: 'Chiaro e conciso nella descrizione di concetti tecnici complessi',
    data_sources: ['CV', 'Cover Letter']
  },
  {
    name: 'Lavoro di squadra',
    score: 4,
    confidence: 'Med',
    justification: 'Esperienza in team distribuiti internazionali',
    data_sources: ['CV']
  },
  {
    name: 'Leadership',
    score: 3,
    confidence: 'Med',
    justification: 'Esperienza limitata nella gestione diretta di team (solo 2 anni)',
    data_sources: ['CV']
  },
  {
    name: 'Adattabilità',
    score: 3,
    confidence: 'Low',
    justification: 'Preferisce contesti strutturati, ha sempre lavorato in grandi aziende',
    data_sources: ['LinkedIn']
  }
];

evaluation.setSection(
  'soft_skills_behavioral',
  softSkillsDimensions,
  [
    'Come hai gestito situazioni di conflitto nel team?',
    'Descrivi un momento in cui hai dovuto adattarti rapidamente a un cambiamento'
  ],
  []
);
```

---

## Calcolare i Punteggi

```typescript
// Impostare i pesi (copiati dalla job offer)
evaluation.pillar_weights = {
  professional_experience: 0.30,
  technical_skills: 0.35,
  motivation: 0.15,
  education_learning: 0.10,
  soft_skills_behavioral: 0.10
};

// Calcolare i punteggi per pillar
evaluation.pillar_scores = {
  professional_experience: 4.75,  // Calcolato automaticamente da setSection
  technical_skills: 4.75,
  motivation: 4.67,
  education_learning: 4.33,
  soft_skills_behavioral: 3.50
};

// Calcolare il punteggio totale
const totalScore = evaluation.calcTotalFromWeights();

console.log(`Total Score: ${totalScore}`);
// Total Score: 4.5475
// Calcolo: 0.30*4.75 + 0.35*4.75 + 0.15*4.67 + 0.10*4.33 + 0.10*3.50 = 4.5475

// Impostare confidence e eligibility
evaluation.confidence_overall = 'High';
evaluation.eligibility_filters = [
  { rule: 'Laurea in Informatica o equivalente', ok: true },
  { rule: 'Almeno 5 anni di esperienza', ok: true },
  { rule: 'Conoscenza avanzata Java', ok: true }
];
```

---

## Salvare nel Database

### Via API Backend

```typescript
import { projectId, publicAnonKey } from '../utils/supabase/info';

const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-2a12511d`;

// Preparare i dati per l'API
const evaluationPayload = {
  candidate_id: evaluation.candidate_id,
  job_id: evaluation.job_id,
  run_id: evaluation.run_id,
  scoring_scale: evaluation.scoring_scale,
  rubric: evaluation.rubric,
  
  // Convertire Map a Object per JSON
  sections: Array.from(evaluation.sections.entries()).map(([name, section]) => ({
    name,
    ...section
  })),
  
  pillar_weights: evaluation.pillar_weights,
  pillar_scores: evaluation.pillar_scores,
  total_score: evaluation.total_score,
  confidence_overall: evaluation.confidence_overall,
  eligibility_filters: evaluation.eligibility_filters
};

// Salvare via API
const response = await fetch(`${serverUrl}/evaluations`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${publicAnonKey}`,
    'apikey': publicAnonKey
  },
  body: JSON.stringify(evaluationPayload)
});

if (response.ok) {
  const result = await response.json();
  console.log('Evaluation saved:', result.evaluation_id);
} else {
  console.error('Failed to save evaluation:', await response.text());
}
```

---

## Recuperare dal Database

### Via API Backend

```typescript
// Recuperare tutte le evaluations
const response = await fetch(`${serverUrl}/evaluations`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${publicAnonKey}`,
    'apikey': publicAnonKey
  }
});

const { evaluations } = await response.json();

console.log(`Trovate ${evaluations.length} valutazioni`);

// Le evaluations arrivano con la struttura completa
evaluations.forEach(evalData => {
  console.log(`Candidato: ${evalData.candidate_id}`);
  console.log(`Total Score: ${evalData.total_score}`);
  console.log(`Sezioni: ${evalData.sections.length}`);
  
  evalData.sections.forEach(section => {
    console.log(`  - ${section.name}: ${section.section_score}`);
    console.log(`    Dimensions: ${section.dimensions.length}`);
    console.log(`    Questions: ${section.questions.length}`);
  });
});
```

### Recuperare Evaluation Specifica per Candidato

```typescript
const candidateEmail = 'mario.rossi@example.com';

const response = await fetch(`${serverUrl}/evaluations/candidate/${encodeURIComponent(candidateEmail)}`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${publicAnonKey}`,
    'apikey': publicAnonKey
  }
});

if (response.ok) {
  const { evaluation } = await response.json();
  
  // Ricostruire la classe Evaluation dal database
  const reconstructedEval = new Evaluation({
    candidate_id: evaluation.candidate_id,
    job_id: evaluation.job_id,
    run_id: evaluation.run_id,
    scoring_scale: evaluation.scoring_scale,
    rubric: evaluation.rubric,
    timestamp_utc: evaluation.timestamp_utc,
    pillar_weights: evaluation.pillar_weights,
    pillar_scores: evaluation.pillar_scores,
    total_score: evaluation.total_score,
    confidence_overall: evaluation.confidence_overall,
    eligibility_filters: evaluation.eligibility_filters
  });
  
  // Ricostruire le sezioni (convertire da array a Map)
  evaluation.sections.forEach(sectionData => {
    reconstructedEval.setSection(
      sectionData.name,
      sectionData.dimensions,
      sectionData.questions,
      sectionData.notes
    );
  });
  
  console.log('Evaluation ricostruita:', reconstructedEval);
}
```

---

## Usare nel Context/Hook

```typescript
// In useSupabaseData.tsx
export interface EvaluationData {
  id: string;
  candidate_id: string;
  job_id: string;
  run_id: string;
  total_score: number;
  confidence_overall: Confidence;
  sections: Section[];  // Array, non Map
  // ...altri campi
}

// Nel componente
import { useData } from '../contexts/DataContext';

function MyComponent() {
  const { evaluations, candidates } = useData();
  
  // Le evaluations arrivano già con sections come array
  evaluations.forEach(evalData => {
    // Accedere alle sezioni
    const profExpSection = evalData.sections.find(s => s.name === 'professional_experience');
    
    if (profExpSection) {
      console.log(`Experience Score: ${profExpSection.section_score}`);
      
      // Accedere alle dimensioni
      profExpSection.dimensions.forEach(dim => {
        console.log(`  ${dim.name}: ${dim.score} (${dim.confidence})`);
        if (dim.justification) {
          console.log(`    ${dim.justification}`);
        }
      });
    }
  });
}
```

---

## Helper Functions Utili

```typescript
// Trovare la sezione con il punteggio più basso
function findWeakestSection(evaluation: EvaluationData): Section | null {
  if (!evaluation.sections.length) return null;
  
  return evaluation.sections.reduce((weakest, current) => 
    current.section_score < weakest.section_score ? current : weakest
  );
}

// Contare domande in sospeso
function countPendingQuestions(sections: Section[]): number {
  return sections.reduce((total, section) => 
    total + section.questions.length - section.notes.length, 0
  );
}

// Calcolare la media di confidence
function calculateAverageConfidence(dimensions: Dimension[]): number {
  const confidenceMap = { 'Low': 1, 'Med': 2, 'High': 3 };
  const total = dimensions.reduce((sum, dim) => 
    sum + (confidenceMap[dim.confidence || 'Med'] || 2), 0
  );
  return total / dimensions.length;
}

// Filtrare candidati per punteggio minimo
function filterByMinScore(evaluations: EvaluationData[], minScore: number): EvaluationData[] {
  return evaluations.filter(e => e.total_score >= minScore);
}

// Raggruppare per confidence
function groupByConfidence(evaluations: EvaluationData[]): Record<string, EvaluationData[]> {
  return evaluations.reduce((groups, eval) => {
    const conf = eval.confidence_overall || 'Med';
    if (!groups[conf]) groups[conf] = [];
    groups[conf].push(eval);
    return groups;
  }, {} as Record<string, EvaluationData[]>);
}
```

---

## Best Practices

### 1. Validazione dei Dati

```typescript
// Sempre validare prima di salvare
if (!jobOffer.weightsSumIsValid()) {
  throw new Error('Job offer weights must sum to 1.0');
}

// Verificare che tutte le sezioni abbiano dimensioni
if (evaluation.sections.size === 0) {
  throw new Error('Evaluation must have at least one section');
}

// Verificare che i punteggi siano nel range corretto
evaluation.sections.forEach((section, name) => {
  section.dimensions.forEach(dim => {
    if (dim.score < 1 || dim.score > 5) {
      throw new Error(`Invalid score ${dim.score} for dimension ${dim.name} in ${name}`);
    }
  });
});
```

### 2. Error Handling

```typescript
async function saveEvaluationSafely(evaluation: Evaluation) {
  try {
    const response = await fetch(`${serverUrl}/evaluations`, {
      method: 'POST',
      headers: { /* ... */ },
      body: JSON.stringify(evaluationPayload)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to save evaluation:', error);
    // Log to monitoring service
    // Show user-friendly error message
    throw error;
  }
}
```

### 3. Performance

```typescript
// Quando hai molte evaluations, filtra lato server se possibile
// Invece di caricare tutte e filtrare in memoria:
const evaluations = await fetchAllEvaluations(); // ❌ Inefficiente
const filtered = evaluations.filter(e => e.total_score >= 4.5);

// Meglio: filtra nel database
const query = `${serverUrl}/evaluations?min_score=4.5`; // ✅ Efficiente
```

---

## Riferimenti

- Schema SQL completo: `/docs/DATABASE_SETUP.md`
- Modello dati dettagliato: `/docs/DATA_MODEL.md`
- TypeScript types: `/types/Evaluation.ts`, `/types/JobOffer.ts`
- Backend API: `/supabase/functions/server/index.tsx`
