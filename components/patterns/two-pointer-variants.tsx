"use client";

import { ArrayPointerVisualizer } from "@/components/interactive/array-pointer-visualizer";
import type { VariantVisualization } from "@/lib/pattern-visualizations";

interface TwoPointerVariantsProps {
  visualizations: VariantVisualization[];
}

export function TwoPointerVariants({ visualizations }: TwoPointerVariantsProps) {
  return (
    <div className="space-y-10">
      {visualizations.map((viz) => (
        <div key={viz.id}>
          <h3 className="mb-4 text-lg font-semibold">{viz.title}</h3>
          <ArrayPointerVisualizer
            array={viz.array}
            steps={viz.steps}
            meta={viz.meta}
            mode={
              viz.id === "inward"
                ? "inward"
                : viz.id === "unidirectional"
                  ? "unidirectional"
                  : "staged"
            }
          />
        </div>
      ))}
    </div>
  );
}
