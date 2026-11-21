"use client";

import { useEffect, useState } from "react";

import { GameProgress, Stage, useKeys, useLatest } from "@/components/games/shared";
import { Button } from "@/components/ui/button";
import type { GameResult } from "@/lib/games";
import { mean, randInt } from "@/lib/games/random";
import { cn } from "@/lib/utils";

const TOTAL = 30;
const MAX_PUMPS = 64;
const PENCE = 5;

const money = (pence: number) => `£${(pence / 100).toFixed(2)}`;
/** Each balloon bursts on a random pump from 1 to 64: stopping around 32 earns the most on average. */
const newBurstPoint = () => 1 + randInt(MAX_PUMPS);

type Round = { pumps: number; burst: boolean };

export function BalloonGame({ onFinish }: { onFinish: (r: GameResult) => void }) {
  const [burstAt, setBurstAt] = useState(newBurstPoint);
  const [pumps, setPumps] = useState(0);
  const [status, setStatus] = useState<"ready" | "burst" | "banked">("ready");
  const [rounds, setRounds] = useState<Round[]>([]);
  const finish = useLatest(onFinish);

  const banked = rounds.reduce((sum, r) => sum + (r.burst ? 0 : r.pumps * PENCE), 0);

  const pump = () => {
    if (status !== "ready") return;
    const next = pumps + 1;
    setPumps(next);
    if (next >= burstAt) {
      setStatus("burst");
      setRounds((rs) => [...rs, { pumps: next, burst: true }]);
    }
  };
  const bank = () => {
    if (status !== "ready" || pumps === 0) return;
    setStatus("banked");
    setRounds((rs) => [...rs, { pumps, burst: false }]);
  };

  useKeys((key, e) => {
    if (key === " ") {
      e.preventDefault();
      pump();
    }
    if (key === "Enter") bank();
  });

  // Pause on the outcome, then the next balloon (or the results).
  useEffect(() => {
    if (status === "ready") return;
    const id = setTimeout(() => {
      if (rounds.length >= TOTAL) {
        const kept = rounds.filter((r) => !r.burst);
        const bursts = rounds.length - kept.length;
        const avg = mean(kept.map((r) => r.pumps));
        // How the next balloon changed after a burst: shows whether a loss made them more careful.
        const afterBurst = rounds.slice(1).filter((_, i) => rounds[i].burst).map((r) => r.pumps);
        const afterBank = rounds.slice(1).filter((_, i) => !rounds[i].burst).map((r) => r.pumps);
        const total = kept.reduce((s, r) => s + r.pumps * PENCE, 0);
        finish.current({
          headline: `${money(total)} banked`,
          metrics: [
            { label: "Average pumps (banked balloons)", value: avg.toFixed(1) },
            { label: "Balloons burst", value: `${bursts} of ${TOTAL}` },
            { label: "Banked", value: money(total) },
            { label: "Pumps after a burst", value: afterBurst.length ? mean(afterBurst).toFixed(1) : "–" },
            { label: "Pumps after banking", value: afterBank.length ? mean(afterBank).toFixed(1) : "–" },
          ],
          insight: `${
            avg < 16
              ? "You played cautiously, banking early and rarely losing money."
              : avg < 36
                ? "You took a balanced amount of risk."
                : "You pushed hard for reward and accepted lots of bursts."
          } For these balloons, stopping around 32 pumps earns the most on average (about ${money(32 * PENCE * 0.5)} a balloon). Employers don't look for a single ideal; they compare your risk-taking and how much it shifts after a loss with people who do well in the role.`,
        });
        return;
      }
      setPumps(0);
      setBurstAt(newBurstPoint());
      setStatus("ready");
    }, status === "burst" ? 1000 : 600);
    return () => clearTimeout(id);
  }, [status, rounds, finish]);

  const size = 70 + pumps * 2.6;

  return (
    <div className="space-y-4">
      <GameProgress value={rounds.length} total={TOTAL} label={`Banked ${money(banked)}`} />
      <Stage className="min-h-[400px] justify-end overflow-hidden">
        <div className="flex h-[260px] items-end justify-center">
          {status === "burst" ? (
            <p className="pb-24 text-3xl font-semibold text-destructive">Pop!</p>
          ) : (
            <svg viewBox="-50 -60 100 130" style={{ width: size, height: size * 1.3 }} aria-hidden className="transition-all duration-100">
              <ellipse cx={0} cy={0} rx={40} ry={50} className={cn("fill-primary/70", status === "banked" && "fill-success/70")} />
              <ellipse cx={-14} cy={-22} rx={8} ry={12} className="fill-white/25" />
              <polygon points="-5,49 5,49 0,56" className="fill-primary/70" />
              <path d="M0 56 q 6 8 0 14" className="stroke-muted-foreground" fill="none" strokeWidth={1.5} />
            </svg>
          )}
        </div>
        <p className="text-lg font-medium tabular-nums">
          This balloon: {status === "burst" ? <span className="text-destructive line-through">{money(pumps * PENCE)}</span> : money(pumps * PENCE)}
        </p>
      </Stage>
      <div className="grid grid-cols-2 gap-3">
        <Button size="lg" className="h-14" onClick={pump} disabled={status !== "ready"}>
          Pump <kbd className="text-xs opacity-70">Space</kbd>
        </Button>
        <Button size="lg" variant="outline" className="h-14" onClick={bank} disabled={status !== "ready" || pumps === 0}>
          Bank {money(pumps * PENCE)} <kbd className="text-xs text-muted-foreground">Enter</kbd>
        </Button>
      </div>
    </div>
  );
}
