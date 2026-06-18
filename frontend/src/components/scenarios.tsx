/* eslint-disable react/jsx-no-comment-textnodes */
"use client";

import type { Scenario } from "@/lib/types";

const SCENARIO_STYLES = [
  { border: "border-indigo-500", chip: "bg-indigo-50 text-indigo-600", bg: "bg-indigo-50", accent: "text-indigo-500" },
  { border: "border-cyan-500",   chip: "bg-cyan-50 text-cyan-600",   bg: "bg-cyan-50",   accent: "text-cyan-600" },
  { border: "border-amber-500",  chip: "bg-amber-50 text-amber-700", bg: "bg-amber-50",  accent: "text-amber-600" },
];

const CONF_CHIP: Record<string, string> = {
  High: "bg-emerald-50 text-emerald-700",
  Medium: "bg-amber-50 text-amber-700",
  Low: "bg-red-50 text-red-700",
};

export function Scenarios({ scenarios }: { scenarios: Scenario[] }) {
  return (
    <div>
      <div className="font-mono text-[11px] font-medium text-zinc-400 tracking-wider uppercase flex items-center gap-2 mb-2 after:content-[''] after:flex-1 after:h-px after:bg-zinc-200">
        Layer 5 // Counterfactual Futures
      </div>
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-xl sm:text-[28px] font-bold tracking-tight mt-1 mb-2">Layer 5: Future Scenarios</h2>
          <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
            <span className="w-1.75 h-1.75 rounded-full bg-indigo-500 shrink-0 animate-pulse" />
            <span className="font-mono text-xs">
              {scenarios.length} scenarios generated · exploratory simulations only
            </span>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded font-mono bg-red-50 text-red-700 font-bold shrink-0">
          SCENARIO — NOT A PREDICTION
        </span>
      </div>

      <div className="flex flex-col gap-5">
        {scenarios.map((s, i) => {
          const style = SCENARIO_STYLES[i % SCENARIO_STYLES.length];
          return (
            <div key={i} className={`bg-white border border-zinc-200 rounded border-l-[3px] ${style.border}`}>
              <div className={`flex items-center justify-between px-4 py-3 ${style.bg}`}>
                <div>
                  <div className={`font-mono text-[10px] font-semibold tracking-wider ${style.accent}`}>
                    FUTURE {String.fromCharCode(65 + i)} // SCENARIO
                  </div>
                  <div className="font-bold text-sm mt-0.5">{s.future}</div>
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded font-mono ${CONF_CHIP[s.confidence] ?? "bg-zinc-100 text-zinc-500"}`}>
                  Confidence: {s.confidence}
                </span>
              </div>
              <div className="p-4">
                <p className="font-mono text-sm text-zinc-600 leading-relaxed mb-4">{s.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3.5">
                  <div className="bg-emerald-50 border border-emerald-200 rounded p-2.5">
                    <div className="font-mono text-[10px] font-semibold text-emerald-700 tracking-wider mb-1.5">↑ UPSIDE</div>
                    <div className="text-sm text-zinc-900 leading-relaxed">{s.upside}</div>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded p-2.5">
                    <div className="font-mono text-[10px] font-semibold text-red-700 tracking-wider mb-1.5">↓ DOWNSIDE</div>
                    <div className="text-sm text-zinc-900 leading-relaxed">{s.downside}</div>
                  </div>
                </div>
                <div className="bg-zinc-50 border border-zinc-200 rounded p-2.5">
                  <div className="font-mono text-[10px] font-semibold text-zinc-400 tracking-wider mb-1.5">CRITICAL ASSUMPTIONS</div>
                  <div className="font-mono text-xs text-zinc-600 leading-relaxed">{s.critical_assumptions}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-[11px] text-zinc-400 font-mono">
        These scenarios are exploratory simulations, not predictions. Confidence levels are indicative, not deterministic.
      </p>
    </div>
  );
}
