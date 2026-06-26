"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { CodeBlock, ComplexityBadge, Callout } from "@/components/mdx/code-block";
import { InteractivePointerAnimation } from "@/components/interactive/interactive-pointer-animation";
import { QuizCard } from "@/components/mdx/quiz-card";
import { DifficultyBadge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SECTION_LABELS, SECTION_OVERLINES } from "@/components/episodes/timeline";
import type { Episode, EpisodeSectionId } from "@/lib/types";
import type { EpisodeContentData } from "@/lib/types";
import { useEffect, useRef } from "react";
import { markSectionRead } from "@/lib/progress";
import { cn } from "@/lib/utils";

interface EpisodeSectionsProps {
  episode: Episode;
  data: EpisodeContentData;
  userId: string;
  completedSections: EpisodeSectionId[];
  onSectionRead: (sectionId: EpisodeSectionId) => void;
  onQuizComplete: (score: number) => void;
}

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

function SectionWrapper({
  id,
  title,
  overline,
  number,
  children,
  onVisible,
}: {
  id: EpisodeSectionId;
  title: string;
  overline: string;
  number: number;
  children: React.ReactNode;
  onVisible: (id: EpisodeSectionId) => void;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onVisible(id);
      },
      { threshold: 0.25, rootMargin: "-20% 0px -55% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [id, onVisible]);

  const num = String(number).padStart(2, "0");

  return (
    <motion.section
      ref={ref}
      id={id}
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-8%" }}
      className="relative scroll-mt-28"
    >
      {/* sticky header: number + title */}
      <div className="sticky top-[4.5rem] z-20 mb-6 flex gap-6 border-b border-border/40 bg-background/90 py-4 backdrop-blur-md lg:gap-8">
        <div className="flex w-10 shrink-0 justify-center lg:w-12">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary bg-background font-mono text-xs font-bold text-primary lg:h-11 lg:w-11",
              "shadow-[0_0_16px_rgba(0,125,250,0.35)]"
            )}
          >
            {num}
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
            {overline}
          </p>
          <h2 className="text-xl font-bold tracking-tight lg:text-2xl">{title}</h2>
        </div>
      </div>

      {/* scrollable body */}
      <div className="flex gap-6 lg:gap-8">
        <div className="w-10 shrink-0 lg:w-12" aria-hidden />
        <div className="min-w-0 flex-1 pb-16 lg:pb-20">
          <div className="space-y-4 text-[15px] leading-relaxed text-muted-foreground">
            {children}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export function EpisodeSections({
  episode,
  data,
  userId,
  onSectionRead,
  onQuizComplete,
}: EpisodeSectionsProps) {
  function handleVisible(sectionId: EpisodeSectionId) {
    onSectionRead(sectionId);
    markSectionRead(
      userId,
      episode.patternSlug,
      episode.slug,
      sectionId,
      episode.sections.length
    );
  }

  const sectionContent: Record<EpisodeSectionId, React.ReactNode> = {
    story: (
      <>
        <p className="text-foreground/90">
          Priya sat at her desk at 11 PM, staring at a LeetCode problem she&apos;d
          never seen before. <strong className="text-foreground">Boats to Save People</strong> —
          a flood rescue scenario where she needed to minimize the number of boats.
        </p>
        <p>
          Each boat holds at most <strong className="text-foreground">2 people</strong>,
          and the total weight in a boat cannot exceed a given{" "}
          <strong className="text-foreground">limit</strong>. She has infinite boats
          available. The goal: rescue everyone using the{" "}
          <strong className="text-foreground">minimum number of boats</strong>.
        </p>
        <p>
          Her first instinct was to try every possible pairing — but with 1000 people,
          that would take forever. There had to be a smarter way...
        </p>
      </>
    ),
    problem: (
      <>
        <p>
          You are given an array{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm text-primary">
            people
          </code>{" "}
          where{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm text-primary">
            people[i]
          </code>{" "}
          is the weight of the i-th person, and an integer{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm text-primary">
            limit
          </code>{" "}
          representing the weight limit of each boat.
        </p>
        <div className="space-y-3 pt-2">
          {data.examples.map((ex, i) => (
            <Card
              key={i}
              className="border-border/70 bg-background/50 p-4 font-mono text-sm"
            >
              <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
                Example {i + 1}
              </p>
              <p className="text-foreground/90">Input: {ex.input}</p>
              <p className="text-foreground/90">Output: {ex.output}</p>
              {ex.explanation && (
                <p className="mt-2 text-muted-foreground">
                  Explanation: {ex.explanation}
                </p>
              )}
            </Card>
          ))}
        </div>
        <a
          href={episode.leetcodeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
        >
          View on LeetCode <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </>
    ),
    diagram: (
      <InteractivePointerAnimation
        people={data.people}
        limit={data.limit}
        steps={data.diagramSteps}
      />
    ),
    "try-yourself": (
      <>
        <p>
          Try implementing the solution before looking at the approaches below.
        </p>
        <CodeBlock code={data.starterCode} title="Starter Code" />
      </>
    ),
    "brute-force": (
      <>
        <p>
          The naive approach tries every possible pairing for each person — correct
          but slow.
        </p>
        <CodeBlock code={data.bruteForceCode} title="Brute Force" />
        <div className="flex gap-3 pt-1">
          <ComplexityBadge value="O(n²)" type="time" />
          <ComplexityBadge value="O(n)" type="space" />
        </div>
      </>
    ),
    observation: (
      <>
        <p>
          After sorting, the <strong className="text-foreground">lightest person</strong>{" "}
          is at index 0 and the <strong className="text-foreground">heaviest</strong> at
          the end. If the heaviest can&apos;t pair with the lightest, they can&apos;t pair
          with anyone — they must go alone.
        </p>
        <p>
          If they <em>can</em> pair, putting them together is always optimal — it frees
          up the most weight capacity for everyone else.
        </p>
      </>
    ),
    "pattern-discovery": (
      <>
        <Callout>
          &ldquo;What if I always pair the lightest person with the heaviest? If they
          don&apos;t fit, the heaviest must go alone anyway.&rdquo;
        </Callout>
        <p>
          This is the <strong className="text-foreground">Inward Two Pointers</strong>{" "}
          pattern: start from both ends of a sorted array and move pointers toward the
          center based on a greedy decision at each step.
        </p>
      </>
    ),
    solution: <CodeBlock code={data.solutionCode} title="Two Pointers Solution" />,
    complexity: (
      <div className="overflow-x-auto rounded-xl border border-border/70">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-4 py-3 text-left font-medium text-foreground">Variant</th>
              <th className="px-4 py-3 text-left font-medium text-foreground">Time</th>
              <th className="px-4 py-3 text-left font-medium text-foreground">Space</th>
            </tr>
          </thead>
          <tbody>
            {data.complexityVariants.map((v) => (
              <tr key={v.variant} className="border-b border-border/60 last:border-0">
                <td className="px-4 py-3 text-foreground/90">{v.variant}</td>
                <td className="px-4 py-3">
                  <ComplexityBadge value={v.time} type="time" />
                </td>
                <td className="px-4 py-3">
                  <ComplexityBadge value={v.space} type="space" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
    related: (
      <div className="grid gap-3 sm:grid-cols-2">
        {data.relatedProblems.map((p) => (
          <a
            key={p.title}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-xl border border-border/70 bg-background/40 p-4 transition-colors hover:border-primary/30"
          >
            <span className="font-medium text-foreground">{p.title}</span>
            <DifficultyBadge difficulty={p.difficulty} />
          </a>
        ))}
      </div>
    ),
    quiz: (
      <QuizCard
        questions={data.quizQuestions}
        onComplete={(score) => onQuizComplete(score)}
      />
    ),
    takeaways: (
      <ul className="space-y-3">
        {data.takeaways.map((item, i) => (
          <li
            key={i}
            className="flex items-start gap-3 rounded-xl border border-border/70 bg-background/40 p-4 text-sm"
          >
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 font-mono text-xs font-bold text-primary">
              {i + 1}
            </span>
            <span className="text-foreground/90">{item}</span>
          </li>
        ))}
      </ul>
    ),
  };

  return (
    <div className="relative pl-1">
      {/* continuous timeline spine */}
      <div
        className="absolute bottom-0 left-[19px] top-0 w-px bg-primary/25 lg:left-[23px]"
        aria-hidden
      />

      {episode.sections.map((sectionId, index) => (
        <SectionWrapper
          key={sectionId}
          id={sectionId}
          title={SECTION_LABELS[sectionId]}
          overline={SECTION_OVERLINES[sectionId]}
          number={index + 1}
          onVisible={handleVisible}
        >
          {sectionContent[sectionId]}
        </SectionWrapper>
      ))}
    </div>
  );
}
