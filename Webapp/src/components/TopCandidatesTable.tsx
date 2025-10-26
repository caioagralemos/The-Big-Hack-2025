import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { MessageCircle, Eye, Users, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Progress } from "./ui/progress";
import { CandidateDetailDialog } from "./CandidateDetailDialog";
import { Section } from "../types/Evaluation";
import { useData } from "../contexts/DataContext";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface CandidateWithEvaluation {
  id: number;
  name: string;
  role: string;
  matchingScore: number;
  weakestCriteria: string;
  phone: string;
  sections: Section[];
}

interface TopCandidatesTableProps {
  onViewAllCandidates?: () => void;
}

const candidates: CandidateWithEvaluation[] = [
  {
    id: 1,
    name: "Maria Rossi",
    role: "Senior Backend Engineer",
    matchingScore: 4.78,
    weakestCriteria: "Competenze Trasversali: 3.2 - Leadership da sviluppare",
    phone: "+39 340 123 4567",
    sections: [
      {
        name: "Esperienza Professionale",
        section_score: 4.9,
        dimensions: [
          { name: "Anni di esperienza rilevante", score: 5, confidence: "High", justification: "8 anni in sviluppo backend enterprise" },
          { name: "Progetti comparabili", score: 5, confidence: "High", justification: "Ha lavorato su sistemi bancari simili" },
          { name: "Progressione di carriera", score: 5, confidence: "Med", justification: "Crescita costante da junior a senior" },
          { name: "Leadership tecnica", score: 4, confidence: "Med", justification: "Ha guidato piccoli team", data_sources: ["CV", "LinkedIn"] },
        ],
        questions: ["Puoi descrivere il progetto più complesso che hai guidato?"],
        notes: ["Ho guidato la migrazione di un sistema monolitico a microservizi per una banca retail, gestendo un team di 8 sviluppatori. Il progetto è durato 14 mesi e ha coinvolto la modernizzazione di oltre 150 servizi legacy."],
      },
      {
        name: "Competenze Tecniche",
        section_score: 4.8,
        dimensions: [
          { name: "Java/Spring Boot", score: 5, confidence: "High", justification: "Esperta certificata con 6+ anni" },
          { name: "Microservizi e Cloud", score: 5, confidence: "High", justification: "Architetture AWS, Kubernetes" },
          { name: "Database e SQL", score: 5, confidence: "Med", justification: "PostgreSQL, MongoDB, Redis" },
          { name: "CI/CD e DevOps", score: 4, confidence: "Med", justification: "Jenkins, GitLab CI, Docker" },
        ],
        questions: ["Quale approccio usi per garantire la scalabilità dei microservizi?"],
        notes: ["Uso pattern come Circuit Breaker, Event Sourcing e CQRS. Implemento caching distribuito con Redis e utilizzo Kafka per la comunicazione asincrona tra servizi, garantendo così decoupling e scalabilità orizzontale."],
      },
      {
        name: "Motivazione",
        section_score: 4.7,
        dimensions: [
          { name: "Interesse per il ruolo", score: 5, confidence: "High", justification: "Lettera motivazionale dettagliata e personalizzata" },
          { name: "Allineamento con i valori", score: 5, confidence: "Med", justification: "Enfasi su stabilità e innovazione" },
          { name: "Aspettative di carriera", score: 4, confidence: "Med", justification: "Cerca crescita tecnica e manageriale" },
        ],
        questions: ["Cosa ti attrae maggiormente del settore bancario?"],
        notes: ["Mi affascina la combinazione di stabilità del settore finanziario con l'innovazione tecnologica. Lavorare su sistemi che gestiscono transazioni critiche e impattano milioni di utenti mi motiva profondamente."],
      },
      {
        name: "Istruzione e Apprendimento",
        section_score: 4.5,
        dimensions: [
          { name: "Formazione accademica", score: 5, confidence: "High", justification: "Master in Computer Science, 110 e lode" },
          { name: "Certificazioni professionali", score: 4, confidence: "High", justification: "AWS Solutions Architect, Oracle Java" },
          { name: "Apprendimento continuo", score: 4, confidence: "Med", justification: "Corsi recenti su Kafka, Event Sourcing" },
        ],
        questions: [],
        notes: [],
      },
      {
        name: "Competenze Trasversali",
        section_score: 3.2,
        dimensions: [
          { name: "Comunicazione", score: 4, confidence: "Med", justification: "Chiara nel descrivere concetti tecnici" },
          { name: "Lavoro di squadra", score: 4, confidence: "Med", justification: "Esperienza in team distribuiti" },
          { name: "Leadership", score: 2, confidence: "Med", justification: "Limitata esperienza nella gestione di team" },
          { name: "Adattabilità", score: 3, confidence: "Low", justification: "Preferisce contesti strutturati" },
        ],
        questions: ["Come hai gestito situazioni di conflitto nel team?", "Descrivi un momento in cui hai dovuto adattarti rapidamente"],
        notes: [],
      },
    ],
  },
  {
    id: 2,
    name: "Carlo Bianchi",
    role: "Senior Backend Engineer",
    matchingScore: 4.72,
    weakestCriteria: "Istruzione e Apprendimento: 3.5 - Formazione autodidatta",
    phone: "+39 340 234 5678",
    sections: [
      {
        name: "Esperienza Professionale",
        section_score: 4.8,
        dimensions: [
          { name: "Anni di esperienza rilevante", score: 5, confidence: "High", justification: "7 anni in aziende tech internazionali" },
          { name: "Progetti comparabili", score: 5, confidence: "High", justification: "Piattaforme ad alto traffico (fintech)" },
          { name: "Progressione di carriera", score: 5, confidence: "High", justification: "Da developer a tech lead" },
          { name: "Leadership tecnica", score: 4, confidence: "Med", justification: "Guida un team di 5 persone" },
        ],
        questions: [],
        notes: [],
      },
      {
        name: "Competenze Tecniche",
        section_score: 4.9,
        dimensions: [
          { name: "Architetture distribuite", score: 5, confidence: "High", justification: "Esperto in design patterns, DDD" },
          { name: "Performance optimization", score: 5, confidence: "High", justification: "Track record di ottimizzazioni critiche" },
          { name: "Security best practices", score: 5, confidence: "Med", justification: "OWASP, encryption, OAuth2" },
          { name: "Code quality", score: 4, confidence: "High", justification: "TDD, code review, refactoring" },
        ],
        questions: [],
        notes: [],
      },
      {
        name: "Motivazione",
        section_score: 4.6,
        dimensions: [
          { name: "Interesse per il ruolo", score: 5, confidence: "Med", justification: "Attratto da sfide tecniche complesse" },
          { name: "Allineamento con i valori", score: 4, confidence: "Med", justification: "Focus su qualità e innovazione" },
          { name: "Aspettative di carriera", score: 5, confidence: "Med", justification: "Crescita come architect" },
        ],
        questions: [],
        notes: [],
      },
      {
        name: "Istruzione e Apprendimento",
        section_score: 3.5,
        dimensions: [
          { name: "Formazione accademica", score: 3, confidence: "High", justification: "Diploma tecnico, nessuna laurea" },
          { name: "Certificazioni professionali", score: 4, confidence: "High", justification: "Kubernetes CKA, AWS Developer" },
          { name: "Apprendimento continuo", score: 4, confidence: "High", justification: "Contributi open source, speaker a conferenze" },
        ],
        questions: ["Come compensi la mancanza di formazione universitaria?"],
        notes: [],
      },
      {
        name: "Competenze Trasversali",
        section_score: 4.8,
        dimensions: [
          { name: "Comunicazione", score: 5, confidence: "High", justification: "Ottimo communicatore, anche in inglese" },
          { name: "Lavoro di squadra", score: 5, confidence: "High", justification: "Esperienza in team agile distribuiti" },
          { name: "Leadership", score: 5, confidence: "Med", justification: "Mentoring attivo, code review" },
          { name: "Adattabilità", score: 4, confidence: "Med", justification: "Gestisce bene il cambiamento" },
        ],
        questions: [],
        notes: [],
      },
    ],
  },
  {
    id: 3,
    name: "Anna Ferrari",
    role: "Frontend Developer",
    matchingScore: 4.62,
    weakestCriteria: "Esperienza Professionale: 3.8 - Solo 4 anni di esperienza",
    phone: "+39 340 345 6789",
    sections: [
      {
        name: "Esperienza Professionale",
        section_score: 3.8,
        dimensions: [
          { name: "Anni di esperienza rilevante", score: 3, confidence: "High", justification: "4 anni in frontend development" },
          { name: "Progetti comparabili", score: 4, confidence: "Med", justification: "Web app complesse, e-commerce" },
          { name: "Progressione di carriera", score: 4, confidence: "Med", justification: "Junior a mid-level developer" },
          { name: "Leadership tecnica", score: 4, confidence: "Low", justification: "Poca esperienza di mentoring" },
        ],
        questions: ["Descrivi il progetto frontend più sfidante"],
        notes: [],
      },
      {
        name: "Competenze Tecniche",
        section_score: 4.9,
        dimensions: [
          { name: "React e TypeScript", score: 5, confidence: "High", justification: "Esperta in React hooks, context, TypeScript avanzato" },
          { name: "UI/UX Design", score: 5, confidence: "High", justification: "Portfolio eccellente, attenzione ai dettagli" },
          { name: "Testing", score: 5, confidence: "Med", justification: "Jest, React Testing Library, Cypress" },
          { name: "Performance", score: 4, confidence: "Med", justification: "Code splitting, lazy loading, ottimizzazioni" },
        ],
        questions: [],
        notes: [],
      },
      {
        name: "Motivazione",
        section_score: 4.7,
        dimensions: [
          { name: "Interesse per il ruolo", score: 5, confidence: "High", justification: "Passione evidente per UI/UX" },
          { name: "Allineamento con i valori", score: 5, confidence: "Med", justification: "Focus su user experience e accessibilità" },
          { name: "Aspettative di carriera", score: 4, confidence: "Med", justification: "Vuole diventare UI engineer senior" },
        ],
        questions: [],
        notes: [],
      },
      {
        name: "Istruzione e Apprendimento",
        section_score: 4.5,
        dimensions: [
          { name: "Formazione accademica", score: 5, confidence: "High", justification: "Laurea in Digital Design e UX" },
          { name: "Certificazioni professionali", score: 4, confidence: "Med", justification: "Google UX Design Certificate" },
          { name: "Apprendimento continuo", score: 4, confidence: "High", justification: "Corsi su accessibilità, design systems" },
        ],
        questions: [],
        notes: [],
      },
      {
        name: "Competenze Trasversali",
        section_score: 4.8,
        dimensions: [
          { name: "Comunicazione", score: 5, confidence: "Med", justification: "Collabora bene con designer e PM" },
          { name: "Lavoro di squadra", score: 5, confidence: "High", justification: "Esperienza in team cross-functional" },
          { name: "Creatività", score: 5, confidence: "High", justification: "Approccio innovativo ai problemi UI" },
          { name: "Attenzione ai dettagli", score: 4, confidence: "High", justification: "Pixel-perfect implementation" },
        ],
        questions: [],
        notes: [],
      },
    ],
  },
  {
    id: 4,
    name: "Marco Conti",
    role: "Data Scientist",
    matchingScore: 4.54,
    weakestCriteria: "Motivazione: 3.6 - Interesse principalmente tecnico",
    phone: "+39 340 456 7890",
    sections: [
      {
        name: "Esperienza Professionale",
        section_score: 4.6,
        dimensions: [
          { name: "Anni di esperienza rilevante", score: 5, confidence: "High", justification: "5 anni in data science e ML" },
          { name: "Progetti comparabili", score: 4, confidence: "Med", justification: "Modelli predittivi per fintech" },
          { name: "Settore rilevante", score: 5, confidence: "High", justification: "Esperienza in settore finanziario" },
        ],
        questions: [],
        notes: [],
      },
      {
        name: "Competenze Tecniche",
        section_score: 4.8,
        dimensions: [
          { name: "Machine Learning", score: 5, confidence: "High", justification: "Sklearn, TensorFlow, PyTorch" },
          { name: "Python e Data Analysis", score: 5, confidence: "High", justification: "Pandas, NumPy, expert level" },
          { name: "SQL e Database", score: 5, confidence: "High", justification: "SQL avanzato, data warehousing" },
          { name: "Visualizzazione dati", score: 4, confidence: "Med", justification: "Matplotlib, Plotly, Tableau" },
        ],
        questions: [],
        notes: [],
      },
      {
        name: "Motivazione",
        section_score: 3.6,
        dimensions: [
          { name: "Interesse per il ruolo", score: 4, confidence: "Med", justification: "Interessato agli aspetti tecnici" },
          { name: "Allineamento con i valori", score: 3, confidence: "Low", justification: "Focalizzato più su tech che su business" },
          { name: "Aspettative di carriera", score: 4, confidence: "Med", justification: "Vuole approfondire ML in produzione" },
        ],
        questions: ["Cosa ti motiva oltre agli aspetti tecnici?", "Come vedi il tuo impatto nel business?"],
        notes: [],
      },
      {
        name: "Istruzione e Apprendimento",
        section_score: 4.7,
        dimensions: [
          { name: "Formazione accademica", score: 5, confidence: "High", justification: "PhD in Data Science" },
          { name: "Pubblicazioni", score: 5, confidence: "High", justification: "3 paper su ML journals" },
          { name: "Apprendimento continuo", score: 4, confidence: "Med", justification: "Corsi avanzati su deep learning" },
        ],
        questions: [],
        notes: [],
      },
      {
        name: "Competenze Trasversali",
        section_score: 4.5,
        dimensions: [
          { name: "Pensiero analitico", score: 5, confidence: "High", justification: "Eccellente problem solving" },
          { name: "Comunicazione tecnica", score: 4, confidence: "Med", justification: "Buon presenter di risultati" },
          { name: "Lavoro di squadra", score: 4, confidence: "Med", justification: "Collabora con data engineers" },
          { name: "Business acumen", score: 5, confidence: "Low", justification: "Limitata comprensione del business" },
        ],
        questions: [],
        notes: [],
      },
    ],
  },
  {
    id: 5,
    name: "Laura Moretti",
    role: "Product Manager",
    matchingScore: 4.48,
    weakestCriteria: "Competenze Tecniche: 3.4 - Comprensione base delle tecnologie",
    phone: "+39 340 567 8901",
    sections: [
      {
        name: "Esperienza Professionale",
        section_score: 4.5,
        dimensions: [
          { name: "Anni di esperienza rilevante", score: 5, confidence: "High", justification: "6 anni in product management" },
          { name: "Gestione prodotti digitali", score: 4, confidence: "High", justification: "SaaS B2B, piattaforme web" },
          { name: "Track record di successo", score: 5, confidence: "Med", justification: "3 prodotti lanciati con successo" },
        ],
        questions: [],
        notes: [],
      },
      {
        name: "Competenze Tecniche",
        section_score: 3.4,
        dimensions: [
          { name: "Comprensione tecnologie", score: 3, confidence: "Med", justification: "Conoscenza base di architetture web" },
          { name: "Strumenti PM", score: 4, confidence: "High", justification: "Jira, Confluence, Figma, analytics" },
          { name: "Data-driven decisions", score: 4, confidence: "Med", justification: "Uso di analytics e A/B testing" },
          { name: "API e integrazioni", score: 3, confidence: "Low", justification: "Comprensione limitata" },
        ],
        questions: ["Come approfondiresti la tua conoscenza tecnica?"],
        notes: [],
      },
      {
        name: "Motivazione",
        section_score: 4.8,
        dimensions: [
          { name: "Interesse per il ruolo", score: 5, confidence: "High", justification: "Forte passione per prodotti fintech" },
          { name: "Allineamento con i valori", score: 5, confidence: "High", justification: "Customer-centric, innovazione" },
          { name: "Aspettative di carriera", score: 4, confidence: "Med", justification: "VP of Product a lungo termine" },
        ],
        questions: [],
        notes: [],
      },
      {
        name: "Istruzione e Apprendimento",
        section_score: 4.3,
        dimensions: [
          { name: "Formazione accademica", score: 4, confidence: "High", justification: "Laurea in Economia, MBA" },
          { name: "Certificazioni professionali", score: 5, confidence: "High", justification: "Certified Scrum Product Owner" },
          { name: "Apprendimento continuo", score: 4, confidence: "Med", justification: "Corsi su UX research, product analytics" },
        ],
        questions: [],
        notes: [],
      },
      {
        name: "Competenze Trasversali",
        section_score: 4.9,
        dimensions: [
          { name: "Leadership", score: 5, confidence: "High", justification: "Guida team cross-functional efficacemente" },
          { name: "Comunicazione", score: 5, confidence: "High", justification: "Eccellente stakeholder management" },
          { name: "Strategic thinking", score: 5, confidence: "High", justification: "Visione di prodotto a lungo termine" },
          { name: "Empatia e user focus", score: 4, confidence: "High", justification: "User research approfondita" },
        ],
        questions: [],
        notes: [],
      },
    ],
  },
  {
    id: 6,
    name: "Davide Romano",
    role: "Senior Backend Engineer",
    matchingScore: 4.34,
    weakestCriteria: "Competenze Trasversali: 3.1 - Preferisce lavoro individuale",
    phone: "+39 340 678 9012",
    sections: [
      {
        name: "Esperienza Professionale",
        section_score: 4.7,
        dimensions: [
          { name: "Anni di esperienza rilevante", score: 5, confidence: "High", justification: "9 anni in sviluppo enterprise" },
          { name: "Progetti comparabili", score: 5, confidence: "High", justification: "Sistemi bancari legacy modernization" },
          { name: "Progressione di carriera", score: 4, confidence: "Med", justification: "Senior developer, no management" },
        ],
        questions: [],
        notes: [],
      },
      {
        name: "Competenze Tecniche",
        section_score: 4.6,
        dimensions: [
          { name: "Java Enterprise", score: 5, confidence: "High", justification: "JEE, Spring, Hibernate expert" },
          { name: "Cloud e containerizzazione", score: 4, confidence: "Med", justification: "AWS, Docker, in apprendimento K8s" },
          { name: "Database", score: 5, confidence: "High", justification: "Oracle, PostgreSQL, performance tuning" },
          { name: "Integration patterns", score: 4, confidence: "Med", justification: "REST, SOAP, message queues" },
        ],
        questions: [],
        notes: [],
      },
      {
        name: "Motivazione",
        section_score: 4.2,
        dimensions: [
          { name: "Interesse per il ruolo", score: 4, confidence: "Med", justification: "Interessato a nuove opportunità" },
          { name: "Allineamento con i valori", score: 4, confidence: "Low", justification: "Stabilità e buona retribuzione" },
          { name: "Aspettative di carriera", score: 5, confidence: "Med", justification: "Vuole rimanere IC senior" },
        ],
        questions: [],
        notes: [],
      },
      {
        name: "Istruzione e Apprendimento",
        section_score: 4.0,
        dimensions: [
          { name: "Formazione accademica", score: 4, confidence: "High", justification: "Laurea in Informatica" },
          { name: "Certificazioni professionali", score: 4, confidence: "High", justification: "Oracle certified, AWS associate" },
          { name: "Apprendimento continuo", score: 4, confidence: "Low", justification: "Formazione principalmente on-the-job" },
        ],
        questions: ["Come ti tieni aggiornato sulle nuove tecnologie?"],
        notes: [],
      },
      {
        name: "Competenze Trasversali",
        section_score: 3.1,
        dimensions: [
          { name: "Comunicazione", score: 3, confidence: "Med", justification: "Comunicazione essenziale, poco proattiva" },
          { name: "Lavoro di squadra", score: 3, confidence: "Med", justification: "Preferisce lavorare autonomamente" },
          { name: "Leadership", score: 2, confidence: "High", justification: "Nessun interesse in ruoli di guida" },
          { name: "Adattabilità", score: 4, confidence: "Low", justification: "Abituato a metodi tradizionali" },
        ],
        questions: ["Come ti trovi a lavorare in team agile?", "Saresti disposto a fare mentoring?"],
        notes: [],
      },
    ],
  },
];

export function TopCandidatesTable(props: TopCandidatesTableProps = {}) {
  const { onViewAllCandidates } = props;
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateWithEvaluation | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Get real data from Supabase
  const { evaluations, jobs, mode } = useData();

  // Transform Supabase data to component format
  const getRealCandidates = () => {
    return evaluations.slice(0, 10).map((evaluation, index) => {
      // Find corresponding job
      const job = jobs.find(j => j.id === evaluation.job_id);
      
      // Calculate overall score from evaluation data
      let overallScore = 0;
      if (evaluation.overall && typeof evaluation.overall === 'object' && evaluation.overall.score) {
        overallScore = evaluation.overall.score;
      } else {
        // Calculate from pillar scores if available
        const pillars = [
          evaluation.professional_experience,
          evaluation.technical_skills,
          evaluation.motivation,
          evaluation.education_learning,
          evaluation.soft_skills_behavioral
        ].filter(p => p && typeof p === 'object' && p.score);
        
        if (pillars.length > 0) {
          overallScore = pillars.reduce((sum, p) => sum + p.score, 0) / pillars.length;
        }
      }

      return {
        id: index + 1,
        name: evaluation.candidate_name || `Candidato ${index + 1}`,
        role: job?.title || "Posizione non specificata",
        matchingScore: overallScore,
        weakestCriteria: "Analisi in corso...",
        phone: evaluation.candidate_phone || "+39 340 123 456",
        sections: [] // Could be expanded to parse evaluation sections
      };
    });
  };

  // Use real data if in live mode, otherwise use demo data
  const candidatesToShow = mode === 'live' ? getRealCandidates() : candidates;

  const handleWhatsAppContact = (phone: string, name: string) => {
    // In a real application, this would integrate with WhatsApp Business API
    console.log(`Contattando ${name} al ${phone}`);
    alert(`Apertura WhatsApp per contattare ${name}`);
  };

  const handleViewDetails = (candidate: CandidateWithEvaluation) => {
    setSelectedCandidate(candidate);
    setDialogOpen(true);
  };

  const handleViewAllCandidates = () => {
    if (onViewAllCandidates) {
      onViewAllCandidates();
    } else {
      // Fallback if no callback provided
      alert("Navigazione alla vista completa di tutti i candidati");
    }
  };

  // Parse the weakest criteria to get category name and score
  const parseWeakestCriteria = (criteria: string) => {
    const parts = criteria.split(':');
    const category = parts[0]?.trim() || '';
    const details = parts[1]?.trim() || '';
    const scoreMatch = details.match(/(\d+\.?\d*)/);
    const score = scoreMatch ? parseFloat(scoreMatch[1]) : 0;
    const description = details.split('-')[1]?.trim() || details;
    
    return { category, score, description, fullText: criteria };
  };

  // Get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 4.0) return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' };
    if (score >= 3.5) return { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' };
    if (score >= 3.0) return { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300' };
    return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' };
  };

  // Render weakest criteria with tooltip
  const renderWeakestCriteria = (criteria: string) => {
    const { category, score, description, fullText } = parseWeakestCriteria(criteria);
    const colors = getScoreColor(score);

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 cursor-help">
              <AlertCircle className={`w-4 h-4 ${colors.text}`} />
              <div className="flex flex-col gap-1">
                <Badge 
                  variant="outline" 
                  className={`${colors.bg} ${colors.text} ${colors.border} border text-xs`}
                >
                  {category}
                </Badge>
                <span className={`text-xs ${colors.text}`}>
                  {score.toFixed(1)}/5.0
                </span>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p className="text-sm">{description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  // Count how many questions have answers (notes) and total questions
  const getResponseStatus = (candidate: CandidateWithEvaluation) => {
    let totalQuestions = 0;
    let answeredQuestions = 0;

    candidate.sections.forEach(section => {
      totalQuestions += section.questions.length;
      answeredQuestions += section.notes.length;
    });

    return { totalQuestions, answeredQuestions };
  };

  const renderResponseStatus = (candidate: CandidateWithEvaluation) => {
    const { totalQuestions, answeredQuestions } = getResponseStatus(candidate);
    const pendingQuestions = totalQuestions - answeredQuestions;

    if (totalQuestions === 0) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 cursor-help">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
                  <CheckCircle className="w-4 h-4 text-gray-500" />
                </div>
                <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-300">
                  N/A
                </Badge>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Nessuna domanda inviata</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    if (answeredQuestions === 0) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 cursor-help">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100">
                  <Clock className="w-4 h-4 text-orange-600" />
                </div>
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-300">
                  {totalQuestions} in sospeso
                </Badge>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>In attesa - Nessuna domanda risposta</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    if (answeredQuestions === totalQuestions) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 cursor-help">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                  {answeredQuestions}/{totalQuestions}
                </Badge>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Completato - Tutte le domande hanno risposta</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 cursor-help">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
                <Clock className="w-4 h-4 text-blue-600" />
              </div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                {answeredQuestions}/{totalQuestions}
              </Badge>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Parziale - {pendingQuestions} {pendingQuestions === 1 ? 'domanda mancante' : 'domande mancanti'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <>
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>
            Migliori Candidati - Azione Immediata
            {mode === 'live' && (
              <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
                Dati Live Supabase
              </Badge>
            )}
          </CardTitle>
          <p className="text-sm text-gray-500">
            Candidati con il punteggio di corrispondenza più alto pronti per essere contattati
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Ruolo Applicato</TableHead>
                  <TableHead>Punteggio di Corrispondenza</TableHead>
                  <TableHead>Criterio più Debole</TableHead>
                  <TableHead>Stato Risposte</TableHead>
                  <TableHead className="text-right">Azione</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidatesToShow.map((candidate) => (
                  <TableRow 
                    key={candidate.id}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleViewDetails(candidate)}
                  >
                    <TableCell>{candidate.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-gray-50">
                        {candidate.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span style={{ color: "#006F4E" }}>
                            {candidate.matchingScore.toFixed(2)}/5.0
                          </span>
                        </div>
                        <Progress 
                          value={candidate.matchingScore * 20} 
                          className="h-2"
                          style={{ 
                            backgroundColor: "#e5e7eb",
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      {renderWeakestCriteria(candidate.weakestCriteria)}
                    </TableCell>
                    <TableCell>
                      {renderResponseStatus(candidate)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            handleViewDetails(candidate);
                          }}
                          className="gap-2"
                          style={{ borderColor: "#006F4E", color: "#006F4E" }}
                        >
                          <Eye className="w-4 h-4" />
                          Dettagli
                        </Button>
                        <Button
                          size="sm"
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            handleWhatsAppContact(candidate.phone, candidate.name);
                          }}
                          className="gap-2"
                          style={{ backgroundColor: "#009B9D" }}
                        >
                          <MessageCircle className="w-4 h-4" />
                          Contatta
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center border-t bg-gray-50 px-6 py-4">
          <p className="text-sm text-gray-600">
            Mostrando i top 6 candidati. Total candidati nel database: <strong>248</strong>
          </p>
          <Button
            variant="outline"
            onClick={handleViewAllCandidates}
            className="gap-2"
            style={{ borderColor: "#006F4E", color: "#006F4E" }}
          >
            <Users className="w-4 h-4" />
            Vedi Tutti i Candidati
          </Button>
        </CardFooter>
      </Card>

      <CandidateDetailDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        candidate={selectedCandidate}
      />
    </>
  );
}