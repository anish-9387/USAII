"use client";

import type { Assumption } from "@/lib/types";

const RISK_STYLE: Record<string, { chip: string; border: string }> = {
  High: { chip: "bg-red-50 text-red-700", border: "border-red-500" },
  Medium: { chip: "bg-amber-50 text-amber-700", border: "border-amber-500" },
  Low: { chip: "bg-emerald-50 text-emerald-700", border: "border-emerald-500" },
};
const EVIDENCE_STYLE: Record<string, string> = {
  Strong: "bg-emerald-50 text-emerald-700",
  Moderate: "bg-amber-50 text-amber-700",
  Weak: "bg-red-50 text-red-700",
};

export function AssumptionsList({ assumptions }: { assumptions: Assumption[] }) {
  const highCount = assumptions.filter((a) => a.risk_level === "High").length;

  return (
    <div>
      <div className="font-mono text-[11px] font-medium text-zinc-400 tracking-wider uppercase flex items-center gap-2 mb-2 after:content-[''] after:flex-1 after:h-px after:bg-zinc-200">
        Layer 3 // Assumption Stress Test
      </div>
      <div className="flex flex-col sm:flex-row items-start justify-between mb-5 gap-3">
        <div>
          <h2 className="text-xl sm:text-[28px] font-bold tracking-tight mt-1 mb-2">Layer 3: Assumption Stress Test</h2>
          <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
            <span className="w-1.75 h-1.75 rounded-full bg-indigo-500 shrink-0 animate-pulse" />
            <span className="font-mono text-xs">
              {assumptions.length} assumptions identified · {highCount} high risk
            </span>
          </div>
        </div>
        {highCount > 0 && (
          <div className="bg-white border border-zinc-200 rounded border-l-[3px] border-l-red-500 p-2.5">
            <div className="font-mono text-[11px] text-red-500 font-semibold">
              ⚠ {highCount} HIGH RISK assumption{highCount > 1 ? "s" : ""} detected
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3.5">
        {assumptions.map((a, i) => {
          const riskStyle = RISK_STYLE[a.risk_level] || RISK_STYLE.Medium;
          return (
            <div key={i} className={`bg-white border border-zinc-200 rounded border-l-[3px] ${riskStyle.border}`}>
              <div className="flex items-start justify-between gap-3 px-4 py-3 border-b border-zinc-200 bg-zinc-50">
                <div className="flex-1">
                  <div className="font-mono text-[11px] text-zinc-400 mb-1">
                    ASSUMPTION {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="font-semibold text-sm text-zinc-900 leading-relaxed">{a.assumption}</div>
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded font-mono shrink-0 ${riskStyle.chip}`}>
                  Risk: {a.risk_level}
                </span>
              </div>
              <div className="p-4">
                <div className="flex gap-2 mb-3">
                  <span className="font-mono text-[11px] text-zinc-400">Evidence:</span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded font-mono ${EVIDENCE_STYLE[a.evidence_strength] || "bg-zinc-100 text-zinc-500"}`}>
                    {a.evidence_strength}
                  </span>
                </div>
                <div className="font-mono text-xs text-zinc-600 leading-relaxed bg-zinc-50 p-2.5 rounded border border-zinc-200">
                  <span className="font-semibold text-zinc-900">If this fails: </span>
                  {a.explanation}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
