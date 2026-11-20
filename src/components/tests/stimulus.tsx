import type { Stimulus as StimulusData } from "@/lib/tests/types";

/** The data table or passage that a group of questions refers to. */
export function Stimulus({ stimulus }: { stimulus: StimulusData }) {
  return (
    <figure className="space-y-3 rounded-xl border bg-card p-4">
      <figcaption className="text-sm font-semibold">{stimulus.title}</figcaption>
      {stimulus.kind === "passage" ? (
        <p className="text-[15px] leading-relaxed text-foreground/90">{stimulus.text}</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm tabular-nums">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  {stimulus.columns.map((c, i) => (
                    <th key={c} scope="col" className={i === 0 ? "py-2 pr-4 font-medium" : "px-3 py-2 text-right font-medium"}>
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stimulus.rows.map((row) => (
                  <tr key={String(row[0])} className="border-b last:border-0">
                    {row.map((cell, i) =>
                      i === 0 ? (
                        <th key={i} scope="row" className="py-2 pr-4 text-left font-medium">
                          {cell}
                        </th>
                      ) : (
                        <td key={i} className="px-3 py-2 text-right">
                          {typeof cell === "number" ? cell.toLocaleString("en-GB") : cell}
                        </td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {stimulus.note && <p className="text-xs text-muted-foreground">{stimulus.note}</p>}
        </>
      )}
    </figure>
  );
}
