import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { Briefcase, Target, TrendingUp, GraduationCap, Users, AlertCircle } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Section, Dimension, Confidence } from "../types/Evaluation";

interface CandidateWithEvaluation {
  id: number;
  name: string;
  role: string;
  matchingScore: number;
  weakestCriteria: string;
  phone: string;
  sections: Section[];
}

interface CandidateDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate: CandidateWithEvaluation | null;
}

export function CandidateDetailDialog({ open, onOpenChange, candidate }: CandidateDetailDialogProps) {
  if (!candidate) return null;

  const dimensionIcons = {
    "Esperienza Professionale": Briefcase,
    "Competenze Tecniche": Target,
    "Motivazione": TrendingUp,
    "Istruzione e Apprendimento": GraduationCap,
    "Competenze Trasversali": Users,
  };

  // Prepare data for radar chart
  const radarData = candidate.sections.map(section => ({
    dimension: section.name,
    score: section.section_score,
    fullMark: 5,
  }));

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return "#006F4E"; // Verde Oscuro
    if (score >= 3.5) return "#009B9D"; // Turquesa
    return "#ED1C24"; // Rosso
  };

  const getScoreLabel = (score: number) => {
    if (score >= 4.5) return "Eccezionale";
    if (score >= 4.0) return "Forte";
    if (score >= 3.5) return "Solido";
    if (score >= 2.5) return "Base";
    return "Insufficiente";
  };

  const getConfidenceBadge = (confidence?: Confidence) => {
    if (!confidence) return null;
    const colors = {
      High: { bg: "#006F4E10", border: "#006F4E", text: "#006F4E" },
      Med: { bg: "#009B9D10", border: "#009B9D", text: "#009B9D" },
      Low: { bg: "#ED1C2410", border: "#ED1C24", text: "#ED1C24" },
    };
    const color = colors[confidence];
    return (
      <Badge 
        variant="outline" 
        className="text-xs"
        style={{ 
          backgroundColor: color.bg, 
          borderColor: color.border, 
          color: color.text 
        }}
      >
        {confidence === 'High' ? 'Alta Confidenza' : confidence === 'Med' ? 'Media Confidenza' : 'Bassa Confidenza'}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div>
              <span className="text-2xl">{candidate.name}</span>
              <Badge variant="outline" className="ml-3 bg-gray-50">
                {candidate.role}
              </Badge>
            </div>
          </DialogTitle>
          <VisuallyHidden>
            <DialogDescription>
              Dettaglio completo del punteggio di corrispondenza per {candidate.name} - {candidate.role}
            </DialogDescription>
          </VisuallyHidden>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Overall Score */}
          <div className="p-4 rounded-lg border-2" style={{ borderColor: "#006F4E20", backgroundColor: "#006F4E05" }}>
            <div className="flex items-center justify-between mb-2">
              <h3>Punteggio di Corrispondenza Globale</h3>
              <span className="text-3xl" style={{ color: getScoreColor(candidate.matchingScore) }}>
                {candidate.matchingScore.toFixed(2)}/5.0
              </span>
            </div>
            <Progress 
              value={candidate.matchingScore * 20} 
              className="h-3"
              style={{ backgroundColor: "#e5e7eb" }}
            />
            <p className="text-sm text-gray-600 mt-2">
              {getScoreLabel(candidate.matchingScore)} - Candidato {candidate.matchingScore >= 4.5 ? "fortemente raccomandato" : candidate.matchingScore >= 4.0 ? "raccomandato" : "da valutare"}
            </p>
          </div>

          {/* Radar Chart */}
          <div className="p-4 bg-white rounded-lg border">
            <h3 className="mb-4">Analisi Dimensionale</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis 
                  dataKey="dimension" 
                  tick={{ fill: "#6b7280", fontSize: 11 }}
                />
                <PolarRadiusAxis angle={90} domain={[0, 5]} />
                <Radar
                  name="Punteggio"
                  dataKey="score"
                  stroke="#006F4E"
                  fill="#006F4E"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Detailed Scores with Sub-dimensions */}
          <div className="space-y-4">
            <h3>Dettaglio Punteggi per Dimensione e Sotto-dimensione</h3>
            <Accordion type="multiple" className="space-y-3">
              {candidate.sections.map((section, sectionIndex) => {
                const Icon = dimensionIcons[section.name as keyof typeof dimensionIcons];
                return (
                  <AccordionItem 
                    key={sectionIndex} 
                    value={`section-${sectionIndex}`}
                    className="border rounded-lg overflow-hidden"
                    style={{ borderColor: "#e5e7eb" }}
                  >
                    <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 [&[data-state=open]]:bg-gray-50">
                      <div className="flex items-center gap-3 flex-1">
                        {Icon && (
                          <div className="p-2 rounded-lg" style={{ backgroundColor: "#006F4E10" }}>
                            <Icon className="w-5 h-5" style={{ color: "#006F4E" }} />
                          </div>
                        )}
                        <div className="flex-1 text-left">
                          <div className="flex items-center justify-between">
                            <h4>{section.name}</h4>
                            <div className="flex items-center gap-3 mr-2">
                              <Badge 
                                variant="outline" 
                                style={{ 
                                  borderColor: getScoreColor(section.section_score),
                                  color: getScoreColor(section.section_score),
                                  backgroundColor: `${getScoreColor(section.section_score)}10`
                                }}
                              >
                                {getScoreLabel(section.section_score)}
                              </Badge>
                              <span 
                                className="text-xl"
                                style={{ color: getScoreColor(section.section_score) }}
                              >
                                {section.section_score.toFixed(2)}/5.0
                              </span>
                            </div>
                          </div>
                          <Progress 
                            value={section.section_score * 20} 
                            className="h-2 mt-2"
                            style={{ backgroundColor: "#e5e7eb" }}
                          />
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="space-y-3 mt-2">
                        <p className="text-sm text-gray-600 mb-3">
                          Sotto-dimensioni valutate ({section.dimensions.length}):
                        </p>
                        {section.dimensions.map((dimension, dimIndex) => (
                          <div 
                            key={dimIndex}
                            className="p-3 rounded-lg bg-gray-50 border border-gray-200"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm">{dimension.name}</span>
                                  {getConfidenceBadge(dimension.confidence)}
                                </div>
                                {dimension.justification && (
                                  <p className="text-xs text-gray-600 mt-1 italic">
                                    "{dimension.justification}"
                                  </p>
                                )}
                              </div>
                              <span 
                                className="text-lg ml-3"
                                style={{ color: getScoreColor(dimension.score) }}
                              >
                                {dimension.score}/5
                              </span>
                            </div>
                            <Progress 
                              value={dimension.score * 20} 
                              className="h-1.5"
                              style={{ backgroundColor: "#e5e7eb" }}
                            />
                            {dimension.data_sources && dimension.data_sources.length > 0 && (
                              <div className="mt-2">
                                <p className="text-xs text-gray-500">
                                  Fonti: {dimension.data_sources.join(", ")}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                        
                        {section.questions && section.questions.length > 0 && (
                          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <h5 className="text-sm mb-2 text-blue-900">Domande di Approfondimento:</h5>
                            <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
                              {section.questions.map((q, i) => (
                                <li key={i}>{q}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {section.notes && section.notes.length > 0 && (
                          <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <h5 className="text-sm mb-2 text-green-900">Note dal Candidato:</h5>
                            <ul className="text-xs text-green-800 space-y-1">
                              {section.notes.map((note, i) => (
                                <li key={i}>• {note}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>

          {/* Weakest Area Alert */}
          <div className="p-4 rounded-lg border-2" style={{ borderColor: "#ED1C2420", backgroundColor: "#ED1C2405" }}>
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 mt-0.5" style={{ color: "#ED1C24" }} />
              <div>
                <h4 className="mb-2" style={{ color: "#ED1C24" }}>Area di Attenzione</h4>
                <p className="text-sm text-gray-700">
                  {candidate.weakestCriteria}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Considera di approfondire questa area durante il colloquio
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
