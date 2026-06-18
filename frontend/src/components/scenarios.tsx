"use client";

import type { Scenario } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const confidenceColors: Record<string, string> = {
  High: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Low: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
};

export function Scenarios({ scenarios }: { scenarios: Scenario[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Counterfactual Futures</CardTitle>
        <p className="text-xs text-zinc-400">These are exploratory scenarios, not predictions.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {scenarios.map((s, i) => (
          <div key={i} className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{s.future}</h3>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${confidenceColors[s.confidence] || ""}`}>
                {s.confidence}
              </span>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">{s.description}</p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">Upside</span>
                <p className="text-zinc-500 dark:text-zinc-400 mt-0.5">{s.upside}</p>
              </div>
              <div>
                <span className="font-medium text-rose-600 dark:text-rose-400">Downside</span>
                <p className="text-zinc-500 dark:text-zinc-400 mt-0.5">{s.downside}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
