"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import type { DecisionContract, FullAnalysis } from "@/lib/types";
import { apiPost } from "@/lib/api";

export function DecisionContractSection({ analysis }: { analysis: FullAnalysis }) {
  const [contract, setContract] = useState<DecisionContract | null>(null);
  const [loading, setLoading] = useState(false);
  const [decision, setDecision] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [signed, setSigned] = useState("");

  const generate = async () => {
    if (!decision.trim()) return;
    setLoading(true);
    try {
      const data = await apiPost<DecisionContract>("/api/contract", { decision, analysis });
      setContract(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const pathId = `PATH-${Date.now().toString(36).toUpperCase().slice(-8)}`;

  return (
    <div>
      <div className="section-label">Layer 8 // Decision Contract</div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.01em", margin: "4px 0 8px" }}>
          Execution Consensus
        </h2>
        <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 640 }}>
          You have arrived at a conclusive decision node. Review the finalized logical constraints, tradeoffs,
          and reasoning below before applying your digital signature to crystallize this path.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20, alignItems: "start" }}>
        {/* Main panel */}
        <div>
          {/* Decision input */}
          {!contract && (
            <div className="card" style={{ marginBottom: 20 }}>
              <div className="card-header">
                <div className="card-label">Your Decision</div>
                <div className="card-title">State Your Choice</div>
              </div>
              <div className="card-body">
                <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: "var(--text-muted)", marginBottom: 10 }}>
                  Describe the path you have chosen after this reasoning process.
                </p>
                <input
                  value={decision}
                  onChange={(e) => setDecision(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && generate()}
                  placeholder="e.g., Accept the 6 LPA Day 1 offer"
                  className="input-mono"
                  style={{ marginBottom: 12 }}
                />
                <button className="btn-indigo" onClick={generate} disabled={!decision.trim() || loading}>
                  {loading ? <Loader2 style={{ width: 14, height: 14 }} className="spin" /> : "▶"}
                  {loading ? "Generating contract..." : "Generate Decision Contract"}
                </button>
              </div>
            </div>
          )}

          {contract && (
            <div className="card" style={{ borderLeft: "3px solid var(--indigo)" }}>
              <div className="card-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div className="card-label">Selected Pathway</div>
                  <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: "var(--indigo)", marginTop: 4 }}>
                    ID: {pathId}
                  </div>
                </div>
                <span className="chip chip-amber">STATUS: PENDING FINALIZATION</span>
              </div>
              <div className="card-body">
                <div className="grid-2" style={{ gap: 16, marginBottom: 16 }}>
                  <div>
                    <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.05em", marginBottom: 8 }}>
                      PRIMARY OBJECTIVE ACCEPTED
                    </div>
                    <div style={{ borderLeft: "3px solid var(--indigo)", paddingLeft: 12 }}>
                      <div style={{ fontWeight: 700, fontSize: 16, color: "var(--text-primary)", lineHeight: 1.3 }}>{contract.decision}</div>
                    </div>
                    <div style={{ marginTop: 14 }}>
                      <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.05em", marginBottom: 8 }}>
                        REASONING SUMMARY
                      </div>
                      <div style={{ background: "#F8FAFC", border: "1px solid var(--border)", borderRadius: 4, padding: "10px 12px" }}>
                        <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                          <span style={{ color: "var(--indigo)", fontSize: 14, flexShrink: 0 }}>◈</span>
                          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                            {contract.reasoning.map((r, i) => (
                              <li key={i} style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.7 }}>
                                {r}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.05em", marginBottom: 8 }}>
                      ACKNOWLEDGED TRADEOFFS
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {contract.known_tradeoffs.map((t, i) => (
                        <div key={i} style={{ background: "#FEF2F2", border: "1px solid #FEE2E2", borderRadius: 4, padding: "10px 12px", display: "flex", gap: 8, alignItems: "flex-start" }}>
                          <span style={{ color: "var(--red)", fontSize: 14, flexShrink: 0 }}>↘</span>
                          <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: "var(--text-primary)", lineHeight: 1.5 }}>{t}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Commitment Authorization</div>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
              By signing, you lock this reasoning pathway into your permanent decision ledger.
            </div>
          </div>
          <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.05em", marginBottom: 6 }}>
                DIGITAL SIGNATURE
              </div>
              <input
                value={signed}
                onChange={(e) => setSigned(e.target.value)}
                placeholder="Type full name to confirm..."
                className="input-mono"
                disabled={!contract}
                style={{ marginBottom: 8 }}
              />
            </div>
            <label style={{ display: "flex", gap: 8, alignItems: "flex-start", cursor: contract ? "pointer" : "not-allowed", opacity: contract ? 1 : 0.4 }}>
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                disabled={!contract}
                style={{ marginTop: 2, accentColor: "var(--indigo)" }}
              />
              <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                I accept full responsibility for this logic.
              </span>
            </label>
            <button
              className="btn-primary"
              style={{ width: "100%", justifyContent: "center" }}
              disabled={!contract || !signed.trim() || !accepted}
            >
              🔒 Finalize Decision
            </button>
            <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: "var(--text-muted)", textAlign: "center", lineHeight: 1.5 }}>
              The AI did not make this decision. You did.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
