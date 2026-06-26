"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { TopNav } from "./top-nav";
import { AuthGuard } from "./auth-guard";
import type { Category, SearchItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import { PageTransition } from "./page-transition";

interface AppShellProps {
  categories: Category[];
  searchItems: SearchItem[];
  navigation: Record<string, boolean>;
  children: React.ReactNode;
}

export function AppShell({
  categories,
  searchItems,
  navigation,
  children,
}: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthGuard>
      <div className="flex min-h-screen">
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-40 h-screen w-[260px] shrink-0 transform transition-transform",
            "lg:sticky lg:top-0 lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <Sidebar
            categories={categories}
            navigation={navigation}
            onNavigate={() => setSidebarOpen(false)}
          />
        </div>

        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <TopNav
            searchItems={searchItems}
            onMenuClick={() => setSidebarOpen(true)}
          />
          <main className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
