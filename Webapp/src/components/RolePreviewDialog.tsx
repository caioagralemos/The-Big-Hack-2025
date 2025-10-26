import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { JobOffer } from "../types/JobOffer";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { CheckCircle2, Target, TrendingUp, GraduationCap, Users, Briefcase } from "lucide-react";

interface RolePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: JobOffer;
}

export function RolePreviewDialog({ open, onOpenChange, role }: RolePreviewDialogProps) {
  const dimensionIcons = {
    professional_experience: Briefcase,
    technical_skills: Target,
    motivation: TrendingUp,
    education_learning: GraduationCap,
    soft_skills_behavioral: Users,
  };

  const dimensionLabels = {
    professional_experience: "Esperienza Professionale",
    technical_skills: "Competenze Tecniche",
    motivation: "Motivazione",
    education_learning: "Istruzione e Apprendimento",
    soft_skills_behavioral: "Competenze Trasversali",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <DialogTitle className="text-2xl" style={{ color: "#006F4E" }}>
              {role.title}
            </DialogTitle>
            <Badge variant="outline" className="bg-gray-50">
              {role.job_key}
            </Badge>
          </div>
          <DialogDescription>
            Visualizza tutti i dettagli del ruolo, inclusi i criteri di valutazione e i requisiti
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Informazioni Generali */}
          <div>
            <h3 className="text-lg mb-2" style={{ color: "#006F4E" }}>
              Descrizione del Ruolo
            </h3>
            <p className="text-gray-700 leading-relaxed">{role.description}</p>
          </div>

          <Separator />

          {/* Requisiti Chiave */}
          <div>
            <h3 className="text-lg mb-3" style={{ color: "#006F4E" }}>
              Requisiti Chiave
            </h3>
            <div className="space-y-2">
              {role.eligibility_filters.map((filter, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle2 
                    className="w-5 h-5 mt-0.5 flex-shrink-0" 
                    style={{ color: "#009B9D" }} 
                  />
                  <span className="text-gray-700">{filter}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Criteri di Valutazione */}
          <div>
            <h3 className="text-lg mb-4" style={{ color: "#006F4E" }}>
              Criteri di Valutazione
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {Object.entries(role.weights).map(([key, value]) => {
                const Icon = dimensionIcons[key as keyof typeof dimensionIcons];
                const label = dimensionLabels[key as keyof typeof dimensionLabels];
                const percentage = (value * 100).toFixed(0);
                
                return (
                  <Card 
                    key={key} 
                    className="border-2 hover:shadow-md transition-shadow" 
                    style={{ borderColor: "#006F4E20" }}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div 
                          className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: "#e6f4f1" }}
                        >
                          <Icon className="w-7 h-7" style={{ color: "#006F4E" }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-600 mb-1">{label}</p>
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl" style={{ color: "#006F4E" }}>
                              {percentage}
                            </span>
                            <span className="text-lg text-gray-500">%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-3">
                            <div
                              className="h-1.5 rounded-full transition-all"
                              style={{
                                width: `${percentage}%`,
                                backgroundColor: "#009B9D"
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card className="bg-gradient-to-br from-gray-50 to-blue-50 border-0">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: "#009B9D" }}>
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm">
                      <span className="text-gray-600">Somma totale dei pesi:</span>
                      <span className="ml-2" style={{ color: "#006F4E" }}>100%</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Le candidature vengono valutate in base a questi criteri ponderati per calcolare il punteggio finale
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Scala di Valutazione */}
          <div>
            <h3 className="text-lg mb-3" style={{ color: "#006F4E" }}>
              Scala di Valutazione
            </h3>
            
            <Card className="border-2" style={{ borderColor: "#006F4E20" }}>
              <CardContent className="pt-6">
                <p className="text-sm text-gray-600 mb-4">
                  Ogni dimensione viene valutata su una scala da 1 a 5
                </p>
                
                <div className="grid grid-cols-5 gap-2 mb-6">
                  {[
                    { value: 1, label: "Insufficiente", color: "#EF4444" },
                    { value: 2, label: "Base", color: "#F59E0B" },
                    { value: 3, label: "Solido", color: "#EAB308" },
                    { value: 4, label: "Forte", color: "#84CC16" },
                    { value: 5, label: "Eccezionale", color: "#22C55E" }
                  ].map((item) => (
                    <div key={item.value} className="text-center">
                      <div 
                        className="w-full aspect-square rounded-lg flex items-center justify-center mb-2 shadow-sm"
                        style={{ backgroundColor: item.color }}
                      >
                        <span className="text-2xl text-white">{item.value}</span>
                      </div>
                      <p className="text-xs text-gray-700">{item.label}</p>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div>
                  <h4 className="text-sm mb-3" style={{ color: "#006F4E" }}>
                    Descrizione dei Livelli
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#EF4444" }}>
                        <span className="text-white">1</span>
                      </div>
                      <div>
                        <span className="text-gray-900">Insufficiente:</span>
                        <span className="text-gray-600 ml-1">Non soddisfa i requisiti minimi</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#F59E0B" }}>
                        <span className="text-white">2</span>
                      </div>
                      <div>
                        <span className="text-gray-900">Base:</span>
                        <span className="text-gray-600 ml-1">Soddisfa i requisiti minimi</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#EAB308" }}>
                        <span className="text-white">3</span>
                      </div>
                      <div>
                        <span className="text-gray-900">Solido:</span>
                        <span className="text-gray-600 ml-1">Competenze consolidate e affidabili</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#84CC16" }}>
                        <span className="text-white">4</span>
                      </div>
                      <div>
                        <span className="text-gray-900">Forte:</span>
                        <span className="text-gray-600 ml-1">Competenze avanzate e dimostrabili</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#22C55E" }}>
                        <span className="text-white">5</span>
                      </div>
                      <div>
                        <span className="text-gray-900">Eccezionale:</span>
                        <span className="text-gray-600 ml-1">Competenze di livello esperto</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Informazioni Aggiuntive */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">ID:</span>
                <span className="ml-2 text-gray-800">{role.id}</span>
              </div>
              <div>
                <span className="text-gray-600">Company ID:</span>
                <span className="ml-2 text-gray-800">{role.company_id}</span>
              </div>
              <div>
                <span className="text-gray-600">Creato:</span>
                <span className="ml-2 text-gray-800">
                  {role.created_at ? new Date(role.created_at).toLocaleString('it-IT') : 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Aggiornato:</span>
                <span className="ml-2 text-gray-800">
                  {role.updated_at ? new Date(role.updated_at).toLocaleString('it-IT') : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
