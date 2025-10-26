import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Plus, Share2, Eye, Info, Trash2, MoreVertical } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { AddRoleDialog } from "./AddRoleDialog";
import { ShareRoleDialog } from "./ShareRoleDialog";
import { RolePreviewDialog } from "./RolePreviewDialog";
import { CandidatePreviewDialog } from "./CandidatePreviewDialog";
import { JobOffer } from "../types/JobOffer";
import { useData } from "../contexts/DataContext";

const demoRoles = [
  new JobOffer({
    id: "1",
    company_id: "credit-agricole",
    job_key: "backend-engineer-senior-core-banking-2025",
    title: "Senior Backend Engineer - Core Banking Systems",
    description: "Crédit Agricole Italia cerca un Senior Backend Engineer per il team Core Banking Systems, responsabile dello sviluppo e dell'evoluzione delle piattaforme che gestiscono milioni di transazioni giornaliere.",
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
      soft_skills_behavioral: 0.10,
    },
    created_at: "2025-10-15T10:00:00Z",
    updated_at: "2025-10-15T10:00:00Z",
  }),
    new JobOffer({
      id: "2",
      company_id: "credit-agricole",
      job_key: "frontend-developer-digital-banking-2025",
      title: "Frontend Developer - Digital Banking Experience",
      description: "Crédit Agricole Italia è alla ricerca di un Frontend Developer talentuoso per il team Digital Banking, focalizzato sulla creazione di esperienze utente eccezionali per i nostri clienti retail e business.",
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
        technical_skills: 0.40,
        motivation: 0.15,
        education_learning: 0.10,
        soft_skills_behavioral: 0.10,
      },
      created_at: "2025-10-18T14:30:00Z",
      updated_at: "2025-10-18T14:30:00Z",
    }),
    new JobOffer({
      id: "3",
      company_id: "credit-agricole",
      job_key: "data-scientist-ai-risk-management-2025",
      title: "Data Scientist - AI & Risk Management",
      description: "Crédit Agricole Italia cerca un Data Scientist esperto per il team AI & Risk Management, dedicato allo sviluppo di modelli predittivi e soluzioni di intelligenza artificiale per la gestione del rischio creditizio e la prevenzione frodi.",
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
        technical_skills: 0.40,
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
      description: "Crédit Agricole Italia cerca un Product Manager esperto per guidare l'evoluzione della nostra app mobile banking, utilizzata da oltre 2 milioni di clienti e con rating 4.6/5 sugli store.",
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
        professional_experience: 0.30,
        technical_skills: 0.20,
        motivation: 0.20,
        education_learning: 0.10,
        soft_skills_behavioral: 0.20,
      },
      created_at: "2025-10-22T11:00:00Z",
      updated_at: "2025-10-22T11:00:00Z",
    }),
  ];

export function RolesManagement() {
  const { mode, jobs } = useData();
  
  // Usa dados demo quando em modo demo, senão usa dados do Supabase
  const roles = mode === 'demo' ? demoRoles : jobs.map(job => new JobOffer({
    id: job.id,
    company_id: job.company_id || '',
    job_key: job.job_key || '',
    title: job.title || '',
    description: job.description || '',
    eligibility_filters: job.eligibility_filters || [],
    weights: job.weights,
    created_at: job.created_at,
    updated_at: job.updated_at,
  }));

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [shareRole, setShareRole] = useState<JobOffer | null>(null);
  const [previewRole, setPreviewRole] = useState<JobOffer | null>(null);
  const [candidatePreviewRole, setCandidatePreviewRole] = useState<JobOffer | null>(null);
  const [deleteRole, setDeleteRole] = useState<JobOffer | null>(null);

  const handleAddRole = (newRole: JobOffer) => {
    // Em modo demo, não fazemos nada (só visual)
    // Em modo live, seria implementada a integração com o banco
    console.log('Add role:', newRole);
  };

  const handleDeleteRole = () => {
    if (deleteRole) {
      // Em modo demo, não fazemos nada (só visual)
      // Em modo live, seria implementada a integração com o banco
      console.log('Delete role:', deleteRole.id);
      setDeleteRole(null);
    }
  };

  // Mock applicants count - in real app this would come from API
  const getApplicantsCount = (roleId: string): number => {
    const mockCounts: Record<string, number> = {
      "1": 87,
      "2": 64,
      "3": 52,
      "4": 45,
    };
    return mockCounts[roleId] || 0;
  };

  return (
    <>
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gestione Ruoli Aperti</CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Crea e condividi posizioni aperte per raccogliere candidature
              </p>
            </div>
            <Button
              onClick={() => setShowAddDialog(true)}
              className="gap-2"
              style={{ backgroundColor: "#006F4E" }}
            >
              <Plus className="w-4 h-4" />
              Nuovo Ruolo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {roles.map((role) => (
              <div
                key={role.id}
                className="border rounded-lg p-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg" style={{ color: "#006F4E" }}>
                        {role.title}
                      </h3>
                      <Badge variant="outline" className="bg-gray-50">
                        {role.job_key}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="bg-blue-50"
                        style={{ borderColor: "#009B9D", color: "#009B9D" }}
                      >
                        {getApplicantsCount(role.id)} candidati
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{role.description}</p>
                    <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                      <span>📅 Creato: {role.created_at ? new Date(role.created_at).toLocaleDateString('it-IT') : 'N/A'}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPreviewRole(role)}
                      className="gap-2"
                      style={{ color: "#006F4E", borderColor: "#006F4E" }}
                    >
                      <Info className="w-4 h-4" />
                      Maggiori Info
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => setCandidatePreviewRole(role)}
                      style={{ color: "#009B9D", borderColor: "#009B9D" }}
                    >
                      <Eye className="w-4 h-4" />
                      Visualizza Anteprima
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShareRole(role)}
                      className="gap-2"
                      style={{ color: "#ED1C24", borderColor: "#ED1C24" }}
                    >
                      <Share2 className="w-4 h-4" />
                      Condividi
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm transition-all border bg-background text-foreground hover:bg-accent hover:text-accent-foreground h-8 px-2">
                        <MoreVertical className="w-4 h-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                          onClick={() => setDeleteRole(role)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Elimina Ruolo
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AddRoleDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAddRole={handleAddRole}
      />

      {shareRole && (
        <ShareRoleDialog
          open={!!shareRole}
          onOpenChange={(open) => !open && setShareRole(null)}
          role={shareRole}
        />
      )}

      {previewRole && (
        <RolePreviewDialog
          open={!!previewRole}
          onOpenChange={(open) => !open && setPreviewRole(null)}
          role={previewRole}
        />
      )}

      {candidatePreviewRole && (
        <CandidatePreviewDialog
          open={!!candidatePreviewRole}
          onOpenChange={(open) => !open && setCandidatePreviewRole(null)}
          role={candidatePreviewRole}
        />
      )}

      <AlertDialog open={!!deleteRole} onOpenChange={(open: boolean) => !open && setDeleteRole(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Conferma Eliminazione</AlertDialogTitle>
            <AlertDialogDescription>
              Sei sicuro di voler eliminare il ruolo <span className="font-semibold">{deleteRole?.title}</span>?
              <br />
              <br />
              Questa azione non può essere annullata e tutte le candidature associate a questo ruolo potrebbero essere perse.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteRole}
              style={{ backgroundColor: "#ED1C24" }}
              className="hover:opacity-90"
            >
              Elimina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
