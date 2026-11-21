"use client";

import { RotateCcwIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { GAME_COMPONENTS } from "@/components/games/registry";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getGame, progressKey, type GameInfo, type GameResult } from "@/lib/games";
import { saveResult } from "@/lib/tests/progress";

/** One game from start to finish: instructions, the game itself, then results. */
export function GameShell({ slug }: { slug: string }) {
  const game = getGame(slug)!;
  const [phase, setPhase] = useState<"intro" | "playing" | "done">("intro");
  const [result, setResult] = useState<GameResult | null>(null);
  // A new key per play remounts the game, so every attempt starts fresh.
  const [attempt, setAttempt] = useState(0);
  const Game = GAME_COMPONENTS[slug];

  useEffect(() => {
    if (phase === "done" && result?.score !== undefined) saveResult(progressKey(slug), result.score);
  }, [phase, result, slug]);

  const start = () => {
    setAttempt((n) => n + 1);
    setPhase("playing");
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-3">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <Link href="/tests" className="hover:text-foreground">Tests</Link>
          {" / "}
          <Link href="/tests/games" className="hover:text-foreground">Game-based</Link>
        </nav>
        <h1 className="text-3xl font-semibold tracking-tight text-balance">{game.title}</h1>
        {phase === "intro" && <p className="text-muted-foreground">{game.description}</p>}
      </div>

      {phase === "intro" && <GameIntro game={game} onStart={start} />}
      {phase === "playing" && (
        <Game
          key={attempt}
          onFinish={(r) => {
            setResult(r);
            setPhase("done");
            window.scrollTo({ top: 0 });
          }}
        />
      )}
      {phase === "done" && result && (
        <>
          <GameResults game={game} result={result} />
          <div className="flex flex-wrap gap-2">
            <Button onClick={start}>
              <RotateCcwIcon data-icon="inline-start" /> Play again
            </Button>
            <Button variant="outline" nativeButton={false} render={<Link href="/tests/games" />}>
              All games
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export function GameIntro({ game, onStart, startLabel = "Start" }: { game: GameInfo; onStart: () => void; startLabel?: string }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-1.5">
        <Badge variant="secondary">About {game.minutes} min</Badge>
        <Badge variant="outline">{game.measures}</Badge>
      </div>
      <div className="space-y-2 rounded-xl border bg-card p-5">
        <h2 className="font-semibold">How it works</h2>
        <ul className="ml-5 list-disc space-y-1.5 text-[15px] leading-relaxed text-foreground/90">
          {game.instructions.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>
      <Button size="lg" onClick={onStart}>
        {startLabel}
      </Button>
    </div>
  );
}

export function GameResults({ game, result }: { game: GameInfo; result: GameResult }) {
  return (
    <div className="space-y-6">
      <div className="space-y-4 rounded-2xl border bg-card p-6">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{game.kind === "behavioural" ? "How you played" : "Your result"}</p>
          <p className="text-2xl font-semibold tracking-tight">{result.headline}</p>
        </div>
        <dl className="grid gap-4 sm:grid-cols-3">
          {result.metrics.map((m) => (
            <div key={m.label} className="space-y-0.5">
              <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{m.label}</dt>
              <dd className="font-medium tabular-nums">{m.value}</dd>
            </div>
          ))}
        </dl>
        <p className="text-[15px] leading-relaxed text-foreground/90">{result.insight}</p>
      </div>
      <div className="space-y-2 rounded-xl border p-5">
        <h2 className="font-semibold">Tips for the real thing</h2>
        <ul className="ml-5 list-disc space-y-1.5 text-[15px] leading-relaxed text-foreground/90">
          {game.tips.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <p className="pt-1 text-xs text-muted-foreground">Based on: {game.basedOn}.</p>
      </div>
    </div>
  );
}
