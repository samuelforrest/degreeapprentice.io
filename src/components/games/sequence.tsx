"use client";

import { useEffect, useState } from "react";

import { Stage, useLatest } from "@/components/games/shared";
import type { GameResult } from "@/lib/games";
import { pct, randInt, shuffle } from "@/lib/games/random";
import { cn } from "@/lib/utils";

const TILES = 16;
const START = 3;
const MAX = 12;
/** From this length, an amber distractor flashes during the sequence. */
const DISTRACTOR_FROM = 5;
const FLASH_MS = 600;
const GAP_MS = 250;

type Round = { tiles: number[]; distractor: { tile: number; at: number } | null };

function newRound(length: number): Round {
  const order = shuffle(Array.from({ length: TILES }, (_, i) => i));
  const tiles = order.slice(0, length);
  return {
    tiles,
    distractor: length >= DISTRACTOR_FROM ? { tile: order[length], at: 1 + randInt(length - 1) } : null,
  };
}

export function SequenceGame({ onFinish }: { onFinish: (r: GameResult) => void }) {
  const [length, setLength] = useState(START);
  const [round, setRound] = useState(() => newRound(START));
  const [phase, setPhase] = useState<"show" | "input" | "right" | "wrong">("show");
  const [lit, setLit] = useState<{ tile: number; distractor: boolean } | null>(null);
  const [input, setInput] = useState<number[]>([]);
  const [misses, setMisses] = useState(0);
  const [best, setBest] = useState(0);
  const [log, setLog] = useState<{ length: number; right: boolean }[]>([]);
  const finish = useLatest(onFinish);

  // Play the sequence, with the distractor slotted in at its position.
  useEffect(() => {
    if (phase !== "show") return;
    const flashes = round.tiles.map((tile) => ({ tile, distractor: false }));
    if (round.distractor) flashes.splice(round.distractor.at, 0, { tile: round.distractor.tile, distractor: true });
    const timers = flashes.flatMap((f, i) => {
      const start = 700 + i * (FLASH_MS + GAP_MS);
      return [setTimeout(() => setLit(f), start), setTimeout(() => setLit(null), start + FLASH_MS)];
    });
    timers.push(setTimeout(() => setPhase("input"), 700 + flashes.length * (FLASH_MS + GAP_MS)));
    return () => timers.forEach(clearTimeout);
  }, [phase, round]);

  // After a round: lengthen on success; end after two misses in a row.
  useEffect(() => {
    if (phase !== "right" && phase !== "wrong") return;
    const id = setTimeout(() => {
      const right = phase === "right";
      const nextMisses = right ? 0 : misses + 1;
      const nextBest = right ? Math.max(best, length) : best;
      const nextLength = right ? length + 1 : length;
      const nextLog = [...log, { length, right }];
      if (nextMisses >= 2 || nextLength > MAX) {
        finish.current({
          headline: nextBest ? `Span of ${nextBest}` : "No sequence completed",
          metrics: [
            { label: "Longest sequence", value: String(nextBest) },
            { label: "Rounds played", value: String(nextLog.length) },
            { label: "Rounds right", value: `${pct(nextLog.filter((r) => r.right).length, nextLog.length)}%` },
          ],
          insight: `Most adults can repeat a spatial sequence of about 5 to 7 tiles. ${
            nextBest >= 7
              ? "Yours is at the top of that range."
              : nextBest >= 5
                ? "You're in the typical range: chunking the path into shapes can add a tile or two."
                : "Try grouping tiles into small shapes (an L, a diagonal) rather than remembering each one."
          } The amber distractor from ${DISTRACTOR_FROM} tiles tests whether you can hold the sequence while ignoring irrelevant information.`,
        });
        return;
      }
      setMisses(nextMisses);
      setBest(nextBest);
      setLength(nextLength);
      setLog(nextLog);
      setRound(newRound(nextLength));
      setInput([]);
      setPhase("show");
    }, 900);
    return () => clearTimeout(id);
  }, [phase, misses, best, length, log, finish]);

  const tap = (tile: number) => {
    if (phase !== "input") return;
    const next = [...input, tile];
    setInput(next);
    if (round.tiles[next.length - 1] !== tile) setPhase("wrong");
    else if (next.length === round.tiles.length) setPhase("right");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">Sequence of {length}</span>
        <span className="text-muted-foreground">
          {phase === "show" ? "Watch…" : phase === "input" ? `Your turn: ${input.length} of ${length}` : phase === "right" ? "Correct" : "Not quite"}
        </span>
      </div>
      <Stage>
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {Array.from({ length: TILES }, (_, tile) => {
            const flashing = lit?.tile === tile;
            const tapped = phase !== "show" && input.includes(tile);
            return (
              <button
                key={tile}
                type="button"
                onClick={() => tap(tile)}
                disabled={phase !== "input"}
                aria-label={`Tile ${tile + 1}`}
                className={cn(
                  "size-14 rounded-xl border bg-background transition-colors duration-100 sm:size-16",
                  phase === "input" && "hover:border-primary/50 active:bg-primary/40",
                  flashing && (lit.distractor ? "border-warning bg-warning" : "border-primary bg-primary"),
                  tapped && "border-primary/60 bg-primary/25",
                  phase === "wrong" && input.at(-1) === tile && "border-destructive bg-destructive/40",
                  phase === "right" && tapped && "border-success bg-success/40",
                )}
              />
            );
          })}
        </div>
      </Stage>
      <p className="text-center text-sm text-muted-foreground">
        {misses === 1 ? "One more miss in a row ends the game." : "Two misses in a row ends the game."}
      </p>
    </div>
  );
}
