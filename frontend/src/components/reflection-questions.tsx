"use client";

import { useState } from "react";
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import type { ReflectionQuestion, ReflectionEvaluation, DecisionExtraction } from "@/lib/types";
import { apiPost } from "@/lib/api";

export function ReflectionQuestions({
  questions,
  extraction,
  onEvaluationComplete,
  initialAnswers,
  initialEvaluation,
}: {
  questions: ReflectionQuestion[];
  extraction: DecisionExtraction;
  onEvaluationComplete?: (answers: string[], evaluation: ReflectionEvaluation) => void;
  initialAnswers?: string[];
  initialEvaluation?: ReflectionEvaluation | null;
}) {
  const [responses, setResponses] = useState<string[]>(
    initialAnswers ?? questions.map(() => ""),
  );
  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<ReflectionEvaluation | null>(
    initialEvaluation ?? null,
  );
  const [error, setError] = useState<string | null>(null);

  const update = (i: number, val: string) =>
    setResponses((prev) => {
      const next = [...prev];
      next[i] = val;
      return next;
    });

  const allAnswered = responses.every((r) => r.trim().length > 0);

  const handleEvaluate = async () => {
    if (!allAnswered) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiPost<ReflectionEvaluation>("/api/evaluate-reflection", {
        extraction,
        questions,
        answers: responses,
      });
      setEvaluation(data);
      onEvaluationComplete?.(responses, data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Evaluation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
            {questions.length} adaptive questions generated
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
                disabled={!!evaluation}
              />
            </div>
          </div>
        ))}
      </div>

      {!evaluation && (
        <div className="mt-5 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <button
            className="inline-flex items-center gap-1.5 px-4.5 py-2 bg-indigo-500 text-white rounded text-sm font-semibold hover:bg-indigo-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={handleEvaluate}
            disabled={!allAnswered || loading}
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "▶"}
            {loading ? "Evaluating..." : "Submit & Evaluate"}
          </button>
          {!allAnswered && (
            <span className="font-mono text-[11px] text-zinc-400">
              Answer all questions to submit
            </span>
          )}
        </div>
      )}

      {error && (
        <div className="mt-4 bg-white border border-zinc-200 rounded border-l-[3px] border-l-red-500 p-4 text-red-500 font-mono text-sm">{error}</div>
      )}

      {evaluation && (
        <div className="mt-6 bg-white border border-zinc-200 rounded overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {evaluation.is_ready ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              )}
              <span className="font-mono text-[11px] font-semibold tracking-wider uppercase text-zinc-400">
                Reflection Evaluation
              </span>
            </div>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded font-mono ${
              evaluation.is_ready
                ? "bg-green-50 text-green-700"
                : "bg-amber-50 text-amber-700"
            }`}>
              {evaluation.is_ready ? "READY TO DECIDE" : "NEEDS MORE REFLECTION"}
            </span>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                  <circle
                    cx="18" cy="18" r="15.5" fill="none"
                    stroke={evaluation.clarity_score >= 7 ? "#22c55e" : evaluation.clarity_score >= 4 ? "#f59e0b" : "#ef4444"}
                    strokeWidth="3"
                    strokeDasharray={`${(evaluation.clarity_score / 10) * 97.4} 97.4`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center font-bold text-sm">
                  {evaluation.clarity_score}/10
                </span>
              </div>
              <div>
                <div className="font-mono text-[10px] font-semibold tracking-wider text-zinc-400 mb-1">CLARITY SCORE</div>
                <div className="font-mono text-xs text-zinc-600 leading-relaxed">{evaluation.summary}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded p-3">
                <div className="font-mono text-[10px] font-semibold tracking-wider text-green-600 mb-2">KEY INSIGHTS</div>
                <ul className="m-0 p-0 list-none flex flex-col gap-1.5">
                  {evaluation.key_insights.map((insight, i) => (
                    <li key={i} className="font-mono text-xs text-zinc-700 leading-relaxed flex gap-1.5">
                      <span className="text-green-500 shrink-0">✦</span>
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded p-3">
                <div className="font-mono text-[10px] font-semibold tracking-wider text-amber-600 mb-2">BLIND SPOTS</div>
                <ul className="m-0 p-0 list-none flex flex-col gap-1.5">
                  {evaluation.blind_spots.map((spot, i) => (
                    <li key={i} className="font-mono text-xs text-zinc-700 leading-relaxed flex gap-1.5">
                      <span className="text-amber-500 shrink-0">!</span>
                      {spot}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <p className="mt-3 text-[11px] text-zinc-400 font-mono">
        These questions are designed to surface your reasoning, not steer your choice.
      </p>
    </div>
  );
}
