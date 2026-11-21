"use client";

// The three reasoning games: Order (build the next frame), Patterns (pick it) and
// Balance (hidden weights). They share a timer, a check step and an explanation.
import { ArrowRightIcon, CheckIcon, XIcon } from "lucide-react";
import { useState } from "react";

import { formatClock, GameProgress, ShapeIcon, Stage, useCountdown } from "@/components/games/shared";
import { Figure } from "@/components/tests/figure";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { GameResult } from "@/lib/games";
import { balancePuzzle, gridToFigure, orderPuzzle, patternPuzzle, type Grid, type Pan } from "@/lib/games/puzzles";
import { pct } from "@/lib/games/random";
import { cn } from "@/lib/utils";

const LETTERS = "ABCD";

function Feedback({ right, children }: { right: boolean; children: React.ReactNode }) {
  return (
    <div className={cn("w-full max-w-xl space-y-1 rounded-xl border p-4 text-sm", right ? "border-success/40 bg-success/10" : "border-destructive/40 bg-destructive/10")}>
      <p className="flex items-center gap-1.5 font-medium">
        {right ? <CheckIcon className="size-4 text-success" /> : <XIcon className="size-4 text-destructive" />}
        {right ? "Correct" : "Not quite"}
      </p>
      <p className="text-foreground/90">{children}</p>
    </div>
  );
}

/** Shared flow: a fixed number of questions, one overall timer, check then next. */
function useRounds(total: number, seconds: number, onFinish: (r: GameResult) => void, describe: (right: number, answered: number) => GameResult) {
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const checked = results.length > index;
  const finish = (rs: boolean[]) => onFinish(describe(rs.filter(Boolean).length, rs.length));
  const remaining = useCountdown(seconds, () => finish(results));
  return {
    index,
    checked,
    right: results[index],
    remaining,
    check: (right: boolean) => setResults([...results, right]),
    next: () => (index + 1 >= total ? finish(results) : setIndex(index + 1)),
    results,
  };
}

function NextButton({ last, onClick }: { last: boolean; onClick: () => void }) {
  return (
    <Button size="lg" onClick={onClick}>
      {last ? "See results" : "Next"} <ArrowRightIcon data-icon="inline-end" />
    </Button>
  );
}

// ——— Order ————————————————————————————————————————————————————————

const ORDER_TOTAL = 12;

export function OrderGame({ onFinish }: { onFinish: (r: GameResult) => void }) {
  const [puzzles] = useState(() => Array.from({ length: ORDER_TOTAL }, (_, i) => orderPuzzle(i)));
  const [grid, setGrid] = useState<Grid>(() => Array(9).fill(0));
  const rounds = useRounds(ORDER_TOTAL, ORDER_TOTAL * 60, onFinish, (right, answered) => ({
    headline: `${right} of ${ORDER_TOTAL} built correctly`,
    score: pct(right, ORDER_TOTAL),
    metrics: [
      { label: "Correct", value: `${right} of ${ORDER_TOTAL}` },
      { label: "Attempted", value: `${answered} of ${ORDER_TOTAL}` },
    ],
    insight:
      "Building the answer yourself is harder than picking it, because there are no options to check against. Work one rule at a time: position first, then fill, then count.",
  }));
  const p = puzzles[rounds.index];
  const cycle = (cell: number) => !rounds.checked && setGrid(grid.map((v, i) => (i === cell ? (v + 1) % 3 : v)));
  const correct = grid.every((v, i) => v === p.answer[i]);

  return (
    <div className="space-y-4">
      <GameProgress value={rounds.index} total={ORDER_TOTAL} label={formatClock(rounds.remaining)} />
      <Stage>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {p.frames.map((f, i) => (
            <Figure key={i} figure={gridToFigure(f, p.shape)} label={`Frame ${i + 1}`} className="size-20 sm:size-24" />
          ))}
          <div className="grid size-[120px] grid-cols-3 gap-1 rounded-md border-2 border-primary/60 p-1 sm:size-[132px]" aria-label="Your frame">
            {grid.map((v, cell) => (
              <button
                key={cell}
                type="button"
                onClick={() => cycle(cell)}
                aria-label={`Cell ${cell + 1}: ${["empty", "outline", "filled"][v]}`}
                className="flex items-center justify-center rounded-sm bg-muted/60 hover:bg-muted"
              >
                {v > 0 && <ShapeIcon shape={p.shape} fill={v === 2 ? "solid" : "none"} className="size-6" />}
              </button>
            ))}
          </div>
        </div>
        {rounds.checked ? (
          <>
            {!rounds.right && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                The answer: <Figure figure={gridToFigure(p.answer, p.shape)} label="Correct frame" />
              </div>
            )}
            <Feedback right={rounds.right}>{p.rule}</Feedback>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Tap cells to cycle: empty → outline → filled.</p>
        )}
      </Stage>
      <div className="flex justify-end gap-2">
        {rounds.checked ? (
          <NextButton
            last={rounds.index + 1 >= ORDER_TOTAL}
            onClick={() => {
              setGrid(Array(9).fill(0));
              rounds.next();
            }}
          />
        ) : (
          <Button size="lg" onClick={() => rounds.check(correct)}>
            Check
          </Button>
        )}
      </div>
    </div>
  );
}

// ——— Patterns ——————————————————————————————————————————————————————

const PATTERN_TOTAL = 15;

export function PatternsGame({ onFinish }: { onFinish: (r: GameResult) => void }) {
  const [puzzles] = useState(() => Array.from({ length: PATTERN_TOTAL }, (_, i) => patternPuzzle(i)));
  const [choice, setChoice] = useState<number | null>(null);
  const rounds = useRounds(PATTERN_TOTAL, 12 * 60, onFinish, (right, answered) => ({
    headline: `${right} of ${PATTERN_TOTAL} correct`,
    score: pct(right, PATTERN_TOTAL),
    metrics: [
      { label: "Correct", value: `${right} of ${PATTERN_TOTAL}` },
      { label: "Answered", value: `${answered} of ${PATTERN_TOTAL}` },
    ],
    insight:
      "Later questions combine two or three rules at once. If you got stuck, list every property that changes (position, rotation, fill, count) and check each option against all of them.",
  }));
  const p = puzzles[rounds.index];

  return (
    <div className="space-y-4">
      <GameProgress value={rounds.index} total={PATTERN_TOTAL} label={formatClock(rounds.remaining)} />
      <Stage>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {p.sequence.map((f, i) => (
            <Figure key={i} figure={f} label={`Frame ${i + 1}`} />
          ))}
          <span className="flex size-16 items-center justify-center rounded-md border border-dashed text-2xl text-muted-foreground sm:size-20">?</span>
        </div>
        <div role="radiogroup" aria-label="Options" className="flex flex-wrap justify-center gap-3">
          {p.options.map((f, i) => (
            <button
              key={i}
              type="button"
              role="radio"
              aria-checked={choice === i}
              disabled={rounds.checked}
              onClick={() => setChoice(i)}
              className={cn(
                "flex flex-col items-center gap-1 rounded-lg border p-2 transition-colors hover:border-foreground/30",
                choice === i && "border-primary ring-2 ring-primary/40",
                rounds.checked && i === p.answer && "border-success ring-2 ring-success/40",
              )}
            >
              <Figure figure={f} label={`Option ${LETTERS[i]}`} />
              <span className="text-xs font-medium text-muted-foreground">{LETTERS[i]}</span>
            </button>
          ))}
        </div>
        {rounds.checked && <Feedback right={rounds.right}>{p.rule}</Feedback>}
      </Stage>
      <div className="flex justify-end">
        {rounds.checked ? (
          <NextButton
            last={rounds.index + 1 >= PATTERN_TOTAL}
            onClick={() => {
              setChoice(null);
              rounds.next();
            }}
          />
        ) : (
          <Button size="lg" disabled={choice === null} onClick={() => rounds.check(choice === p.answer)}>
            Check
          </Button>
        )}
      </div>
    </div>
  );
}

// ——— Balance ———————————————————————————————————————————————————————

const BALANCE_TOTAL = 10;

function PanView({ pan, className }: { pan: Pan; className?: string }) {
  return (
    <div className={cn("flex min-h-10 min-w-24 flex-wrap items-center justify-center gap-1 rounded-lg border-b-4 border-muted-foreground/40 bg-muted/40 px-2 py-1.5", className)}>
      {pan.map((s, i) => (
        <ShapeIcon key={i} shape={s} className={cn("size-6", s === "square" ? "text-muted-foreground" : "text-primary")} />
      ))}
    </div>
  );
}

function Scale({ left, right }: { left: Pan; right: React.ReactNode }) {
  return (
    <div className="flex items-end gap-3">
      <PanView pan={left} />
      <div className="flex flex-col items-center pb-1 text-muted-foreground">
        <span className="text-lg leading-none">=</span>
        <span className="h-4 w-0.5 bg-muted-foreground/40" />
        <span className="h-1 w-6 rounded bg-muted-foreground/40" />
      </div>
      {right}
    </div>
  );
}

export function BalanceGame({ onFinish }: { onFinish: (r: GameResult) => void }) {
  const [level, setLevel] = useState(1);
  const [maxLevel, setMaxLevel] = useState(1);
  const [puzzle, setPuzzle] = useState(() => balancePuzzle(1));
  const [value, setValue] = useState("");
  const rounds = useRounds(BALANCE_TOTAL, 10 * 60, onFinish, (right, answered) => ({
    headline: `${right} of ${BALANCE_TOTAL} balanced`,
    score: pct(right, BALANCE_TOTAL),
    metrics: [
      { label: "Correct", value: `${right} of ${BALANCE_TOTAL}` },
      { label: "Answered", value: `${answered} of ${BALANCE_TOTAL}` },
      { label: "Hardest level reached", value: `${maxLevel} of 6` },
    ],
    insight:
      "Questions got harder each time you were right, so the level you reached says more than the raw score. Convert every shape into squares before adding anything up, and solve the simplest clue first.",
  }));

  const submit = () => {
    if (rounds.checked || value === "") return;
    rounds.check(Number(value) === puzzle.answer);
  };
  const next = () => {
    const nextLevel = Math.max(1, Math.min(6, level + (rounds.right ? 1 : -1)));
    setLevel(nextLevel);
    setMaxLevel(Math.max(maxLevel, nextLevel));
    setPuzzle(balancePuzzle(nextLevel));
    setValue("");
    rounds.next();
  };
  const explain = Object.entries(puzzle.weights)
    .filter(([s]) => s !== "square")
    .map(([s, w]) => `a ${s} weighs ${w} squares`)
    .join(", ");

  return (
    <div className="space-y-4">
      <GameProgress value={rounds.index} total={BALANCE_TOTAL} label={`Level ${level} · ${formatClock(rounds.remaining)}`} />
      <Stage className="gap-5">
        <div className="space-y-3">
          <p className="text-center text-xs font-medium tracking-wide text-muted-foreground uppercase">Clues</p>
          {puzzle.clues.map((c, i) => (
            <Scale key={i} left={c.left} right={<PanView pan={c.right} />} />
          ))}
        </div>
        <div className="space-y-3 border-t pt-5">
          <p className="text-center text-xs font-medium tracking-wide text-muted-foreground uppercase">How many squares balance this?</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            <Scale
              left={puzzle.question}
              right={
                <div className="flex items-center gap-1.5 rounded-lg border-b-4 border-muted-foreground/40 bg-muted/40 px-2 py-1">
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    autoFocus
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    disabled={rounds.checked}
                    aria-label="Number of squares"
                    className="h-8 w-16 text-center"
                  />
                  <ShapeIcon shape="square" className="size-6 text-muted-foreground" />
                </div>
              }
            />
          </form>
        </div>
        {rounds.checked && (
          <Feedback right={rounds.right}>
            The answer is {puzzle.answer}: {explain}.
          </Feedback>
        )}
      </Stage>
      <div className="flex justify-end">
        {rounds.checked ? (
          <NextButton last={rounds.index + 1 >= BALANCE_TOTAL} onClick={next} />
        ) : (
          <Button size="lg" disabled={value === ""} onClick={submit}>
            Check
          </Button>
        )}
      </div>
    </div>
  );
}
