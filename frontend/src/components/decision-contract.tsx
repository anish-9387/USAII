"use client";

import { FileText, Loader2 } from "lucide-react";
import type { FullAnalysis, ReflectionEvaluation } from "@/lib/types";
import { exportFullAnalysisPDF } from "@/lib/pdf-export";
import { useState } from "react";

export function DecisionContractSection({
  analysis,
  userInput,
  reflectionEvaluation,
  reflectionAnswers,
}: {
  analysis: FullAnalysis;
  userInput?: string;
  reflectionEvaluation?: ReflectionEvaluation | null;
  reflectionAnswers?: string[] | null;
}) {
  const [exporting, setExporting] = useState(false);

  const handleExport = () => {
    setExporting(true);
    try {
      exportFullAnalysisPDF(
        userInput || "Decision analysis",
        analysis as unknown as Record<string, unknown>,
        reflectionEvaluation as unknown as Record<string, unknown> | null | undefined,
        reflectionAnswers || null,
      );
    } catch (e) {
      console.error("PDF export failed:", e);
    } finally {
      setExporting(false);
    }
  };

  const layerCount = [
    analysis.extraction,
    analysis.belief_graph,
    analysis.assumptions,
    analysis.contradictions,
    analysis.scenarios,
    analysis.tradeoffs,
    analysis.reflection_questions,
  ].filter(Boolean).length;

  return (
    <div>
      <div className="font-mono text-[11px] font-medium text-zinc-400 tracking-wider uppercase flex items-center gap-2 mb-2 after:content-[''] after:flex-1 after:h-px after:bg-zinc-200">
        Layer 8 // Decision Report
      </div>
      <div className="mb-5">
        <h2 className="text-xl sm:text-[28px] font-bold tracking-tight mt-1 mb-2">Export Full Analysis</h2>
        <p className="font-mono text-sm text-zinc-600 leading-relaxed max-w-160">
          Review your complete decision analysis spanning all layers. Download the PDF report
          containing your problem statement, extracted reasoning, scenarios, tradeoffs, and reflections.
        </p>
      </div>

      <div className="bg-white border border-zinc-200 rounded mb-5">
        <div className="px-4 py-3 border-b border-zinc-200 bg-zinc-50">
          <div className="text-[11px] font-semibold tracking-wider uppercase text-zinc-400">Analysis Summary</div>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {[
              { label: "Layers Analyzed", value: `${layerCount}/7` },
              { label: "Assumptions Tested", value: `${analysis.assumptions.length}` },
              { label: "Scenarios Explored", value: `${analysis.scenarios.length}` },
              { label: "Reflections Answered", value: `${reflectionAnswers?.length || 0}/${analysis.reflection_questions.length}` },
            ].map((stat) => (
              <div key={stat.label} className="bg-zinc-50 border border-zinc-200 rounded p-3 text-center">
                <div className="font-mono text-lg font-bold text-indigo-500">{stat.value}</div>
                <div className="font-mono text-[10px] text-zinc-400 tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <p className="font-mono text-xs text-zinc-400">
              The PDF will include all analysis layers, your reflection answers, and the AI evaluation.
              After reviewing, proceed to Layer 9 to state your chosen path and generate an action plan.
            </p>
            <button
              className="inline-flex items-center gap-1.5 px-4.5 py-2.5 bg-zinc-900 text-white rounded text-sm font-semibold hover:bg-zinc-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              onClick={handleExport}
              disabled={exporting}
            >
              {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
              {exporting ? "Generating PDF..." : "Export Full Analysis to PDF"}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-indigo-50 border border-zinc-200 rounded border-l-[3px] border-l-indigo-500">
        <div className="p-4">
          <div className="font-mono text-[10px] font-semibold text-indigo-500 tracking-wider mb-1.5">▶ NEXT STEP</div>
          <div className="font-bold text-sm text-zinc-900">
            After reviewing your analysis PDF, go to Layer 9 (Action Plan) to state your chosen path. The AI will then build a concrete 90-day execution plan tailored to your decision.
          </div>
        </div>
      </div>
    </div>
  );
}
