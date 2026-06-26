import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import type {
  Category,
  Episode,
  Pattern,
  Resource,
  User,
} from "./types";
import {
  filterCategories,
  filterEpisodes,
  filterPatterns,
  filterResources,
  isEpisodePublished,
  isPatternPublished,
  type CatalogConfig,
} from "./catalog";
import { mdxComponents } from "@/components/mdx/mdx-components";

const contentDir = path.join(process.cwd(), "content");
const configDir = path.join(contentDir, "config");

function readJson<T>(filename: string): T {
  const filePath = path.join(configDir, filename);
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
}

export function getCatalog(): CatalogConfig {
  return readJson<CatalogConfig>("catalog.json");
}

export function getCategories(): Category[] {
  const catalog = getCatalog();
  const categories = readJson<Category[]>("categories.json");
  const patterns = getAllPatterns();
  return filterCategories(catalog, categories, patterns);
}

function getAllPatterns(): Pattern[] {
  const data = readJson<Record<string, Pattern>>("patterns.json");
  return Object.values(data);
}

function getAllEpisodes(): Episode[] {
  const data = readJson<Record<string, Episode>>("episodes.json");
  return Object.values(data).sort((a, b) => a.order - b.order);
}

export function getPatterns(): Pattern[] {
  const catalog = getCatalog();
  return filterPatterns(catalog, getAllPatterns());
}

export function getPattern(slug: string): Pattern | undefined {
  const catalog = getCatalog();
  if (!isPatternPublished(catalog, slug)) return undefined;
  const data = readJson<Record<string, Pattern>>("patterns.json");
  return data[slug];
}

export function getEpisodes(): Episode[] {
  const catalog = getCatalog();
  return filterEpisodes(catalog, getAllEpisodes());
}

export function getEpisode(
  patternSlug: string,
  episodeSlug: string
): Episode | undefined {
  const catalog = getCatalog();
  if (!isEpisodePublished(catalog, patternSlug, episodeSlug)) return undefined;
  const data = readJson<Record<string, Episode>>("episodes.json");
  return data[`${patternSlug}/${episodeSlug}`];
}

export function getEpisodesByPattern(patternSlug: string): Episode[] {
  const catalog = getCatalog();
  if (!isPatternPublished(catalog, patternSlug)) return [];
  return getEpisodes().filter((e) => e.patternSlug === patternSlug);
}

export function getResources(): Resource[] {
  const catalog = getCatalog();
  const resources = readJson<Resource[]>("resources.json");
  return filterResources(catalog, resources);
}

export function getUsers(): User[] {
  return readJson<User[]>("users.json");
}

export async function compileMdxFile(relativePath: string) {
  const filePath = path.join(contentDir, relativePath);
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const source = fs.readFileSync(filePath, "utf-8");
  const { content, data } = matter(source);

  const { content: compiled } = await compileMDX({
    source: content,
    components: mdxComponents,
    options: { parseFrontmatter: false },
  });

  return { compiled, frontmatter: data };
}

export function getMdxRawContent(relativePath: string): string {
  const filePath = path.join(contentDir, relativePath);
  if (!fs.existsSync(filePath)) return "";
  const source = fs.readFileSync(filePath, "utf-8");
  return matter(source).content;
}

export function getSearchDocuments() {
  const patterns = getPatterns();
  const episodes = getEpisodes();

  const patternDocs = patterns.map((p) => ({
    id: p.slug,
    title: p.title,
    subtitle: p.description,
    href: `/patterns/${p.slug}`,
    type: "pattern" as const,
    tags: [...p.tags, ...p.categories],
    body: getMdxRawContent(p.mdx),
  }));

  const episodeDocs = episodes.map((e) => ({
    id: `${e.patternSlug}/${e.slug}`,
    title: e.title,
    subtitle: e.subtitle,
    href: `/episodes/${e.patternSlug}/${e.slug}`,
    type: "episode" as const,
    tags: [e.patternSlug, e.difficulty],
    body: getMdxRawContent(e.mdx),
  }));

  return [...patternDocs, ...episodeDocs];
}
