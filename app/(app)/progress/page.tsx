import { getCategories, getPatterns } from "@/lib/content";
import { ProgressClient } from "@/components/progress/progress-client";

export default function ProgressPage() {
  const patterns = getPatterns();
  const categories = getCategories();
  return <ProgressClient patterns={patterns} categories={categories} />;
}
