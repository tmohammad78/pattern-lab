"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Home,
  Layers,
  PlayCircle,
  Code2,
  BookOpen,
  TrendingUp,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getSession, getInitials } from "@/lib/auth";
import { getProgress } from "@/lib/progress";
import type { Category } from "@/lib/types";
import { useEffect, useState } from "react";

const navItems = [
  { key: "home", href: "/", label: "Home", icon: Home },
  { key: "patterns", href: "/patterns", label: "Patterns", icon: Layers },
  { key: "episodes", href: "/episodes", label: "Episodes", icon: PlayCircle },
  { key: "playground", href: "/playground", label: "Playground", icon: Code2 },
  { key: "resources", href: "/resources", label: "Resources", icon: BookOpen },
  { key: "progress", href: "/progress", label: "Progress", icon: TrendingUp },
] as const;

interface SidebarProps {
  categories: Category[];
  navigation: Record<string, boolean>;
  onNavigate?: () => void;
}

export function Sidebar({ categories, navigation, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");
  const [userName, setUserName] = useState("Guest");
  const [initials, setInitials] = useState("G");
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);

  useEffect(() => {
    const session = getSession();
    if (session) {
      setUserName(session.name);
      setInitials(getInitials(session.name));
      const progress = getProgress(session.email);
      setStreak(progress.streak.current);
      setXp(progress.xp);
    }
  }, [pathname]);

  return (
    <aside className="flex h-screen w-[260px] flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="border-b border-sidebar-border p-5">
        <Link href="/" className="flex items-center gap-3" onClick={onNavigate}>
          <Image
            src="/snapppay-logo.svg"
            alt="Snapp Pay"
            width={36}
            height={36}
            className="rounded-full"
          />
          <div>
            <p className="font-semibold leading-tight">Pattern Lab</p>
            <p className="text-xs text-muted-foreground">by Snapp Pay</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {navItems
            .filter((item) => navigation[item.key] !== false)
            .map(({ href, label, icon: Icon }) => {
            const isActive =
              href === "/"
                ? pathname === "/"
                : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onNavigate}
                  className={cn(
                    "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
                  )}
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-6">
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Categories
          </p>
          <ul className="space-y-0.5">
            {categories.map((cat) => {
              const href = `/patterns?category=${cat.id}`;
              const isActive =
                pathname.startsWith("/patterns") && activeCategory === cat.id;
              return (
                <li key={cat.id}>
                  <Link
                    href={href}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-foreground"
                        : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                    )}
                  >
                    <span>{cat.label}</span>
                    <span
                      className="text-xs font-medium"
                      style={{ color: `var(--${cat.color})` }}
                    >
                      0/{cat.total}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{userName}</p>
            <p className="text-xs text-muted-foreground">
              Level {Math.floor(xp / 500) + 1} · {xp} XP
            </p>
          </div>
          {streak > 0 && (
            <span className="flex items-center gap-1 text-xs text-orange-400">
              <Flame className="h-3.5 w-3.5" />
              {streak}
            </span>
          )}
        </div>
        <p className="mt-3 text-center text-[10px] text-muted-foreground">
          Pattern Lab · Snapp Pay
        </p>
      </div>
    </aside>
  );
}
