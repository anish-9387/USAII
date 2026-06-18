"use client";

import { useState } from "react";
import type { ReflectionQuestion } from "@/lib/types";

export function ReflectionQuestions({ questions }: { questions: ReflectionQuestion[] }) {
  const [responses, setResponses] = useState<string[]>(questions.map(() => ""));

  const update = (i: number, val: string) =>
    setResponses((prev) => { const next = [...prev]; next[i] = val; return next; });

  return (
    <div>
      <div className="section-label">Layer 7 // Reflection</div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.01em", margin: "4px 0 8px" }}>
          Layer 7: Decision Reflection
        </h2>
        <div className="status-line">
          <span className="status-dot" />
          <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12 }}>
            {questions.length} adaptive questions generated · your answers stay local
          </span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {questions.map((q, i) => (
          <div key={i} className="card" style={{ borderLeft: "3px solid var(--indigo)" }}>
            <div className="card-body">
              <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: "var(--indigo)", fontWeight: 600, letterSpacing: "0.06em", marginBottom: 8 }}>
                REFLECTION {String(i + 1).padStart(2, "0")}
              </div>
              <p style={{ fontStyle: "italic", fontSize: 14, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.6, marginBottom: 12 }}>
                &ldquo;{q.question}&rdquo;
              </p>
              <textarea
                value={responses[i]}
                onChange={(e) => update(i, e.target.value)}
                placeholder="Type your thoughts here..."
                className="input-mono"
                rows={3}
                style={{ fontSize: 13 }}
              />
            </div>
          </div>
        ))}
      </div>
      <p style={{ marginTop: 12, fontSize: 11, color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>
        These questions are designed to surface your reasoning, not steer your choice.
      </p>
    </div>
  );
}
