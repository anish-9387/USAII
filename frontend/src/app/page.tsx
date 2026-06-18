"use client";

import { useState } from "react";
import type { FullAnalysis } from "@/lib/types";
import { apiPost } from "@/lib/api";
import { ChatInput } from "@/components/chat-input";
import { ExtractionDisplay } from "@/components/extraction-display";
import { BeliefGraph } from "@/components/belief-graph";
import { AssumptionsList } from "@/components/assumptions-list";
import { Contradictions } from "@/components/contradictions";
import { Scenarios } from "@/components/scenarios";
import { TradeoffChart } from "@/components/tradeoff-chart";
import { ReflectionQuestions } from "@/components/reflection-questions";
import { DecisionContractSection } from "@/components/decision-contract";
import { ActionPlanSection } from "@/components/action-plan";
import { Layers, Brain, AlertTriangle, GitBranch, Scale, FileText, Target, Eye } from "lucide-react";

const LAYERS = [
  { id: "input", label: "Input", icon: Layers },
  { id: "extraction", label: "Extraction", icon: Brain },
  { id: "graph", label: "Belief Graph", icon: GitBranch },
  { id: "assumptions", label: "Assumptions", icon: AlertTriangle },
  { id: "contradictions", label: "Contradictions", icon: Scale },
  { id: "scenarios", label: "Futures", icon: Eye },
  { id: "tradeoffs", label: "Tradeoffs", icon: GitBranch },
  { id: "reflect", label: "Reflect", icon: Brain },
  { id: "contract", label: "Contract", icon: FileText },
  { id: "action", label: "Action", icon: Target },
];

export default function Home() {
  const [analysis, setAnalysis] = useState<FullAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeLayer, setActiveLayer] = useState("input");
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (message: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiPost<FullAnalysis>("/api/analyze", { message });
      setAnalysis(data);
      setActiveLayer("extraction");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to analyze");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Parallax</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Don&apos;t ask AI what to do. Ask AI to help you think.
        </p>
        <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
          AI Decision Intelligence System &mdash; Human-in-the-loop. Always.
        </p>
      </header>

      {analysis && (
        <nav className="mb-8 flex flex-wrap gap-1.5 justify-center">
          {LAYERS.map((layer) => {
            const Icon = layer.icon;
            const isActive = activeLayer === layer.id;
            const isAvailable =
              layer.id === "input" ||
              (analysis &&
                (layer.id !== "contract" || true) &&
                (layer.id !== "action" || true));
            return (
              <button
                key={layer.id}
                onClick={() => isAvailable && setActiveLayer(layer.id)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900"
                    : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
                }`}
              >
                <Icon className="h-3 w-3" />
                {layer.label}
              </button>
            );
          })}
        </nav>
      )}

      <div className="space-y-8">
        {activeLayer === "input" && (
          <section>
            <h2 className="mb-4 text-center text-lg font-semibold">Describe Your Situation</h2>
            <ChatInput onAnalyze={handleAnalyze} loading={loading} />
            {error && (
              <p className="mt-4 text-center text-sm text-rose-500">{error}</p>
            )}
          </section>
        )}

        {analysis && activeLayer === "extraction" && (
          <section>
            <h2 className="mb-4 text-lg font-semibold">Decision Extraction</h2>
            <ExtractionDisplay extraction={analysis.extraction} />
          </section>
        )}

        {analysis && activeLayer === "graph" && (
          <section>
            <BeliefGraph graph={analysis.belief_graph} />
          </section>
        )}

        {analysis && activeLayer === "assumptions" && (
          <section>
            <AssumptionsList assumptions={analysis.assumptions} />
          </section>
        )}

        {analysis && activeLayer === "contradictions" && (
          <section>
            <Contradictions contradictions={analysis.contradictions} />
          </section>
        )}

        {analysis && activeLayer === "scenarios" && (
          <section>
            <Scenarios scenarios={analysis.scenarios} />
          </section>
        )}

        {analysis && activeLayer === "tradeoffs" && (
          <section>
            <TradeoffChart tradeoffs={analysis.tradeoffs} />
          </section>
        )}

        {analysis && activeLayer === "reflect" && (
          <section>
            <ReflectionQuestions questions={analysis.reflection_questions} />
          </section>
        )}

        {analysis && activeLayer === "contract" && (
          <section>
            <DecisionContractSection analysis={analysis} />
          </section>
        )}

        {analysis && activeLayer === "action" && (
          <section>
            <ActionPlanSection analysis={analysis} />
          </section>
        )}
      </div>

      <footer className="mt-16 border-t border-zinc-200 pt-6 text-center text-xs text-zinc-400 dark:border-zinc-800">
        <p>Parallax — AI Decision Intelligence System for the USAII Global AI Hackathon 2026</p>
        <p className="mt-1">
          These are exploratory simulations, not predictions. You remain in control of your decisions.
        </p>
      </footer>
    </div>
  );
}
