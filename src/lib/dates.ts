"use client";

// Deadline status depends on today's date, so it is only ever computed in the
// browser: pre-rendered HTML would otherwise freeze "closes in 3 days" at build time.
import { useSyncExternalStore } from "react";

export const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const subscribe = () => () => {};

/** Today's date (YYYY-MM-DD) on the client; null during pre-render and hydration. */
export function useToday() {
  return useSyncExternalStore(subscribe, todayISO, () => null);
}

export const daysBetween = (from: string, to: string) =>
  Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000);

export type DeadlineStatus =
  | { kind: "unknown" }
  | { kind: "not-open"; opens: string }
  | { kind: "open"; daysLeft: number | null }
  | { kind: "closed" };

export function deadlineStatus(
  o: { opens: string | null; closes: string | null },
  today: string,
): DeadlineStatus {
  if (o.closes && o.closes < today) return { kind: "closed" };
  if (o.opens && o.opens > today) return { kind: "not-open", opens: o.opens };
  if (o.closes) return { kind: "open", daysLeft: daysBetween(today, o.closes) };
  return o.opens ? { kind: "open", daysLeft: null } : { kind: "unknown" };
}
