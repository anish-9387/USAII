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
    <div className="max-w-190 mx-auto">
      <div className="mb-10 text-center">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded font-mono bg-indigo-50 text-indigo-600 mb-5">
          ● HUMAN-IN-THE-LOOP STATUS: ACTIVE
        </span>
        <h1 className="text-2xl sm:text-4xl font-bold leading-[1.15] tracking-tight mb-3">
          Don&apos;t ask AI what to do.<br />
          <span className="text-indigo-500">Ask AI to help you think.</span>
        </h1>
        <p className="text-sm text-zinc-600 font-mono max-w-130 mx-auto leading-relaxed">
          A Second Brain for Real Life. Navigate high-stakes career decisions with clarity, structural thinking, and evidence — not opaque recommendations.
        </p>
        <div className="flex gap-3 justify-center mt-7 flex-wrap">
          {[
            { icon: "◎", title: "Human-in-the-Loop", desc: "The system augments, never automates." },
            { icon: "⬡", title: "Structural Thinking", desc: "Map thoughts into logical graphs." },
            { icon: "⚖", title: "Tradeoff Analysis", desc: "Quantify the invisible costs." },
            { icon: "◈", title: "Responsible AI", desc: "No black-box recommendations." },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="bg-white border border-zinc-200 rounded p-3 flex items-start gap-2.5 max-w-45 text-left">
              <span className="text-lg">{icon}</span>
              <div>
                <div className="text-xs font-semibold mb-0.5">{title}</div>
                <div className="text-[11px] text-zinc-400 font-mono leading-relaxed">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded">
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 bg-zinc-50">
          <div>
            <div className="text-[11px] font-semibold tracking-wider uppercase text-zinc-400">Decision Input</div>
            <div className="text-sm font-bold text-zinc-900 mt-0.5">Current Thought Stream</div>
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded font-mono bg-zinc-100 text-zinc-500">Source: Direct Input</span>
        </div>
        <div className="p-4">
          <form onSubmit={handleSubmit}>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`"I have a 6 LPA offer.\nMy dream company arrives later.\nFamily depends on me.\nI have an education loan."`}
              className="font-mono text-sm px-3 py-2.5 border border-zinc-200 rounded bg-white text-zinc-900 w-full outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 resize-y"
              style={{ borderLeft: "3px solid #6366F1", borderRadius: "0 4px 4px 0" }}
              rows={6}
              disabled={loading}
            />

            <div className="mb-4">
              <div className="text-[11px] text-zinc-400 font-mono mb-2">Quick scenarios:</div>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_FILLS.map((fill, i) => (
                  <button
                    key={i}
                    type="button"
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded font-mono bg-zinc-100 text-zinc-500 cursor-pointer border border-zinc-200 hover:bg-zinc-200 transition-colors"
                    onClick={() => setMessage(fill)}
                  >
                    Scenario {i + 1}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="text-xs font-mono text-zinc-400">
                Ctrl+Enter to analyze · Gemini 2.5 Flash · Vertex AI
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4.5 py-2 bg-indigo-500 text-white rounded text-sm font-semibold hover:bg-indigo-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={!message.trim() || loading}
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>▶</span>}
                {loading ? "Analyzing..." : "Start Reasoning Journey"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <p className="text-center mt-4 text-xs text-zinc-400 font-mono">
        You are the decision maker. We are the architects of your reasoning.
      </p>
    </div>
  );
}
