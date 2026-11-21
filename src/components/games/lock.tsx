"use client";

import { LockKeyholeIcon, LockKeyholeOpenIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { GameProgress, Stage, useKeys } from "@/components/games/shared";
import { Button } from "@/components/ui/button";
import type { GameResult } from "@/lib/games";
import { mean, ms, pct, pick, randInt } from "@/lib/games/random";
import { cn } from "@/lib/utils";

const CODES = 10;
const DIGITS = 4;
/** Half a number's slice of the dial, less a little margin. */
const TOLERANCE = 14;

type Code = { digits: number[]; speed: number; dir: 1 | -1 };
type Press = { hit: boolean; errorMs: number };

const newCode = (index: number): Code => ({
  digits: Array.from({ length: DIGITS }, () => randInt(10)),
  speed: 110 + index * 18 + randInt(50), // degrees per second, faster as you go
  dir: pick([1, -1] as const),
});

const angleDiff = (a: number, b: number) => {
  const d = (((a - b) % 360) + 540) % 360 - 180;
  return Math.abs(d);
};

export function LockGame({ onFinish }: { onFinish: (r: GameResult) => void }) {
  const [codeIndex, setCodeIndex] = useState(0);
  const [code, setCode] = useState(() => newCode(0));
  const [entered, setEntered] = useState(0);
  const [presses, setPresses] = useState<Press[]>([]);
  const [resets, setResets] = useState(0);
  const [opened, setOpened] = useState(0);
  const [flash, setFlash] = useState<"hit" | "miss" | "open" | null>(null);
  // The marker's angle comes from the clock, so it never drifts from what's on screen.
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);

  useEffect(() => {
    let frame = requestAnimationFrame(function tick(t) {
      setNow(t);
      setStartedAt((s) => s ?? t);
      frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const angle = startedAt === null ? 0 : (code.dir * code.speed * (now - startedAt)) / 1000;
  const target = code.digits[entered];

  const end = (finalPresses = presses, finalOpened = opened) => {
    const hits = finalPresses.filter((p) => p.hit).length;
    onFinish({
      headline: `${finalOpened} of ${CODES} locks opened`,
      score: pct(hits, finalPresses.length),
      metrics: [
        { label: "Locks opened", value: `${finalOpened} of ${CODES}` },
        { label: "Accurate stops", value: `${hits} of ${finalPresses.length}` },
        { label: "Average timing error", value: ms(mean(finalPresses.map((p) => p.errorMs))) },
        { label: "Resets", value: String(resets) },
      ],
      insight: `Your stops were off by ${ms(mean(finalPresses.map((p) => p.errorMs)))} on average. ${
        finalOpened < CODES
          ? "You moved on before opening every lock: in the real task, sticking with it after resets is part of what's measured."
          : "You kept going through every lock, which shows persistence as well as precision."
      } The trick at higher speeds is to press as the marker approaches, not when it arrives.`,
    });
  };

  const stop = () => {
    if (flash === "open" || startedAt === null) return;
    const diff = angleDiff(angle, target * 36);
    const press = { hit: diff <= TOLERANCE, errorMs: (diff / code.speed) * 1000 };
    const nextPresses = [...presses, press];
    setPresses(nextPresses);
    if (!press.hit) {
      setEntered(0);
      setResets((n) => n + 1);
      setFlash("miss");
      return;
    }
    if (entered + 1 < DIGITS) {
      setEntered(entered + 1);
      setFlash("hit");
      return;
    }
    const nextOpened = opened + 1;
    setOpened(nextOpened);
    setFlash("open");
    setTimeout(() => {
      if (codeIndex + 1 >= CODES) return end(nextPresses, nextOpened);
      setCodeIndex(codeIndex + 1);
      setCode(newCode(codeIndex + 1));
      setEntered(0);
      setFlash(null);
      setStartedAt(null);
    }, 900);
  };

  useEffect(() => {
    if (flash !== "hit" && flash !== "miss") return;
    const id = setTimeout(() => setFlash(null), 250);
    return () => clearTimeout(id);
  }, [flash, presses]);

  useKeys((key, e) => {
    if (key === " ") {
      e.preventDefault();
      stop();
    }
  });

  const R = 82;
  return (
    <div className="space-y-4">
      <GameProgress value={codeIndex} total={CODES} label={`Opened ${opened}`} />
      <Stage>
        <div className="flex items-center gap-2" aria-label="Code entered">
          {code.digits.map((d, i) => (
            <span
              key={i}
              className={cn(
                "flex size-10 items-center justify-center rounded-lg border text-lg font-semibold tabular-nums",
                i < entered || flash === "open" ? "border-success/60 bg-success/15" : i === entered ? "border-primary" : "text-muted-foreground",
              )}
            >
              {i < entered || flash === "open" ? d : "•"}
            </span>
          ))}
        </div>
        <svg viewBox="-110 -110 220 220" className="size-64" aria-hidden>
          <circle r={104} className={cn("fill-background stroke-border", flash === "miss" && "stroke-destructive", flash === "open" && "stroke-success")} strokeWidth={3} />
          {Array.from({ length: 10 }, (_, n) => {
            const a = ((n * 36 - 90) * Math.PI) / 180;
            const isTarget = n === target && flash !== "open";
            return (
              <g key={n}>
                {isTarget && <circle cx={Math.cos(a) * R} cy={Math.sin(a) * R} r={15} className="fill-primary/25 stroke-primary" strokeWidth={2} />}
                <text
                  x={Math.cos(a) * R}
                  y={Math.sin(a) * R}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className={cn("text-[15px] font-semibold tabular-nums", isTarget ? "fill-foreground" : "fill-muted-foreground")}
                >
                  {n}
                </text>
              </g>
            );
          })}
          <g transform={`rotate(${angle})`}>
            <line x1={0} y1={0} x2={0} y2={-62} className="stroke-warning" strokeWidth={4} strokeLinecap="round" />
            <circle cy={-R} r={18} className="fill-none stroke-warning" strokeWidth={2.5} />
          </g>
          <circle r={22} className="fill-muted stroke-border" />
          <foreignObject x={-11} y={-11} width={22} height={22}>
            {flash === "open" ? <LockKeyholeOpenIcon className="size-[22px] text-success" /> : <LockKeyholeIcon className="size-[22px] text-muted-foreground" />}
          </foreignObject>
        </svg>
      </Stage>
      <div className="grid grid-cols-[1fr_auto] gap-3">
        <Button size="lg" className="h-14" onClick={stop}>
          Stop <kbd className="text-xs opacity-70">Space</kbd>
        </Button>
        <Button size="lg" variant="outline" className="h-14" onClick={() => end()} disabled={flash === "open"}>
          Move on
        </Button>
      </div>
    </div>
  );
}
