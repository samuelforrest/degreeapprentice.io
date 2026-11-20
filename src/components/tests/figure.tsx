import type { Figure as FigureData, FigureItem } from "@/lib/tests/types";
import { cn } from "@/lib/utils";

const CELL = 24;
const SIZE = CELL * 3;

function ShapeMark({ item }: { item: FigureItem }) {
  const cx = (item.cell % 3) * CELL + CELL / 2;
  const cy = Math.floor(item.cell / 3) * CELL + CELL / 2;
  const r = 7;
  const paint = { fill: item.filled ? "currentColor" : "none", stroke: "currentColor", strokeWidth: 1.75, strokeLinejoin: "round" as const };
  const transform = item.rotate ? `rotate(${item.rotate} ${cx} ${cy})` : undefined;

  switch (item.shape) {
    case "circle":
      return <circle cx={cx} cy={cy} r={r} {...paint} />;
    case "square":
      return <rect x={cx - r + 0.5} y={cy - r + 0.5} width={2 * r - 1} height={2 * r - 1} {...paint} transform={transform} />;
    case "triangle":
      return <polygon points={`${cx},${cy - r} ${cx + r},${cy + r - 1} ${cx - r},${cy + r - 1}`} {...paint} transform={transform} />;
    case "diamond":
      return <polygon points={`${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`} {...paint} transform={transform} />;
    case "arrow":
      return (
        <polygon
          points={`${cx},${cy - 8} ${cx + 6},${cy - 1} ${cx + 2.5},${cy - 1} ${cx + 2.5},${cy + 8} ${cx - 2.5},${cy + 8} ${cx - 2.5},${cy - 1} ${cx - 6},${cy - 1}`}
          {...paint}
          transform={transform}
        />
      );
  }
}

/** A 3×3 reasoning figure drawn as SVG. */
export function Figure({ figure, label, className }: { figure: FigureData; label: string; className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      role="img"
      aria-label={label}
      className={cn("size-16 shrink-0 rounded-md border bg-background text-foreground sm:size-20", className)}
    >
      {[1, 2].map((i) => (
        <g key={i} className="text-border" stroke="currentColor" strokeWidth={0.5} strokeDasharray="1.5 2">
          <line x1={i * CELL} y1={2} x2={i * CELL} y2={SIZE - 2} />
          <line x1={2} y1={i * CELL} x2={SIZE - 2} y2={i * CELL} />
        </g>
      ))}
      {figure.map((item, i) => (
        <ShapeMark key={i} item={item} />
      ))}
    </svg>
  );
}
