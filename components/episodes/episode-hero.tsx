"use client";

import { Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, difficultyColor } from "@/lib/utils";
import type { Difficulty } from "@/lib/types";

interface EpisodeHeroProps {
  episodeNumber: string;
  category: string;
  difficulty: Difficulty;
  readTimeMin: number;
  title: string;
  description: string;
  isComplete: boolean;
  onMarkComplete: () => void;
}

export function EpisodeHero({
  episodeNumber,
  category,
  difficulty,
  readTimeMin,
  title,
  description,
  isComplete,
  onMarkComplete,
}: EpisodeHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/90">
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(circle, rgba(0,125,250,0.22) 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "linear-gradient(135deg, rgba(0,125,250,0.08) 0%, transparent 50%)",
        }}
      />

      <div className="relative p-6 lg:p-8">
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary-foreground">
            {episodeNumber}
          </span>
          <span className="rounded-full border border-border bg-background/60 px-3 py-1 text-[11px] font-medium capitalize text-muted-foreground">
            {category}
          </span>
          <span
            className={cn(
              "rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide",
              difficultyColor(difficulty)
            )}
          >
            {difficulty}
          </span>
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            {readTimeMin} min
          </span>
        </div>

        <h1 className="mb-3 text-3xl font-bold tracking-tight lg:text-4xl">
          {title}
        </h1>
        <p className="mb-6 max-w-3xl text-[15px] leading-relaxed text-muted-foreground">
          {description}
        </p>

        <Button
          variant="outline"
          size="sm"
          onClick={onMarkComplete}
          disabled={isComplete}
          className="border-primary/40 text-primary hover:bg-primary/10"
        >
          <CheckCircle2 className="h-4 w-4" />
          {isComplete ? "Completed" : "Mark complete"}
        </Button>
      </div>
    </div>
  );
}
