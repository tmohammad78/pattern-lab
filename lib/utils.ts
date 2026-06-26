import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Difficulty } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getGreeting(name: string): string {
  const hour = new Date().getHours();
  const period =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  return `${period}, ${name.split(" ")[0]}`;
}

export function difficultyColor(difficulty: Difficulty): string {
  switch (difficulty) {
    case "easy":
      return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
    case "medium":
      return "text-amber-400 border-amber-500/30 bg-amber-500/10";
    case "hard":
      return "text-red-400 border-red-500/30 bg-red-500/10";
  }
}

export function episodeKey(patternSlug: string, episodeSlug: string): string {
  return `${patternSlug}/${episodeSlug}`;
}

export function formatEpisodeNumber(order: number): string {
  return `Episode ${String(order).padStart(2, "0")}`;
}
