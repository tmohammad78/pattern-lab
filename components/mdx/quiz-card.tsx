"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { QuizQuestion } from "@/lib/types";

interface QuizCardProps {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
}

export function QuizCard({ questions, onComplete }: QuizCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [displayScore, setDisplayScore] = useState(0);
  const scoreRef = useRef(0);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);

  const question = questions[currentIndex];

  function handleSelect(index: number) {
    if (showResult) return;
    setSelected(index);
    setShowResult(true);
    if (index === question.correctIndex) {
      scoreRef.current += 1;
      setDisplayScore(scoreRef.current);
    }
  }

  function handleNext() {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      setFinished(true);
      onComplete(scoreRef.current);
    }
  }

  if (finished) {
    return (
      <Card className="p-8 text-center">
        <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-emerald-400" />
        <h3 className="mb-2 text-xl font-semibold">Quiz Complete!</h3>
        <p className="text-muted-foreground">
          You scored {scoreRef.current} out of {questions.length}
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Question {currentIndex + 1} of {questions.length}
        </span>
        <span>Score: {displayScore}</span>
      </div>
      <h3 className="mb-6 text-lg font-medium">{question.question}</h3>
      <div className="space-y-3">
        {question.options.map((option, i) => {
          const isSelected = selected === i;
          const isCorrect = i === question.correctIndex;
          let borderClass = "border-border hover:border-primary/50";

          if (showResult && isCorrect) {
            borderClass = "border-emerald-500 bg-emerald-500/10";
          } else if (showResult && isSelected && !isCorrect) {
            borderClass = "border-red-500 bg-red-500/10";
          }

          return (
            <motion.button
              key={i}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(i)}
              disabled={showResult}
              className={`flex w-full items-center gap-3 rounded-lg border p-4 text-left text-sm transition-colors ${borderClass}`}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1">{option}</span>
              {showResult && isCorrect && (
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              )}
              {showResult && isSelected && !isCorrect && (
                <XCircle className="h-4 w-4 text-red-400" />
              )}
            </motion.button>
          );
        })}
      </div>
      {showResult && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-lg bg-muted p-4 text-sm text-muted-foreground"
        >
          {question.explanation}
        </motion.div>
      )}
      {showResult && (
        <div className="mt-4 flex justify-end">
          <Button onClick={handleNext}>
            {currentIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}
          </Button>
        </div>
      )}
    </Card>
  );
}
