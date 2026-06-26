"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import {
  StatCard,
  WeeklyChart,
  TopicRadarChart,
  BadgeGrid,
} from "@/components/progress/progress-charts";
import { getSession } from "@/lib/auth";
import {
  getProgress,
  exportProgress,
  importProgress,
} from "@/lib/progress";
import type { Category, Pattern } from "@/lib/types";

interface ProgressClientProps {
  patterns: Pattern[];
  categories: Category[];
}

export function ProgressClient({ patterns, categories }: ProgressClientProps) {
  const [stats, setStats] = useState({
    xp: 0,
    problemsSolved: 0,
    streak: 0,
    patternsDone: "0/0",
    weeklyActivity: [0, 0, 0, 0, 0, 0, 0],
  });
  const [radarData, setRadarData] = useState<{ label: string; value: number }[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const userIdRef = useRef("");

  function refreshStats(email: string) {
    const progress = getProgress(email);
    const done = Object.values(progress.patterns).filter(
      (p) => p.percentComplete >= 100
    ).length;

    setStats({
      xp: progress.xp,
      problemsSolved: progress.problemsSolved,
      streak: progress.streak.current,
      patternsDone: `${done}/${patterns.length}`,
      weeklyActivity: progress.weeklyActivity,
    });

    setRadarData(
      categories.slice(0, 7).map((cat) => ({
        label: cat.label.split(" ")[0],
        value: Math.round(
          (progress.patterns[
            patterns.find((p) => p.categories.includes(cat.id))?.slug ?? ""
          ]?.percentComplete ?? 0) / 10
        ),
      }))
    );
  }

  useEffect(() => {
    const session = getSession();
    if (!session) return;
    userIdRef.current = session.email;
    refreshStats(session.email);
  }, [patterns, categories]);

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !userIdRef.current) return;
    try {
      await importProgress(userIdRef.current, file);
      refreshStats(userIdRef.current);
    } catch {
      alert("Failed to import progress file");
    }
  }

  const badges = [
    {
      id: "seeker",
      title: "Pattern Seeker",
      description: "Completed first pattern",
      icon: "🔍",
      unlocked: stats.problemsSolved >= 1,
    },
    {
      id: "reader",
      title: "Speed Reader",
      description: "5 episodes in one day",
      icon: "⚡",
      unlocked: false,
    },
    {
      id: "two-pointer",
      title: "Two-Pointer Pro",
      description: "Mastered Two Pointers",
      icon: "👆",
      unlocked: stats.problemsSolved >= 1,
    },
    {
      id: "streak",
      title: "On Fire",
      description: "5 day streak",
      icon: "🔥",
      unlocked: stats.streak >= 5,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 lg:p-10"
    >
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Your Progress</h1>
          <p className="mt-2 text-muted-foreground">
            Track your learning journey across all patterns and episodes.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => userIdRef.current && exportProgress(userIdRef.current)}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileRef.current?.click()}
          >
            <Upload className="h-4 w-4" />
            Import
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImport}
          />
        </div>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total XP" value={stats.xp} color="text-amber-400" />
        <StatCard
          label="Problems Solved"
          value={stats.problemsSolved}
          color="text-emerald-400"
        />
        <StatCard
          label="Day Streak"
          value={stats.streak}
          color="text-orange-400"
        />
        <StatCard
          label="Patterns Done"
          value={stats.patternsDone}
          color="text-primary"
        />
      </div>

      <div className="mb-8 grid gap-4 lg:grid-cols-2">
        <WeeklyChart data={stats.weeklyActivity} />
        <TopicRadarChart categories={radarData} />
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold">Achievements</h2>
        <BadgeGrid badges={badges} />
      </div>
    </motion.div>
  );
}
