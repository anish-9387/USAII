"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import type { ActionPlan, FullAnalysis } from "@/lib/types";
import { apiPost } from "@/lib/api";

const TIMELINE_COLORS = ["var(--indigo)", "#64748B", "#94A3B8"];

export function ActionPlanSection({ analysis }: { analysis: FullAnalysis }) {
  const [plan, setPlan] = useState<ActionPlan | null>(null);
  const [loading, setLoading] = useState(false);
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

  const phases = plan ? [
    { label: "Days 1–30",  steps: plan.plan_30_day, color: TIMELINE_COLORS[0] },
    { label: "Days 31–60", steps: plan.plan_60_day, color: TIMELINE_COLORS[1] },
    { label: "Days 61–90", steps: plan.plan_90_day, color: TIMELINE_COLORS[2] },
  ] : [];

  return (
    <div>
      <div className="section-label">Layer 9 // Action Plan</div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.01em", margin: "4px 0 8px" }}>
          Immediate Execution Timeline
        </h2>
        <div className="status-line">
          <span className="status-dot" />
          <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12 }}>
            90-day action plan · generated after decision
          </span>
        </div>
      </div>

      {!plan && (
        <div className="card">
          <div className="card-header">
            <div className="card-label">Generate Action Plan</div>
          </div>
          <div className="card-body">
            <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: "var(--text-muted)", marginBottom: 10 }}>
              Enter the decision you made. The system will generate a concrete 90-day execution plan.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <input
                value={decision}
                onChange={(e) => setDecision(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && generate()}
                placeholder="e.g., Accept the 6 LPA offer"
                className="input-mono"
              />
              <button className="btn-indigo" onClick={generate} disabled={!decision.trim() || loading} style={{ flexShrink: 0 }}>
                {loading ? <Loader2 style={{ width: 14, height: 14 }} className="spin" /> : "▶"}
                {loading ? "Generating..." : "Generate Plan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {plan && (
        <>
          {/* First action CTA */}
          <div className="card" style={{ borderLeft: "3px solid var(--indigo)", marginBottom: 20, background: "#EEF2FF" }}>
            <div className="card-body">
              <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 600, color: "var(--indigo)", letterSpacing: "0.06em", marginBottom: 6 }}>
                ▶ FIRST ACTION — DO THIS TODAY
              </div>
              <div style={{ fontWeight: 700, fontSize: 16, color: "var(--text-primary)" }}>{plan.first_action}</div>
            </div>
          </div>

          {/* Timeline */}
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-header">
              <div className="card-label">Execution Timeline</div>
              <div className="card-title">90-Day Roadmap</div>
            </div>
            <div className="card-body">
              {phases.map((phase, pi) => (
                <div key={phase.label} style={{ marginBottom: pi < phases.length - 1 ? 20 : 0 }}>
                  <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, fontWeight: 600, color: phase.color, marginBottom: 10 }}>
                    {phase.label}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 16, borderLeft: `2px solid ${phase.color}` }}>
                    {phase.steps.map((step, i) => (
                      <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <span style={{ color: phase.color, flexShrink: 0, marginTop: 2 }}>◎</span>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{step.title}</div>
                          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "var(--text-muted)", lineHeight: 1.5, marginTop: 2 }}>{step.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risk mitigation */}
          <div className="grid-2" style={{ gap: 16 }}>
            <div className="card">
              <div className="card-header">
                <div className="card-label">Risk Mitigation</div>
              </div>
              <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {plan.risk_mitigation.map((r, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: "var(--text-secondary)" }}>
                    <span style={{ color: "var(--amber)", flexShrink: 0 }}>⚠</span>
                    {r}
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <div className="card-header">
                <div className="card-label">Assumptions to Validate</div>
              </div>
              <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {plan.assumptions_to_validate.map((a, i) => (
                  <label key={i} style={{ display: "flex", gap: 8, cursor: "pointer", fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: "var(--text-secondary)", alignItems: "flex-start" }}>
                    <input type="checkbox" style={{ marginTop: 2, accentColor: "var(--indigo)" }} />
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
