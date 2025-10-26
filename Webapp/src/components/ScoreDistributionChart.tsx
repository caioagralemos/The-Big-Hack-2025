import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from "recharts";
import { useData } from "../contexts/DataContext";
import { Badge } from "./ui/badge";

const demoData = [
  { range: "1.0-2.0", count: 45, color: "#9ca3af" },
  { range: "2.0-3.0", count: 128, color: "#009B9D" },
  { range: "3.0-4.0", count: 234, color: "#009B9D" },
  { range: "4.0-5.0", count: 187, color: "#006F4E" },
];

export function ScoreDistributionChart() {
  const { mode, evaluations } = useData();

  const getScoreDistribution = () => {
    if (mode === 'demo') return demoData;

    // Cria distribuição de scores baseada nos dados reais
    const distribution = {
      "1.0-2.0": 0,
      "2.0-3.0": 0, 
      "3.0-4.0": 0,
      "4.0-5.0": 0
    };

    evaluations.forEach(evaluation => {
      // O score total está no campo 'overall' do banco
      const overallData = evaluation.overall || {};
      const score = overallData.total_score || 0;
      if (score >= 1.0 && score < 2.0) distribution["1.0-2.0"]++;
      else if (score >= 2.0 && score < 3.0) distribution["2.0-3.0"]++;
      else if (score >= 3.0 && score < 4.0) distribution["3.0-4.0"]++;
      else if (score >= 4.0 && score <= 5.0) distribution["4.0-5.0"]++;
    });

    return [
      { range: "1.0-2.0", count: distribution["1.0-2.0"], color: "#9ca3af" },
      { range: "2.0-3.0", count: distribution["2.0-3.0"], color: "#009B9D" },
      { range: "3.0-4.0", count: distribution["3.0-4.0"], color: "#009B9D" },
      { range: "4.0-5.0", count: distribution["4.0-5.0"], color: "#006F4E" },
    ];
  };

  const data = getScoreDistribution();

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Distribuzione del Punteggio di Corrispondenza</CardTitle>
            <p className="text-sm text-gray-500">
              Qualità generale del pool di candidati per fascia di punteggio
            </p>
          </div>
          <Badge variant={mode === 'demo' ? "secondary" : "default"}>
            {mode === 'demo' ? "Demo" : "Live Supabase"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "white", 
                border: "1px solid #e5e7eb",
                borderRadius: "8px"
              }}
            />
            <ReferenceLine 
              x="3.0-4.0" 
              stroke="#009B9D" 
              strokeDasharray="5 5"
              label={{ value: "Soglia di Contatto", position: "top", fill: "#009B9D" }}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: "#006F4E" }}></div>
            <span>Punteggio Alto (4-5)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: "#009B9D" }}></div>
            <span>Punteggio Medio (2-4)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: "#9ca3af" }}></div>
            <span>Punteggio Basso (1-2)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
