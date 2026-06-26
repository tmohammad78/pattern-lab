"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, CheckCircle2 } from "lucide-react";
import { DifficultyBadge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Pattern } from "@/lib/types";

const CHART_COLORS: Record<string, string> = {
  "chart-1": "#007dfa",
  "chart-2": "#10b981",
  "chart-3": "#f59e0b",
  "chart-4": "#06b6d4",
  "chart-5": "#ec4899",
};

function getThemeColor(colorKey: string): string {
  return CHART_COLORS[colorKey] ?? CHART_COLORS["chart-1"];
}

interface PatternCardProps {
  pattern: Pattern;
  progress?: number;
  view?: "grid" | "list";
}

export function PatternCard({
  pattern,
  progress = 0,
  view = "grid",
}: PatternCardProps) {
  const isComplete = progress >= 100;
  const theme = getThemeColor(pattern.color);
  const displayProgress = isComplete ? 100 : Math.max(progress, progress > 0 ? 8 : 0);

  if (view === "list") {
    return (
      <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.15 }}>
        <Link href={`/patterns/${pattern.slug}`}>
          <article
            className="group flex items-center gap-4 rounded-xl border border-border/80 bg-card/80 p-4 backdrop-blur-sm transition-all hover:border-[color-mix(in_srgb,var(--theme)_35%,transparent)]"
            style={{ "--theme": theme } as React.CSSProperties}
          >
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
              style={{ background: `${theme}18` }}
            >
              <span
                className="h-3 w-3 rounded-full"
                style={{ background: theme, boxShadow: `0 0 10px ${theme}80` }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold group-hover:text-[var(--theme)] transition-colors">
                  {pattern.title}
                </h3>
                {isComplete && (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                )}
              </div>
              <p className="truncate text-sm text-muted-foreground">
                {pattern.description}
              </p>
            </div>
            <div className="hidden items-center gap-3 sm:flex">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <BookOpen className="h-3.5 w-3.5" />
                {pattern.episodeCount} episodes
              </span>
              <DifficultyBadge difficulty={pattern.difficulty} />
            </div>
          </article>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="h-full"
    >
      <Link href={`/patterns/${pattern.slug}`} className="block h-full">
        <article
          className={cn(
            "group relative flex h-full flex-col overflow-hidden rounded-xl",
            "border border-border/70 bg-card/90 backdrop-blur-sm",
            "transition-all duration-300",
            "hover:border-[color-mix(in_srgb,var(--theme)_40%,transparent)]",
            "hover:shadow-[0_8px_32px_-8px_color-mix(in_srgb,var(--theme)_25%,transparent)]"
          )}
          style={{ "--theme": theme } as React.CSSProperties}
        >
          {/* subtle top glow */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-24 opacity-40 transition-opacity group-hover:opacity-70"
            style={{
              background: `linear-gradient(180deg, ${theme}14 0%, transparent 100%)`,
            }}
          />

          <div className="relative flex flex-1 flex-col p-5 pb-4">
            {/* header row */}
            <div className="mb-5 flex items-start justify-between">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl ring-1 ring-white/5"
                style={{ background: `${theme}15` }}
              >
                <span
                  className="h-3.5 w-3.5 rounded-full"
                  style={{
                    background: theme,
                    boxShadow: `0 0 12px ${theme}90`,
                  }}
                />
              </div>
              {isComplete && (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/25">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                </div>
              )}
            </div>

            {/* title + description */}
            <h3 className="mb-2 text-[15px] font-semibold leading-snug tracking-tight transition-colors group-hover:text-[var(--theme)]">
              {pattern.title}
            </h3>
            <p className="mb-4 line-clamp-2 min-h-[2.5rem] text-[13px] leading-relaxed text-muted-foreground">
              {pattern.description}
            </p>

            {/* tags */}
            <div className="mb-5 flex flex-wrap gap-1.5">
              {pattern.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-border/80 bg-background/40 px-2 py-0.5 text-[11px] text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* footer meta */}
            <div className="mt-auto flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                <BookOpen className="h-3.5 w-3.5 opacity-70" />
                {pattern.episodeCount} episode{pattern.episodeCount !== 1 ? "s" : ""}
              </span>
              <DifficultyBadge difficulty={pattern.difficulty} />
            </div>
          </div>

          {/* progress bar */}
          <div className="h-[3px] bg-muted/80">
            <motion.div
              className="h-full rounded-r-full"
              style={{ background: theme }}
              initial={{ width: 0 }}
              animate={{ width: `${displayProgress}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
