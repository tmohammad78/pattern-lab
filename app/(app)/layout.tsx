import {
  getCategories,
  getSearchDocuments,
  getCatalog,
} from "@/lib/content";
import { isNavEnabled } from "@/lib/catalog";
import { AppShell } from "@/components/layout/app-shell";
import { Suspense } from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const catalog = getCatalog();
  const categories = getCategories();
  const searchItems = getSearchDocuments().map(
    ({ id, title, subtitle, href, type, tags }) => ({
      id,
      title,
      subtitle,
      href,
      type,
      tags,
    })
  );

  const navigation = {
    home: isNavEnabled(catalog, "home"),
    patterns: isNavEnabled(catalog, "patterns"),
    episodes: isNavEnabled(catalog, "episodes"),
    playground: isNavEnabled(catalog, "playground"),
    resources: isNavEnabled(catalog, "resources"),
    progress: isNavEnabled(catalog, "progress"),
  };

  return (
    <Suspense>
      <AppShell
        categories={categories}
        searchItems={searchItems}
        navigation={navigation}
      >
        {children}
      </AppShell>
    </Suspense>
  );
}
