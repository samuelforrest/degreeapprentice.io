"use client";

import { useEffect, useRef, useState } from "react";

import type { BalanceShape } from "@/lib/games/puzzles";
import { cn } from "@/lib/utils";

/** Calls `onKey` for keydowns while `enabled`. Ignores auto-repeat so holding a key can't spam answers. */
export function useKeys(onKey: (key: string, e: KeyboardEvent) => void, enabled = true) {
  const handler = useRef(onKey);
  useEffect(() => {
    handler.current = onKey;
  });
  useEffect(() => {
    if (!enabled) return;
    const listener = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      if ((e.target as HTMLElement | null)?.closest("input, textarea")) return;
      handler.current(e.key, e);
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [enabled]);
}

/** The latest value of a callback, for timers that shouldn't restart when it changes. */
export function useLatest<T>(value: T) {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  });
  return ref;
}

/** Thin progress bar along the top of a game. */
export function GameProgress({ value, total, label }: { value: number; total: number; label?: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium tabular-nums">
          {Math.min(value + 1, total)} <span className="text-muted-foreground">of {total}</span>
        </span>
        {label && <span className="text-muted-foreground tabular-nums">{label}</span>}
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-primary transition-[width]" style={{ width: `${(value / total) * 100}%` }} />
      </div>
    </div>
  );
}

/** The play area: a fixed-height card so the layout doesn't jump between rounds. */
export function Stage({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex min-h-[340px] flex-col items-center justify-center gap-6 rounded-2xl border bg-card p-6 select-none", className)}>
      {children}
    </div>
  );
}

export function ShapeIcon({
  shape,
  fill = "soft",
  className,
}: {
  shape: BalanceShape;
  fill?: "soft" | "solid" | "none";
  className?: string;
}) {
  const paint = {
    fill: fill === "none" ? "none" : "currentColor",
    fillOpacity: fill === "solid" ? 1 : 0.2,
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinejoin: "round" as const,
  };
  return (
    <svg viewBox="0 0 20 20" className={cn("size-6", className)} role="img" aria-label={shape}>
      {shape === "circle" && <circle cx={10} cy={10} r={7.5} {...paint} />}
      {shape === "square" && <rect x={3} y={3} width={14} height={14} rx={1} {...paint} />}
      {shape === "triangle" && <polygon points="10,2.5 17.5,17 2.5,17" {...paint} />}
      {shape === "diamond" && <polygon points="10,2 18,10 10,18 2,10" {...paint} />}
    </svg>
  );
}

/** Seconds left on a countdown that starts on mount; calls `onExpire` once at zero. */
export function useCountdown(seconds: number, onExpire: () => void) {
  const [remaining, setRemaining] = useState(seconds);
  const expire = useLatest(onExpire);
  useEffect(() => {
    const deadline = Date.now() + seconds * 1000;
    const id = setInterval(() => {
      const left = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0) {
        clearInterval(id);
        expire.current();
      }
    }, 250);
    return () => clearInterval(id);
  }, [seconds, expire]);
  return remaining;
}

export const formatClock = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
