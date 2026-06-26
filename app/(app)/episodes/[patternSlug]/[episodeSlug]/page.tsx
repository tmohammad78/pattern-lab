import { notFound } from "next/navigation";
import { getEpisode, getPattern, getCategories } from "@/lib/content";
import { getEpisodeData } from "@/lib/episode-data";
import { EpisodeClient } from "@/components/episodes/episode-client";

interface EpisodePageProps {
  params: Promise<{ patternSlug: string; episodeSlug: string }>;
}

export default async function EpisodePage({ params }: EpisodePageProps) {
  const { patternSlug, episodeSlug } = await params;
  const episode = getEpisode(patternSlug, episodeSlug);
  const pattern = getPattern(patternSlug);
  const data = getEpisodeData(patternSlug, episodeSlug);
  const categories = getCategories();

  if (!episode || !pattern || !data) notFound();

  const categoryId = pattern.categories[0];
  const categoryLabel =
    categories.find((c) => c.id === categoryId)?.label ?? categoryId;

  return (
    <EpisodeClient
      episode={episode}
      patternTitle={pattern.title}
      categoryLabel={categoryLabel}
      heroDescription={
        episode.heroDescription ??
        pattern.description
      }
      data={data}
    />
  );
}

export async function generateStaticParams() {
  const { getEpisodes } = await import("@/lib/content");
  return getEpisodes().map((e) => ({
    patternSlug: e.patternSlug,
    episodeSlug: e.slug,
  }));
}
