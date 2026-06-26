import { getCategories, getPatterns } from "@/lib/content";
import { PatternsClient } from "@/components/patterns/patterns-client";

export default function PatternsPage() {
  const patterns = getPatterns();
  const categories = getCategories();
  return <PatternsClient patterns={patterns} categories={categories} />;
}
