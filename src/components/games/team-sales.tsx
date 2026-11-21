"use client";

import { useState } from "react";

import { GameProgress, Stage } from "@/components/games/shared";
import { Button } from "@/components/ui/button";
import type { GameResult } from "@/lib/games";
import { pct } from "@/lib/games/random";
import { cn } from "@/lib/utils";

const ROUNDS = 12;
type Price = "high" | "low";
type Round = { you: Price; them: Price; yours: number; theirs: number };

const PAYOFF: Record<Price, Record<Price, [number, number]>> = {
  high: { high: [3, 3], low: [0, 5] },
  low: { high: [5, 0], low: [1, 1] },
};

/** The other team copies your last move (tit-for-tat), and now and then undercuts or forgives. */
function theirMove(history: Round[]): Price {
  if (!history.length) return "high";
  const copy = history.at(-1)!.you;
  return Math.random() < 0.12 ? (copy === "high" ? "low" : "high") : copy;
}

export function TeamSalesGame({ onFinish }: { onFinish: (r: GameResult) => void }) {
  const [rounds, setRounds] = useState<Round[]>([]);
  const last = rounds.at(-1);
  const you = rounds.reduce((s, r) => s + r.yours, 0);
  const them = rounds.reduce((s, r) => s + r.theirs, 0);

  const choose = (price: Price) => {
    const them = theirMove(rounds);
    const [yours, theirs] = PAYOFF[price][them];
    setRounds([...rounds, { you: price, them, yours, theirs }]);
  };

  const finish = () => {
    const high = rounds.filter((r) => r.you === "high").length;
    const undercut = rounds.slice(0, -1).flatMap((r, i) => (r.them === "low" ? [rounds[i + 1].you] : []));
    const retaliated = undercut.filter((p) => p === "low").length;
    const yourTotal = rounds.reduce((s, r) => s + r.yours, 0);
    const theirTotal = rounds.reduce((s, r) => s + r.theirs, 0);
    onFinish({
      headline: `£${yourTotal}k profit for your team`,
      metrics: [
        { label: "Your team", value: `£${yourTotal}k` },
        { label: "Other team", value: `£${theirTotal}k` },
        { label: "Rounds you priced high", value: `${pct(high, ROUNDS)}%` },
        { label: "Undercut back after being undercut", value: undercut.length ? `${retaliated} of ${undercut.length}` : "Never undercut" },
      ],
      insight: `Both teams pricing high every round earns the most together (£36k each). Undercutting wins one round but usually starts a price war. ${
        high >= 9
          ? "You mostly cooperated, which builds trust and steady joint profit."
          : high <= 4
            ? "You mostly undercut. That can win individual rounds, but it pushes both teams' profits down."
            : "You mixed cooperation and competition."
      } The task looks at trust, fairness and how you respond when someone else lets you down: forgiving one undercut tends to work better than holding a grudge.`,
    });
  };

  return (
    <div className="space-y-4">
      <GameProgress value={rounds.length} total={ROUNDS} label={`You £${you}k · Them £${them}k`} />
      <Stage>
        {last ? (
          <div className="grid w-full max-w-md grid-cols-2 gap-3 text-center">
            {[
              { who: "Your team", price: last.you, profit: last.yours },
              { who: "Other team", price: last.them, profit: last.theirs },
            ].map((x) => (
              <div key={x.who} className="space-y-1 rounded-xl border bg-background p-4">
                <p className="text-sm text-muted-foreground">{x.who}</p>
                <p className={cn("text-lg font-semibold capitalize", x.price === "low" ? "text-warning" : "text-success")}>{x.price} price</p>
                <p className="text-sm tabular-nums">+£{x.profit}k</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="max-w-sm text-center text-muted-foreground">Round 1: choose your price. The other team is choosing at the same time.</p>
        )}
        <table className="text-xs text-muted-foreground">
          <caption className="pb-1">Profit (your team / other team)</caption>
          <thead>
            <tr>
              <th />
              <th className="px-3 font-medium">They go high</th>
              <th className="px-3 font-medium">They go low</th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            <tr>
              <th className="pr-3 text-right font-medium">You go high</th>
              <td className="px-3 text-center">£3k / £3k</td>
              <td className="px-3 text-center">£0 / £5k</td>
            </tr>
            <tr>
              <th className="pr-3 text-right font-medium">You go low</th>
              <td className="px-3 text-center">£5k / £0</td>
              <td className="px-3 text-center">£1k / £1k</td>
            </tr>
          </tbody>
        </table>
      </Stage>
      {rounds.length < ROUNDS ? (
        <div className="grid grid-cols-2 gap-3">
          <Button size="lg" className="h-14" onClick={() => choose("high")}>
            High price
          </Button>
          <Button size="lg" variant="outline" className="h-14" onClick={() => choose("low")}>
            Low price
          </Button>
        </div>
      ) : (
        <Button size="lg" className="h-14 w-full" onClick={finish}>
          See results
        </Button>
      )}
    </div>
  );
}
