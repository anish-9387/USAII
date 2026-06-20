/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";

import { useState } from "react";
import type { FullAnalysis, ReflectionEvaluation } from "@/lib/types";
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
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

type LayerId = "input" | "extraction" | "graph" | "assumptions" | "contradictions" | "scenarios" | "tradeoffs" | "reflect" | "contract" | "action";

const NAV_GROUPS = [
  {
    label: "Analysis",
    items: [
      { id: "extraction" as LayerId, label: "Extraction" },
      { id: "graph" as LayerId, label: "Belief Graphs" },
      { id: "assumptions" as LayerId, label: "Stress Tests" },
      { id: "contradictions" as LayerId, label: "Contradictions" },
    ],
  },
  {
    label: "Futures",
    items: [
      { id: "scenarios" as LayerId, label: "Future Scenarios" },
      { id: "tradeoffs" as LayerId, label: "Tradeoff Analysis" },
      { id: "reflect" as LayerId, label: "Reflection" },
    ],
  },
  {
    label: "Decision",
    items: [
      { id: "contract" as LayerId, label: "Decision Contract" },
      { id: "action" as LayerId, label: "Action Plan" },
    ],
  },
];

const MOBILE_TABS: { id: LayerId; label: string }[] = [
  { id: "extraction", label: "Extract" },
  { id: "graph", label: "Graph" },
  { id: "assumptions", label: "Stress" },
  { id: "contradictions", label: "Conflict" },
  { id: "scenarios", label: "Futures" },
  { id: "tradeoffs", label: "Tradeoffs" },
  { id: "reflect", label: "Reflect" },
  { id: "contract", label: "Report" },
  { id: "action", label: "Action" },
];

const LOADING_STEPS = [
  "Parsing unstructured thought stream...",
  "Extracting goals, constraints, and fears...",
  "Mapping belief relationships...",
  "Running assumption stress test...",
  "Detecting contradictions...",
  "Generating future scenarios...",
  "Analyzing tradeoffs...",
  "Generating reflection questions...",
  "Finalizing analysis...",
];

export default function AppPage() {
  const router = useRouter();
  const [analysis, setAnalysis] = useState<FullAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeLayer, setActiveLayer] = useState<LayerId>("input");
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [reflectionAnswers, setReflectionAnswers] = useState<string[] | null>(null);
  const [reflectionEval, setReflectionEval] = useState<ReflectionEvaluation | null>(null);

  const handleAnalyze = async (message: string) => {
    setLoading(true);
    setError(null);
    setUserInput(message);
    let stepIdx = 0;
    setLoadingStep(LOADING_STEPS[0]);
    const interval = setInterval(() => {
      stepIdx = (stepIdx + 1) % LOADING_STEPS.length;
      setLoadingStep(LOADING_STEPS[stepIdx]);
    }, 1800);
    try {
      const data = await apiPost<FullAnalysis>("/api/analyze", { message });
      setAnalysis(data);
      setActiveLayer("extraction");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed. Please try again.");
    } finally {
      clearInterval(interval);
      setLoading(false);
      setLoadingStep("");
    }
  };

  const handleReset = () => {
    setAnalysis(null);
    setActiveLayer("input");
    setError(null);
    setUserInput("");
    setReflectionAnswers(null);
    setReflectionEval(null);
  };

  const canAccess = (id: LayerId) => !!analysis || id === "input";

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <header className="h-12 bg-white border-b border-zinc-200 flex items-center px-3 sm:px-6 gap-2 sm:gap-8 shrink-0 z-10">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="sm:hidden p-1.5 rounded hover:bg-zinc-100 transition-colors">
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <button onClick={() => router.push("/")} className="bg-none border-none cursor-pointer p-0">
          <span className="font-bold text-sm sm:text-base tracking-tight text-zinc-900">REVERIE</span>
        </button>
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold rounded font-mono bg-indigo-50 text-indigo-600 whitespace-nowrap">● HUMAN-IN-THE-LOOP: ACTIVE</span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/30 z-20 sm:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside className={`w-60 bg-white border-r border-zinc-200 flex flex-col shrink-0 overflow-y-auto py-5 transition-transform duration-200 z-30
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          sm:translate-x-0 sm:relative sm:z-0 fixed h-full sm:h-auto`}>
          <div className="px-4 pb-4 border-b border-zinc-200 mb-2">
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="w-8 h-8 bg-zinc-100 border border-zinc-200 rounded flex items-center justify-center text-sm">◈</div>
              <div>
                <div className="font-bold text-sm leading-tight">Decision<br />Architecture</div>
                <div className="font-mono text-[11px] text-zinc-400 mt-0.5">Analytical Environment</div>
              </div>
            </div>
            <button className="flex items-center gap-1.5 mx-3 my-3 px-3 py-2 bg-zinc-900 text-white rounded text-sm font-semibold cursor-pointer hover:opacity-85 transition-opacity w-[calc(100%-24px)]" onClick={handleReset}>
              <span className="text-base leading-none">+</span> New Decision Model
            </button>
          </div>

          <nav className="flex-1 py-2">
            {NAV_GROUPS.map((group) => (
              <div key={group.label} className="mb-1">
                <div className="px-4 py-1.5 text-[10px] font-semibold tracking-widest uppercase text-zinc-400 font-mono">
                  {group.label}
                </div>
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    className={`flex items-center gap-2.5 px-4 py-2 text-sm font-medium w-full bg-transparent border-none text-left cursor-pointer transition-colors ${activeLayer === item.id ? "text-indigo-500 border-l-2 border-l-indigo-500 bg-indigo-50" : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                      } ${!canAccess(item.id) ? "opacity-35 cursor-not-allowed" : ""}`}
                    onClick={() => { canAccess(item.id) && setActiveLayer(item.id); setSidebarOpen(false); }}
                    disabled={!canAccess(item.id)}
                  >
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 shrink-0">
                      <rect x="2" y="2" width="12" height="12" rx="2" />
                      <path d="M5 8h6M8 5v6" />
                    </svg>
                    {item.label}
                  </button>
                ))}
              </div>
            ))}
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto p-4 sm:p-8 pb-20 sm:pb-8">
          {activeLayer === "input" && (
            <div className="animate-[fadeIn_0.3s_ease]">
              {!loading ? (
                <ChatInput onAnalyze={handleAnalyze} loading={loading} />
              ) : (
                <div className="flex flex-col items-center justify-center min-h-80 gap-6">
                  <div className="w-12 h-12 border-[3px] border-zinc-200 border-t-indigo-500 rounded-full animate-spin" />
                  <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
                    <span className="w-1.75 h-1.75 rounded-full bg-indigo-500 shrink-0 animate-pulse" />
                    <span className="font-mono text-sm">{loadingStep}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded font-mono bg-zinc-100 text-zinc-500">gemini-2.5-flash · Vertex AI</span>
                </div>
              )}
              {error && (
                <div className="mt-6 bg-white border border-zinc-200 rounded border-l-[3px] border-l-red-500 p-4 text-red-500 font-mono text-sm">{error}</div>
              )}
            </div>
          )}
          {analysis && activeLayer === "extraction" && <div className="animate-[fadeIn_0.3s_ease]"><ExtractionDisplay extraction={analysis.extraction} /></div>}
          {analysis && activeLayer === "graph" && <div className="animate-[fadeIn_0.3s_ease]"><BeliefGraph graph={analysis.belief_graph} /></div>}
          {analysis && activeLayer === "assumptions" && <div className="animate-[fadeIn_0.3s_ease]"><AssumptionsList assumptions={analysis.assumptions} /></div>}
          {analysis && activeLayer === "contradictions" && <div className="animate-[fadeIn_0.3s_ease]"><Contradictions contradictions={analysis.contradictions} /></div>}
          {analysis && activeLayer === "scenarios" && <div className="animate-[fadeIn_0.3s_ease]"><Scenarios scenarios={analysis.scenarios} /></div>}
          {analysis && activeLayer === "tradeoffs" && <div className="animate-[fadeIn_0.3s_ease]"><TradeoffChart tradeoffs={analysis.tradeoffs} /></div>}
          {analysis && activeLayer === "reflect" && (
            <div className="animate-[fadeIn_0.3s_ease]">
              <ReflectionQuestions
                questions={analysis.reflection_questions}
                extraction={analysis.extraction}
                initialAnswers={reflectionAnswers ?? undefined}
                initialEvaluation={reflectionEval}
                onEvaluationComplete={(answers, evalResult) => {
                  setReflectionAnswers(answers);
                  setReflectionEval(evalResult);
                }}
              />
            </div>
          )}
          {analysis && activeLayer === "contract" && (
            <div className="animate-[fadeIn_0.3s_ease]">
              <DecisionContractSection
                analysis={analysis}
                userInput={userInput}
                reflectionEvaluation={reflectionEval}
                reflectionAnswers={reflectionAnswers}
              />
            </div>
          )}
          {analysis && activeLayer === "action" && <div className="animate-[fadeIn_0.3s_ease]"><ActionPlanSection analysis={analysis} /></div>}
        </main>
      </div>

      {/* Mobile bottom tabs */}
      {analysis && (
        <nav className="sm:hidden flex overflow-x-auto border-t border-zinc-200 bg-white shrink-0 gap-0">
          {MOBILE_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveLayer(tab.id)}
              className={`flex-1 min-w-0 px-1.5 py-2 text-[10px] font-semibold whitespace-nowrap transition-colors border-b-2 ${activeLayer === tab.id ? "text-indigo-500 border-indigo-500" : "text-zinc-400 border-transparent"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      )}

      <footer className="h-10 bg-white border-t border-zinc-200 flex items-center justify-between px-3 sm:px-6 shrink-0 font-mono text-[10px] sm:text-[11px] text-zinc-400">
        <span className="truncate">Reverie is a reasoning tool, not a decision maker.</span>
        <span className="text-zinc-900 font-semibold shrink-0 ml-2">Human-in-the-loop</span>
      </footer>
    </div>
  );
}
