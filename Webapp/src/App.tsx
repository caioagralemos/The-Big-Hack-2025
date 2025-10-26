import { useState, useEffect } from "react";
import { KPICard } from "./components/KPICard";
import { FilterBar } from "./components/FilterBar";
import { ScoreDistributionChart } from "./components/ScoreDistributionChart";
import { DimensionsRadarChart } from "./components/DimensionsRadarChart";
import { CandidateFunnelChart } from "./components/CandidateFunnelChart";
import { TopCandidatesTable } from "./components/TopCandidatesTable";
import { AllCandidatesView } from "./components/AllCandidatesView";
import { RolesManagement } from "./components/RolesManagement";
import { PublicJobApplication } from "./components/PublicJobApplication";
import { DataModeToggle } from "./components/DataModeToggle";
import { DataProvider, useData } from "./contexts/DataContext";
import { JobOffer } from "./types/JobOffer";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./components/ui/tabs";

const creditAgricoleLogo = "/credit-agricole-logo.svg";

function AppContent() {
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedDateRange, setSelectedDateRange] =
    useState("30d");
  const [activeTab, setActiveTab] = useState("statistiche");
  
  // Get real data from Supabase
  const { jobs, evaluations, mode } = useData();

  // Simple routing based on URL
  const [view, setView] = useState<"admin" | "candidate">(
    "admin",
  );
  const [currentRoleId, setCurrentRoleId] = useState<
    string | null
  >(null);

  // Calculate KPIs from real data
  const calculateKPIs = () => {
    if (mode === 'demo') {
      // Return demo KPIs
      return {
        totalApplications: 1250,
        averageScore: "3.8/5.0",
        contactedProfiles: 594,
        averageHiringTime: "28 giorni"
      };
    }

    // Calculate real KPIs from Supabase data
    const totalApplications = evaluations.length;
    
    // Calculate average score from evaluations
    const scoresWithOverall = evaluations.filter(e => e.overall && typeof e.overall === 'object' && e.overall.score);
    const averageScore = scoresWithOverall.length > 0 
      ? (scoresWithOverall.reduce((sum, e) => sum + (e.overall.score || 0), 0) / scoresWithOverall.length).toFixed(1)
      : "0.0";
    
    // Mock contacted profiles (30-50% of applications)
    const contactedProfiles = Math.floor(totalApplications * 0.4);
    
    // Mock average hiring time
    const averageHiringTime = totalApplications > 0 ? "25 giorni" : "N/A";
    
    return {
      totalApplications,
      averageScore: `${averageScore}/5.0`,
      contactedProfiles,
      averageHiringTime
    };
  };

  const kpis = calculateKPIs();

  // Mock role data - in real app this would come from API based on roleId
  const mockRoles = [
    new JobOffer({
      id: "1",
      company_id: "credit-agricole",
      job_key: "backend-engineer-senior-core-banking-2025",
      title: "Senior Backend Engineer - Core Banking Systems",
      description:
        `Crédit Agricole Italia cerca un Senior Backend Engineer per il team Core Banking Systems, responsabile dello sviluppo e dell'evoluzione delle piattaforme che gestiscono milioni di transazioni giornaliere.

**La Tua Missione:**
Sarai parte del team che sviluppa e mantiene i servizi backend mission-critical per le nostre applicazioni bancarie digitali. Lavorerai su sistemi ad alta affidabilità che servono oltre 4 milioni di clienti, garantendo sicurezza, scalabilità e performance eccezionali.

**Cosa Farai:**
• Progettare e implementare microservizi scalabili utilizzando Java/Spring Boot o Python
• Collaborare con team internazionali in un ambiente Agile/Scrum
• Ottimizzare le performance di sistemi ad alto traffico (>10K req/sec)
• Implementare best practice di sicurezza per dati sensibili bancari
• Contribuire all'architettura tecnica e alle decisioni di design
• Mentorare sviluppatori junior e condividere conoscenze tecniche

**L'Ambiente di Lavoro:**
Lavorerai in un ambiente moderno con tecnologie all'avanguardia, cultura DevOps, e opportunità di crescita professionale. Offriamo modalità di lavoro ibrida (3 giorni in presenza, 2 da remoto) nella nostra sede di Milano o Parma.`,
      eligibility_filters: [
        "Minimo 5 anni di esperienza comprovata in sviluppo backend enterprise",
        "Competenza avanzata in Java (Spring Boot, JPA) o Python (Django, FastAPI)",
        "Esperienza concreta con architetture a microservizi e pattern di design",
        "Conoscenza approfondita di database relazionali (PostgreSQL, Oracle) e NoSQL (MongoDB, Redis)",
        "Esperienza pratica con sistemi di messaging e streaming (Kafka, RabbitMQ, AWS SQS)",
        "Familiarità con Docker, Kubernetes e pratiche CI/CD (Jenkins, GitLab CI)",
        "Esperienza con cloud provider (preferibilmente AWS o Azure)",
        "Conoscenza di pratiche di sicurezza applicativa (OWASP, encryption, OAuth2)",
        "Capacità di lavorare in team Agile internazionali",
        "Inglese professionale (B2 minimo) per comunicazione con team esteri",
      ],
      weights: {
        professional_experience: 0.35,
        technical_skills: 0.35,
        motivation: 0.15,
        education_learning: 0.05,
        soft_skills_behavioral: 0.1,
      },
      created_at: "2025-10-15T10:00:00Z",
      updated_at: "2025-10-15T10:00:00Z",
    }),
    new JobOffer({
      id: "2",
      company_id: "credit-agricole",
      job_key: "frontend-developer-digital-banking-2025",
      title: "Frontend Developer - Digital Banking Experience",
      description:
        `Crédit Agricole Italia è alla ricerca di un Frontend Developer talentuoso per il team Digital Banking, focalizzato sulla creazione di esperienze utente eccezionali per i nostri clienti retail e business.

**Il Progetto:**
Contribuirai allo sviluppo della nuova generazione di applicazioni web banking, utilizzate quotidianamente da milioni di clienti per gestire i propri conti, investimenti e operazioni finanziarie. Il tuo lavoro avrà un impatto diretto sulla soddisfazione dei clienti.

**Responsabilità Principali:**
• Sviluppare interfacce utente moderne, responsive e accessibili utilizzando React e TypeScript
• Collaborare strettamente con UX/UI designer per implementare design pixel-perfect
• Ottimizzare le performance frontend per garantire caricamenti rapidi e UX fluida
• Implementare test automatizzati (unit, integration, e2e) per garantire qualità del codice
• Contribuire al design system aziendale e alle librerie di componenti condivisi
• Partecipare a code review e promuovere best practice di sviluppo frontend
• Integrare API REST e GraphQL per connettere frontend a servizi backend

**Tecnologie Utilizzate:**
React, TypeScript, Next.js, Tailwind CSS, GraphQL, Jest, React Testing Library, Cypress, Storybook, Figma

**Cosa Offriamo:**
Ambiente di lavoro stimolante, formazione continua, budget per conferenze e corsi, strumenti moderni (MacBook Pro, monitor 4K), lavoro ibrido flessibile.`,
      eligibility_filters: [
        "Almeno 3 anni di esperienza professionale nello sviluppo frontend",
        "Competenza avanzata in React (hooks, context, performance optimization)",
        "Conoscenza approfondita di TypeScript e JavaScript moderno (ES6+)",
        "Esperienza con framework/library CSS moderni (Tailwind, Styled Components, CSS Modules)",
        "Familiarità con strumenti di testing (Jest, React Testing Library, Cypress, Playwright)",
        "Comprensione solida dei principi di UX/UI e accessibilità web (WCAG)",
        "Esperienza con state management (Redux, Zustand, o React Query)",
        "Conoscenza di build tools e bundlers (Webpack, Vite, Turbopack)",
        "Esperienza con sistemi di versioning (Git) e workflow collaborativi (PR, code review)",
        "Capacità di tradurre design Figma in codice di produzione",
        "Attenzione ai dettagli e passione per l'esperienza utente",
      ],
      weights: {
        professional_experience: 0.25,
        technical_skills: 0.4,
        motivation: 0.15,
        education_learning: 0.1,
        soft_skills_behavioral: 0.1,
      },
      created_at: "2025-10-18T14:30:00Z",
      updated_at: "2025-10-18T14:30:00Z",
    }),
    new JobOffer({
      id: "3",
      company_id: "credit-agricole",
      job_key: "data-scientist-ai-risk-management-2025",
      title: "Data Scientist - AI & Risk Management",
      description:
        `Crédit Agricole Italia cerca un Data Scientist esperto per il team AI & Risk Management, dedicato allo sviluppo di modelli predittivi e soluzioni di intelligenza artificiale per la gestione del rischio creditizio e la prevenzione frodi.

**Il Ruolo:**
Lavorerai su progetti strategici che utilizzano machine learning e AI per migliorare le decisioni di business, ottimizzare il rischio di credito, e proteggere i clienti dalle frodi. I tuoi modelli impatteranno direttamente le strategie di lending e la sicurezza finanziaria.

**Responsabilità:**
• Sviluppare modelli di machine learning per credit scoring e risk assessment
• Creare algoritmi di fraud detection in tempo reale per transazioni bancarie
• Analizzare grandi volumi di dati finanziari per identificare pattern e insights
• Implementare modelli predittivi in ambiente di produzione con MLOps best practices
• Collaborare con business analyst e risk manager per tradurre requisiti in soluzioni tecniche
• Validare modelli secondo normative bancarie (Basel III, IFRS9)
• Documentare metodologie e risultati per audit e compliance

**Stack Tecnologico:**
Python (scikit-learn, TensorFlow, PyTorch), SQL (PostgreSQL, Snowflake), Spark, MLflow, Airflow, Docker, AWS SageMaker, Git, Jupyter

**Ambiente:**
Team multidisciplinare, progetti innovativi con AI, accesso a grandi dataset, infrastruttura cloud moderna, possibilità di pubblicare ricerche.`,
      eligibility_filters: [
        "Laurea Magistrale o PhD in Data Science, Statistica, Matematica, Fisica, o Ingegneria",
        "Minimo 3 anni di esperienza come Data Scientist in contesti enterprise",
        "Competenza avanzata in Python per data analysis e machine learning (Pandas, NumPy, scikit-learn)",
        "Esperienza concreta nello sviluppo di modelli di ML/AI in produzione",
        "Conoscenza approfondita di algoritmi ML (supervised, unsupervised, ensemble methods)",
        "Esperienza con SQL avanzato e gestione di grandi dataset",
        "Familiarità con deep learning frameworks (TensorFlow, PyTorch) è un plus",
        "Conoscenza di MLOps practices e strumenti (MLflow, Kubeflow, SageMaker)",
        "Esperienza nel settore finanziario o in risk management è preferibile",
        "Capacità di comunicare risultati tecnici a stakeholder non tecnici",
        "Pensiero analitico, rigore metodologico e attenzione ai dettagli",
      ],
      weights: {
        professional_experience: 0.25,
        technical_skills: 0.4,
        motivation: 0.15,
        education_learning: 0.15,
        soft_skills_behavioral: 0.05,
      },
      created_at: "2025-10-20T09:15:00Z",
      updated_at: "2025-10-20T09:15:00Z",
    }),
    new JobOffer({
      id: "4",
      company_id: "credit-agricole",
      job_key: "product-manager-mobile-banking-2025",
      title: "Product Manager - Mobile Banking",
      description:
        `Crédit Agricole Italia cerca un Product Manager esperto per guidare l'evoluzione della nostra app mobile banking, utilizzata da oltre 2 milioni di clienti e con rating 4.6/5 sugli store.

**La Sfida:**
Sarai responsabile della strategia e roadmap della nostra app mobile, lavorando per migliorare continuamente l'esperienza dei clienti e introdurre funzionalità innovative che rendano il banking più semplice, sicuro e accessibile.

**Cosa Farai:**
• Definire la vision e strategia di prodotto per l'app mobile banking
• Gestire l'intero ciclo di vita del prodotto, dal discovery al post-launch
• Condurre ricerche utente, interviste, e analisi dati per identificare opportunità
• Collaborare con UX/UI designer per creare esperienze utente eccezionali
• Lavorare con team di sviluppo (iOS, Android, Backend) per delivery di alta qualità
• Analizzare metriche di prodotto (engagement, retention, NPS) e guidare ottimizzazioni
• Gestire stakeholder interni (business, compliance, IT) e allineare priorità
• Coordinare beta testing, A/B test e rollout graduali di nuove feature
• Monitorare competitor e trend di mercato nel digital banking

**Skill Richieste:**
Product management, user research, data analysis, Agile/Scrum, stakeholder management, mobile product experience

**Cosa Offriamo:**
Ruolo strategico con alto impatto, team di talento, budget per sperimentazione, crescita verso ruoli di leadership, formazione continua.`,
      eligibility_filters: [
        "Minimo 4 anni di esperienza come Product Manager, preferibilmente su prodotti digitali/mobile",
        "Track record dimostrabile di prodotti lanciati con successo",
        "Esperienza con metodologie Agile/Scrum e framework di product management (JTBD, OKR)",
        "Forte orientamento data-driven: esperienza con analytics tools (Google Analytics, Mixpanel, Amplitude)",
        "Competenza in user research e usability testing",
        "Capacità di scrivere user stories, requirements e documentazione tecnica",
        "Esperienza di collaborazione con team di design e sviluppo",
        "Eccellenti capacità di stakeholder management e comunicazione",
        "Familiarità con l'ecosistema mobile (iOS, Android) e processi di app store",
        "Esperienza nel settore fintech o banking è un forte plus",
        "Mentalità customer-centric e passione per UX",
        "Capacità di bilanciare esigenze di business, utenti e vincoli tecnici",
      ],
      weights: {
        professional_experience: 0.3,
        technical_skills: 0.2,
        motivation: 0.2,
        education_learning: 0.1,
        soft_skills_behavioral: 0.2,
      },
      created_at: "2025-10-22T11:00:00Z",
      updated_at: "2025-10-22T11:00:00Z",
    }),
  ];

  // Check URL on mount to determine view
  useEffect(() => {
    const path = window.location.pathname;
    const match = path.match(/\/apply\/(.+)/);
    if (match) {
      setCurrentRoleId(match[1]);
      setView("candidate");
    }
  }, []);

  // Get current role for candidate view
  const currentRole = mockRoles.find(
    (r) => r.id === currentRoleId,
  );

  // Candidate view
  if (view === "candidate" && currentRole) {
    return <PublicJobApplication role={currentRole} />;
  }

  // Admin dashboard view

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={creditAgricoleLogo}
                alt="Crédit Agricole"
                className="h-10"
              />
              <div className="border-l border-gray-300 pl-4">
                <h1
                  className="text-xl"
                  style={{ color: "#006F4E" }}
                >
                  Analytics Dashboard
                </h1>
                <p className="text-sm text-gray-600">
                  Sistema di Reclutamento
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DataModeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white border p-1 h-auto gap-2">
            <TabsTrigger
              value="statistiche"
              className="data-[state=active]:bg-[#006F4E] data-[state=active]:text-white px-6 py-3 text-base"
            >
              Statistiche
            </TabsTrigger>
            <TabsTrigger
              value="candidati"
              className="data-[state=active]:bg-[#006F4E] data-[state=active]:text-white px-6 py-3 text-base"
            >
              Tutti i Candidati
            </TabsTrigger>
            <TabsTrigger
              value="roles"
              className="data-[state=active]:bg-[#006F4E] data-[state=active]:text-white px-6 py-3 text-base"
            >
              Gestione Ruoli
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="statistiche"
            className="space-y-8"
          >

            {/* Filters */}
            <FilterBar
              selectedRole={selectedRole}
              selectedDateRange={selectedDateRange}
              onRoleChange={setSelectedRole}
              onDateRangeChange={setSelectedDateRange}
            />

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard
                title="Totale Candidature"
                value={kpis.totalApplications}
                trend={mode === 'demo' ? 12.5 : undefined}
                color="#006F4E"
                subtitle={mode === 'live' ? "Database Supabase" : "vs. mese precedente"}
              />
              <KPICard
                title="Tasso di Corrispondenza Medio"
                value={kpis.averageScore}
                trend={mode === 'demo' ? 5.2 : undefined}
                color="#009B9D"
                subtitle={mode === 'live' ? "Punteggio medio reale" : "Punteggio medio"}
              />
              <KPICard
                title="Profili Contattati"
                value={kpis.contactedProfiles}
                trend={mode === 'demo' ? 8.3 : undefined}
                color="#006F4E"
                subtitle="Via WhatsApp"
              />
              <KPICard
                title="Tempo Medio di Assunzione"
                value={kpis.averageHiringTime}
                trend={mode === 'demo' ? -3.5 : undefined}
                color="#ED1C24"
                subtitle="Giorni fino all'offerta"
              />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ScoreDistributionChart />
              <DimensionsRadarChart />
            </div>

            <div className="grid grid-cols-1 gap-6">
              <CandidateFunnelChart />
            </div>

            {/* Top Candidates Table */}
            <div>
              <TopCandidatesTable onViewAllCandidates={() => setActiveTab("candidati")} />
            </div>
          </TabsContent>

          <TabsContent value="candidati">
            <AllCandidatesView />
          </TabsContent>

          <TabsContent value="roles">
            <RolesManagement />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <p className="text-sm text-gray-500 text-center">
            © 2025 Crédit Agricole - Tutti i diritti riservati
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
}