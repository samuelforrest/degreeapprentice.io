"use client";

import { useEffect, useRef, useState } from "react";

import { useLatest } from "@/components/games/shared";

export type Outcome<T> = { trial: T; answer: string | null; rt: number | null; correct: boolean };

/**
 * Runs fixed-length timed trials: a gap, the stimulus with a response window, then brief
 * feedback. Shared by the reaction-time games (arrows, tickets, day or night).
 */
export function useTrials<T>(opts: {
  trials: T[];
  gapMs: (index: number) => number;
  windowMs: (index: number) => number;
  feedbackMs: number;
  isCorrect: (trial: T, answer: string | null) => boolean;
  onDone: (outcomes: Outcome<T>[], early: number) => void;
}) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"gap" | "show" | "feedback">("gap");
  const [last, setLast] = useState<Outcome<T> | null>(null);
  const [early, setEarly] = useState(0);
  const outcomes = useRef<Outcome<T>[]>([]);
  const shownAt = useRef(0);
  const earlyCount = useRef(0);
  const cfg = useLatest(opts);

  const record = (answer: string | null) => {
    const trial = opts.trials[index];
    const o = {
      trial,
      answer,
      rt: answer === null ? null : performance.now() - shownAt.current,
      correct: opts.isCorrect(trial, answer),
    };
    outcomes.current.push(o);
    setLast(o);
    setPhase("feedback");
  };
  const recordLatest = useLatest(record);

  useEffect(() => {
    const c = cfg.current;
    let id: ReturnType<typeof setTimeout>;
    if (phase === "gap") {
      id = setTimeout(() => {
        shownAt.current = performance.now();
        setPhase("show");
      }, c.gapMs(index));
    } else if (phase === "show") {
      id = setTimeout(() => recordLatest.current(null), c.windowMs(index));
    } else {
      id = setTimeout(() => {
        if (index + 1 >= c.trials.length) c.onDone(outcomes.current, earlyCount.current);
        else {
          setIndex(index + 1);
          setPhase("gap");
        }
      }, c.feedbackMs);
    }
    return () => clearTimeout(id);
  }, [phase, index, recordLatest, cfg]);

  const respond = (answer: string) => {
    if (phase === "show") record(answer);
    else if (phase === "gap") {
      earlyCount.current += 1;
      setEarly(earlyCount.current);
    }
  };

  return { index, phase, trial: opts.trials[index], last, early, respond };
}
