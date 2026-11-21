// Generators for the reasoning games. Every puzzle is built from explicit rules, so
// the answer is always computed rather than written by hand, and each play is new.
import { pick, randInt, shuffle } from "@/lib/games/random";
import type { Figure, FigureItem } from "@/lib/tests/types";

/** The eight outer cells of a 3×3 grid, clockwise from the top left. */
const RING = [0, 1, 2, 5, 8, 7, 6, 3];
const mod = (n: number, m: number) => ((n % m) + m) % m;
const ringCell = (i: number) => RING[mod(i, 8)];

const figureKey = (f: Figure) =>
  JSON.stringify([...f].sort((a, b) => a.cell - b.cell).map((x) => [x.shape, x.cell, !!x.filled, x.rotate ?? 0]));

// ——— Patterns: pick the next frame ————————————————————————————————————————

type ItemRule = {
  shape: FigureItem["shape"];
  /** Ring index, or a fixed cell when step is null. */
  pos: number;
  step: number | null;
  filled: boolean;
  alternate: boolean;
  rot: number;
  rotStep: number;
};

function frameAt(rules: ItemRule[], t: number): Figure {
  return rules.map((r) => ({
    shape: r.shape,
    cell: r.step === null ? r.pos : ringCell(r.pos + r.step * t),
    filled: r.alternate ? (t % 2 === 0) === r.filled : r.filled,
    ...(r.shape === "arrow" && { rotate: mod(r.rot + r.rotStep * t, 360) }),
  }));
}

const distinctCells = (f: Figure) => new Set(f.map((x) => x.cell)).size === f.length;

const PATTERN_SHAPES = ["circle", "square", "triangle", "diamond", "arrow"] as const;

function randomRule(shape: FigureItem["shape"], hard: boolean): ItemRule {
  const centre = !hard && Math.random() < 0.15;
  return {
    shape,
    pos: centre ? 4 : randInt(8),
    step: centre ? null : pick(hard ? [1, -1, 2, -2, 3] : [1, -1, 2]),
    filled: Math.random() < 0.5,
    alternate: Math.random() < (hard ? 0.5 : 0.35),
    rot: pick([0, 90, 180, 270]),
    rotStep: shape === "arrow" ? pick(hard ? [45, 90, -90, 135] : [90, -90, 180]) : 0,
  };
}

export type PatternPuzzle = { sequence: Figure[]; options: Figure[]; answer: number; rule: string };

function describe(rules: ItemRule[]) {
  return rules
    .map((r) => {
      const bits = [
        r.step === null ? "stays in the centre" : `moves ${Math.abs(r.step)} ${Math.abs(r.step) === 1 ? "cell" : "cells"} ${r.step > 0 ? "clockwise" : "anticlockwise"} round the edge`,
        r.rotStep ? `turns ${Math.abs(r.rotStep)}° ${r.rotStep > 0 ? "clockwise" : "anticlockwise"}` : null,
        r.alternate ? "switches between filled and outline" : null,
      ].filter(Boolean);
      return `The ${r.shape} ${bits.join(", ")}.`;
    })
    .join(" ");
}

export function patternPuzzle(index: number): PatternPuzzle {
  const hard = index >= 6;
  for (;;) {
    const count = index < 3 ? 1 : index < 10 ? 2 : pick([2, 3]);
    // Arrows rotate, so they're the most interesting: favour them first. Shapes never repeat in one puzzle.
    const shapes = shuffle(PATTERN_SHAPES);
    if (Math.random() < 0.5) shapes.sort((x, y) => Number(y === "arrow") - Number(x === "arrow"));
    const rules = shapes.slice(0, count).map((shape) => randomRule(shape, hard));
    const frames = [0, 1, 2, 3, 4].map((t) => frameAt(rules, t));
    if (!frames.every(distinctCells)) continue;
    if (new Set(frames.map(figureKey)).size < 4) continue; // something must visibly change

    const answer = frames[4];
    const wrong: Figure[] = [frames[3]];
    rules.forEach((r, i) => {
      const tweak = (patch: Partial<ItemRule>) => frameAt(rules.map((x, j) => (j === i ? { ...x, ...patch } : x)), 4);
      if (r.step !== null) wrong.push(tweak({ step: r.step + 1 }), tweak({ step: r.step - 1 }));
      if (r.rotStep) wrong.push(tweak({ rotStep: -r.rotStep }), tweak({ rot: r.rot + 90 }));
      wrong.push(answer.map((x, j) => (j === i ? { ...x, filled: !x.filled } : x)));
    });
    const seen = new Set([figureKey(answer)]);
    const distractors = shuffle(wrong).filter((f) => {
      const k = figureKey(f);
      if (!distinctCells(f) || seen.has(k)) return false;
      seen.add(k);
      return true;
    });
    if (distractors.length < 3) continue;

    const options = shuffle([answer, ...distractors.slice(0, 3)]);
    return { sequence: frames.slice(0, 4), options, answer: options.indexOf(answer), rule: describe(rules) };
  }
}

// ——— Order: build the fourth frame ——————————————————————————————————————

/** 0 empty, 1 outline, 2 filled, for each of the 9 cells. */
export type Grid = number[];

export type OrderPuzzle = { shape: BalanceShape; frames: Grid[]; answer: Grid; rule: string };

const empty = (): Grid => Array(9).fill(0);
const fillOf = () => pick([1, 2]);

function orderFrames(kind: number): { frames: Grid[]; rule: string } | null {
  const step = pick([1, -1]);
  const dir = step > 0 ? "clockwise" : "anticlockwise";
  const t4 = [0, 1, 2, 3];

  switch (kind) {
    case 0: {
      // Marks orbit together.
      const marks = shuffle([0, 1, 2, 3, 4, 5, 6, 7]).slice(0, pick([1, 2, 2, 3])).map((p) => ({ p, f: fillOf() }));
      return {
        rule: `Every mark moves one cell ${dir} round the edge each step.`,
        frames: t4.map((t) => {
          const g = empty();
          for (const m of marks) g[ringCell(m.p + step * t)] = m.f;
          return g;
        }),
      };
    }
    case 1: {
      // Orbit and alternate fill.
      const marks = shuffle([0, 1, 2, 3, 4, 5, 6, 7]).slice(0, pick([1, 2])).map((p) => ({ p, f: fillOf() }));
      return {
        rule: `Marks move one cell ${dir} each step and switch between outline and filled.`,
        frames: t4.map((t) => {
          const g = empty();
          for (const m of marks) g[ringCell(m.p + step * t)] = t % 2 === 0 ? m.f : 3 - m.f;
          return g;
        }),
      };
    }
    case 2: {
      // One more mark each step.
      const start = randInt(8);
      const gap = pick([1, 2]);
      const f = fillOf();
      return {
        rule: `A new mark is added ${gap === 1 ? "in the next cell" : "two cells along"} ${dir} each step.`,
        frames: t4.map((t) => {
          const g = empty();
          for (let k = 0; k <= t; k++) g[ringCell(start + step * gap * k)] = f;
          return g;
        }),
      };
    }
    case 3: {
      // Two marks travelling in opposite directions.
      const a = randInt(8);
      const b = mod(a + pick([3, 4, 5]), 8);
      const frames = t4.map((t) => {
        const g = empty();
        g[ringCell(a + t)] = 2;
        g[ringCell(b - t)] = 1;
        return g;
      });
      if (t4.some((t) => ringCell(a + t) === ringCell(b - t))) return null;
      return { rule: "The filled mark moves clockwise and the outline mark moves anticlockwise, one cell each step.", frames };
    }
    case 4: {
      // A row pattern moving down.
      const row = Array.from({ length: 3 }, () => (Math.random() < 0.6 ? fillOf() : 0));
      if (row.every((x) => x === 0) || row.every((x) => x !== 0 && x === row[0])) return null;
      const start = randInt(3);
      return {
        rule: "The row of marks moves down one row each step, wrapping back to the top.",
        frames: t4.map((t) => {
          const g = empty();
          const r = (start + t) % 3;
          row.forEach((v, c) => (g[r * 3 + c] = v));
          return g;
        }),
      };
    }
    default: {
      // Centre blinks while a mark orbits.
      const p = randInt(8);
      const f = fillOf();
      const jump = pick([1, 2]);
      return {
        rule: `The centre switches between outline and filled, and the outer mark moves ${jump === 1 ? "one cell" : "two cells"} ${dir} each step.`,
        frames: t4.map((t) => {
          const g = empty();
          g[4] = t % 2 === 0 ? f : 3 - f;
          g[ringCell(p + step * jump * t)] = 2;
          return g;
        }),
      };
    }
  }
}

export function orderPuzzle(index: number): OrderPuzzle {
  const kinds = index < 4 ? [0, 2, 4] : [0, 1, 2, 3, 4, 5];
  for (;;) {
    const built = orderFrames(pick(kinds));
    if (!built) continue;
    const { frames, rule } = built;
    return {
      shape: pick(["circle", "square", "triangle", "diamond"] as const),
      frames: frames.slice(0, 3),
      answer: frames[3],
      rule,
    };
  }
}

export const gridToFigure = (g: Grid, shape: FigureItem["shape"]): Figure =>
  g.flatMap((v, cell) => (v ? [{ shape, cell, filled: v === 2 }] : []));

// ——— Balance: hidden weights ——————————————————————————————————————————

export type BalanceShape = "square" | "circle" | "triangle" | "diamond";
export type Pan = BalanceShape[];
export type BalancePuzzle = {
  clues: { left: Pan; right: Pan }[];
  question: Pan;
  answer: number;
  weights: Partial<Record<BalanceShape, number>>;
};

const squares = (n: number): Pan => Array(n).fill("square");

/** Level 1–6: more shapes, chained clues and bigger final scales as it rises. */
export function balancePuzzle(level: number): BalancePuzzle {
  const others = shuffle(["circle", "triangle", "diamond"] as const).slice(0, Math.min(3, 1 + Math.floor((level - 1) / 2)));
  const values = shuffle([2, 3, 4, 5]).slice(0, others.length).sort((a, b) => a - b);
  const weights: Partial<Record<BalanceShape, number>> = { square: 1 };
  others.forEach((s, i) => (weights[s] = values[i]));

  const clues = others.map((s, i) => {
    const w = values[i];
    if (i > 0 && level >= 3 && Math.random() < 0.7) {
      const prev = others[i - 1];
      return { left: [s] as Pan, right: [prev, ...squares(w - values[i - 1])] as Pan };
    }
    if (level >= 5 && Math.random() < 0.5) return { left: [s, s] as Pan, right: squares(2 * w) };
    return { left: [s] as Pan, right: squares(w) };
  });

  const size = Math.min(5, 1 + Math.ceil(level / 2));
  const question: Pan = Array.from({ length: size }, () => pick(level >= 4 ? [...others, "square" as const] : others));
  const answer = question.reduce((sum, s) => sum + (weights[s] ?? 0), 0);
  return { clues: shuffle(clues), question, answer, weights };
}
