"use client";

import type { Assumption } from "@/lib/types";

const RISK_STYLE: Record<string, { chip: string; border: string }> = {
  High:   { chip: "chip-red",   border: "var(--red)" },
  Medium: { chip: "chip-amber", border: "var(--amber)" },
  Low:    { chip: "chip-green", border: "var(--green)" },
};
const EVIDENCE_STYLE: Record<string, string> = {
  Strong:   "chip-green",
  Moderate: "chip-amber",
  Weak:     "chip-red",
};

export function AssumptionsList({ assumptions }: { assumptions: Assumption[] }) {
  const highCount = assumptions.filter((a) => a.risk_level === "High").length;

  return (
    <div>
      <div className="section-label">Layer 3 // Assumption Stress Test</div>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.01em", margin: "4px 0 8px" }}>
            Layer 3: Assumption Stress Test
          </h2>
          <div className="status-line">
            <span className="status-dot" />
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12 }}>
              {assumptions.length} assumptions identified · {highCount} high risk
            </span>
          </div>
        </div>
        {highCount > 0 && (
          <div className="card" style={{ borderLeft: "3px solid var(--red)", padding: "10px 14px" }}>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "var(--red)", fontWeight: 600 }}>
              ⚠ {highCount} HIGH RISK assumption{highCount > 1 ? "s" : ""} detected
            </div>
          </div>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {assumptions.map((a, i) => {
          const riskStyle = RISK_STYLE[a.risk_level] || RISK_STYLE.Medium;
          return (
            <div
              key={i}
              className="card"
              style={{ borderLeft: `3px solid ${riskStyle.border}` }}
            >
              <div className="card-header" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>
                    ASSUMPTION {String(i + 1).padStart(2, "0")}
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text-primary)", lineHeight: 1.4 }}>{a.assumption}</div>
                </div>
                <span className={`chip ${riskStyle.chip}`} style={{ flexShrink: 0 }}>
                  Risk: {a.risk_level}
                </span>
              </div>
              <div className="card-body">
                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                  <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "var(--text-muted)" }}>Evidence:</span>
                  <span className={`chip ${EVIDENCE_STYLE[a.evidence_strength] || "chip-neutral"}`}>
                    {a.evidence_strength}
                  </span>
                </div>
                <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.7, background: "#F8FAFC", padding: "10px 12px", borderRadius: 4, border: "1px solid var(--border)" }}>
                  <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>If this fails: </span>
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
