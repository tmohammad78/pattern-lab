"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Suspense, useEffect, useState } from "react";
import { PatternCard } from "@/components/patterns/pattern-card";
import { FilterChips, ViewToggle } from "@/components/patterns/filter-chips";
import { getSession } from "@/lib/auth";
import { getProgress, getPatternProgress } from "@/lib/progress";
import type { Category, Pattern } from "@/lib/types";

interface PatternsClientProps {
  patterns: Pattern[];
  categories: Category[];
}

function PatternsContent({ patterns, categories }: PatternsClientProps) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") ?? "all";
  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});

  useEffect(() => {
    setActiveCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    const saved = localStorage.getItem("pattern-lab-view");
    if (saved === "list" || saved === "grid") setView(saved);
  }, []);

  useEffect(() => {
    const session = getSession();
    if (!session) return;
    const progress = getProgress(session.email);
    const map: Record<string, number> = {};
    patterns.forEach((p) => {
      map[p.slug] = getPatternProgress(progress, p.slug);
    });
    setProgressMap(map);
  }, [patterns]);

  function handleViewChange(v: "grid" | "list") {
    setView(v);
    localStorage.setItem("pattern-lab-view", v);
  }

  const filtered =
    activeCategory === "all"
      ? patterns
      : patterns.filter((p) => p.categories.includes(activeCategory));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 lg:p-10"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Algorithm Patterns</h1>
        <p className="mt-2 text-muted-foreground">
          Master the essential patterns that cover 90% of interview problems.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <FilterChips
          categories={categories}
          active={activeCategory}
          onChange={setActiveCategory}
        />
        <ViewToggle view={view} onChange={handleViewChange} />
      </div>

      <div
        className={
          view === "grid"
            ? "grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
            : "space-y-3"
        }
      >
        {filtered.map((pattern) => (
          <PatternCard
            key={pattern.slug}
            pattern={pattern}
            progress={progressMap[pattern.slug] ?? 0}
            view={view}
          />
        ))}
      </div>
    </motion.div>
  );
}

export function PatternsClient(props: PatternsClientProps) {
  return (
    <Suspense>
      <PatternsContent {...props} />
    </Suspense>
  );
}
