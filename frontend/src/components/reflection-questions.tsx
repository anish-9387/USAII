"use client";

import { useState } from "react";
import type { ReflectionQuestion } from "@/lib/types";

export function ReflectionQuestions({ questions }: { questions: ReflectionQuestion[] }) {
  const [responses, setResponses] = useState<string[]>(questions.map(() => ""));

  const update = (i: number, val: string) =>
    setResponses((prev) => { const next = [...prev]; next[i] = val; return next; });

  return (
    <div>
      <div className="font-mono text-[11px] font-medium text-zinc-400 tracking-wider uppercase flex items-center gap-2 mb-2 after:content-[''] after:flex-1 after:h-px after:bg-zinc-200">
        Layer 7 // Reflection
      </div>
      <div className="mb-5">
        <h2 className="text-xl sm:text-[28px] font-bold tracking-tight mt-1 mb-2">Layer 7: Decision Reflection</h2>
        <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
          <span className="w-1.75 h-1.75 rounded-full bg-indigo-500 shrink-0 animate-pulse" />
          <span className="font-mono text-xs">
            {questions.length} adaptive questions generated · your answers stay local
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {questions.map((q, i) => (
          <div key={i} className="bg-white border border-zinc-200 rounded border-l-[3px] border-l-indigo-500">
            <div className="p-4">
              <div className="font-mono text-[10px] text-indigo-500 font-semibold tracking-wider mb-2">
                REFLECTION {String(i + 1).padStart(2, "0")}
              </div>
              <p className="italic text-sm font-semibold text-zinc-900 leading-relaxed mb-3">
                &ldquo;{q.question}&rdquo;
              </p>
              <textarea
                value={responses[i]}
                onChange={(e) => update(i, e.target.value)}
                placeholder="Type your thoughts here..."
                className="font-mono text-sm px-3 py-2.5 border border-zinc-200 rounded bg-white text-zinc-900 w-full outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 resize-y"
                rows={3}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-zinc-400 font-mono">
        These questions are designed to surface your reasoning, not steer your choice.
      </p>
    </div>
  );
}
