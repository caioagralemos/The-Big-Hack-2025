import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useData } from "../contexts/DataContext";
import { Badge } from "./ui/badge";

const demoStages = [
  { name: "Visualizzato il Link", count: 1250, percentage: 100, color: "#e6f4f1" },
  { name: "Modulo Inviato", count: 894, percentage: 71.5, color: "#b3e0d9" },
  { name: "Approvato dal Filtro IA", count: 594, percentage: 47.5, color: "#66c2b3", drop: 33.6 },
  { name: "Colloquio Programmato", count: 287, percentage: 23.0, color: "#009B9D", drop: 51.7 },
  { name: "Assunto", count: 78, percentage: 6.2, color: "#006F4E", drop: 72.8 },
];

export function CandidateFunnelChart() {
  const { mode, evaluations } = useData();

  const getFunnelData = () => {
    if (mode === 'demo') return demoStages;

    // Cria funil baseado nos dados reais
    const totalEvaluations = evaluations.length;
    
    if (totalEvaluations === 0) {
      return [
        { name: "Visualizzato il Link", count: 0, percentage: 100, color: "#e6f4f1" },
        { name: "Modulo Inviato", count: 0, percentage: 0, color: "#b3e0d9" },
        { name: "Approvato dal Filtro IA", count: 0, percentage: 0, color: "#66c2b3" },
        { name: "Colloquio Programmato", count: 0, percentage: 0, color: "#009B9D" },
        { name: "Assunto", count: 0, percentage: 0, color: "#006F4E" },
      ];
    }

    // Estimativa baseada nos dados disponíveis
    const highScoreCandidates = evaluations.filter(evaluation => {
      const overall = evaluation.overall || {};
      return (overall.total_score || 0) >= 4.0;
    }).length;

    const mediumScoreCandidates = evaluations.filter(evaluation => {
      const overall = evaluation.overall || {};
      return (overall.total_score || 0) >= 3.0;
    }).length;

    // Estimativa de visualizações (assumindo 40% conversion rate)
    const estimatedViews = Math.round(totalEvaluations / 0.4);
    
    const stages: Array<{name: string, count: number, percentage: number, color: string, drop?: number}> = [
      { name: "Visualizzato il Link", count: estimatedViews, percentage: 100, color: "#e6f4f1" },
      { name: "Modulo Inviato", count: totalEvaluations, percentage: Math.round((totalEvaluations / estimatedViews) * 100), color: "#b3e0d9" },
      { name: "Approvato dal Filtro IA", count: mediumScoreCandidates, percentage: Math.round((mediumScoreCandidates / estimatedViews) * 100), color: "#66c2b3" },
      { name: "Colloquio Programmato", count: highScoreCandidates, percentage: Math.round((highScoreCandidates / estimatedViews) * 100), color: "#009B9D" },
      { name: "Assunto", count: Math.round(highScoreCandidates * 0.3), percentage: Math.round((highScoreCandidates * 0.3 / estimatedViews) * 100), color: "#006F4E" },
    ];

    // Calcula drops
    for (let i = 1; i < stages.length; i++) {
      const previousPercentage = stages[i - 1].percentage;
      const currentPercentage = stages[i].percentage;
      const drop = previousPercentage > 0 ? Math.round(((previousPercentage - currentPercentage) / previousPercentage) * 100) : 0;
      stages[i].drop = drop;
    }

    return stages;
  };

  const stages = getFunnelData();

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Flusso di Candidati per Fase</CardTitle>
            <p className="text-sm text-gray-500">
              Identificare i colli di bottiglia nel processo di reclutamento
            </p>
          </div>
          <Badge variant={mode === 'demo' ? "secondary" : "default"}>
            {mode === 'demo' ? "Demo" : "Live Supabase"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stages.map((stage, index) => (
            <div key={index} className="relative">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">{stage.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{stage.count} candidati</span>
                  <span className="text-sm text-gray-500">({stage.percentage}%)</span>
                  {stage.drop && stage.drop > 40 && (
                    <span className="text-sm" style={{ color: "#ED1C24" }}>
                      ↓ {stage.drop}%
                    </span>
                  )}
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-10 relative overflow-hidden">
                <div
                  className="h-10 rounded-full flex items-center justify-end px-4 transition-all duration-500"
                  style={{
                    width: `${stage.percentage}%`,
                    backgroundColor: stage.color,
                  }}
                >
                  <span className="text-sm" style={{ color: index > 2 ? "white" : "#006F4E" }}>
                    {stage.percentage}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-100">
          <p className="text-sm text-red-800">
            <strong>Allerta:</strong> Calo critico del 72,8% tra "Colloquio Programmato" e "Assunto". 
            Rivedere il processo di colloqui.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
