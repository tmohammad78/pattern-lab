"use client";

import Link from "next/link";
import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { EpisodeHero } from "@/components/episodes/episode-hero";
import { OnThisPageNav } from "@/components/episodes/timeline";
import { EpisodeSections } from "@/components/episodes/episode-sections";
import { getSession } from "@/lib/auth";
import { getProgress, markQuizComplete, markSectionRead } from "@/lib/progress";
import { formatEpisodeNumber } from "@/lib/utils";
import type { Episode, EpisodeSectionId } from "@/lib/types";
import type { EpisodeContentData } from "@/lib/types";

interface EpisodeClientProps {
  episode: Episode;
  patternTitle: string;
  categoryLabel: string;
  heroDescription: string;
  data: EpisodeContentData;
}

export function EpisodeClient({
  episode,
  patternTitle,
  categoryLabel,
  heroDescription,
  data,
}: EpisodeClientProps) {
  const [completedSections, setCompletedSections] = useState<EpisodeSectionId[]>([]);
  const [activeSection, setActiveSection] = useState<EpisodeSectionId>("story");
  const [isComplete, setIsComplete] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const session = getSession();
    if (!session) return;
    setUserId(session.email);
    const progress = getProgress(session.email);
    const key = `${episode.patternSlug}/${episode.slug}`;
    const epProgress = progress.episodes[key];
    setCompletedSections(epProgress?.sectionsRead ?? []);
    setIsComplete(Boolean(epProgress?.completedAt));
  }, [episode]);

  const handleSectionRead = useCallback((sectionId: EpisodeSectionId) => {
    setActiveSection(sectionId);
    setCompletedSections((prev) =>
      prev.includes(sectionId) ? prev : [...prev, sectionId]
    );
  }, []);

  function scrollToSection(sectionId: EpisodeSectionId) {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    setActiveSection(sectionId);
  }

  function handleMarkComplete() {
    if (!userId) return;
    episode.sections.forEach((sectionId) => {
      markSectionRead(
        userId,
        episode.patternSlug,
        episode.slug,
        sectionId,
        episode.sections.length
      );
    });
    setCompletedSections(episode.sections);
    setIsComplete(true);
  }

  function handleQuizComplete(score: number) {
    if (!userId) return;
    markQuizComplete(
      userId,
      episode.patternSlug,
      episode.slug,
      score,
      episode.sections.length
    );
    setCompletedSections((prev) =>
      prev.includes("quiz") ? prev : [...prev, "quiz"]
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-6xl p-6 lg:p-10"
    >
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link
          href={`/patterns/${episode.patternSlug}`}
          className="hover:text-primary transition-colors"
        >
          {patternTitle}
        </Link>
        <span className="mx-2">›</span>
        <span className="text-foreground">
          {formatEpisodeNumber(episode.order)}
        </span>
      </nav>

      <div className="mb-10">
        <EpisodeHero
          episodeNumber={`EP ${String(episode.order).padStart(2, "0")}`}
          category={categoryLabel}
          difficulty={episode.difficulty}
          readTimeMin={episode.readTimeMin}
          title={episode.subtitle}
          description={heroDescription}
          isComplete={isComplete}
          onMarkComplete={handleMarkComplete}
        />
      </div>

      <div className="flex flex-col gap-10 xl:flex-row xl:items-start">
        <div className="min-w-0 flex-1">
          <div className="sticky top-14 z-20 -mx-6 mb-8 bg-background/95 px-6 py-3 backdrop-blur-md xl:hidden">
            <OnThisPageNav
              sections={episode.sections}
              activeSection={activeSection}
              onSectionClick={scrollToSection}
              variant="compact"
            />
          </div>
          {userId && (
            <EpisodeSections
              episode={episode}
              data={data}
              userId={userId}
              completedSections={completedSections}
              onSectionRead={handleSectionRead}
              onQuizComplete={handleQuizComplete}
            />
          )}
        </div>

        <aside className="hidden w-56 shrink-0 self-start xl:block">
          <div className="sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto pb-8">
            <OnThisPageNav
              sections={episode.sections}
              activeSection={activeSection}
              onSectionClick={scrollToSection}
            />
          </div>
        </aside>
      </div>
    </motion.div>
  );
}
