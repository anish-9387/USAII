"use client";

import type { DecisionExtraction } from "@/lib/types";

const PANEL_CONFIG = [
  {
    key: "goals" as const,
    label: "Goals",
    icon: "⚑",
    chipClass: "chip-indigo",
    numbered: true,
    subtitles: ["Primary immediate objective", "Secondary long-term objective"],
  },
  {
    key: "constraints" as const,
    label: "Constraints",
    icon: "⚠",
    chipClass: "chip-red",
    numbered: false,
    tags: ["Financial", "Hard Limit", "Institutional"],
  },
  {
    key: "priorities" as const,
    label: "Priorities",
    icon: "≡",
    chipClass: "chip-amber",
    numbered: false,
    weights: ["Weight: High", "Weight: Medium", "Weight: Low"],
  },
  {
    key: "fears" as const,
    label: "Fears",
    icon: "◎",
    chipClass: "chip-red",
    numbered: false,
    asPills: true,
  },
];

export function ExtractionDisplay({ extraction }: { extraction: DecisionExtraction }) {
  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <div className="section-label">Layer 1 // Semantic Extraction</div>
          <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.01em", margin: "4px 0 8px" }}>
            Layer 1: Semantic Extraction
          </h2>
          <div className="status-line">
            <span className="status-dot" />
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12 }}>
              Parsing unstructured thought stream...
            </span>
          </div>
        </div>
        <div className="card" style={{ padding: "12px 16px", minWidth: 200, textAlign: "right" }}>
          <div className="card-label" style={{ textAlign: "left" }}>Reasoning Confidence</div>
          <div style={{ marginTop: 8 }}>
            <div className="confidence-bar-wrap">
              <div className="confidence-bar-track">
                <div className="confidence-bar-fill" style={{ width: "92%" }} />
              </div>
              <span className="confidence-value">92%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4-panel grid */}
      <div className="grid-2" style={{ gap: 16 }}>
        {PANEL_CONFIG.map((panel) => {
          const items: string[] = extraction[panel.key];
          return (
            <div key={panel.key} className="card">
              <div className="card-header" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "var(--indigo)", fontSize: 14 }}>{panel.icon}</span>
                <span className="card-label" style={{ fontSize: 12 }}>{panel.label.toUpperCase()}</span>
              </div>
              <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {panel.asPills ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {items.map((item, i) => (
                      <span key={i} className={`chip ${panel.chipClass}`} style={{ padding: "4px 12px" }}>
                        ● {item}
                      </span>
                    ))}
                  </div>
                ) : (
                  items.map((item, i) => (
                    <div key={i} style={{ borderBottom: i < items.length - 1 ? "1px solid var(--border)" : "none", paddingBottom: i < items.length - 1 ? 10 : 0 }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        {panel.numbered && (
                          <span style={{ color: "var(--indigo)", fontFamily: "JetBrains Mono, monospace", fontSize: 11, fontWeight: 600, minWidth: 18, paddingTop: 2 }}>
                            {String(i + 1).padStart(2, "0")}
                          </span>
                        )}
                        {!panel.numbered && (
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--text-muted)", flexShrink: 0, marginTop: 6 }} />
                        )}
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{item}</div>
                          {panel.weights && panel.weights[i] && (
                            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "var(--text-muted)" }}>
                              {panel.weights[i]}
                            </div>
                          )}
                          {panel.subtitles && panel.subtitles[i] && (
                            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "var(--text-muted)" }}>
                              {panel.subtitles[i]}
                            </div>
                          )}
                          {panel.key === "constraints" && i === 0 && (
                            <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
                              <span className="chip chip-neutral">Financial</span>
                              <span className="chip chip-red">Hard Limit</span>
                            </div>
                          )}
                          {panel.key === "constraints" && i > 0 && (
                            <div style={{ marginTop: 4 }}>
                              <span className="chip chip-neutral">Institutional</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Status bar */}
      <div style={{ marginTop: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div className="status-line">
          <span style={{ color: "var(--indigo)", fontSize: 14 }}>◈</span>
          <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: "var(--text-secondary)" }}>
            Semantic model stable. Ready for next phase.
          </span>
        </div>
        <span className="chip chip-indigo">
          {extraction.goals.length + extraction.constraints.length + extraction.priorities.length + extraction.fears.length} nodes extracted
        </span>
      </div>
    </div>
  );
}
