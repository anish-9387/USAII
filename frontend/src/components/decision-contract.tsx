"use client";

import { useState } from "react";
import type { DecisionContract, FullAnalysis } from "@/lib/types";
import { apiPost } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Loader2 } from "lucide-react";

interface DecisionContractProps {
  analysis: FullAnalysis;
}

export function DecisionContractSection({ analysis }: DecisionContractProps) {
  const [contract, setContract] = useState<DecisionContract | null>(null);
  const [loading, setLoading] = useState(false);
  const [decision, setDecision] = useState("");

  const generateContract = async () => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Decision Contract</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1 block">What is your decision?</label>
          <div className="flex gap-2">
            <input
              value={decision}
              onChange={(e) => setDecision(e.target.value)}
              placeholder="e.g., Accept the 6 LPA offer"
              className="flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-950"
            />
            <Button onClick={generateContract} disabled={!decision.trim() || loading} size="sm">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
              Generate
            </Button>
          </div>
        </div>
        {contract && (
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Decision: {contract.decision}</p>
            <div className="mb-3">
              <p className="text-xs font-medium text-zinc-500 mb-1">Reasoning:</p>
              <ul className="space-y-1">
                {contract.reasoning.map((r, i) => (
                  <li key={i} className="text-xs text-zinc-600 dark:text-zinc-400 flex items-start gap-1.5">
                    <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-zinc-400" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium text-zinc-500 mb-1">Known Tradeoffs:</p>
              <ul className="space-y-1">
                {contract.known_tradeoffs.map((t, i) => (
                  <li key={i} className="text-xs text-zinc-600 dark:text-zinc-400 flex items-start gap-1.5">
                    <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-amber-400" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
