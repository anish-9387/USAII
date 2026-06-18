"use client";

import type { Contradiction } from "@/lib/types";

const SEV_STYLE: Record<string, { chip: string; border: string; label: string }> = {
  High:   { chip: "chip-red",   border: "var(--red)",   label: "HIGH CONFLICT" },
  Medium: { chip: "chip-amber", border: "var(--amber)", label: "MODERATE CONFLICT" },
  Low:    { chip: "chip-green", border: "var(--green)", label: "LOW CONFLICT" },
};

export function Contradictions({ contradictions }: { contradictions: Contradiction[] }) {
  return (
    <div>
      <div className="section-label">Layer 4 // Contradiction Detection</div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.01em", margin: "4px 0 8px" }}>
          Layer 4: Contradiction Detection
        </h2>
        <div className="status-line">
          <span className="status-dot" />
          <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12 }}>
            {contradictions.length} conflict{contradictions.length !== 1 ? "s" : ""} detected · The AI does not judge — it only illuminates.
          </span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {contradictions.map((c, i) => {
          const sev = SEV_STYLE[c.severity] || SEV_STYLE.Medium;
          // Try to split "Statement A vs Statement B" from conflict string
          const parts = c.conflict.split(/\s+vs\.?\s+|↔|<->|\bvs\b/i);
          const stmtA = parts[0]?.trim() ?? c.conflict;
          const stmtB = parts[1]?.trim() ?? "";

          return (
            <div key={i} className="card" style={{ borderLeft: `3px solid ${sev.border}` }}>
              <div className="card-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "var(--text-muted)" }}>
                  CONFLICT {String(i + 1).padStart(2, "0")}
                </div>
                <span className={`chip ${sev.chip}`}>{sev.label}</span>
              </div>
              <div className="card-body">
                {stmtB ? (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 12, alignItems: "center", marginBottom: 14 }}>
                    <div style={{ background: "#F8FAFC", border: "1px solid var(--border)", borderRadius: 4, padding: "10px 12px" }}>
                      <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: "var(--text-muted)", marginBottom: 4 }}>STATEMENT A</div>
                      <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text-primary)" }}>{stmtA}</div>
                    </div>
                    <div style={{ textAlign: "center", color: sev.border, fontSize: 20 }}>⚡</div>
                    <div style={{ background: "#F8FAFC", border: "1px solid var(--border)", borderRadius: 4, padding: "10px 12px" }}>
                      <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: "var(--text-muted)", marginBottom: 4 }}>STATEMENT B</div>
                      <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text-primary)" }}>{stmtB}</div>
                    </div>
                  </div>
                ) : (
                  <div style={{ background: "#F8FAFC", border: "1px solid var(--border)", borderRadius: 4, padding: "10px 12px", marginBottom: 14 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text-primary)" }}>{c.conflict}</div>
                  </div>
                )}
                <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.7 }}>
                  {c.explanation}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <p style={{ marginTop: 12, fontSize: 11, color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>
        These are logical inconsistencies, not moral judgments. You decide what to do with them.
      </p>
    </div>
  );
}
