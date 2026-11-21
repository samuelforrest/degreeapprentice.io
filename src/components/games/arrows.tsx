"use client";

import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, XIcon } from "lucide-react";
import { useState } from "react";

import { GameProgress, Stage, useKeys } from "@/components/games/shared";
import { useTrials } from "@/components/games/use-trials";
import { Button } from "@/components/ui/button";
import type { GameResult } from "@/lib/games";
import { mean, ms, pct } from "@/lib/games/random";
import { cn } from "@/lib/utils";

type Dir = "left" | "right";
type Trial = { dir: Dir; congruent: boolean; small: boolean };

const TOTAL = 60;
const opposite = (d: Dir): Dir => (d === "left" ? "right" : "left");

function makeTrials(): Trial[] {
  return Array.from({ length: TOTAL }, (_, i) => ({
    dir: Math.random() < 0.5 ? "left" : "right",
    congruent: Math.random() < 0.5,
    // Later on, the distracting arrows sometimes change size too.
    small: i > TOTAL / 2 && Math.random() < 0.4,
  }));
}

function Arrow({ dir, className }: { dir: Dir; className?: string }) {
  const Icon = dir === "left" ? ArrowLeftIcon : ArrowRightIcon;
  return <Icon className={cn("size-10 sm:size-14", className)} strokeWidth={2.5} aria-hidden />;
}

export function ArrowsGame({ onFinish }: { onFinish: (r: GameResult) => void }) {
  const [trials] = useState(makeTrials);
  const run = useTrials({
    trials,
    gapMs: () => 500 + Math.random() * 400,
    // The response window shrinks from 1.5s to 0.7s.
    windowMs: (i) => 1500 - (800 * i) / (TOTAL - 1),
    feedbackMs: 300,
    isCorrect: (t, a) => a === t.dir,
    onDone: (outcomes, early) => {
      const right = outcomes.filter((o) => o.correct);
      const rt = (congruent: boolean) => mean(right.filter((o) => o.trial.congruent === congruent).map((o) => o.rt!));
      const con = rt(true);
      const inc = rt(false);
      const misses = outcomes.filter((o) => o.answer === null).length;
      onFinish({
        headline: `${pct(right.length, TOTAL)}% correct`,
        score: Math.max(0, pct(right.length - early, TOTAL)),
        metrics: [
          { label: "Correct", value: `${right.length} of ${TOTAL}` },
          { label: "Speed, arrows agree", value: ms(con) },
          { label: "Speed, arrows disagree", value: ms(inc) },
          { label: "Too slow", value: String(misses) },
          { label: "Pressed too early", value: String(early) },
        ],
        insight: `You were ${ms(Math.max(0, inc - con))} slower when the surrounding arrows pointed the other way. Almost everyone slows down on those (often by 50–100 ms): the smaller that gap and the fewer errors you make, the better you're filtering out distractions. ${misses > 5 ? "You ran out of time on several rounds, so try committing a little sooner." : ""}`,
      });
    },
  });

  useKeys((key) => {
    if (key === "ArrowLeft") run.respond("left");
    if (key === "ArrowRight") run.respond("right");
  });

  const t = run.trial;
  const flank = t.congruent ? t.dir : opposite(t.dir);
  const showing = run.phase !== "gap";

  return (
    <div className="space-y-4">
      <GameProgress value={run.index} total={TOTAL} />
      <Stage>
        <div className="flex h-16 items-center gap-2 sm:gap-4" aria-live="off">
          {showing ? (
            [0, 1, 2, 3, 4].map((i) =>
              i === 2 ? (
                <Arrow key={i} dir={t.dir} />
              ) : (
                <Arrow key={i} dir={flank} className={cn(t.small && "size-7 sm:size-9", run.phase === "feedback" && "opacity-40")} />
              ),
            )
          ) : (
            <span className="text-4xl text-muted-foreground">+</span>
          )}
        </div>
        <div className="h-6 text-sm font-medium">
          {run.phase === "feedback" && run.last && (
            <span className={cn("flex items-center gap-1", run.last.correct ? "text-success" : "text-destructive")}>
              {run.last.answer === null ? "Too slow" : run.last.correct ? <CheckIcon className="size-5" /> : <XIcon className="size-5" />}
            </span>
          )}
        </div>
      </Stage>
      <div className="grid grid-cols-2 gap-3">
        <Button size="lg" variant="outline" className="h-14" onClick={() => run.respond("left")} aria-label="Left">
          <ArrowLeftIcon className="size-6" />
        </Button>
        <Button size="lg" variant="outline" className="h-14" onClick={() => run.respond("right")} aria-label="Right">
          <ArrowRightIcon className="size-6" />
        </Button>
      </div>
    </div>
  );
}
