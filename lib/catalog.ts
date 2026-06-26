import type { Category, Episode, Pattern, Resource } from "./types";

export interface CatalogConfig {
  mode: "all" | "published-only";
  patterns: string[];
  episodes: string[];
  categories?: string[];
  resources?: string[];
  navigation?: {
    home?: boolean;
    patterns?: boolean;
    episodes?: boolean;
    playground?: boolean;
    resources?: boolean;
    progress?: boolean;
  };
}

export function episodeKey(patternSlug: string, episodeSlug: string): string {
  return `${patternSlug}/${episodeSlug}`;
}

export function isPatternPublished(
  catalog: CatalogConfig,
  slug: string
): boolean {
  if (catalog.mode === "all") return true;
  return catalog.patterns.includes(slug);
}

export function isEpisodePublished(
  catalog: CatalogConfig,
  patternSlug: string,
  episodeSlug: string
): boolean {
  if (catalog.mode === "all") return true;
  return catalog.episodes.includes(episodeKey(patternSlug, episodeSlug));
}

export function filterPatterns(
  catalog: CatalogConfig,
  patterns: Pattern[]
): Pattern[] {
  if (catalog.mode === "all") return patterns;
  return patterns.filter((p) => catalog.patterns.includes(p.slug));
}

export function filterEpisodes(
  catalog: CatalogConfig,
  episodes: Episode[]
): Episode[] {
  if (catalog.mode === "all") return episodes;
  return episodes.filter((e) =>
    catalog.episodes.includes(episodeKey(e.patternSlug, e.slug))
  );
}

export function filterCategories(
  catalog: CatalogConfig,
  categories: Category[],
  patterns: Pattern[]
): Category[] {
  if (catalog.mode === "all") return categories;

  if (catalog.categories?.length) {
    return categories.filter((c) => catalog.categories!.includes(c.id));
  }

  const publishedCategoryIds = new Set(
    patterns.flatMap((p) => p.categories)
  );
  return categories.filter((c) => publishedCategoryIds.has(c.id));
}

export function filterResources(
  catalog: CatalogConfig,
  resources: Resource[]
): Resource[] {
  if (catalog.mode === "all") return resources;
  if (!catalog.resources?.length) return [];
  return resources.filter((r) => catalog.resources!.includes(r.id));
}

export function isNavEnabled(
  catalog: CatalogConfig,
  key: keyof NonNullable<CatalogConfig["navigation"]>
): boolean {
  if (catalog.mode === "all") return true;
  return catalog.navigation?.[key] !== false;
}
