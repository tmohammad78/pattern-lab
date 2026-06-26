"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DifficultyBadge } from "@/components/ui/badge";
import { getSession } from "@/lib/auth";
import { getProgress, getPatternProgress } from "@/lib/progress";
import type { Episode, Pattern } from "@/lib/types";

interface PatternHeroProps {
  pattern: Pattern;
  episodes: Episode[];
  categoryLabel: string;
}

export function PatternHero({ pattern, episodes, categoryLabel }: PatternHeroProps) {
  const [progress, setProgress] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  const totalEpisodes = Math.max(pattern.episodeCount, episodes.length);
  const firstEpisode = episodes[0];

  useEffect(() => {
    const session = getSession();
    if (!session) return;

    const userProgress = getProgress(session.email);
    const patternProgress = getPatternProgress(userProgress, pattern.slug);
    setProgress(patternProgress);

    const completed = episodes.filter((ep) => {
      const key = `${ep.patternSlug}/${ep.slug}`;
      return Boolean(userProgress.episodes[key]?.completedAt);
    }).length;
    setCompletedCount(completed);
  }, [pattern.slug, episodes]);

  const displayProgress =
    totalEpisodes > 0
      ? Math.max(
          progress,
          Math.round((completedCount / totalEpisodes) * 100)
        )
      : 0;

  return (
    <Card className="relative mb-8 overflow-hidden border-border/70 bg-card/90 p-6 lg:p-8">
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(circle, rgba(0,125,250,0.18) 0%, transparent 70%)",
        }}
      />

      <div className="relative flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-xl text-2xl ring-1 ring-primary/20"
            style={{ background: "rgba(0,125,250,0.12)" }}
          >
            {pattern.icon}
          </div>
          <div>
            <h1 className="text-2xl font-bold lg:text-3xl">{pattern.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {categoryLabel} · {totalEpisodes} episode
              {totalEpisodes !== 1 ? "s" : ""} · {completedCount} completed
            </p>
          </div>
        </div>
        <DifficultyBadge difficulty={pattern.difficulty} />
      </div>

      <p className="relative mt-4 max-w-3xl leading-relaxed text-muted-foreground">
        {pattern.description}
      </p>

      {firstEpisode && (
        <div className="relative mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link href={`/episodes/${pattern.slug}/${firstEpisode.slug}`}>
            <Button className="shadow-[0_0_20px_rgba(0,125,250,0.25)]">
              Start Episode 1 <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>

          <div className="flex min-w-[200px] flex-1 items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${displayProgress}%` }}
              />
            </div>
            <span className="shrink-0 text-sm text-muted-foreground">
              {displayProgress}% complete
            </span>
          </div>
        </div>
      )}
    </Card>
  );
}

export function CoreIntuition({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="mb-4 text-xl font-semibold">Core Intuition</h2>
      <Card className="border-border/70 bg-card/60 p-5 lg:p-6">
        <div className="flex gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
            <Lightbulb className="h-5 w-5 text-amber-400" />
          </div>
          <div className="prose prose-invert max-w-none text-muted-foreground">
            {children}
          </div>
        </div>
      </Card>
    </div>
  );
}
