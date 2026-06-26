"use client";

import { cn } from "@/lib/utils";

interface FilterChipsProps {
  categories: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
}

export function FilterChips({ categories, active, onChange }: FilterChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange("all")}
        className={cn(
          "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
          active === "all"
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground hover:text-foreground"
        )}
      >
        All Patterns
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
            active === cat.id
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:text-foreground"
          )}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}

interface ViewToggleProps {
  view: "grid" | "list";
  onChange: (view: "grid" | "list") => void;
}

export function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="flex rounded-lg border border-border p-1">
      <button
        onClick={() => onChange("grid")}
        className={cn(
          "rounded-md px-3 py-1.5 text-sm transition-colors",
          view === "grid"
            ? "bg-muted text-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
        aria-label="Grid view"
      >
        ⊞
      </button>
      <button
        onClick={() => onChange("list")}
        className={cn(
          "rounded-md px-3 py-1.5 text-sm transition-colors",
          view === "list"
            ? "bg-muted text-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
        aria-label="List view"
      >
        ☰
      </button>
    </div>
  );
}
