"use client";

import { useState } from "react";
import { Loader2, FileText } from "lucide-react";
import type { ActionPlan, FullAnalysis } from "@/lib/types";
import { apiPost } from "@/lib/api";
import { exportActionPlanPDF } from "@/lib/pdf-export";

const TIMELINE_COLORS = ["text-indigo-500", "text-zinc-500", "text-zinc-400"];

export function ActionPlanSection({ analysis }: { analysis: FullAnalysis }) {
  const [plan, setPlan] = useState<ActionPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [decision, setDecision] = useState("");

  const generate = async () => {
    if (!decision.trim()) return;
    setLoading(true);
    try {
      const data = await apiPost<ActionPlan>("/api/action-plan", { decision, extraction: analysis.extraction });
      setPlan(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    if (!plan) return;
    setExporting(true);
    try {
      exportActionPlanPDF(
        plan as unknown as Record<string, unknown>,
        decision,
      );
    } catch (e) {
      console.error("PDF export failed:", e);
    } finally {
      setExporting(false);
    }
  };

  const phases = plan ? [
    { label: "Days 1\u201330", steps: plan.plan_30_day, color: TIMELINE_COLORS[0] },
    { label: "Days 31\u201360", steps: plan.plan_60_day, color: TIMELINE_COLORS[1] },
    { label: "Days 61\u201390", steps: plan.plan_90_day, color: TIMELINE_COLORS[2] },
  ] : [];

  return (
    <div>
      <div className="font-mono text-[11px] font-medium text-zinc-400 tracking-wider uppercase flex items-center gap-2 mb-2 after:content-[''] after:flex-1 after:h-px after:bg-zinc-200">
        Layer 9 // Action Plan
      </div>
      <div className="mb-5">
        <h2 className="text-xl sm:text-[28px] font-bold tracking-tight mt-1 mb-2">Immediate Execution Timeline</h2>
        <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
          <span className="w-1.75 h-1.75 rounded-full bg-indigo-500 shrink-0 animate-pulse" />
          <span className="font-mono text-xs">90-day action plan generated after decision</span>
        </div>
      </div>

      {!plan && (
        <div className="bg-white border border-zinc-200 rounded">
          <div className="px-4 py-3 border-b border-zinc-200 bg-zinc-50">
            <div className="text-[11px] font-semibold tracking-wider uppercase text-zinc-400">State Your Chosen Path</div>
          </div>
          <div className="p-4">
            <p className="font-mono text-xs text-zinc-400 mb-2.5">
              After reviewing the exported analysis from Layer 8, state the path you have chosen.
              The AI will build a concrete 90-day execution plan tailored to your decision.
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                value={decision}
                onChange={(e) => setDecision(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && generate()}
                placeholder="Enter your chosen path..."
                className="font-mono text-sm px-3 py-2.5 border border-zinc-200 rounded bg-white text-zinc-900 w-full outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
              <button
                className="inline-flex items-center gap-1.5 px-4.5 py-2 bg-indigo-500 text-white rounded text-sm font-semibold hover:bg-indigo-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                onClick={generate}
                disabled={!decision.trim() || loading}
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "▶"}
                {loading ? "Generating..." : "Generate Plan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {plan && (
        <>
          <div className="flex justify-end mb-4">
            <button
              className="inline-flex items-center gap-1.5 px-4.5 py-2 bg-zinc-900 text-white rounded text-sm font-semibold hover:bg-zinc-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={handleExportPDF}
              disabled={exporting}
            >
              {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
              {exporting ? "Generating PDF..." : "Download Action Plan PDF"}
            </button>
          </div>

          <div className="bg-indigo-50 border border-zinc-200 rounded border-l-[3px] border-l-indigo-500 mb-5">
            <div className="p-4">
              <div className="font-mono text-[10px] font-semibold text-indigo-500 tracking-wider mb-1.5">▶ FIRST ACTION &mdash; DO THIS TODAY</div>
              <div className="font-bold text-base text-zinc-900">{plan.first_action}</div>
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded mb-4">
            <div className="px-4 py-3 border-b border-zinc-200 bg-zinc-50">
              <div className="text-[11px] font-semibold tracking-wider uppercase text-zinc-400">Execution Timeline</div>
              <div className="text-sm font-bold text-zinc-900 mt-0.5">90-Day Roadmap</div>
            </div>
            <div className="p-4">
              {phases.map((phase, pi) => (
                <div key={phase.label} className={pi < phases.length - 1 ? "mb-5" : ""}>
                  <div className={`font-mono text-xs font-semibold mb-2.5 ${phase.color}`}>{phase.label}</div>
                  <div className="flex flex-col gap-2 pl-4 border-l-2" style={{ borderColor: phase.color.replace('text-', '').includes('indigo') ? '#6366F1' : phase.color.includes('500') ? '#737373' : '#a1a1aa' }}>
                    {phase.steps.map((step, i) => (
                      <div key={i} className="flex gap-2.5 items-start">
                        <span className={`shrink-0 mt-0.5 ${phase.color}`}>◎</span>
                        <div>
                          <div className="font-semibold text-sm">{step.title}</div>
                          <div className="font-mono text-[11px] text-zinc-400 leading-relaxed mt-0.5">{step.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-zinc-200 rounded">
              <div className="px-4 py-3 border-b border-zinc-200 bg-zinc-50">
                <div className="text-[11px] font-semibold tracking-wider uppercase text-zinc-400">Risk Mitigation</div>
              </div>
              <div className="p-4 flex flex-col gap-2">
                {plan.risk_mitigation.map((r, i) => (
                  <div key={i} className="flex gap-2 font-mono text-xs text-zinc-600">
                    <span className="text-amber-500 shrink-0">⚠</span>
                    {r}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white border border-zinc-200 rounded">
              <div className="px-4 py-3 border-b border-zinc-200 bg-zinc-50">
                <div className="text-[11px] font-semibold tracking-wider uppercase text-zinc-400">Assumptions to Validate</div>
              </div>
              <div className="p-4 flex flex-col gap-2">
                {plan.assumptions_to_validate.map((a, i) => (
                  <label key={i} className="flex gap-2 cursor-pointer font-mono text-xs text-zinc-600 items-start">
                    <input type="checkbox" className="mt-0.5 accent-indigo-500" />
                    {a}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
