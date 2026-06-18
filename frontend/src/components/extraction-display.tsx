"use client";

import type { DecisionExtraction } from "@/lib/types";

const PANEL_CONFIG = [
  {
    key: "goals" as const,
    label: "Goals",
    icon: "⚑",
    numbered: true,
  },
  {
    key: "constraints" as const,
    label: "Constraints",
    icon: "⚠",
    numbered: false,
  },
  {
    key: "priorities" as const,
    label: "Priorities",
    icon: "≡",
    numbered: false,
  },
  {
    key: "fears" as const,
    label: "Fears",
    icon: "◎",
    numbered: false,
  },
];

export function ExtractionDisplay({ extraction }: { extraction: DecisionExtraction }) {
  return (
    <div>
      <div className="font-mono text-[11px] font-medium text-zinc-400 tracking-wider uppercase flex items-center gap-2 mb-2 after:content-[''] after:flex-1 after:h-px after:bg-zinc-200">
        Layer 1 // Semantic Extraction
      </div>
      <div className="flex flex-col sm:flex-row items-start justify-between mb-6 gap-3">
        <div>
          <h2 className="text-xl sm:text-[28px] font-bold tracking-tight mt-1 mb-2">Layer 1: Semantic Extraction</h2>
          <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
            <span className="w-1.75 h-1.75 rounded-full bg-indigo-500 shrink-0 animate-pulse" />
            <span className="font-mono text-xs">Parsing unstructured thought stream...</span>
          </div>
        </div>
        <div className="bg-white border border-zinc-200 rounded p-3 min-w-40 w-full sm:w-auto">
          <div className="text-[11px] font-semibold tracking-wider uppercase text-zinc-400">Reasoning Confidence</div>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-zinc-200 rounded overflow-hidden">
              <div className="h-full bg-indigo-500 rounded" style={{ width: "92%" }} />
            </div>
            <span className="font-mono text-sm font-medium text-indigo-500">92%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {PANEL_CONFIG.map((panel) => {
          const items: string[] = extraction[panel.key];
          return (
            <div key={panel.key} className="bg-white border border-zinc-200 rounded">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-200 bg-zinc-50">
                <span className="text-indigo-500 text-sm">{panel.icon}</span>
                <span className="text-[11px] font-semibold tracking-wider uppercase text-zinc-400">{panel.label}</span>
              </div>
              <div className="p-4 flex flex-col gap-2.5">
                {items.map((item, i) => (
                  <div key={i} className={i < items.length - 1 ? "border-b border-zinc-200 pb-2.5" : ""}>
                    <div className="flex items-start gap-2.5">
                      {panel.numbered ? (
                        <span className="text-indigo-500 font-mono text-[11px] font-semibold min-w-4.5 pt-0.5">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0 mt-1.5" />
                      )}
                      <div className="flex-1">
                        <div className="font-semibold text-sm mb-0.5">{item}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-indigo-500 text-sm">◈</span>
          <span className="font-mono text-xs text-zinc-500">Semantic model stable. Ready for next phase.</span>
        </div>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded font-mono bg-indigo-50 text-indigo-600">
          {extraction.goals.length + extraction.constraints.length + extraction.priorities.length + extraction.fears.length} nodes extracted
        </span>
      </div>
    </div>
  );
}
