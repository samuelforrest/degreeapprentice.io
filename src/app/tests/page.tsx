import { ArrowRightIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { BestScore } from "@/components/tests/best-score";
import { CATEGORIES, formatTimeLimit, TESTS } from "@/lib/tests";
import { PageHeader, PageShell } from "@/components/site/page-header";

export const metadata: Metadata = {
  title: "Free practice tests",
  description:
    "Free situational judgement, numerical, verbal and logical reasoning practice tests for degree apprenticeship applications. No sign-up.",
  alternates: { canonical: "/tests" },
};

export default function TestsPage() {
  return (
    <PageShell>
      <PageHeader
        title="Practice tests"
        description="Most degree apprenticeship applications include online assessments. Practise the formats employers use, with a full explanation for every answer. Free, no sign-up, and your scores stay in your browser."
      />

      {CATEGORIES.map((category) => {
        const tests = TESTS.filter((t) => t.category === category.id);
        return (
          <section key={category.id} aria-labelledby={category.id} className="space-y-4">
            <div className="mx-auto max-w-2xl space-y-1 text-center">
              <h2 id={category.id} className="text-xl font-semibold tracking-tight">
                {category.label}
              </h2>
              <p className="text-sm text-muted-foreground">{category.description}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {tests.map((t) => (
                <Link
                  key={t.slug}
                  href={`/tests/${t.slug}`}
                  className="group flex flex-col gap-3 rounded-xl border bg-card p-5 transition-colors hover:border-foreground/15 hover:bg-muted/40"
                >
                  <div className="space-y-1">
                    <h3 className="font-semibold leading-snug transition-colors group-hover:text-primary">{t.title}</h3>
                    <p className="text-sm text-muted-foreground">{t.description}</p>
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-2 text-xs text-muted-foreground">
                    <span>
                      {t.questions.length} questions · {formatTimeLimit(t.timeLimit)}
                    </span>
                    <BestScore slug={t.slug} />
                    <ArrowRightIcon className="size-4 shrink-0 transition-colors group-hover:text-primary" aria-hidden />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      <p className="mx-auto max-w-2xl text-center text-sm text-muted-foreground">
        All questions are original and written to mirror common assessment formats. They aren&apos;t taken from, or
        endorsed by, any test publisher or employer. Real tests vary, so check what each employer uses.
      </p>
    </PageShell>
  );
}
