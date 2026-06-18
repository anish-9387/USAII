"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

interface ChatInputProps {
  onAnalyze: (message: string) => Promise<void>;
  loading: boolean;
}

const QUICK_FILLS = [
  "I have a 6 LPA offer. My dream company arrives on Day 3. My family depends on me. I have an education loan.",
  "I got a government job offer but a startup wants me. Family wants stability. I want growth.",
  "I have a campus offer but want to pursue an MBA. Not sure if the timing is right.",
];

export function ChatInput({ onAnalyze, loading }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || loading) return;
    await onAnalyze(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      if (message.trim() && !loading) onAnalyze(message);
    }
  };

  return (
    <div style={{ maxWidth: 760, margin: "0 auto" }}>
      {/* Hero */}
      <div style={{ marginBottom: 40, textAlign: "center" }}>
        <div className="chip chip-indigo" style={{ marginBottom: 20, display: "inline-flex" }}>
          ● HUMAN-IN-THE-LOOP STATUS: ACTIVE
        </div>
        <h1 style={{ fontSize: 40, fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: 12 }}>
          Don&apos;t ask AI what to do.<br />
          <span style={{ color: "var(--indigo)" }}>Ask AI to help you think.</span>
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", fontFamily: "JetBrains Mono, monospace", maxWidth: 520, margin: "0 auto", lineHeight: 1.8 }}>
          A Second Brain for Real Life. Navigate high-stakes career decisions with clarity, structural thinking, and evidence — not opaque recommendations.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 28, flexWrap: "wrap" }}>
          <div className="card" style={{ padding: "12px 16px", display: "flex", alignItems: "flex-start", gap: 10, maxWidth: 200, textAlign: "left" }}>
            <span style={{ fontSize: 18 }}>◎</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 2 }}>Human-in-the-Loop</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace", lineHeight: 1.5 }}>The system augments, never automates.</div>
            </div>
          </div>
          <div className="card" style={{ padding: "12px 16px", display: "flex", alignItems: "flex-start", gap: 10, maxWidth: 200, textAlign: "left" }}>
            <span style={{ fontSize: 18 }}>⬡</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 2 }}>Structural Thinking</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace", lineHeight: 1.5 }}>Map thoughts into logical graphs.</div>
            </div>
          </div>
          <div className="card" style={{ padding: "12px 16px", display: "flex", alignItems: "flex-start", gap: 10, maxWidth: 200, textAlign: "left" }}>
            <span style={{ fontSize: 18 }}>⚖</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 2 }}>Tradeoff Analysis</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace", lineHeight: 1.5 }}>Quantify the invisible costs.</div>
            </div>
          </div>
          <div className="card" style={{ padding: "12px 16px", display: "flex", alignItems: "flex-start", gap: 10, maxWidth: 200, textAlign: "left" }}>
            <span style={{ fontSize: 18 }}>◈</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 2 }}>Responsible AI</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace", lineHeight: 1.5 }}>No black-box recommendations.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Input card */}
      <div className="card">
        <div className="card-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div className="card-label">Decision Input</div>
            <div className="card-title">Current Thought Stream</div>
          </div>
          <span className="chip chip-neutral">Source: Direct Input</span>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`"I have a 6 LPA offer.\nMy dream company arrives later.\nFamily depends on me.\nI have an education loan."`}
              className="input-mono"
              rows={6}
              style={{ borderLeft: "3px solid var(--indigo)", borderRadius: "0 4px 4px 0", marginBottom: 12 }}
              disabled={loading}
            />

            {/* Quick fills */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace", marginBottom: 8 }}>Quick scenarios:</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {QUICK_FILLS.map((fill, i) => (
                  <button
                    key={i}
                    type="button"
                    className="chip chip-neutral"
                    style={{ cursor: "pointer", fontSize: 11, padding: "4px 10px", border: "1px solid var(--border)" }}
                    onClick={() => setMessage(fill)}
                  >
                    Scenario {i + 1}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div className="status-line">
                <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "var(--text-muted)" }}>
                  Ctrl+Enter to analyze · Powered by Gemini 2.5 Flash · Vertex AI
                </span>
              </div>
              <button
                type="submit"
                className="btn-indigo"
                disabled={!message.trim() || loading}
                id="analyze-btn"
              >
                {loading ? <Loader2 style={{ width: 14, height: 14 }} className="spin" /> : <span>▶</span>}
                {loading ? "Analyzing..." : "Start Reasoning Journey"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <p style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>
        You are the decision maker. We are the architects of your reasoning.
      </p>
    </div>
  );
}
