// Server-rendered charts for /insights: plain HTML bars, so they work without JavaScript.
// Single-series throughout (one hue, no legend); hover or focus a bar for its tooltip,
// and every chart has a table view.
import { cn } from "@/lib/utils";

type Row = { label: string; value: number; display: string; detail?: string; highlight?: boolean };

function Tooltip({ children }: { children: React.ReactNode }) {
  return (
    <span
      role="tooltip"
      className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 hidden -translate-x-1/2 rounded-md border bg-popover px-2 py-1 text-xs whitespace-nowrap text-popover-foreground shadow-md group-hover:block group-focus-visible:block"
    >
      {children}
    </span>
  );
}

function TableView({ caption, head, rows }: { caption: string; head: [string, string, string?]; rows: (string | number)[][] }) {
  return (
    <details className="text-sm">
      <summary className="cursor-pointer text-muted-foreground hover:text-foreground">Show as table</summary>
      <table className="mt-2 w-full text-left">
        <caption className="sr-only">{caption}</caption>
        <thead className="text-xs text-muted-foreground">
          <tr>
            {head.filter(Boolean).map((h, i) => (
              <th key={h} className={cn("py-1 font-medium", i > 0 && "text-right")}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="tabular-nums">
          {rows.map((r) => (
            <tr key={String(r[0])} className="border-t border-border/60">
              {r.map((cell, i) => (
                <td key={i} className={cn("py-1", i > 0 && "text-right")}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  );
}

/** Horizontal bars, largest first: magnitude across named categories. */
export function BarList({
  title,
  rows,
  valueLabel,
  min = 0,
}: {
  title: string;
  rows: Row[];
  valueLabel: string;
  /** Baseline value; keep 0 unless the axis is labelled as truncated. */
  min?: number;
}) {
  const max = Math.max(...rows.map((r) => r.value));
  return (
    <figure className="space-y-3">
      <ul className="space-y-1.5" aria-label={title}>
        {rows.map((r) => (
          <li key={r.label} className="grid grid-cols-[minmax(7rem,11rem)_1fr] items-center gap-3 text-sm">
            <span className="truncate text-muted-foreground" title={r.label}>
              {r.label}
            </span>
            <span className="flex items-center gap-2">
              <span
                tabIndex={0}
                aria-label={`${r.label}: ${r.display}${r.detail ? `, ${r.detail}` : ""}`}
                className="group relative block h-5 max-h-6 rounded-r-[4px] outline-none focus-visible:ring-2 focus-visible:ring-ring"
                style={{ width: `${Math.max(1.5, ((r.value - min) / (max - min)) * 100) * 0.85}%` }}
              >
                <span className={cn("block size-full rounded-r-[4px]", r.highlight === false ? "bg-muted-foreground/35" : "bg-primary")} />
                <Tooltip>
                  {r.label}: <strong>{r.display}</strong>
                  {r.detail && <span className="text-muted-foreground"> · {r.detail}</span>}
                </Tooltip>
              </span>
              <span className="shrink-0 font-medium tabular-nums">{r.display}</span>
            </span>
          </li>
        ))}
      </ul>
      <TableView
        caption={title}
        head={["", valueLabel, rows.some((r) => r.detail) ? "Notes" : undefined]}
        rows={rows.map((r) => [r.label, r.display, ...(r.detail ? [r.detail] : [])])}
      />
    </figure>
  );
}

/** Vertical columns along an ordered axis (salary bands, months). */
export function Columns({
  title,
  bars,
  valueLabel,
  axisEvery = 1,
}: {
  title: string;
  bars: { label: string; short: string; value: number; display: string }[];
  valueLabel: string;
  /** Label every nth column on the axis so labels never collide. */
  axisEvery?: number;
}) {
  const max = Math.max(...bars.map((b) => b.value), 1);
  const peak = bars.findIndex((b) => b.value === max);
  return (
    <figure className="space-y-3">
      <div className="relative">
        <div className="flex h-44 items-end gap-0.5 border-b border-border" aria-label={title} role="list">
          {bars.map((b, i) => (
            <div key={b.label} role="listitem" className="flex h-full flex-1 flex-col items-center justify-end">
              {i === peak && <span className="mb-1 text-xs font-medium whitespace-nowrap tabular-nums">{b.display}</span>}
              <span
                tabIndex={0}
                aria-label={`${b.label}: ${b.display}`}
                className="group relative block w-full max-w-6 rounded-t-[4px] bg-primary outline-none focus-visible:ring-2 focus-visible:ring-ring"
                style={{ height: `${(b.value / max) * 80}%`, minHeight: b.value ? 2 : 0 }}
              >
                <Tooltip>
                  {b.label}: <strong>{b.display}</strong>
                </Tooltip>
              </span>
            </div>
          ))}
        </div>
        <div className="mt-1.5 flex gap-0.5 text-[11px] text-muted-foreground tabular-nums">
          {bars.map((b, i) => (
            <span key={b.label} className="flex-1 text-center">
              {i % axisEvery === 0 ? b.short : ""}
            </span>
          ))}
        </div>
      </div>
      <TableView caption={title} head={["", valueLabel]} rows={bars.map((b) => [b.label, b.display])} />
    </figure>
  );
}

export function Stat({ label, value, note }: { label: string; value: React.ReactNode; note?: React.ReactNode }) {
  return (
    <div className="space-y-1 rounded-xl border bg-card p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-semibold tracking-tight">{value}</p>
      {note && <p className="text-xs text-muted-foreground">{note}</p>}
    </div>
  );
}
