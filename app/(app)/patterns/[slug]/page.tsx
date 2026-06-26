import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPattern,
  getEpisodesByPattern,
  compileMdxFile,
  getCategories,
} from "@/lib/content";
import { getPatternVisualizations } from "@/lib/pattern-visualizations";
import { PatternDetailClient } from "@/components/patterns/pattern-detail-client";

interface PatternDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PatternDetailPage({
  params,
}: PatternDetailPageProps) {
  const { slug } = await params;
  const pattern = getPattern(slug);
  if (!pattern) notFound();

  const episodes = getEpisodesByPattern(slug);
  const mdx = await compileMdxFile(pattern.mdx);
  const categories = getCategories();
  const categoryLabel =
    categories.find((c) => c.id === pattern.categories[0])?.label ??
    pattern.categories[0];
  const visualizations = getPatternVisualizations(slug);

  return (
    <div className="p-6 lg:p-10">
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/patterns" className="hover:text-primary">
          Patterns
        </Link>
        <span className="mx-2">›</span>
        <span className="text-foreground">{pattern.title}</span>
      </nav>

      <PatternDetailClient
        pattern={pattern}
        episodes={episodes}
        categoryLabel={categoryLabel}
        mdxContent={mdx?.compiled}
        visualizations={visualizations}
      />
    </div>
  );
}

export async function generateStaticParams() {
  const { getPatterns } = await import("@/lib/content");
  return getPatterns().map((p) => ({ slug: p.slug }));
}
