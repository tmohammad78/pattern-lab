import { getPatterns, getEpisodes, getCategories } from "@/lib/content";
import { HomeClient } from "@/components/home/home-client";

export default function HomePage() {
  const patterns = getPatterns();
  const episodes = getEpisodes();
  const categories = getCategories();

  const patternMap = Object.fromEntries(
    patterns.map((p) => [p.slug, p])
  );

  const categoryMap = Object.fromEntries(
    categories.map((c) => [c.id, c.label])
  );

  return (
    <HomeClient
      patterns={patterns}
      episodes={episodes.map((ep) => ({
        ...ep,
        patternTitle: patternMap[ep.patternSlug]?.title ?? ep.patternSlug,
        categoryLabels: (patternMap[ep.patternSlug]?.categories ?? []).map(
          (id) => categoryMap[id] ?? id
        ),
      }))}
      totalPatterns={patterns.length}
    />
  );
}
