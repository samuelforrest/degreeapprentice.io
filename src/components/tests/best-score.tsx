"use client";

import { useSyncExternalStore } from "react";

import { getProgressSnapshot, readProgress, subscribeProgress } from "@/lib/tests/progress";

/** The visitor's best score for a test, read from this browser. Renders nothing until they've taken it. */
export function BestScore({ slug }: { slug: string }) {
  const raw = useSyncExternalStore(subscribeProgress, getProgressSnapshot, () => null);
  const result = readProgress(raw)[slug];
  if (!result) return null;
  return <span className="text-xs font-medium text-primary tabular-nums">Best: {result.best}%</span>;
}
