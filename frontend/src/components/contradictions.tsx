"use client";

import type { Contradiction } from "@/lib/types";

const SEV_STYLE: Record<string, { chip: string; border: string; label: string }> = {
  High: { chip: "bg-red-50 text-red-700", border: "border-red-500", label: "HIGH CONFLICT" },
  Medium: { chip: "bg-amber-50 text-amber-700", border: "border-amber-500", label: "MODERATE CONFLICT" },
  Low: { chip: "bg-emerald-50 text-emerald-700", border: "border-emerald-500", label: "LOW CONFLICT" },
};

export function Contradictions({ contradictions }: { contradictions: Contradiction[] }) {
  return (
    <div>
      <div className="font-mono text-[11px] font-medium text-zinc-400 tracking-wider uppercase flex items-center gap-2 mb-2 after:content-[''] after:flex-1 after:h-px after:bg-zinc-200">
        Layer 4 // Contradiction Detection
      </div>
      <div className="mb-5">
        <h2 className="text-xl sm:text-[28px] font-bold tracking-tight mt-1 mb-2">Layer 4: Contradiction Detection</h2>
        <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
          <span className="w-1.75 h-1.75 rounded-full bg-indigo-500 shrink-0 animate-pulse" />
          <span className="font-mono text-xs">
            {contradictions.length} conflict{contradictions.length !== 1 ? "s" : ""} detected · The AI does not judge — it only illuminates.
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3.5">
        {contradictions.map((c, i) => {
          const sev = SEV_STYLE[c.severity] || SEV_STYLE.Medium;
          const parts = c.conflict.split(/\s+vs\.?\s+|↔|<->|\bvs\b/i);
          const stmtA = parts[0]?.trim() ?? c.conflict;
          const stmtB = parts[1]?.trim() ?? "";

          return (
            <div key={i} className={`bg-white border border-zinc-200 rounded border-l-4 ${sev.border}`}>
              <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 bg-zinc-50">
                <div className="font-mono text-[11px] text-zinc-400">
                  CONFLICT {String(i + 1).padStart(2, "0")}
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded font-mono ${sev.chip}`}>{sev.label}</span>
              </div>
              <div className="p-4">
                {stmtB ? (
                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 items-center mb-3.5">
                    <div className="bg-zinc-50 border border-zinc-200 rounded p-2.5">
                      <div className="font-mono text-[10px] text-zinc-400 mb-1">STATEMENT A</div>
                      <div className="font-semibold text-sm text-zinc-900">{stmtA}</div>
                    </div>
                    <div className="text-center text-xl" style={{ color: sev.border.includes('red') ? '#EF4444' : sev.border.includes('amber') ? '#F59E0B' : '#10B981' }}>⚡</div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded p-2.5">
                      <div className="font-mono text-[10px] text-zinc-400 mb-1">STATEMENT B</div>
                      <div className="font-semibold text-sm text-zinc-900">{stmtB}</div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-zinc-50 border border-zinc-200 rounded p-2.5 mb-3.5">
                    <div className="font-semibold text-sm text-zinc-900">{c.conflict}</div>
                  </div>
                )}
                <div className="font-mono text-xs text-zinc-600 leading-relaxed">{c.explanation}</div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-[11px] text-zinc-400 font-mono">
        These are logical inconsistencies, not moral judgments. You decide what to do with them.
      </p>
    </div>
  );
}
