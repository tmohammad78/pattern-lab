"use client";

import { cn } from "@/lib/utils";
import type { EpisodeSectionId } from "@/lib/types";

export const SECTION_LABELS: Record<EpisodeSectionId, string> = {
  story: "Story",
  problem: "Problem Statement",
  diagram: "Visual Illustration",
  "try-yourself": "Try Yourself",
  "brute-force": "Brute Force",
  observation: "Insight Discovery",
  "pattern-discovery": "Pattern Reveal",
  solution: "Generic Solution",
  complexity: "Complexity",
  related: "Related Problems",
  quiz: "Quiz",
  takeaways: "Key Takeaways",
};

export const SECTION_OVERLINES: Record<EpisodeSectionId, string> = {
  story: "The Setup",
  problem: "Specification",
  diagram: "Visualization",
  "try-yourself": "Practice",
  "brute-force": "Approach",
  observation: "Analysis",
  "pattern-discovery": "Discovery",
  solution: "Solution",
  complexity: "Complexity",
  related: "Extension",
  quiz: "Review",
  takeaways: "Summary",
};

interface OnThisPageNavProps {
  sections: EpisodeSectionId[];
  activeSection: EpisodeSectionId;
  onSectionClick: (id: EpisodeSectionId) => void;
  variant?: "sidebar" | "compact";
}

export function OnThisPageNav({
  sections,
  activeSection,
  onSectionClick,
  variant = "sidebar",
}: OnThisPageNavProps) {
  if (variant === "compact") {
    return (
      <nav className="overflow-x-auto pb-2">
        <div className="flex gap-2">
          {sections.map((section, index) => {
            const isActive = section === activeSection;
            const num = String(index + 1).padStart(2, "0");
            return (
              <button
                key={section}
                onClick={() => onSectionClick(section)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-colors",
                  isActive
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border text-muted-foreground"
                )}
              >
                <span className="font-mono">{num}</span>
                <span>{SECTION_LABELS[section]}</span>
              </button>
            );
          })}
        </div>
      </nav>
    );
  }

  return (
    <nav>
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        On this page
      </p>
      <ul className="space-y-1">
        {sections.map((section, index) => {
          const isActive = section === activeSection;
          const num = String(index + 1).padStart(2, "0");
          return (
            <li key={section}>
              <button
                onClick={() => onSectionClick(section)}
                className={cn(
                  "relative flex w-full items-center gap-3 rounded-lg py-2 pl-4 pr-2 text-left text-sm transition-colors",
                  isActive
                    ? "font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <span
                    className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-primary"
                    style={{
                      boxShadow: "0 0 8px rgba(0,125,250,0.6)",
                    }}
                  />
                )}
                <span
                  className={cn(
                    "font-mono text-xs tabular-nums",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {num}
                </span>
                <span>{SECTION_LABELS[section]}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function ProgressTracker({
  sections,
  completedSections,
}: {
  sections: EpisodeSectionId[];
  completedSections: EpisodeSectionId[];
}) {
  const progress = Math.round(
    (completedSections.length / sections.length) * 100
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Story</span>
        <span>{progress}%</span>
        <span>Quiz</span>
      </div>
      <div className="flex gap-1">
        {sections.map((section) => (
          <div
            key={section}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              completedSections.includes(section) ? "bg-primary" : "bg-muted"
            )}
          />
        ))}
      </div>
    </div>
  );
}
