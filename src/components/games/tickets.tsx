"use client";

import { useState } from "react";

import { GameProgress, Stage, useKeys } from "@/components/games/shared";
import { useTrials } from "@/components/games/use-trials";
import { Button } from "@/components/ui/button";
import type { GameResult } from "@/lib/games";
import { mean, ms, pct, pick } from "@/lib/games/random";
import { cn } from "@/lib/utils";

type Box = "top" | "bottom";
type Trial = { box: Box; n: number; switched: boolean };

const TOTAL = 64;
/** The rule labels disappear after this many tickets. */
const LABELS_FOR = 20;

const RULES: Record<Box, { question: string; left: string; right: string }> = {
  top: { question: "Odd or even?", left: "Odd", right: "Even" },
  bottom: { question: "Lower or higher than 5?", left: "Lower", right: "Higher" },
};

const answerOf = (t: Trial) => (t.box === "top" ? (t.n % 2 ? "left" : "right") : t.n < 5 ? "left" : "right");

function makeTrials(): Trial[] {
  let box: Box = Math.random() < 0.5 ? "top" : "bottom";
  return Array.from({ length: TOTAL }, (_, i) => {
    const switched = i > 0 && Math.random() < 0.5;
    if (switched) box = box === "top" ? "bottom" : "top";
    return { box, n: pick([1, 2, 3, 4, 6, 7, 8, 9]), switched };
  });
}

export function TicketsGame({ onFinish }: { onFinish: (r: GameResult) => void }) {
  const [trials] = useState(makeTrials);
  const run = useTrials({
    trials,
    gapMs: () => 350,
    windowMs: (i) => 2500 - (900 * i) / (TOTAL - 1),
    feedbackMs: 250,
    isCorrect: (t, a) => a === answerOf(t),
    onDone: (outcomes) => {
      const right = outcomes.filter((o) => o.correct);
      const rt = (switched: boolean) => mean(right.filter((o) => o.trial.switched === switched).map((o) => o.rt!));
      const stay = rt(false);
      const sw = rt(true);
      const late = outcomes.filter((o) => o.answer === null).length;
      const labelled = pct(right.filter((o) => trials.indexOf(o.trial) < LABELS_FOR).length, LABELS_FOR);
      const unlabelled = pct(right.filter((o) => trials.indexOf(o.trial) >= LABELS_FOR).length, TOTAL - LABELS_FOR);
      onFinish({
        headline: `${pct(right.length, TOTAL)}% sorted correctly`,
        score: pct(right.length, TOTAL),
        metrics: [
          { label: "Correct", value: `${right.length} of ${TOTAL}` },
          { label: "Same box as before", value: ms(stay) },
          { label: "Switched box", value: ms(sw) },
          { label: "With rule labels", value: `${labelled}%` },
          { label: "Without labels", value: `${unlabelled}%` },
          { label: "Too slow", value: String(late) },
        ],
        insight: `Switching rules cost you ${ms(Math.max(0, sw - stay))} on average. A switch cost is normal; keeping it small while staying accurate shows you can juggle rules quickly. ${unlabelled + 10 < labelled ? "Your accuracy dropped once the labels disappeared, so practise holding both rules in mind from the start." : "Your accuracy held up once the labels disappeared, which is the hard part."}`,
      });
    },
  });

  useKeys((key) => {
    if (key === "f" || key === "F") run.respond("left");
    if (key === "j" || key === "J") run.respond("right");
  });

  const t = run.trial;
  const labels = run.index < LABELS_FOR;
  const rule = RULES[t.box];

  return (
    <div className="space-y-4">
      <GameProgress value={run.index} total={TOTAL} label={labels ? "Rules shown" : "Rules hidden"} />
      <Stage className="gap-3 p-4">
        {(["top", "bottom"] as const).map((box) => (
          <div key={box} className="flex w-full max-w-md flex-1 flex-col items-center gap-2 rounded-xl border bg-background p-4">
            <p className={cn("h-5 text-sm text-muted-foreground transition-opacity", !labels && "opacity-0")}>
              {RULES[box].question}
            </p>
            <div className="flex h-20 items-center justify-center">
              {run.phase !== "gap" && t.box === box && (
                <div
                  className={cn(
                    "flex h-20 w-28 items-center justify-center rounded-lg border-2 border-dashed border-primary/60 bg-primary/10 text-4xl font-semibold tabular-nums",
                    run.phase === "feedback" &&
                      (run.last?.correct ? "border-success bg-success/10" : "border-destructive bg-destructive/10"),
                  )}
                >
                  {t.n}
                </div>
              )}
            </div>
          </div>
        ))}
      </Stage>
      <div className="grid grid-cols-2 gap-3">
        {(["left", "right"] as const).map((side) => (
          <Button key={side} size="lg" variant="outline" className="h-14 flex-col gap-0" onClick={() => run.respond(side)}>
            <span className="font-semibold">{side === "left" ? "F" : "J"}</span>
            {labels && <span className="text-xs text-muted-foreground">{rule[side]}</span>}
          </Button>
        ))}
      </div>
    </div>
  );
}
