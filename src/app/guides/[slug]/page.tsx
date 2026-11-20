import { ArrowLeftIcon, PencilIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { GuideCard } from "@/components/guides/guide-card";
import { Markdown } from "@/components/markdown";
import { Badge } from "@/components/ui/badge";
import { githubEditUrl, site } from "@/config/site";
import { formatDate } from "@/lib/format";
import { GUIDE_TYPES, getGuide, getGuides } from "@/lib/guides";

// Anything not pre-rendered is a real 404, not a soft one.
export const dynamicParams = false;

export function generateStaticParams() {
  return getGuides().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps<"/guides/[slug]">): Promise<Metadata> {
  const guide = getGuide((await params).slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: { type: "article", title: guide.title, description: guide.description, publishedTime: guide.published },
  };
}

export default async function GuidePage({ params }: PageProps<"/guides/[slug]">) {
  const guide = getGuide((await params).slug);
  if (!guide) notFound();

  // Same type first, then the rest, so readers keep finding related material.
  const more = getGuides()
    .filter((g) => g.slug !== guide.slug)
    .sort((a, b) => Number(b.type === guide.type) - Number(a.type === guide.type))
    .slice(0, 3);

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    datePublished: guide.published,
    ...(guide.updated && { dateModified: guide.updated }),
    publisher: { "@type": "Organization", name: site.name, url: site.url },
  }).replace(/</g, "\\u003c");

  return (
    <div className="space-y-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <article className="mx-auto max-w-2xl space-y-8">
        <header className="space-y-4">
          <Link href="/guides" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeftIcon className="size-3.5" aria-hidden /> All guides
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight text-balance md:text-4xl">{guide.title}</h1>
          <p className="text-lg text-muted-foreground">{guide.description}</p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-muted-foreground">
            <Badge variant="secondary">{GUIDE_TYPES[guide.type].label}</Badge>
            <span>{formatDate(guide.updated ?? guide.published)}</span>
            {guide.updated && <span>(updated)</span>}
            <span aria-hidden>·</span>
            <span>{guide.readingMinutes} min read</span>
          </div>
        </header>

        <Markdown
          className={
            "text-base leading-7 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:tracking-tight [&_h3]:mt-6 [&_h3]:text-base " +
            "[&_blockquote]:my-4 [&_blockquote]:border-primary/60 [&_blockquote]:italic [&_li]:pl-1 [&_ol]:space-y-2 [&_ul]:space-y-2"
          }
        >
          {guide.body}
        </Markdown>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t pt-6 text-sm text-muted-foreground">
          <span>Spotted something out of date or wrong?</span>
          <a
            href={githubEditUrl(guide.file)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-primary"
          >
            <PencilIcon className="size-3.5" aria-hidden /> Edit this guide on GitHub
          </a>
        </footer>
      </article>

      {more.length > 0 && (
        <section aria-labelledby="more-guides" className="space-y-4">
          <h2 id="more-guides" className="text-xl font-semibold tracking-tight">
            Keep reading
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((g) => (
              <GuideCard key={g.slug} guide={g} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
