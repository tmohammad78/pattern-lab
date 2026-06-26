import Fuse from "fuse.js";
import type { SearchItem } from "./types";

export function createSearchIndex(
  documents: (SearchItem & { body?: string })[]
) {
  return new Fuse(documents, {
    keys: [
      { name: "title", weight: 0.4 },
      { name: "subtitle", weight: 0.3 },
      { name: "tags", weight: 0.2 },
      { name: "body", weight: 0.1 },
    ],
    threshold: 0.4,
    includeScore: true,
  });
}

export function searchDocuments(
  fuse: Fuse<SearchItem & { body?: string }>,
  query: string
): SearchItem[] {
  if (!query.trim()) return [];
  return fuse.search(query).map((r) => r.item);
}
