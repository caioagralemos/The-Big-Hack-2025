import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from "recharts";
import { useData } from "../contexts/DataContext";
import { Badge } from "./ui/badge";

const demoData = [
  { dimension: "Esperienza Professionale", actual: 4.2, target: 4.5 },
  { dimension: "Competenze Tecniche", actual: 3.8, target: 4.0 },
  { dimension: "Motivazione", actual: 4.5, target: 4.2 },
  { dimension: "Istruzione e Apprendimento", actual: 3.9, target: 4.0 },
  { dimension: "Competenze Trasversali", actual: 4.1, target: 4.3 },
];

export function DimensionsRadarChart() {
  const { mode, evaluations, jobs } = useData();

  const getDimensionsData = () => {
    if (mode === 'demo') return demoData;

    if (!evaluations.length || !jobs.length) return [];

    // Calcula médias por dimensão baseadas nos dados reais
    const dimensions: Record<string, { scores: number[], target: number }> = {
      "Esperienza Professionale": { scores: [], target: 4.5 },
      "Competenze Tecniche": { scores: [], target: 4.0 },
      "Motivazione": { scores: [], target: 4.2 },
      "Istruzione e Apprendimento": { scores: [], target: 4.0 },
      "Competenze Trasversali": { scores: [], target: 4.3 },
    };

    evaluations.forEach(evaluation => {
      // Extrai scores das diferentes seções
      if (evaluation.professional_experience?.section_score) {
        dimensions["Esperienza Professionale"].scores.push(evaluation.professional_experience.section_score);
      }
      if (evaluation.technical_skills?.section_score) {
        dimensions["Competenze Tecniche"].scores.push(evaluation.technical_skills.section_score);
      }
      if (evaluation.motivation?.section_score) {
        dimensions["Motivazione"].scores.push(evaluation.motivation.section_score);
      }
      if (evaluation.education_learning?.section_score) {
        dimensions["Istruzione e Apprendimento"].scores.push(evaluation.education_learning.section_score);
      }
      if (evaluation.soft_skills_behavioral?.section_score) {
        dimensions["Competenze Trasversali"].scores.push(evaluation.soft_skills_behavioral.section_score);
      }
    });

    return Object.entries(dimensions).map(([name, data]) => ({
      dimension: name,
      actual: data.scores.length > 0 
        ? Math.round((data.scores.reduce((a, b) => a + b, 0) / data.scores.length) * 10) / 10
        : 0,
      target: data.target
    }));
  };

  const data = getDimensionsData();

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Rendimento per Dimensione di Valutazione</CardTitle>
            <p className="text-sm text-gray-500">
              Punteggi medi vs. obiettivo ideale del ruolo
            </p>
          </div>
          <Badge variant={mode === 'demo' ? "secondary" : "default"}>
            {mode === 'demo' ? "Demo" : "Live Supabase"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <RadarChart data={data}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis 
              dataKey="dimension" 
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />
            <PolarRadiusAxis angle={90} domain={[0, 5]} />
            <Radar
              name="Punteggio Attuale"
              dataKey="actual"
              stroke="#009B9D"
              fill="#009B9D"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Radar
              name="Obiettivo Ideale"
              dataKey="target"
              stroke="#006F4E"
              fill="#006F4E"
              fillOpacity={0.1}
              strokeWidth={2}
              strokeDasharray="5 5"
            />
            <Legend 
              wrapperStyle={{ paddingTop: "20px" }}
              iconType="line"
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
