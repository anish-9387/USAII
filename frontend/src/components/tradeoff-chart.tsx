"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { TradeoffAnalysis } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = ["#8b5cf6", "#10b981", "#f59e0b"];

export function TradeoffChart({ tradeoffs }: { tradeoffs: TradeoffAnalysis }) {
  const chartData = tradeoffs.dimensions.map((dim) => {
    const entry: Record<string, string | number> = { dimension: dim };
    tradeoffs.futures.forEach((f) => {
      const score = f.scores.find((s) => s.dimension === dim);
      entry[f.future] = score?.value ?? 0;
    });
    return entry;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Tradeoff Analysis</CardTitle>
        <p className="text-xs text-zinc-400">No rankings — only comparison across dimensions.</p>
      </CardHeader>
      <CardContent>
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData}>
              <PolarGrid stroke="#e4e4e7" />
              <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11, fill: "#71717a" }} />
              <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} />
              {tradeoffs.futures.map((f, i) => (
                <Radar
                  key={f.future}
                  name={f.future}
                  dataKey={f.future}
                  stroke={COLORS[i % COLORS.length]}
                  fill={COLORS[i % COLORS.length]}
                  fillOpacity={0.1}
                />
              ))}
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
