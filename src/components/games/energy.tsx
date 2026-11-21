"use client";

import { ZapIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { GameProgress, Stage, useKeys, useLatest } from "@/components/games/shared";
import type { GameResult } from "@/lib/games";
import { pct, shuffle } from "@/lib/games/random";
import { cn } from "@/lib/utils";

const TURNS = 80;
const START = 200;

/**
 * Two generators pay a lot but drain more over time; two pay less but come out ahead.
 * Same structure as the Iowa Gambling Task, scaled down.
 */
const TYPES = [
  { gain: 10, loss: 25, chance: 0.5, good: false },
  { gain: 10, loss: 125, chance: 0.1, good: false },
  { gain: 5, loss: 5, chance: 0.5, good: true },
  { gain: 5, loss: 25, chance: 0.1, good: true },
];

type Turn = { generator: number; good: boolean; net: number };

export function EnergyGame({ onFinish }: { onFinish: (r: GameResult) => void }) {
  const [generators] = useState(() => shuffle(TYPES));
  const [turns, setTurns] = useState<Turn[]>([]);
  const [flash, setFlash] = useState<{ gain: number; loss: number; generator: number } | null>(null);
  const finish = useLatest(onFinish);
  const power = START + turns.reduce((s, t) => s + t.net, 0);
  const done = turns.length >= TURNS;

  const run = (i: number) => {
    if (done) return;
    const g = generators[i];
    const loss = Math.random() < g.chance ? g.loss : 0;
    setFlash({ gain: g.gain, loss, generator: i });
    setTurns((ts) => [...ts, { generator: i, good: g.good, net: g.gain - loss }]);
  };

  useKeys((key) => {
    const n = Number(key);
    if (n >= 1 && n <= 4) run(n - 1);
  });

  useEffect(() => {
    if (!done) return;
    const id = setTimeout(() => {
      const blocks = [0, 1, 2, 3].map((b) => turns.slice(b * 20, b * 20 + 20));
      const goodShare = blocks.map((bl) => pct(bl.filter((t) => t.good).length, bl.length));
      const switches = turns.slice(1).filter((t, i) => t.generator !== turns[i].generator).length;
      finish.current({
        headline: `${goodShare[3]}% steady generators by the end`,
        metrics: [
          { label: "Final power", value: String(power) },
          { label: "Steady picks, turns 1–20", value: `${goodShare[0]}%` },
          { label: "Steady picks, turns 61–80", value: `${goodShare[3]}%` },
          { label: "Times you switched", value: String(switches) },
        ],
        insight: `Two generators give big boosts but occasional large drains, so they lose power over time. The other two give less but come out ahead. ${
          goodShare[3] >= 70
            ? "You learned to favour the steady ones, which is what most people work out by the end."
            : goodShare[3] > goodShare[0]
              ? "You moved towards the steady generators but kept testing the risky ones."
              : "You stuck with the big-win generators. The pull of large rewards is exactly what this task measures."
        } Exploring a little early and then settling on what works is the pattern linked with learning from feedback.`,
      });
    }, 500);
    return () => clearTimeout(id);
  }, [done, turns, power, finish]);

  const max = Math.max(START * 2, power);

  return (
    <div className="space-y-4">
      <GameProgress value={turns.length} total={TURNS} label={`Power ${power}`} />
      <Stage className="gap-5">
        <div className="w-full max-w-md space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Power</span>
            <span className="tabular-nums">{power}</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-warning transition-[width]" style={{ width: `${Math.max(0, (power / max) * 100)}%` }} />
          </div>
        </div>
        <div className="grid w-full max-w-md grid-cols-2 gap-3 sm:grid-cols-4">
          {generators.map((_, i) => {
            const active = flash?.generator === i;
            return (
              <button
                key={i}
                type="button"
                onClick={() => run(i)}
                disabled={done}
                className={cn(
                  "flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border bg-background transition-colors hover:border-primary/50 hover:bg-muted/50",
                  active && "border-primary",
                )}
              >
                <ZapIcon className="size-7 text-warning" aria-hidden />
                <span className="text-sm font-medium">Generator {i + 1}</span>
                <span className="h-4 text-xs tabular-nums">
                  {active && (
                    <>
                      <span className="text-success">+{flash.gain}</span>
                      {flash.loss > 0 && <span className="text-destructive"> −{flash.loss}</span>}
                    </>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </Stage>
    </div>
  );
}
