"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  Clock,
  Flame,
  Layers,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DifficultyBadge } from "@/components/ui/badge";
import { getSession } from "@/lib/auth";
import { getProgress } from "@/lib/progress";
import type { Difficulty, Pattern } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";

interface EpisodeItem {
  patternSlug: string;
  slug: string;
  title: string;
  subtitle: string;
  order: number;
  difficulty: Difficulty;
  readTimeMin: number;
  patternTitle: string;
  categoryLabels: string[];
}

interface HomeClientProps {
  patterns: Pattern[];
  episodes: EpisodeItem[];
  totalPatterns: number;
}

function StatCard({
  label,
  value,
  icon,
  iconClass,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  iconClass: string;
}) {
  return (
    <div className="rounded-xl border border-border/70 bg-card/80 p-5 backdrop-blur-sm">
      <div className="mb-4 flex items-start justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          {label}
        </p>
        <div className={`rounded-lg p-2 ${iconClass}`}>{icon}</div>
      </div>
      <p className="text-3xl font-bold tracking-tight">{value}</p>
    </div>
  );
}

export function HomeClient({
  patterns,
  episodes,
  totalPatterns,
}: HomeClientProps) {
  const [greeting, setGreeting] = useState("Welcome");
  const [firstName, setFirstName] = useState("there");
  const [stats, setStats] = useState({
    patternsMastered: 0,
    episodesDone: 0,
    streak: 0,
    xp: 0,
  });
  const [continueUrl, setContinueUrl] = useState("/episodes/two-pointers/boats-to-save-people");
  const [heroDescription, setHeroDescription] = useState(
    "Start your first episode and build your daily streak."
  );

  useEffect(() => {
    const session = getSession();
    if (!session) return;

    const hour = new Date().getHours();
    const period =
      hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
    setGreeting(period);
    setFirstName(session.name.split(" ")[0]);

    const progress = getProgress(session.email);
    const patternsMastered = Object.values(progress.patterns).filter(
      (p) => p.percentComplete >= 100
    ).length;
    const episodesDone = Object.values(progress.episodes).filter(
      (e) => e.completedAt
    ).length;

    setStats({
      patternsMastered,
      episodesDone,
      streak: progress.streak.current,
      xp: progress.xp,
    });

    if (progress.lastVisited) {
      const { patternSlug, episodeSlug } = progress.lastVisited;
      setContinueUrl(`/episodes/${patternSlug}/${episodeSlug}`);
      const pattern = patterns.find((p) => p.slug === patternSlug);
      setHeroDescription(
        `You're working through ${pattern?.title ?? patternSlug}. ${
          progress.streak.current > 0
            ? `Keep your ${progress.streak.current}-day streak alive with today's pick.`
            : "Pick up where you left off."
        }`
      );
    } else if (episodes.length > 0) {
      setContinueUrl(
        `/episodes/${episodes[0].patternSlug}/${episodes[0].slug}`
      );
      setHeroDescription(
        "Begin with Boats to Save People — a story-driven intro to the Two Pointers pattern."
      );
    }
  }, [patterns, episodes]);

  const weekNumber = Math.min(
    12,
    Math.max(1, stats.patternsMastered + stats.episodesDone + 1)
  );

  const sortedEpisodes = useMemo(() => {
    return [...episodes].sort((a, b) => a.order - b.order);
  }, [episodes]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-5xl space-y-8 p-6 lg:p-10"
    >
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/90">
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-70"
          style={{
            background:
              "radial-gradient(circle, rgba(0,125,250,0.25) 0%, transparent 70%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "linear-gradient(135deg, rgba(0,125,250,0.1) 0%, transparent 55%)",
          }}
        />

        <div className="relative p-6 lg:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
                Week {weekNumber} of your journey
              </span>
              <span className="text-muted-foreground">
                · {stats.patternsMastered} pattern
                {stats.patternsMastered !== 1 ? "s" : ""} mastered
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1.5">
              <Image
                src="/snapppay-logo.svg"
                alt="Snapp Pay"
                width={18}
                height={18}
                className="rounded-full"
              />
              <span className="text-xs font-medium text-muted-foreground">
                Snapp Pay
              </span>
            </div>
          </div>

          <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
            {greeting}, {firstName}.
          </h1>
          <p className="mt-2 text-2xl font-bold text-primary lg:text-3xl">
            Ready to think algorithmically?
          </p>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            {heroDescription}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={continueUrl}>
              <Button
                size="lg"
                className="shadow-[0_0_24px_rgba(0,125,250,0.35)]"
              >
                Continue Learning
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/patterns">
              <Button size="lg" variant="outline">
                Browse Patterns
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Patterns Mastered"
          value={`${stats.patternsMastered}/${totalPatterns}`}
          icon={<Layers className="h-4 w-4 text-primary" />}
          iconClass="bg-primary/10"
        />
        <StatCard
          label="Episodes Done"
          value={String(stats.episodesDone)}
          icon={<BookOpen className="h-4 w-4 text-emerald-400" />}
          iconClass="bg-emerald-500/10"
        />
        <StatCard
          label="Day Streak"
          value={`${stats.streak} day${stats.streak !== 1 ? "s" : ""}`}
          icon={<Flame className="h-4 w-4 text-orange-400" />}
          iconClass="bg-orange-500/10"
        />
        <StatCard
          label="Total XP"
          value={stats.xp.toLocaleString()}
          icon={<Zap className="h-4 w-4 text-amber-400" />}
          iconClass="bg-amber-500/10"
        />
      </section>

      {/* Continue Learning */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em]">
            Continue Learning
          </h2>
          <Link
            href="/episodes"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all →
          </Link>
        </div>

        <div className="space-y-3">
          {sortedEpisodes.length === 0 ? (
            <div className="rounded-xl border border-border/70 bg-card/60 p-8 text-center text-muted-foreground">
              No episodes yet. Check back soon!
            </div>
          ) : (
            sortedEpisodes.map((episode) => (
              <Link
                key={`${episode.patternSlug}/${episode.slug}`}
                href={`/episodes/${episode.patternSlug}/${episode.slug}`}
              >
                <motion.div
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.15 }}
                  className="group flex items-center gap-4 rounded-xl border border-border/70 bg-card/80 p-4 transition-colors hover:border-primary/30"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted font-mono text-sm text-muted-foreground">
                    {String(episode.order).padStart(2, "0")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold transition-colors group-hover:text-primary">
                      {episode.subtitle}
                    </h3>
                    <p className="truncate text-sm text-muted-foreground">
                      {episode.patternTitle}
                      {episode.categoryLabels.length > 0 &&
                        ` · ${episode.categoryLabels.join(" · ")}`}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <DifficultyBadge difficulty={episode.difficulty} />
                    <span className="hidden items-center gap-1 text-xs text-muted-foreground sm:flex">
                      <Clock className="h-3.5 w-3.5" />
                      {episode.readTimeMin}m
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                  </div>
                </motion.div>
              </Link>
            ))
          )}
        </div>
      </section>
    </motion.div>
  );
}
