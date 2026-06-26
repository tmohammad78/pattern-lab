"use client";

import type { EpisodeSectionId, LastVisited, UserProgress } from "./types";
import { episodeKey } from "./utils";
import { scheduleProgressSync } from "./progress-sync";

const PROGRESS_PREFIX = "pattern-lab-progress-";

function storageKey(userId: string): string {
  return `${PROGRESS_PREFIX}${userId}`;
}

function defaultProgress(userId: string): UserProgress {
  return {
    userId,
    episodes: {},
    patterns: {},
    streak: { current: 0, lastActiveDate: "" },
    xp: 0,
    problemsSolved: 0,
    weeklyActivity: [0, 0, 0, 0, 0, 0, 0],
  };
}

export function getProgress(userId: string): UserProgress {
  if (typeof window === "undefined") return defaultProgress(userId);
  const raw = localStorage.getItem(storageKey(userId));
  if (!raw) return defaultProgress(userId);
  try {
    return { ...defaultProgress(userId), ...JSON.parse(raw) };
  } catch {
    return defaultProgress(userId);
  }
}

export function saveProgress(progress: UserProgress): void {
  const payload: UserProgress = {
    ...progress,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(storageKey(payload.userId), JSON.stringify(payload));
  scheduleProgressSync(payload);
}

function touchStreak(progress: UserProgress): UserProgress {
  const today = new Date().toISOString().slice(0, 10);
  const { lastActiveDate, current } = progress.streak;

  if (lastActiveDate === today) return progress;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  const newStreak =
    lastActiveDate === yesterdayStr ? current + 1 : lastActiveDate ? 1 : 1;

  const dayIndex = (new Date().getDay() + 6) % 7;
  const weeklyActivity = [...progress.weeklyActivity];
  weeklyActivity[dayIndex] = (weeklyActivity[dayIndex] ?? 0) + 1;

  return {
    ...progress,
    streak: { current: newStreak, lastActiveDate: today },
    weeklyActivity,
  };
}

export function markSectionRead(
  userId: string,
  patternSlug: string,
  episodeSlug: string,
  sectionId: EpisodeSectionId,
  totalSections: number
): UserProgress {
  let progress = touchStreak(getProgress(userId));
  const key = episodeKey(patternSlug, episodeSlug);
  const ep = progress.episodes[key] ?? { sectionsRead: [] };

  if (!ep.sectionsRead.includes(sectionId)) {
    ep.sectionsRead = [...ep.sectionsRead, sectionId];
    progress = { ...progress, xp: progress.xp + 10 };
  }

  if (ep.sectionsRead.length >= totalSections && !ep.completedAt) {
    ep.completedAt = new Date().toISOString();
    progress = {
      ...progress,
      xp: progress.xp + 50,
      problemsSolved: progress.problemsSolved + 1,
    };
  }

  progress.episodes = { ...progress.episodes, [key]: ep };
  progress.lastVisited = { patternSlug, episodeSlug, sectionId };

  const percent = Math.round((ep.sectionsRead.length / totalSections) * 100);
  progress.patterns = {
    ...progress.patterns,
    [patternSlug]: { percentComplete: percent },
  };

  saveProgress(progress);
  return progress;
}

export function markQuizComplete(
  userId: string,
  patternSlug: string,
  episodeSlug: string,
  score: number,
  totalSections: number
): UserProgress {
  let progress = getProgress(userId);
  const key = episodeKey(patternSlug, episodeSlug);
  const ep = progress.episodes[key] ?? { sectionsRead: [] };
  ep.quizScore = score;

  if (!ep.sectionsRead.includes("quiz")) {
    ep.sectionsRead = [...ep.sectionsRead, "quiz"];
  }

  progress = {
    ...progress,
    episodes: { ...progress.episodes, [key]: ep },
    xp: progress.xp + score * 20,
  };

  if (ep.sectionsRead.length >= totalSections && !ep.completedAt) {
    ep.completedAt = new Date().toISOString();
    progress.problemsSolved += 1;
  }

  progress.patterns = {
    ...progress.patterns,
    [patternSlug]: {
      percentComplete: Math.round(
        (ep.sectionsRead.length / totalSections) * 100
      ),
    },
  };

  saveProgress(progress);
  return progress;
}

export function setLastVisited(
  userId: string,
  lastVisited: LastVisited
): UserProgress {
  const progress = { ...getProgress(userId), lastVisited };
  saveProgress(progress);
  return progress;
}

export function exportProgress(userId: string): void {
  const progress = getProgress(userId);
  const blob = new Blob([JSON.stringify(progress, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `progress-${userId.replace("@", "-")}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function importProgress(
  userId: string,
  file: File
): Promise<UserProgress> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string) as UserProgress;
        const merged = { ...data, userId };
        saveProgress(merged);
        resolve(merged);
      } catch {
        reject(new Error("Invalid progress file"));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}

export function isEpisodeComplete(
  progress: UserProgress,
  patternSlug: string,
  episodeSlug: string
): boolean {
  const key = episodeKey(patternSlug, episodeSlug);
  return Boolean(progress.episodes[key]?.completedAt);
}

export function getPatternProgress(
  progress: UserProgress,
  patternSlug: string
): number {
  return progress.patterns[patternSlug]?.percentComplete ?? 0;
}
