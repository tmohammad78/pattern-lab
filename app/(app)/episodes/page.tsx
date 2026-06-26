import {
  getEpisodes,
  getPatterns,
  getPattern,
} from "@/lib/content";
import { EpisodeCard } from "@/components/episodes/episode-card";

export default function EpisodesPage() {
  const episodes = getEpisodes();
  const patterns = getPatterns();
  const patternMap = Object.fromEntries(patterns.map((p) => [p.slug, p.title]));

  const grouped = patterns
    .map((pattern) => ({
      pattern,
      episodes: episodes.filter((e) => e.patternSlug === pattern.slug),
    }))
    .filter((g) => g.episodes.length > 0);

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Episodes</h1>
        <p className="mt-2 text-muted-foreground">
          Story-driven walkthroughs of classic LeetCode problems.
        </p>
      </div>

      {grouped.length === 0 ? (
        <p className="text-muted-foreground">No episodes yet. Check back soon!</p>
      ) : (
        grouped.map(({ pattern, episodes: eps }) => (
          <div key={pattern.slug} className="mb-10">
            <h2 className="mb-4 text-xl font-semibold">{pattern.title}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {eps.map((ep) => (
                <EpisodeCard
                  key={ep.slug}
                  episode={ep}
                  patternTitle={patternMap[ep.patternSlug] ?? ep.patternSlug}
                />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
