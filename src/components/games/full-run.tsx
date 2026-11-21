"use client";

import Link from "next/link";
import { useState } from "react";

import { GameIntro, GameResults } from "@/components/games/game-shell";
import { GAME_COMPONENTS } from "@/components/games/registry";
import { Button } from "@/components/ui/button";
import { FULL_RUN, getGame, progressKey, type GameResult } from "@/lib/games";
import { saveResult } from "@/lib/tests/progress";

/** Every task in the full run back to back, with a combined summary at the end. */
export function FullRun() {
  const [step, setStep] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [results, setResults] = useState<GameResult[]>([]);
  const done = results.length === FULL_RUN.length;

  const top = () => window.scrollTo({ top: 0 });

  if (step === -1) {
    const minutes = FULL_RUN.reduce((m, slug) => m + getGame(slug)!.minutes, 0);
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <Header />
        <p className="text-muted-foreground">
          {FULL_RUN.length} tasks back to back, the way employers send them: about {minutes} minutes in total. Like the real thing, there are no
          results until the end, and it&apos;s best done in one sitting somewhere quiet.
        </p>
        <ol className="grid gap-2 sm:grid-cols-3">
          {FULL_RUN.map((slug, i) => (
            <li key={slug} className="rounded-lg border bg-card px-3 py-2 text-sm">
              <span className="mr-2 text-muted-foreground tabular-nums">{i + 1}</span>
              {getGame(slug)!.title}
            </li>
          ))}
        </ol>
        <Button size="lg" onClick={() => setStep(0)}>
          Begin
        </Button>
      </div>
    );
  }

  if (done) {
    return (
      <div className="mx-auto max-w-3xl space-y-8">
        <Header />
        <p className="text-muted-foreground">
          You finished all {FULL_RUN.length} tasks. Real providers turn this into a trait profile compared with people already doing the job, so
          use these numbers to spot which tasks to practise, not as a pass or fail.
        </p>
        {FULL_RUN.map((slug, i) => (
          <section key={slug} className="space-y-2">
            <h2 className="text-lg font-semibold">
              {i + 1}. {getGame(slug)!.title}
            </h2>
            <GameResults game={getGame(slug)!} result={results[i]} />
          </section>
        ))}
        <Button nativeButton={false} render={<Link href="/tests/games" />}>
          Back to all games
        </Button>
      </div>
    );
  }

  const game = getGame(FULL_RUN[step])!;
  const Game = GAME_COMPONENTS[game.slug];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">
          Task {step + 1} of {FULL_RUN.length}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">{game.title}</h1>
      </div>
      {playing ? (
        <Game
          key={game.slug}
          onFinish={(r) => {
            if (r.score !== undefined) saveResult(progressKey(game.slug), r.score);
            setResults((rs) => [...rs, r]);
            setPlaying(false);
            if (step + 1 < FULL_RUN.length) setStep(step + 1);
            top();
          }}
        />
      ) : (
        <GameIntro
          game={game}
          startLabel={`Start task ${step + 1}`}
          onStart={() => {
            setPlaying(true);
            top();
          }}
        />
      )}
    </div>
  );
}

function Header() {
  return (
    <div className="space-y-3">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <Link href="/tests" className="hover:text-foreground">Tests</Link>
        {" / "}
        <Link href="/tests/games" className="hover:text-foreground">Game-based</Link>
      </nav>
      <h1 className="text-3xl font-semibold tracking-tight text-balance">Full game-based assessment</h1>
    </div>
  );
}
