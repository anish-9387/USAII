"use client";

import type { Contradiction } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const severityColors: Record<string, string> = {
  High: "border-l-red-500",
  Medium: "border-l-amber-500",
  Low: "border-l-blue-500",
};

export function Contradictions({ contradictions }: { contradictions: Contradiction[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Contradictions Detected</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {contradictions.map((c, i) => (
          <div
            key={i}
            className={`rounded-lg border border-zinc-200 border-l-4 p-4 dark:border-zinc-800 ${severityColors[c.severity] || "border-l-zinc-400"}`}
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{c.conflict}</p>
              <span className="shrink-0 text-xs font-medium text-zinc-400">{c.severity}</span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{c.explanation}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
