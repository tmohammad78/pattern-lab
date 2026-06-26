"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import { Search } from "lucide-react";
import type { SearchItem } from "@/lib/types";
import { createSearchIndex, searchDocuments } from "@/lib/search";

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
  items: SearchItem[];
}

export function SearchDialog({ open, onClose, items }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    const fuse = createSearchIndex(items);
    setResults(query ? searchDocuments(fuse, query) : items.slice(0, 6));
  }, [query, items]);

  if (!open) return null;

  function navigate(href: string) {
    router.push(href);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-xl border border-border bg-popover shadow-2xl">
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search patterns, episodes..."
            className="flex-1 bg-transparent py-4 text-sm outline-none"
          />
          <kbd className="rounded border border-border px-1.5 py-0.5 text-xs text-muted-foreground">
            ESC
          </kbd>
        </div>
        <ul className="max-h-80 overflow-y-auto p-2">
          {results.length === 0 ? (
            <li className="px-4 py-8 text-center text-sm text-muted-foreground">
              No results found
            </li>
          ) : (
            results.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => navigate(item.href)}
                  className="flex w-full flex-col rounded-lg px-4 py-3 text-left transition-colors hover:bg-muted"
                >
                  <span className="text-sm font-medium">{item.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {item.type} · {item.subtitle}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
