"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";

interface ChatInputProps {
  onAnalyze: (message: string) => Promise<void>;
  loading: boolean;
}

export function ChatInput({ onAnalyze, loading }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || loading) return;
    await onAnalyze(message);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-4">
      <div className="relative">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe your situation... e.g., I have a 6 LPA offer, my dream company comes later, family pressure is high..."
          className="w-full min-h-[120px] resize-y rounded-xl border border-zinc-200 bg-white p-4 text-sm shadow-sm placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 dark:placeholder:text-zinc-600 dark:focus:border-zinc-600 dark:focus:ring-zinc-800"
          rows={4}
        />
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs text-zinc-400">
          Parallax helps you think clearly. It never makes decisions for you.
        </p>
        <Button type="submit" disabled={!message.trim() || loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {loading ? "Analyzing..." : "Analyze Decision"}
        </Button>
      </div>
    </form>
  );
}
