"use client";

import { AnchorIcon, BellIcon, FeatherIcon, KeyRoundIcon, LeafIcon, MoonIcon, StarIcon, SunIcon, type LucideIcon } from "lucide-react";
import { useState } from "react";

import { GameProgress, Stage, useKeys } from "@/components/games/shared";
import { useTrials } from "@/components/games/use-trials";
import { Button } from "@/components/ui/button";
import type { GameResult } from "@/lib/games";
import { pct, shuffle } from "@/lib/games/random";
import { cn } from "@/lib/utils";

const SYMBOLS: LucideIcon[] = [StarIcon, LeafIcon, AnchorIcon, KeyRoundIcon, BellIcon, FeatherIcon];
/** How often each pair means day. None is certain, which is the point of the task. */
const ODDS = [0.9, 0.85, 0.8, 0.7, 0.3, 0.2, 0.15, 0.1];
const BLOCKS = 11;
const TOTAL = ODDS.length * BLOCKS;

type Answer = "day" | "night";
type Pair = { a: number; b: number; pDay: number };
type Trial = { pair: number; outcome: Answer };

function makeGame() {
  const combos: [number, number][] = [];
  for (let a = 0; a < SYMBOLS.length; a++) for (let b = a + 1; b < SYMBOLS.length; b++) combos.push([a, b]);
  const odds = shuffle(ODDS);
  const pairs: Pair[] = shuffle(combos)
    .slice(0, ODDS.length)
    .map(([a, b], i) => ({ a, b, pDay: odds[i] }));
  const trials: Trial[] = Array.from({ length: BLOCKS }).flatMap(() =>
    shuffle(pairs.map((_, i) => i)).map((pair) => ({
      pair,
      outcome: Math.random() < pairs[pair].pDay ? "day" : "night",
    })),
  );
  return { pairs, trials };
}

export function PredictGame({ onFinish }: { onFinish: (r: GameResult) => void }) {
  const [{ pairs, trials }] = useState(makeGame);
  const best = (t: Trial): Answer => (pairs[t.pair].pDay > 0.5 ? "day" : "night");

  const run = useTrials({
    trials,
    gapMs: () => 400,
    windowMs: () => 3000,
    feedbackMs: 1200,
    isCorrect: (t, a) => a === t.outcome,
    onDone: (outcomes) => {
      const third = Math.floor(TOTAL / 3);
      const optimal = (os: typeof outcomes) => pct(os.filter((o) => o.answer === best(o.trial)).length, os.length);
      const first = optimal(outcomes.slice(0, third));
      const lastThird = optimal(outcomes.slice(-third));
      const matched = outcomes.filter((o) => o.correct).length;
      const missed = outcomes.filter((o) => o.answer === null).length;
      onFinish({
        headline: `${lastThird}% best choices by the end`,
        score: lastThird,
        metrics: [
          { label: "Best choices, first third", value: `${first}%` },
          { label: "Best choices, last third", value: `${lastThird}%` },
          { label: "Matched the outcome", value: `${matched} of ${TOTAL}` },
          { label: "No answer", value: String(missed) },
        ],
        insight: `A "best choice" is the answer that pair gives most often. Because no pair is 100% reliable, even perfect play only matches the outcome about 80% of the time, so the climb from ${first}% to ${lastThird}% is what counts: it shows how quickly you picked up the pattern from feedback. ${lastThird < first + 10 ? "Try committing to a pair's usual answer even after it surprises you once." : ""}`,
      });
    },
  });

  useKeys((key) => {
    if (key === "d" || key === "D") run.respond("day");
    if (key === "n" || key === "N") run.respond("night");
  });

  const pair = pairs[run.trial.pair];
  const A = SYMBOLS[pair.a];
  const B = SYMBOLS[pair.b];
  const fb = run.phase === "feedback" ? run.last : null;

  return (
    <div className="space-y-4">
      <GameProgress value={run.index} total={TOTAL} />
      <Stage>
        <div className={cn("flex items-center gap-6 transition-opacity", run.phase === "gap" && "opacity-0")}>
          {[A, B].map((Icon, i) => (
            <span key={i} className="flex size-24 items-center justify-center rounded-2xl border bg-background">
              <Icon className="size-12 text-primary" aria-hidden />
            </span>
          ))}
        </div>
        <div className="h-7 text-sm font-medium">
          {fb && (
            <span className="flex items-center gap-2">
              {fb.trial.outcome === "day" ? <SunIcon className="size-5 text-warning" /> : <MoonIcon className="size-5 text-primary" />}
              It was {fb.trial.outcome}.
              <span className={fb.correct ? "text-success" : "text-muted-foreground"}>
                {fb.answer === null ? "Too slow." : fb.correct ? "You got it." : `You said ${fb.answer}.`}
              </span>
            </span>
          )}
        </div>
      </Stage>
      <div className="grid grid-cols-2 gap-3">
        <Button size="lg" variant="outline" className="h-14" onClick={() => run.respond("day")}>
          <SunIcon /> Day <kbd className="text-xs text-muted-foreground">D</kbd>
        </Button>
        <Button size="lg" variant="outline" className="h-14" onClick={() => run.respond("night")}>
          <MoonIcon /> Night <kbd className="text-xs text-muted-foreground">N</kbd>
        </Button>
      </div>
    </div>
  );
}
