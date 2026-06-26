"use client";

import { useState, useEffect } from "react";
import { Search, Menu, Flame } from "lucide-react";
import { getSession, getInitials } from "@/lib/auth";
import { getProgress } from "@/lib/progress";
import { ThemeToggle } from "./theme-toggle";
import { SearchDialog } from "./search-dialog";
import type { SearchItem } from "@/lib/types";

interface TopNavProps {
  searchItems: SearchItem[];
  onMenuClick?: () => void;
}

export function TopNav({ searchItems, onMenuClick }: TopNavProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [initials, setInitials] = useState("AK");
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const session = getSession();
    if (session) {
      setInitials(getInitials(session.name));
      setStreak(getProgress(session.email).streak.current);
    }

    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") setSearchOpen(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-md lg:px-6">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <button
          onClick={() => setSearchOpen(true)}
          className="mx-auto flex h-9 w-full max-w-md items-center gap-2 rounded-full border border-border bg-muted/50 px-4 text-sm text-muted-foreground transition-colors hover:border-primary/30 lg:mx-0 lg:ml-auto lg:mr-0"
        >
          <Search className="h-4 w-4" />
          <span className="flex-1 text-left">Search patterns, episodes...</span>
          <kbd className="hidden rounded border border-border bg-background px-1.5 py-0.5 text-xs sm:inline">
            ⌘K
          </kbd>
        </button>

        <div className="ml-auto flex items-center gap-2">
          {streak > 0 && (
            <span className="hidden items-center gap-1 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-400 sm:flex">
              <Flame className="h-3.5 w-3.5" />
              {streak} day streak
            </span>
          )}
          <ThemeToggle />
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {initials}
          </div>
        </div>
      </header>

      <SearchDialog
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        items={searchItems}
      />
    </>
  );
}
