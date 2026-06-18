"use client";

import type { DecisionExtraction } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";

const sections: { key: keyof DecisionExtraction; label: string; color: string }[] = [
  { key: "goals", label: "Goals", color: "border-l-emerald-500" },
  { key: "constraints", label: "Constraints", color: "border-l-amber-500" },
  { key: "priorities", label: "Priorities", color: "border-l-blue-500" },
  { key: "fears", label: "Fears", color: "border-l-rose-500" },
];

export function ExtractionDisplay({ extraction }: { extraction: DecisionExtraction }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {sections.map(({ key, label, color }) => (
        <Card key={key} className={`border-l-4 ${color}`}>
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold text-zinc-500 mb-2 uppercase tracking-wider">{label}</h3>
            <ul className="space-y-1">
              {extraction[key].map((item, i) => (
                <li key={i} className="text-sm text-zinc-800 dark:text-zinc-200 flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
