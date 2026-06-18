"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { TradeoffAnalysis } from "@/lib/types";

const COLORS = ["#6366F1", "#06B6D4", "#F59E0B"];

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
    <div>
      <div className="font-mono text-[11px] font-medium text-zinc-400 tracking-wider uppercase flex items-center gap-2 mb-2 after:content-[''] after:flex-1 after:h-px after:bg-zinc-200">
        Layer 6 // Tradeoff Analysis
      </div>
      <div className="flex flex-col sm:flex-row items-start justify-between mb-5 gap-3">
        <div>
          <h2 className="text-xl sm:text-[28px] font-bold tracking-tight mt-1 mb-2">Layer 6: Tradeoff Analysis</h2>
          <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
            <span className="w-1.75 h-1.75 rounded-full bg-indigo-500 shrink-0 animate-pulse" />
            <span className="font-mono text-xs">
              {tradeoffs.dimensions.length} dimensions · {tradeoffs.futures.length} scenarios compared
            </span>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded font-mono bg-indigo-50 text-indigo-600">No ranking — only comparison</span>
      </div>

      <div className="bg-white border border-zinc-200 rounded">
        <div className="px-4 py-3 border-b border-zinc-200 bg-zinc-50">
          <div className="text-[11px] font-semibold tracking-wider uppercase text-zinc-400">Radar Comparison</div>
          <div className="text-sm font-bold text-zinc-900 mt-0.5">Multi-Dimensional Tradeoff Map</div>
        </div>
        <div className="p-4">
          <div className="h-95">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={chartData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis
                  dataKey="dimension"
                  tick={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, fill: "#475569" }}
                />
                <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, border: "1px solid #E2E8F0", borderRadius: 4 }}
                />
                {tradeoffs.futures.map((f, i) => (
                  <Radar
                    key={f.future}
                    name={f.future}
                    dataKey={f.future}
                    stroke={COLORS[i % COLORS.length]}
                    fill={COLORS[i % COLORS.length]}
                    fillOpacity={0.08}
                    strokeWidth={2}
                  />
                ))}
                <Legend wrapperStyle={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, paddingTop: 12 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded mt-4">
        <div className="px-4 py-3 border-b border-zinc-200 bg-zinc-50">
          <div className="text-[11px] font-semibold tracking-wider uppercase text-zinc-400">Score Breakdown</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse font-mono text-xs">
            <thead>
              <tr className="bg-zinc-100">
                <th className="px-4 py-2.5 text-left border-b border-zinc-200 text-zinc-400 font-semibold tracking-wider text-[11px]">DIMENSION</th>
                {tradeoffs.futures.map((f, i) => (
                  <th key={f.future} className="px-4 py-2.5 text-center border-b border-zinc-200 font-semibold text-[11px]" style={{ color: COLORS[i % COLORS.length] }}>
                    {f.future.split(":")[0]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tradeoffs.dimensions.map((dim, di) => (
                <tr key={dim} className={di % 2 === 0 ? "bg-zinc-50" : "bg-white"}>
                  <td className="px-4 py-2 border-b border-zinc-200 text-zinc-600 font-medium">{dim}</td>
                  {tradeoffs.futures.map((f, fi) => {
                    const score = f.scores.find((s) => s.dimension === dim)?.value ?? 0;
                    return (
                      <td key={f.future} className="px-4 py-2 text-center border-b border-zinc-200">
                        <div className="flex items-center justify-center gap-1.5">
                          <div className="w-10 h-1 bg-zinc-200 rounded overflow-hidden">
                            <div className="h-full rounded" style={{ width: `${score * 10}%`, background: COLORS[fi % COLORS.length] }} />
                          </div>
                          <span className="font-semibold" style={{ color: COLORS[fi % COLORS.length] }}>{score}</span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
