"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PointerVizStep } from "@/lib/pattern-visualizations";

type PointerMode = "inward" | "unidirectional" | "staged";

interface ArrayPointerVisualizerProps {
  array: number[];
  steps: PointerVizStep[];
  meta: string;
  mode: PointerMode;
}

function windowRange(highlight: number[]): string | null {
  if (highlight.length < 2) return null;
  const min = Math.min(...highlight);
  const max = Math.max(...highlight);
  return min === max ? `[${min}]` : `[${min}...${max}]`;
}

export function ArrayPointerVisualizer({
  array,
  steps,
  meta,
  mode,
}: ArrayPointerVisualizerProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const step = steps[stepIndex];
  const range = windowRange(step.highlight);

  function pointerLabel(index: number): string | null {
    if (mode === "inward") {
      if (step.left === index) return "L";
      if (step.right === index) return "R";
    } else {
      if (step.slow === index) return "S";
      if (step.fast === index) return "F";
      if (mode === "staged" && step.highlight[0] === index && step.left !== index) {
        return "i";
      }
    }
    return null;
  }

  function pointerColor(label: string): string {
    if (label === "L" || label === "S") return "text-emerald-400";
    if (label === "R" || label === "F") return "text-amber-400";
    return "text-primary";
  }

  return (
    <div className="rounded-xl border border-border/70 bg-card/80 p-5 lg:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2 text-sm">
        <code className="text-muted-foreground">{meta}</code>
        <span className="font-medium text-primary">{step.status}</span>
      </div>

      <div className="relative mx-auto mb-6 max-w-2xl py-4">
        {range && (
          <p className="mb-4 text-center text-xs font-medium text-primary">
            {range}
          </p>
        )}

        <div className="relative flex items-end justify-center gap-2 sm:gap-3">
          {array.map((value, i) => {
            const isHighlighted = step.highlight.includes(i);
            const label = pointerLabel(i);

            return (
              <div key={i} className="relative flex flex-col items-center gap-2">
                <AnimatePresence>
                  {label && (
                    <motion.span
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      className={cn("text-xs font-bold", pointerColor(label))}
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
                <motion.div
                  layout
                  className={cn(
                    "relative z-10 flex h-12 w-12 items-center justify-center rounded-xl border-2 font-mono text-base font-bold sm:h-14 sm:w-14 sm:text-lg",
                    isHighlighted
                      ? "border-primary bg-primary/15 text-primary shadow-[0_0_18px_rgba(0,125,250,0.25)]"
                      : "border-border/80 bg-muted/50 text-foreground/80"
                  )}
                >
                  {value}
                </motion.div>
                <span className="text-xs text-muted-foreground">{i}</span>
              </div>
            );
          })}
        </div>
      </div>

      <p className="mb-6 min-h-[2.5rem] text-center text-sm leading-relaxed text-muted-foreground">
        {step.label}
      </p>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setStepIndex((s) => Math.max(0, s - 1))}
          disabled={stepIndex === 0}
        >
          <ChevronLeft className="h-4 w-4" />
          Prev
        </Button>
        <div className="flex items-center gap-1.5">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setStepIndex(i)}
              aria-label={`Step ${i + 1}`}
              className={cn(
                "rounded-full transition-all",
                i === stepIndex
                  ? "h-2 w-6 bg-primary"
                  : "h-2 w-2 bg-muted hover:bg-muted-foreground/40"
              )}
            />
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setStepIndex((s) => Math.min(steps.length - 1, s + 1))}
          disabled={stepIndex === steps.length - 1}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
