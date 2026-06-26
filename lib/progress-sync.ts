"use client";

import type { UserProgress } from "./types";
import { mergeProgress } from "./progress-merge";
import { getProgress, saveProgress } from "./progress";

let syncTimer: ReturnType<typeof setTimeout> | null = null;

export async function fetchRemoteProgress(
  userId: string
): Promise<UserProgress | null> {
  try {
    const res = await fetch(
      `/api/progress?userId=${encodeURIComponent(userId)}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { progress: UserProgress | null };
    return data.progress;
  } catch {
    return null;
  }
}

export async function pushProgressToServer(
  progress: UserProgress
): Promise<boolean> {
  try {
    const res = await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: progress.userId, progress }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function scheduleProgressSync(progress: UserProgress): void {
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    void pushProgressToServer(progress);
  }, 800);
}

export async function hydrateProgressFromServer(
  userId: string
): Promise<UserProgress> {
  const local = getProgress(userId);
  const remote = await fetchRemoteProgress(userId);

  if (!remote) {
    scheduleProgressSync(local);
    return local;
  }

  const merged = mergeProgress(local, remote);
  saveProgress(merged);
  scheduleProgressSync(merged);
  return merged;
}
