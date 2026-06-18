"use client";

import type { Scenario } from "@/lib/types";

const SCENARIO_STYLES = [
  { border: "var(--indigo)", chip: "chip-indigo", bg: "#EEF2FF", accent: "#6366F1" },
  { border: "var(--cyan)",   chip: "chip-cyan",   bg: "#ECFEFF", accent: "#06B6D4" },
  { border: "var(--amber)",  chip: "chip-amber",  bg: "#FFFBEB", accent: "#F59E0B" },
];

const CONF_CHIP: Record<string, string> = {
  High: "chip-green", Medium: "chip-amber", Low: "chip-red",
};

export function Scenarios({ scenarios }: { scenarios: Scenario[] }) {
  return (
    <div>
      <div className="section-label">Layer 5 // Counterfactual Futures</div>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.01em", margin: "4px 0 8px" }}>
            Layer 5: Future Scenarios
          </h2>
          <div className="status-line">
            <span className="status-dot" />
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12 }}>
              {scenarios.length} scenarios generated · exploratory simulations only
            </span>
          </div>
        </div>
        <div className="chip chip-red" style={{ flexShrink: 0, fontWeight: 700 }}>
          SCENARIO — NOT A PREDICTION
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {scenarios.map((s, i) => {
          const style = SCENARIO_STYLES[i % SCENARIO_STYLES.length];
          return (
            <div key={i} className="card" style={{ borderLeft: `3px solid ${style.border}` }}>
              <div className="card-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: style.bg }}>
                <div>
                  <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: style.accent, fontWeight: 600, letterSpacing: "0.06em" }}>
                    FUTURE {String.fromCharCode(65 + i)} // SCENARIO
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginTop: 2 }}>{s.future}</div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span className={`chip ${CONF_CHIP[s.confidence] ?? "chip-neutral"}`}>
                    Confidence: {s.confidence}
                  </span>
                </div>
              </div>
              <div className="card-body">
                <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 16 }}>
                  {s.description}
                </p>
                <div className="grid-2" style={{ gap: 12, marginBottom: 14 }}>
                  <div style={{ background: "#ECFDF5", border: "1px solid #D1FAE5", borderRadius: 4, padding: "10px 12px" }}>
                    <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 600, color: "#065F46", letterSpacing: "0.05em", marginBottom: 6 }}>↑ UPSIDE</div>
                    <div style={{ fontSize: 13, color: "var(--text-primary)", lineHeight: 1.5 }}>{s.upside}</div>
                  </div>
                  <div style={{ background: "#FEF2F2", border: "1px solid #FEE2E2", borderRadius: 4, padding: "10px 12px" }}>
                    <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 600, color: "#991B1B", letterSpacing: "0.05em", marginBottom: 6 }}>↓ DOWNSIDE</div>
                    <div style={{ fontSize: 13, color: "var(--text-primary)", lineHeight: 1.5 }}>{s.downside}</div>
                  </div>
                </div>
                <div style={{ background: "#F8FAFC", border: "1px solid var(--border)", borderRadius: 4, padding: "10px 12px" }}>
                  <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.05em", marginBottom: 6 }}>CRITICAL ASSUMPTIONS</div>
                  <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>{s.critical_assumptions}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <p style={{ marginTop: 12, fontSize: 11, color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>
        These scenarios are exploratory simulations, not predictions. Confidence levels are indicative, not deterministic.
      </p>
    </div>
  );
}
