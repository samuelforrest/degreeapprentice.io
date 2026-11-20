import type { Metadata } from "next";

import { GuideCard } from "@/components/guides/guide-card";
import { Button } from "@/components/ui/button";
import { githubNewIssueUrl } from "@/config/site";
import { GUIDE_TYPES, getGuides, type GuideType } from "@/lib/guides";
import { PageHeader, PageShell } from "@/components/site/page-header";

export const metadata: Metadata = {
  title: "Guides and articles",
  description:
    "Free, practical guides to applying for degree apprenticeships: timelines, online tests, interviews, assessment centres and more.",
  alternates: { canonical: "/guides" },
};

export default function GuidesPage() {
  const guides = getGuides();
  const featured = guides.find((g) => g.featured);
  const rest = guides.filter((g) => g !== featured);

  return (
    <PageShell>
      <PageHeader
        title="Guides"
        description="Practical help with every stage of getting a degree apprenticeship, from choosing a route to your first assessment centre. Written and improved by the community."
      />

      {featured && <GuideCard guide={featured} featured />}

      {(Object.keys(GUIDE_TYPES) as GuideType[]).map((type) => {
        const items = rest.filter((g) => g.type === type);
        if (!items.length) return null;
        return (
          <section key={type} aria-labelledby={`type-${type}`} className="space-y-4">
            <div className="mx-auto max-w-2xl space-y-1 text-center">
              <h2 id={`type-${type}`} className="text-xl font-semibold tracking-tight">
                {GUIDE_TYPES[type].plural}
              </h2>
              <p className="text-sm text-muted-foreground">{GUIDE_TYPES[type].description}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((g) => (
                <GuideCard key={g.slug} guide={g} />
              ))}
            </div>
          </section>
        );
      })}

      <section className="space-y-3 rounded-xl border bg-card p-6 text-center">
        <h2 className="text-lg font-semibold tracking-tight">Want to write a guide?</h2>
        <p className="mx-auto max-w-xl text-sm text-muted-foreground">
          Every guide is a Markdown file on GitHub. If you&apos;re an apprentice, or have been through the process,
          suggest a topic or add your own.
        </p>
        <Button
          variant="outline"
          nativeButton={false}
          render={<a href={githubNewIssueUrl("suggest-guide.yml")} target="_blank" rel="noopener noreferrer" />}
        >
          Suggest a guide
        </Button>
      </section>
    </PageShell>
  );
}
