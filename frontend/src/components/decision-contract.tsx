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
  const [pathId, setPathId] = useState("");

  const generate = async () => {
    if (!decision.trim()) return;
    setLoading(true);
    setPathId(`PATH-${Date.now().toString(36).toUpperCase().slice(-8)}`);
    try {
      const data = await apiPost<DecisionContract>("/api/contract", { decision, analysis });
      setContract(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="font-mono text-[11px] font-medium text-zinc-400 tracking-wider uppercase flex items-center gap-2 mb-2 after:content-[''] after:flex-1 after:h-px after:bg-zinc-200">
        Layer 8 // Decision Contract
      </div>
      <div className="mb-5">
        <h2 className="text-xl sm:text-[28px] font-bold tracking-tight mt-1 mb-2">Execution Consensus</h2>
        <p className="font-mono text-sm text-zinc-600 leading-relaxed max-w-160">
          You have arrived at a conclusive decision node. Review the finalized logical constraints, tradeoffs,
          and reasoning below before applying your digital signature to crystallize this path.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5 items-start">
        <div>
          {!contract && (
            <div className="bg-white border border-zinc-200 rounded mb-5">
              <div className="px-4 py-3 border-b border-zinc-200 bg-zinc-50">
                <div className="text-[11px] font-semibold tracking-wider uppercase text-zinc-400">Your Decision</div>
                <div className="text-sm font-bold text-zinc-900 mt-0.5">State Your Choice</div>
              </div>
              <div className="p-4">
                <p className="font-mono text-xs text-zinc-400 mb-2.5">
                  Describe the path you have chosen after this reasoning process.
                </p>
                <input
                  value={decision}
                  onChange={(e) => setDecision(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && generate()}
                  placeholder="e.g., Accept the 6 LPA Day 1 offer"
                  className="font-mono text-sm px-3 py-2.5 border border-zinc-200 rounded bg-white text-zinc-900 w-full outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 mb-3"
                />
                <button
                  className="inline-flex items-center gap-1.5 px-4.5 py-2 bg-indigo-500 text-white rounded text-sm font-semibold hover:bg-indigo-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  onClick={generate}
                  disabled={!decision.trim() || loading}
                >
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "▶"}
                  {loading ? "Generating contract..." : "Generate Decision Contract"}
                </button>
              </div>
            </div>
          )}

          {contract && (
            <div className="bg-white border border-zinc-200 rounded border-l-[3px] border-l-indigo-500">
              <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 bg-zinc-50">
                <div>
                  <div className="text-[11px] font-semibold tracking-wider uppercase text-zinc-400">Selected Pathway</div>
                  <div className="font-mono text-xs text-indigo-500 mt-1">ID: {pathId}</div>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded font-mono bg-amber-50 text-amber-700">STATUS: PENDING FINALIZATION</span>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="font-mono text-[10px] text-zinc-400 font-semibold tracking-wider mb-2">PRIMARY OBJECTIVE ACCEPTED</div>
                    <div className="border-l-[3px] border-l-indigo-500 pl-3">
                      <div className="font-bold text-base text-zinc-900 leading-tight">{contract.decision}</div>
                    </div>
                    <div className="mt-3.5">
                      <div className="font-mono text-[10px] text-zinc-400 font-semibold tracking-wider mb-2">REASONING SUMMARY</div>
                      <div className="bg-zinc-50 border border-zinc-200 rounded p-2.5">
                        <div className="flex gap-2 items-start">
                          <span className="text-indigo-500 text-sm shrink-0">◈</span>
                          <ul className="m-0 p-0 list-none">
                            {contract.reasoning.map((r, i) => (
                              <li key={i} className="font-mono text-xs text-zinc-600 leading-relaxed">{r}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] text-zinc-400 font-semibold tracking-wider mb-2">ACKNOWLEDGED TRADEOFFS</div>
                    <div className="flex flex-col gap-2">
                      {contract.known_tradeoffs.map((t, i) => (
                        <div key={i} className="bg-red-50 border border-red-200 rounded p-2.5 flex gap-2 items-start">
                          <span className="text-red-500 text-sm shrink-0">↘</span>
                          <span className="font-mono text-xs text-zinc-900 leading-relaxed">{t}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white border border-zinc-200 rounded">
          <div className="px-4 py-3 border-b border-zinc-200 bg-zinc-50">
            <div className="text-sm font-bold text-zinc-900">Commitment Authorization</div>
            <div className="font-mono text-[11px] text-zinc-400 mt-1">
              By signing, you lock this reasoning pathway into your permanent decision ledger.
            </div>
          </div>
          <div className="p-4 flex flex-col gap-3">
            <div>
              <div className="font-mono text-[10px] text-zinc-400 font-semibold tracking-wider mb-1.5">DIGITAL SIGNATURE</div>
              <input
                value={signed}
                onChange={(e) => setSigned(e.target.value)}
                placeholder="Type full name to confirm..."
                className="font-mono text-sm px-3 py-2.5 border border-zinc-200 rounded bg-white text-zinc-900 w-full outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 mb-2"
                disabled={!contract}
              />
            </div>
            <label className={`flex gap-2 items-start ${contract ? "cursor-pointer" : "cursor-not-allowed opacity-40"}`}>
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                disabled={!contract}
                className="mt-0.5 accent-indigo-500"
              />
              <span className="font-mono text-[11px] text-zinc-600 leading-relaxed">
                I accept full responsibility for this logic.
              </span>
            </label>
            <button
              className="inline-flex items-center gap-1.5 px-4.5 py-2 bg-zinc-900 text-white rounded text-sm font-semibold hover:bg-zinc-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed w-full justify-center"
              disabled={!contract || !signed.trim() || !accepted}
            >
              🔒 Finalize Decision
            </button>
            <p className="font-mono text-[10px] text-zinc-400 text-center leading-relaxed">
              The AI did not make this decision. You did.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
