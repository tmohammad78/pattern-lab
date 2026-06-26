"use client";

import { EpisodeCard } from "@/components/episodes/episode-card";
import { PatternHero, CoreIntuition } from "@/components/patterns/pattern-hero";
import { TwoPointerVariants } from "@/components/patterns/two-pointer-variants";
import type { Episode, Pattern } from "@/lib/types";
import type { VariantVisualization } from "@/lib/pattern-visualizations";

interface PatternDetailClientProps {
  pattern: Pattern;
  episodes: Episode[];
  categoryLabel: string;
  mdxContent: React.ReactNode;
  visualizations: VariantVisualization[];
}

export function PatternDetailClient({
  pattern,
  episodes,
  categoryLabel,
  mdxContent,
  visualizations,
}: PatternDetailClientProps) {
  return (
    <>
      <PatternHero
        pattern={pattern}
        episodes={episodes}
        categoryLabel={categoryLabel}
      />

      {mdxContent && <CoreIntuition>{mdxContent}</CoreIntuition>}

      {visualizations.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-2 text-xl font-semibold">Visual Diagram</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Step through each two-pointer style with example numbers.
          </p>
          <TwoPointerVariants visualizations={visualizations} />
        </div>
      )}

      {pattern.variants.length > 0 && visualizations.length === 0 && (
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold">Variants</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {pattern.variants.map((v) => (
              <div
                key={v.id}
                className="rounded-xl border border-border/70 bg-card/60 p-5"
              >
                <h3 className="mb-2 font-medium">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {episodes.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-semibold">Episodes</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {episodes.map((ep) => (
              <EpisodeCard
                key={ep.slug}
                episode={ep}
                patternTitle={pattern.title}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
