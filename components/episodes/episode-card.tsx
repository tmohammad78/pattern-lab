"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { DifficultyBadge } from "@/components/ui/badge";
import { formatEpisodeNumber } from "@/lib/utils";
import type { Episode } from "@/lib/types";

interface EpisodeCardProps {
  episode: Episode;
  patternTitle: string;
  isComplete?: boolean;
}

export function EpisodeCard({
  episode,
  patternTitle,
  isComplete = false,
}: EpisodeCardProps) {
  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
      <Link href={`/episodes/${episode.patternSlug}/${episode.slug}`}>
        <Card className="group p-5 transition-colors hover:border-primary/30">
          <div className="mb-3 flex items-start justify-between">
            <span className="text-xs font-medium text-primary">
              {formatEpisodeNumber(episode.order)}
            </span>
            {isComplete && (
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            )}
          </div>
          <h3 className="mb-1 font-semibold group-hover:text-primary transition-colors">
            {episode.title}
          </h3>
          <p className="mb-1 text-sm text-muted-foreground">{episode.subtitle}</p>
          <p className="mb-4 text-xs text-muted-foreground">{patternTitle}</p>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              {episode.readTimeMin} min read
            </span>
            <DifficultyBadge difficulty={episode.difficulty} />
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
