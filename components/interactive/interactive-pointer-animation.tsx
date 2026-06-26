"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DiagramStep } from "@/lib/types";

interface InteractivePointerAnimationProps {
  people: number[];
  limit: number;
  steps: DiagramStep[];
}

export function InteractivePointerAnimation({
  people,
  limit,
  steps,
}: InteractivePointerAnimationProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const step = steps[stepIndex];
  const sorted = [...people].sort((a, b) => a - b);

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between text-sm">
        <code className="text-muted-foreground">
          people = [{sorted.join(", ")}], limit = {limit}
        </code>
        <span className="font-medium text-primary">
          boats: {step.boats}
        </span>
      </div>

      <div className="relative mb-6 flex items-end justify-center gap-3 py-8">
        {sorted.map((weight, i) => {
          const isLeft = i === step.left;
          const isRight = i === step.right;
          const isHighlighted = step.highlight.includes(i);

          return (
            <div key={i} className="flex flex-col items-center gap-2">
              <AnimatePresence>
                {(isLeft || isRight) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={cn(
                      "text-xs font-bold",
                      isLeft ? "text-emerald-400" : "text-amber-400"
                    )}
                  >
                    {isLeft ? "L" : "R"}
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.div
                layout
                className={cn(
                  "flex h-14 w-14 items-center justify-center rounded-xl border-2 font-mono text-lg font-bold transition-colors",
                  isHighlighted
                    ? "border-primary bg-primary/20 text-primary shadow-[0_0_20px_rgba(0,125,250,0.3)]"
                    : "border-border bg-muted text-foreground"
                )}
              >
                {weight}
              </motion.div>
              <span className="text-xs text-muted-foreground">{i}</span>
            </div>
          );
        })}
      </div>

      <p className="mb-6 min-h-[3rem] text-center text-sm text-muted-foreground">
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
        <div className="flex gap-1.5">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setStepIndex(i)}
              className={cn(
                "h-2 w-2 rounded-full transition-colors",
                i === stepIndex ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setStepIndex((s) => Math.min(steps.length - 1, s + 1))
          }
          disabled={stepIndex === steps.length - 1}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
