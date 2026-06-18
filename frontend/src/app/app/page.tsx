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
import { useRouter } from "next/navigation";

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

const TOP_TABS: { id: LayerId; label: string }[] = [
  { id: "extraction", label: "Extraction" },
  { id: "graph", label: "Belief Graph" },
  { id: "scenarios", label: "Scenarios" },
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

  const handleAnalyze = async (message: string) => {
    setLoading(true);
    setError(null);
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
  };

  const canAccess = (id: LayerId) => !!analysis || id === "input";

  return (
    <div className="app-shell">
      {/* Top Bar */}
      <header className="app-topbar">
        <button onClick={() => router.push("/")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <span className="topbar-logo">PARALLAX</span>
        </button>
        {analysis && (
          <nav className="topbar-nav">
            {TOP_TABS.map((tab) => (
              <button
                key={tab.id}
                className={`topbar-nav-item${activeLayer === tab.id ? " active" : ""}`}
                onClick={() => setActiveLayer(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        )}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
          <span className="chip chip-indigo" style={{ fontSize: 10 }}>● HUMAN-IN-THE-LOOP: ACTIVE</span>
        </div>
      </header>

      {/* Body */}
      <div className="app-body">
        {/* Sidebar */}
        <aside className="app-sidebar scrollbar-thin">
          <div className="sidebar-header">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 32, height: 32, background: "#F1F5F9", border: "1px solid var(--border)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>◈</div>
              <div>
                <div className="sidebar-title">Decision<br />Architecture</div>
                <div className="sidebar-subtitle">Analytical Environment</div>
              </div>
            </div>
            <button className="btn-new-model" onClick={handleReset}>
              <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> New Decision Model
            </button>
          </div>

          <nav className="sidebar-nav">
            {NAV_GROUPS.map((group) => (
              <div key={group.label} style={{ marginBottom: 4 }}>
                <div style={{ padding: "6px 16px 2px", fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>
                  {group.label}
                </div>
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    className={`sidebar-nav-item${activeLayer === item.id ? " active" : ""}`}
                    onClick={() => canAccess(item.id) && setActiveLayer(item.id)}
                    disabled={!canAccess(item.id)}
                    style={{ width: "100%", background: "none", border: "none", textAlign: "left", cursor: canAccess(item.id) ? "pointer" : "not-allowed", opacity: canAccess(item.id) ? 1 : 0.35 }}
                  >
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="2" y="2" width="12" height="12" rx="2" />
                      <path d="M5 8h6M8 5v6" />
                    </svg>
                    {item.label}
                  </button>
                ))}
              </div>
            ))}
          </nav>

          <div className="sidebar-bottom">
            <button className="sidebar-nav-item" style={{ width: "100%", background: "none", border: "none", textAlign: "left", cursor: "pointer" }}>
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="6" /><path d="M8 7v1.5M8 11h.01" /></svg>
              Help
            </button>
            <button className="sidebar-nav-item" style={{ width: "100%", background: "none", border: "none", textAlign: "left", cursor: "pointer" }}>
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="12" height="9" rx="1" /><path d="M5 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" /></svg>
              Logs
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="app-main scrollbar-thin">
          {activeLayer === "input" && (
            <div className="fade-in">
              {!loading ? (
                <ChatInput onAnalyze={handleAnalyze} loading={loading} />
              ) : (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 320, gap: 24 }}>
                  <div style={{ width: 48, height: 48, border: "3px solid var(--border)", borderTopColor: "var(--indigo)", borderRadius: "50%" }} className="spin" />
                  <div className="status-line">
                    <span className="status-dot" />
                    <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 13 }}>{loadingStep}</span>
                  </div>
                  <span className="chip chip-neutral">gemini-2.5-flash · Vertex AI</span>
                </div>
              )}
              {error && (
                <div className="card" style={{ marginTop: 24, borderLeft: "3px solid var(--red)" }}>
                  <div className="card-body" style={{ color: "var(--red)", fontFamily: "JetBrains Mono, monospace", fontSize: 13 }}>{error}</div>
                </div>
              )}
            </div>
          )}
          {analysis && activeLayer === "extraction" && <div className="fade-in"><ExtractionDisplay extraction={analysis.extraction} /></div>}
          {analysis && activeLayer === "graph" && <div className="fade-in"><BeliefGraph graph={analysis.belief_graph} /></div>}
          {analysis && activeLayer === "assumptions" && <div className="fade-in"><AssumptionsList assumptions={analysis.assumptions} /></div>}
          {analysis && activeLayer === "contradictions" && <div className="fade-in"><Contradictions contradictions={analysis.contradictions} /></div>}
          {analysis && activeLayer === "scenarios" && <div className="fade-in"><Scenarios scenarios={analysis.scenarios} /></div>}
          {analysis && activeLayer === "tradeoffs" && <div className="fade-in"><TradeoffChart tradeoffs={analysis.tradeoffs} /></div>}
          {analysis && activeLayer === "reflect" && <div className="fade-in"><ReflectionQuestions questions={analysis.reflection_questions} /></div>}
          {analysis && activeLayer === "contract" && <div className="fade-in"><DecisionContractSection analysis={analysis} /></div>}
          {analysis && activeLayer === "action" && <div className="fade-in"><ActionPlanSection analysis={analysis} /></div>}
        </main>
      </div>

      {/* Footer */}
      <footer className="app-footer">
        <span>Parallax is a reasoning tool, not a decision maker. You are in control.</span>
        <div style={{ display: "flex", gap: 20 }}>
          <span style={{ cursor: "pointer" }}>Ethics Policy</span>
          <span style={{ cursor: "pointer" }}>Methodology</span>
          <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>Human-in-the-loop Status: Active</span>
        </div>
      </footer>
    </div>
  );
}
