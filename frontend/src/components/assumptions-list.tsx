"use client";

import type { Assumption } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const riskColors: Record<string, string> = {
  High: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  Medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Low: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

const evidenceColors: Record<string, string> = {
  Strong: "text-emerald-600 dark:text-emerald-400",
  Moderate: "text-amber-600 dark:text-amber-400",
  Weak: "text-rose-600 dark:text-rose-400",
};

export function AssumptionsList({ assumptions }: { assumptions: Assumption[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Assumption Stress Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {assumptions.map((a, i) => (
          <div key={i} className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
            <div className="flex items-start justify-between gap-2 mb-2">
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{a.assumption}</p>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${riskColors[a.risk_level] || "bg-zinc-100 text-zinc-600"}`}>
                Risk: {a.risk_level}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-zinc-400">Evidence:</span>
              <span className={`text-xs font-medium ${evidenceColors[a.evidence_strength] || ""}`}>{a.evidence_strength}</span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{a.explanation}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
