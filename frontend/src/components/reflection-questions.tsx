"use client";

import type { ReflectionQuestion } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

export function ReflectionQuestions({ questions }: { questions: ReflectionQuestion[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Reflection Prompts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {questions.map((q, i) => (
          <div key={i} className="flex items-start gap-3 rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900">
            <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
            <p className="text-sm text-zinc-700 dark:text-zinc-300">{q.question}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
