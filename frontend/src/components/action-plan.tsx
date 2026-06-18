"use client";

import { useState } from "react";
import type { ActionPlan, FullAnalysis } from "@/lib/types";
import { apiPost } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Loader2 } from "lucide-react";

interface ActionPlanSectionProps {
  analysis: FullAnalysis;
}

export function ActionPlanSection({ analysis }: ActionPlanSectionProps) {
  const [plan, setPlan] = useState<ActionPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [decision, setDecision] = useState("");

  const generatePlan = async () => {
    if (!decision.trim()) return;
    setLoading(true);
    try {
      const data = await apiPost<ActionPlan>("/api/action-plan", { decision, extraction: analysis.extraction });
      setPlan(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const planSteps = plan
    ? [
        { label: "30-Day Plan", steps: plan.plan_30_day },
        { label: "60-Day Plan", steps: plan.plan_60_day },
        { label: "90-Day Plan", steps: plan.plan_90_day },
      ]
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Action Plan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1 block">What did you decide?</label>
          <div className="flex gap-2">
            <input
              value={decision}
              onChange={(e) => setDecision(e.target.value)}
              placeholder="e.g., Accept the 6 LPA offer"
              className="flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-950"
            />
            <Button onClick={generatePlan} disabled={!decision.trim() || loading} size="sm">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Target className="h-4 w-4" />}
              Generate
            </Button>
          </div>
        </div>
        {plan && (
          <div className="space-y-4">
            {planSteps.map((section) => (
              <div key={section.label}>
                <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">{section.label}</h4>
                <div className="space-y-2">
                  {section.steps.map((step, i) => (
                    <div key={i} className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{step.title}</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{step.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950">
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">First Action</p>
              <p className="text-sm text-amber-800 dark:text-amber-300">{plan.first_action}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
