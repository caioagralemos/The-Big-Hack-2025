import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  trend?: number;
  color: string;
  subtitle?: string;
}

export function KPICard({ title, value, trend, color, subtitle }: KPICardProps) {
  const isPositive = trend && trend > 0;
  const trendColor = isPositive ? "#10b981" : "#ef4444";

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-gray-600">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl" style={{ color }}>
            {value}
          </span>
          {trend !== undefined && (
            <div className="flex items-center gap-1" style={{ color: trendColor }}>
              {isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="text-sm">
                {Math.abs(trend)}%
              </span>
            </div>
          )}
        </div>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}
