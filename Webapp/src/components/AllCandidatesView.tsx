import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { MessageCircle, Eye, Search, Filter, Download, ArrowUpDown } from "lucide-react";
import { Progress } from "./ui/progress";
import { CandidateDetailDialog } from "./CandidateDetailDialog";
import { Section } from "../types/Evaluation";
import { useData } from "../contexts/DataContext";

interface CandidateWithEvaluation {
  id: number;
  name: string;
  role: string;
  matchingScore: number;
  weakestCriteria: string;
  phone: string;
  email?: string;
  appliedDate?: string;
  status?: string;
  sections: Section[];
}

// Mock data - extended from TopCandidatesTable
const allCandidates: CandidateWithEvaluation[] = [
  // Top 6 candidates (from TopCandidatesTable)
  {
    id: 1,
    name: "Maria Rossi",
    role: "Senior Backend Engineer",
    matchingScore: 4.78,
    weakestCriteria: "Competenze Trasversali: 3.2 - Leadership da sviluppare",
    phone: "+39 340 123 4567",
    email: "maria.rossi@email.com",
    appliedDate: "2025-10-20",
    status: "In Revisione",
    sections: [
      {
        name: "Esperienza Professionale",
        section_score: 4.9,
        dimensions: [
          { name: "Anni di esperienza rilevante", score: 5, confidence: "High", justification: "8 anni in sviluppo backend enterprise" },
        ],
        questions: [],
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
    email: "carlo.bianchi@email.com",
    appliedDate: "2025-10-19",
    status: "Contattato",
    sections: [
      {
        name: "Esperienza Professionale",
        section_score: 4.8,
        dimensions: [
          { name: "Anni di esperienza rilevante", score: 5, confidence: "High", justification: "7 anni in aziende tech internazionali" },
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
    email: "anna.ferrari@email.com",
    appliedDate: "2025-10-18",
    status: "In Revisione",
    sections: [
      {
        name: "Competenze Tecniche",
        section_score: 4.9,
        dimensions: [
          { name: "React e TypeScript", score: 5, confidence: "High", justification: "Esperta in React hooks, context, TypeScript avanzato" },
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
    email: "marco.conti@email.com",
    appliedDate: "2025-10-17",
    status: "Da Valutare",
    sections: [
      {
        name: "Competenze Tecniche",
        section_score: 4.8,
        dimensions: [
          { name: "Machine Learning", score: 5, confidence: "High", justification: "Sklearn, TensorFlow, PyTorch" },
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
    email: "laura.moretti@email.com",
    appliedDate: "2025-10-16",
    status: "Contattato",
    sections: [
      {
        name: "Competenze Trasversali",
        section_score: 4.9,
        dimensions: [
          { name: "Leadership", score: 5, confidence: "High", justification: "Guida team cross-functional efficacemente" },
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
    email: "davide.romano@email.com",
    appliedDate: "2025-10-15",
    status: "In Revisione",
    sections: [
      {
        name: "Esperienza Professionale",
        section_score: 4.7,
        dimensions: [
          { name: "Anni di esperienza rilevante", score: 5, confidence: "High", justification: "9 anni in sviluppo enterprise" },
        ],
        questions: [],
        notes: [],
      },
    ],
  },
  // Additional candidates
  {
    id: 7,
    name: "Francesca Martini",
    role: "Frontend Developer",
    matchingScore: 4.25,
    weakestCriteria: "Testing: 3.3 - Esperienza limitata con test E2E",
    phone: "+39 340 789 0123",
    email: "francesca.martini@email.com",
    appliedDate: "2025-10-14",
    status: "Da Valutare",
    sections: [
      {
        name: "Competenze Tecniche",
        section_score: 4.4,
        dimensions: [
          { name: "React", score: 4, confidence: "Med", justification: "Buona conoscenza di React" },
        ],
        questions: [],
        notes: [],
      },
    ],
  },
  {
    id: 8,
    name: "Giuseppe Ricci",
    role: "Senior Backend Engineer",
    matchingScore: 4.18,
    weakestCriteria: "Cloud: 3.4 - Esperienza limitata con Kubernetes",
    phone: "+39 340 890 1234",
    email: "giuseppe.ricci@email.com",
    appliedDate: "2025-10-13",
    status: "Rifiutato",
    sections: [
      {
        name: "Esperienza Professionale",
        section_score: 4.5,
        dimensions: [
          { name: "Backend development", score: 4, confidence: "High", justification: "6 anni di esperienza" },
        ],
        questions: [],
        notes: [],
      },
    ],
  },
  {
    id: 9,
    name: "Silvia Colombo",
    role: "Data Scientist",
    matchingScore: 4.12,
    weakestCriteria: "MLOps: 3.2 - Poca esperienza in produzione",
    phone: "+39 340 901 2345",
    email: "silvia.colombo@email.com",
    appliedDate: "2025-10-12",
    status: "In Revisione",
    sections: [
      {
        name: "Competenze Tecniche",
        section_score: 4.3,
        dimensions: [
          { name: "Python", score: 4, confidence: "High", justification: "Ottima conoscenza Python" },
        ],
        questions: [],
        notes: [],
      },
    ],
  },
  {
    id: 10,
    name: "Roberto Gallo",
    role: "Product Manager",
    matchingScore: 4.05,
    weakestCriteria: "Esperienza Mobile: 3.1 - Background principalmente web",
    phone: "+39 341 012 3456",
    email: "roberto.gallo@email.com",
    appliedDate: "2025-10-11",
    status: "Contattato",
    sections: [
      {
        name: "Esperienza Professionale",
        section_score: 4.2,
        dimensions: [
          { name: "Product management", score: 4, confidence: "Med", justification: "4 anni esperienza PM" },
        ],
        questions: [],
        notes: [],
      },
    ],
  },
  {
    id: 11,
    name: "Chiara Marino",
    role: "Frontend Developer",
    matchingScore: 3.95,
    weakestCriteria: "TypeScript: 3.0 - Conoscenza base",
    phone: "+39 341 123 4567",
    email: "chiara.marino@email.com",
    appliedDate: "2025-10-10",
    status: "Da Valutare",
    sections: [
      {
        name: "Competenze Tecniche",
        section_score: 4.0,
        dimensions: [
          { name: "JavaScript", score: 4, confidence: "Med", justification: "Buona conoscenza JS" },
        ],
        questions: [],
        notes: [],
      },
    ],
  },
  {
    id: 12,
    name: "Alessandro Greco",
    role: "Senior Backend Engineer",
    matchingScore: 3.88,
    weakestCriteria: "Microservizi: 3.1 - Esperienza principalmente monolitica",
    phone: "+39 341 234 5678",
    email: "alessandro.greco@email.com",
    appliedDate: "2025-10-09",
    status: "In Revisione",
    sections: [
      {
        name: "Esperienza Professionale",
        section_score: 4.0,
        dimensions: [
          { name: "Backend", score: 4, confidence: "Med", justification: "5 anni esperienza" },
        ],
        questions: [],
        notes: [],
      },
    ],
  },
  {
    id: 13,
    name: "Valentina Bruno",
    role: "Data Scientist",
    matchingScore: 3.82,
    weakestCriteria: "Settore finanziario: 2.8 - Nessuna esperienza in banking",
    phone: "+39 341 345 6789",
    email: "valentina.bruno@email.com",
    appliedDate: "2025-10-08",
    status: "Rifiutato",
    sections: [
      {
        name: "Competenze Tecniche",
        section_score: 4.1,
        dimensions: [
          { name: "ML", score: 4, confidence: "Med", justification: "Buone competenze ML" },
        ],
        questions: [],
        notes: [],
      },
    ],
  },
  {
    id: 14,
    name: "Matteo Esposito",
    role: "Frontend Developer",
    matchingScore: 3.75,
    weakestCriteria: "Accessibilità: 2.9 - Poca attenzione a WCAG",
    phone: "+39 341 456 7890",
    email: "matteo.esposito@email.com",
    appliedDate: "2025-10-07",
    status: "Da Valutare",
    sections: [
      {
        name: "Competenze Tecniche",
        section_score: 3.9,
        dimensions: [
          { name: "React", score: 4, confidence: "Med", justification: "Esperienza React 3 anni" },
        ],
        questions: [],
        notes: [],
      },
    ],
  },
  {
    id: 15,
    name: "Sofia Lombardi",
    role: "Product Manager",
    matchingScore: 3.68,
    weakestCriteria: "Stakeholder Management: 3.0 - Esperienza limitata",
    phone: "+39 341 567 8901",
    email: "sofia.lombardi@email.com",
    appliedDate: "2025-10-06",
    status: "In Revisione",
    sections: [
      {
        name: "Esperienza Professionale",
        section_score: 3.7,
        dimensions: [
          { name: "PM experience", score: 3, confidence: "Med", justification: "2 anni esperienza" },
        ],
        questions: [],
        notes: [],
      },
    ],
  },
  {
    id: 16,
    name: "Luca Fontana",
    role: "Senior Backend Engineer",
    matchingScore: 3.62,
    weakestCriteria: "Performance: 2.8 - Poca esperienza con sistemi ad alto traffico",
    phone: "+39 341 678 9012",
    email: "luca.fontana@email.com",
    appliedDate: "2025-10-05",
    status: "Rifiutato",
    sections: [
      {
        name: "Competenze Tecniche",
        section_score: 3.8,
        dimensions: [
          { name: "Java", score: 4, confidence: "Med", justification: "4 anni Java" },
        ],
        questions: [],
        notes: [],
      },
    ],
  },
  {
    id: 17,
    name: "Giulia Santoro",
    role: "Data Scientist",
    matchingScore: 3.55,
    weakestCriteria: "SQL: 2.7 - Conoscenza base di database",
    phone: "+39 341 789 0123",
    email: "giulia.santoro@email.com",
    appliedDate: "2025-10-04",
    status: "Da Valutare",
    sections: [
      {
        name: "Competenze Tecniche",
        section_score: 3.7,
        dimensions: [
          { name: "Python", score: 4, confidence: "Med", justification: "Buon Python" },
        ],
        questions: [],
        notes: [],
      },
    ],
  },
  {
    id: 18,
    name: "Andrea Caruso",
    role: "Frontend Developer",
    matchingScore: 3.48,
    weakestCriteria: "State Management: 2.9 - Nessuna esperienza con Redux",
    phone: "+39 341 890 1234",
    email: "andrea.caruso@email.com",
    appliedDate: "2025-10-03",
    status: "In Revisione",
    sections: [
      {
        name: "Competenze Tecniche",
        section_score: 3.6,
        dimensions: [
          { name: "Frontend", score: 3, confidence: "Med", justification: "2 anni esperienza" },
        ],
        questions: [],
        notes: [],
      },
    ],
  },
  {
    id: 19,
    name: "Elisa Vitale",
    role: "Product Manager",
    matchingScore: 3.42,
    weakestCriteria: "Agile: 2.8 - Poca esperienza con metodologie agile",
    phone: "+39 341 901 2345",
    email: "elisa.vitale@email.com",
    appliedDate: "2025-10-02",
    status: "Rifiutato",
    sections: [
      {
        name: "Esperienza Professionale",
        section_score: 3.5,
        dimensions: [
          { name: "PM", score: 3, confidence: "Low", justification: "1 anno esperienza" },
        ],
        questions: [],
        notes: [],
      },
    ],
  },
  {
    id: 20,
    name: "Simone Pellegrini",
    role: "Senior Backend Engineer",
    matchingScore: 3.35,
    weakestCriteria: "DevOps: 2.6 - Nessuna esperienza CI/CD",
    phone: "+39 342 012 3456",
    email: "simone.pellegrini@email.com",
    appliedDate: "2025-10-01",
    status: "Da Valutare",
    sections: [
      {
        name: "Competenze Tecniche",
        section_score: 3.5,
        dimensions: [
          { name: "Backend", score: 3, confidence: "Med", justification: "3 anni esperienza" },
        ],
        questions: [],
        notes: [],
      },
    ],
  },
  {
    id: 21,
    name: "Federica De Luca",
    role: "Data Scientist",
    matchingScore: 3.28,
    weakestCriteria: "Deep Learning: 2.5 - Conoscenza solo teorica",
    phone: "+39 342 123 4567",
    email: "federica.deluca@email.com",
    appliedDate: "2025-09-30",
    status: "In Revisione",
    sections: [
      {
        name: "Istruzione",
        section_score: 4.2,
        dimensions: [
          { name: "Formazione", score: 4, confidence: "High", justification: "Master in Data Science" },
        ],
        questions: [],
        notes: [],
      },
    ],
  },
  {
    id: 22,
    name: "Paolo Marchetti",
    role: "Frontend Developer",
    matchingScore: 3.15,
    weakestCriteria: "Performance: 2.4 - Nessuna esperienza con ottimizzazioni",
    phone: "+39 342 234 5678",
    email: "paolo.marchetti@email.com",
    appliedDate: "2025-09-29",
    status: "Rifiutato",
    sections: [
      {
        name: "Competenze Tecniche",
        section_score: 3.3,
        dimensions: [
          { name: "HTML/CSS", score: 3, confidence: "Med", justification: "Base solida" },
        ],
        questions: [],
        notes: [],
      },
    ],
  },
  {
    id: 23,
    name: "Beatrice Monti",
    role: "Product Manager",
    matchingScore: 3.08,
    weakestCriteria: "Data Analytics: 2.3 - Nessuna esperienza con tool analytics",
    phone: "+39 342 345 6789",
    email: "beatrice.monti@email.com",
    appliedDate: "2025-09-28",
    status: "Da Valutare",
    sections: [
      {
        name: "Motivazione",
        section_score: 4.0,
        dimensions: [
          { name: "Interesse", score: 4, confidence: "High", justification: "Forte motivazione" },
        ],
        questions: [],
        notes: [],
      },
    ],
  },
  {
    id: 24,
    name: "Daniele Serra",
    role: "Senior Backend Engineer",
    matchingScore: 2.95,
    weakestCriteria: "Architettura: 2.2 - Esperienza solo junior",
    phone: "+39 342 456 7890",
    email: "daniele.serra@email.com",
    appliedDate: "2025-09-27",
    status: "Rifiutato",
    sections: [
      {
        name: "Esperienza Professionale",
        section_score: 3.0,
        dimensions: [
          { name: "Backend", score: 3, confidence: "Low", justification: "2 anni esperienza" },
        ],
        questions: [],
        notes: [],
      },
    ],
  },
  {
    id: 25,
    name: "Martina Barone",
    role: "Data Scientist",
    matchingScore: 2.82,
    weakestCriteria: "Statistics: 2.1 - Background non quantitativo",
    phone: "+39 342 567 8901",
    email: "martina.barone@email.com",
    appliedDate: "2025-09-26",
    status: "Rifiutato",
    sections: [
      {
        name: "Istruzione",
        section_score: 2.8,
        dimensions: [
          { name: "Formazione", score: 3, confidence: "Med", justification: "Laurea umanistica" },
        ],
        questions: [],
        notes: [],
      },
    ],
  },
];

export function AllCandidatesView() {
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateWithEvaluation | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [scoreFilter, setScoreFilter] = useState("all");
  const [sortBy, setSortBy] = useState("score-desc");
  
  // Get real data from Supabase
  const { evaluations, jobs, mode } = useData();

  // Transform Supabase data to component format
  const getRealCandidates = () => {
    return evaluations.map((evaluation, index) => {
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
        email: evaluation.candidate_id || `candidato${index + 1}@email.com`,
        appliedDate: new Date(evaluation.timestamp_utc).toLocaleDateString('it-IT'),
        status: overallScore >= 4 ? "Ottimo" : overallScore >= 3 ? "Buono" : "Da valutare",
        sections: [] // Could be expanded to parse evaluation sections
      };
    });
  };

  // Use real data if in live mode, otherwise use demo data
  const candidatesData = mode === 'live' ? getRealCandidates() : allCandidates;

  // Filter and sort candidates
  const filteredAndSortedCandidates = candidatesData
    .filter((candidate) => {
      // Search filter
      const matchesSearch = 
        searchQuery === "" ||
        candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.role.toLowerCase().includes(searchQuery.toLowerCase());

      // Role filter
      let matchesRole = true;
      if (roleFilter !== "all") {
        const roleMap: { [key: string]: string } = {
          backend: "Senior Backend Engineer",
          frontend: "Frontend Developer",
          data: "Data Scientist",
          product: "Product Manager",
        };
        matchesRole = candidate.role === roleMap[roleFilter];
      }

      // Score filter
      let matchesScore = true;
      if (scoreFilter !== "all") {
        if (scoreFilter === "excellent") matchesScore = candidate.matchingScore >= 4.5;
        else if (scoreFilter === "strong") matchesScore = candidate.matchingScore >= 4.0 && candidate.matchingScore < 4.5;
        else if (scoreFilter === "solid") matchesScore = candidate.matchingScore >= 3.5 && candidate.matchingScore < 4.0;
        else if (scoreFilter === "basic") matchesScore = candidate.matchingScore < 3.5;
      }

      return matchesSearch && matchesRole && matchesScore;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "score-desc":
          return b.matchingScore - a.matchingScore;
        case "score-asc":
          return a.matchingScore - b.matchingScore;
        case "date-desc":
          return (b.appliedDate || "").localeCompare(a.appliedDate || "");
        case "date-asc":
          return (a.appliedDate || "").localeCompare(b.appliedDate || "");
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

  // Calculate statistics
  const totalCandidates = filteredAndSortedCandidates.length;
  const excellentCount = filteredAndSortedCandidates.filter(c => c.matchingScore >= 4.5).length;
  const strongCount = filteredAndSortedCandidates.filter(c => c.matchingScore >= 4.0 && c.matchingScore < 4.5).length;
  const toEvaluateCount = filteredAndSortedCandidates.filter(c => c.status === "Da Valutare").length;

  const handleViewDetails = (candidate: CandidateWithEvaluation) => {
    setSelectedCandidate(candidate);
    setDialogOpen(true);
  };

  const handleWhatsAppContact = (phone: string, name: string) => {
    const message = `Olá ${name}, entrei em contato através do sistema de recrutamento...`;
    const cleanPhone = phone ? phone.replace(/\D/g, '') : '';
    const whatsappUrl = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleExport = () => {
    alert("Esportazione candidati in formato CSV/Excel - Da implementare");
  };

  const getStatusBadgeStyle = (status?: string) => {
    switch (status) {
      case "Contattato":
        return "bg-blue-50 border-blue-200 text-blue-700";
      case "In Revisione":
        return "bg-yellow-50 border-yellow-200 text-yellow-700";
      case "Da Valutare":
        return "bg-gray-50 border-gray-200 text-gray-700";
      case "Rifiutato":
        return "bg-red-50 border-red-200 text-red-700";
      default:
        return "bg-gray-50 border-gray-200 text-gray-700";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  return (
    <>
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Tutti i Candidati
                {mode === 'live' && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Database Supabase ({candidatesData.length})
                  </Badge>
                )}
                {mode === 'demo' && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Dati Demo ({candidatesData.length})
                  </Badge>
                )}
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Visualizza, filtra e gestisci tutti i candidati nel sistema
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleExport}
              className="gap-2"
              style={{ borderColor: "#006F4E", color: "#006F4E" }}
            >
              <Download className="w-4 h-4" />
              Esporta
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Cerca per nome, email o competenze..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filtra per ruolo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti i Ruoli</SelectItem>
                <SelectItem value="backend">Backend Engineer</SelectItem>
                <SelectItem value="frontend">Frontend Developer</SelectItem>
                <SelectItem value="data">Data Scientist</SelectItem>
                <SelectItem value="product">Product Manager</SelectItem>
              </SelectContent>
            </Select>
            <Select value={scoreFilter} onValueChange={setScoreFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filtra per score" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti i Punteggi</SelectItem>
                <SelectItem value="excellent">Eccezionale (4.5+)</SelectItem>
                <SelectItem value="strong">Forte (4.0-4.5)</SelectItem>
                <SelectItem value="solid">Solido (3.5-4.0)</SelectItem>
                <SelectItem value="basic">Base (&lt; 3.5)</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[200px]">
                <ArrowUpDown className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Ordina per" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="score-desc">Punteggio (Alto-Basso)</SelectItem>
                <SelectItem value="score-asc">Punteggio (Basso-Alto)</SelectItem>
                <SelectItem value="date-desc">Data (Recente)</SelectItem>
                <SelectItem value="date-asc">Data (Meno Recente)</SelectItem>
                <SelectItem value="name-asc">Nome (A-Z)</SelectItem>
                <SelectItem value="name-desc">Nome (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results Info */}
          <div className="flex items-center justify-between py-2 border-y">
            <p className="text-sm text-gray-600">
              Mostrando <strong>{totalCandidates}</strong> candidati
            </p>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                {excellentCount} Eccellenti
              </Badge>
              <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                {strongCount} Forti
              </Badge>
              <Badge variant="outline" className="bg-gray-50 border-gray-200 text-gray-700">
                {toEvaluateCount} Da Valutare
              </Badge>
            </div>
          </div>

          {/* Candidates Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Ruolo</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Punteggio</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedCandidates.map((candidate) => (
                  <TableRow 
                    key={candidate.id}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleViewDetails(candidate)}
                  >
                    <TableCell>{candidate.name}</TableCell>
                    <TableCell className="text-sm text-gray-600">{candidate.email || "-"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-gray-50 text-xs">
                        {candidate.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{formatDate(candidate.appliedDate)}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span 
                            style={{ 
                              color: candidate.matchingScore >= 4.5 ? "#006F4E" : 
                                     candidate.matchingScore >= 4.0 ? "#009B9D" : 
                                     candidate.matchingScore >= 3.5 ? "#F59E0B" : "#EF4444" 
                            }}
                          >
                            {candidate.matchingScore.toFixed(2)}/5.0
                          </span>
                        </div>
                        <Progress 
                          value={candidate.matchingScore * 20} 
                          className="h-1.5 w-20"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusBadgeStyle(candidate.status)}>
                        {candidate.status || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            handleViewDetails(candidate);
                          }}
                          className="gap-1 h-8 px-2"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            handleWhatsAppContact(candidate.phone, candidate.name);
                          }}
                          className="gap-1 h-8 px-2"
                          style={{ color: "#009B9D" }}
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <CandidateDetailDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        candidate={selectedCandidate}
      />
    </>
  );
}