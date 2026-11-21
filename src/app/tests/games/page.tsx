import { ChevronRightIcon, PlayIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader, PageShell } from "@/components/site/page-header";
import { BestScore } from "@/components/tests/best-score";
import { Button } from "@/components/ui/button";
import { FULL_RUN, GAMES, progressKey, type GameKind } from "@/lib/games";

export const metadata: Metadata = {
  title: "Game-based assessment practice",
  description:
    "Free practice for game-based assessments like Arctic Shores: balloon risk, arrows, tile sequence, faces, code lock, tickets and more. No sign-up.",
  alternates: { canonical: "/tests/games" },
};

const GROUPS: { kind: GameKind; label: string; description: string }[] = [
  {
    kind: "cognitive",
    label: "Tasks with right answers",
    description: "Memory, attention, speed and reasoning. Practice genuinely helps here, so these keep a best score.",
  },
  {
    kind: "behavioural",
    label: "Tasks about how you play",
    description: "No right answers: these show your approach to risk, learning and cooperation. Practise so nothing surprises you, then play naturally.",
  },
];

export default function GamesPage() {
  return (
    <PageShell>
      <PageHeader
        title="Game-based assessments"
        description="Some employers send short browser games instead of (or as well as) traditional tests. Arctic Shores is the best-known provider. Practise every common task type here, one at a time or as a full run."
        actions={
          <Button size="lg" nativeButton={false} render={<Link href="/tests/games/full" />}>
            <PlayIcon data-icon="inline-start" /> Full assessment ({FULL_RUN.length} tasks)
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        {GROUPS.map((group) => (
          <section key={group.kind} aria-labelledby={group.kind} className="flex min-w-0 flex-col gap-4 rounded-xl border bg-card p-5 md:p-6">
            <div className="space-y-1">
              <h2 id={group.kind} className="text-lg font-semibold tracking-tight">
                {group.label}
              </h2>
              <p className="text-sm text-muted-foreground">{group.description}</p>
            </div>
            <ul className="-mx-2 divide-y divide-border/60">
              {GAMES.filter((g) => g.kind === group.kind).map((g) => (
                <li key={g.slug}>
                  <Link
                    href={g.href ?? `/tests/games/${g.slug}`}
                    className="group flex items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium transition-colors group-hover:text-primary">{g.title}</p>
                      <p className="text-sm text-muted-foreground">{g.description}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-0.5 text-xs text-muted-foreground tabular-nums">
                      <span>{g.minutes} min</span>
                      {!g.href && <BestScore slug={progressKey(g.slug)} />}
                    </div>
                    <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="mx-auto max-w-2xl space-y-2 text-center text-sm text-muted-foreground">
        <p>
          Real assessments don&apos;t have a pass mark. Your play is turned into a profile of traits and compared with people who do well in the
          role, so there&apos;s no &quot;perfect&quot; way to play the behavioural tasks.
        </p>
        <p>
          These are original practice versions of the well-known psychology tasks that game-based assessments build on. They aren&apos;t made by,
          taken from or endorsed by Arctic Shores or any other provider, and the real games look and score differently. If your invitation
          includes an official practice level, play that too.
        </p>
      </div>
    </PageShell>
  );
}
