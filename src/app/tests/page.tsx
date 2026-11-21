import { BookOpenTextIcon, ChartColumnIcon, ChevronRightIcon, CompassIcon, Gamepad2Icon, PuzzleIcon, type LucideIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader, PageShell } from "@/components/site/page-header";
import { BestScore } from "@/components/tests/best-score";
import { PLAYABLE } from "@/lib/games";
import { CATEGORIES, shortTitle, TESTS } from "@/lib/tests";
import type { TestCategory } from "@/lib/tests/types";

export const metadata: Metadata = {
  title: "Free practice tests",
  description:
    "Free situational judgement, numerical, verbal and logical reasoning practice tests for degree apprenticeship applications. No sign-up.",
  alternates: { canonical: "/tests" },
};

const ICONS: Record<TestCategory, LucideIcon> = {
  situational: CompassIcon,
  numerical: ChartColumnIcon,
  verbal: BookOpenTextIcon,
  logical: PuzzleIcon,
};

export default function TestsPage() {
  return (
    <PageShell>
      <PageHeader
        title="Practice tests"
        description="Most degree apprenticeship applications include online assessments. Practise the formats employers use, with a full explanation for every answer. Free, no sign-up, and your scores stay in your browser."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {CATEGORIES.map((category) => {
          const Icon = ICONS[category.id];
          const tests = TESTS.filter((t) => t.category === category.id);
          return (
            <section
              key={category.id}
              aria-labelledby={category.id}
              className="flex min-w-0 flex-col gap-4 rounded-xl border bg-card p-5 md:p-6"
            >
              <div className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-muted/50 text-primary">
                  <Icon className="size-[18px]" aria-hidden />
                </span>
                <div className="space-y-1">
                  <h2 id={category.id} className="text-lg font-semibold tracking-tight">
                    {category.label}
                  </h2>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
              </div>

              <ul className="-mx-2 divide-y divide-border/60">
                {tests.map((t) => (
                  <li key={t.slug}>
                    <Link
                      href={`/tests/${t.slug}`}
                      className="group flex items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-muted/50"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium transition-colors group-hover:text-primary">{shortTitle(t.title)}</p>
                        <p className="text-sm text-muted-foreground">{t.description}</p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-0.5 text-xs text-muted-foreground tabular-nums">
                        <span>
                          {t.questions.length} Qs · {Math.round(t.timeLimit / 60)} min
                        </span>
                        <BestScore slug={t.slug} />
                      </div>
                      <ChevronRightIcon
                        className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
                        aria-hidden
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <Link
        href="/tests/games"
        className="group flex items-center gap-4 rounded-xl border bg-card p-5 transition-colors hover:bg-muted/50 md:p-6"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-muted/50 text-primary">
          <Gamepad2Icon className="size-[18px]" aria-hidden />
        </span>
        <div className="min-w-0 flex-1 space-y-1">
          <h2 className="text-lg font-semibold tracking-tight transition-colors group-hover:text-primary">Game-based assessments</h2>
          <p className="text-sm text-muted-foreground">
            {PLAYABLE.length} practice games for assessments like Arctic Shores: risk, memory, attention, emotion recognition and reasoning,
            one at a time or as a full run.
          </p>
        </div>
        <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" aria-hidden />
      </Link>

      <p className="mx-auto max-w-2xl text-center text-sm text-muted-foreground">
        All questions are original and written to mirror common assessment formats. They aren&apos;t taken from, or
        endorsed by, any test publisher or employer. Real tests vary, so check what each employer uses.
      </p>
    </PageShell>
  );
}
