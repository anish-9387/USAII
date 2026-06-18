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
      <div className="section-label">Layer 6 // Tradeoff Analysis</div>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.01em", margin: "4px 0 8px" }}>
            Layer 6: Tradeoff Analysis
          </h2>
          <div className="status-line">
            <span className="status-dot" />
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12 }}>
              {tradeoffs.dimensions.length} dimensions · {tradeoffs.futures.length} scenarios compared
            </span>
          </div>
        </div>
        <span className="chip chip-indigo">No ranking — only comparison</span>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-label">Radar Comparison</div>
          <div className="card-title">Multi-Dimensional Tradeoff Map</div>
        </div>
        <div className="card-body">
          <div style={{ height: 380 }}>
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
                <Legend
                  wrapperStyle={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, paddingTop: 12 }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Supplementary table */}
      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-header">
          <div className="card-label">Score Breakdown</div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "JetBrains Mono, monospace", fontSize: 12 }}>
            <thead>
              <tr style={{ background: "#F1F5F9" }}>
                <th style={{ padding: "10px 16px", textAlign: "left", borderBottom: "1px solid var(--border)", color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.04em", fontSize: 11 }}>DIMENSION</th>
                {tradeoffs.futures.map((f, i) => (
                  <th key={f.future} style={{ padding: "10px 16px", textAlign: "center", borderBottom: "1px solid var(--border)", color: COLORS[i % COLORS.length], fontWeight: 600, fontSize: 11 }}>
                    {f.future.split(":")[0]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tradeoffs.dimensions.map((dim, di) => (
                <tr key={dim} style={{ background: di % 2 === 0 ? "#FAFAFA" : "#FFFFFF" }}>
                  <td style={{ padding: "8px 16px", borderBottom: "1px solid var(--border)", color: "var(--text-secondary)", fontWeight: 500 }}>{dim}</td>
                  {tradeoffs.futures.map((f, fi) => {
                    const score = f.scores.find((s) => s.dimension === dim)?.value ?? 0;
                    return (
                      <td key={f.future} style={{ padding: "8px 16px", textAlign: "center", borderBottom: "1px solid var(--border)" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                          <div style={{ width: 40, height: 4, background: "#E2E8F0", borderRadius: 2, overflow: "hidden" }}>
                            <div style={{ width: `${score * 10}%`, height: "100%", background: COLORS[fi % COLORS.length], borderRadius: 2 }} />
                          </div>
                          <span style={{ color: COLORS[fi % COLORS.length], fontWeight: 600 }}>{score}</span>
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
