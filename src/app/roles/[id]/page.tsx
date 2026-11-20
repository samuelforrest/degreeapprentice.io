import { ExternalLinkIcon, FlagIcon, PencilIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Markdown } from "@/components/markdown";
import { CompanyLogo } from "@/components/apprenticeships/company-logo";
import { DeadlineBadge } from "@/components/apprenticeships/deadline-badge";
import { ApprenticeshipCard } from "@/components/apprenticeships/apprenticeship-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { githubEditUrl, githubNewIssueUrl, site } from "@/config/site";
import { formatDate, formatSalary } from "@/lib/format";
import { getApprenticeships, getApprenticeship, toSummary } from "@/lib/apprenticeships";
import type { Apprenticeship } from "@/lib/types";

// Anything not pre-rendered is a real 404, not a soft one.
export const dynamicParams = false;

export function generateStaticParams() {
  return getApprenticeships().map((o) => ({ id: o.id }));
}

export async function generateMetadata({ params }: PageProps<"/roles/[id]">): Promise<Metadata> {
  const o = getApprenticeship((await params).id);
  if (!o) return {};
  const bits = [
    o.salary !== null ? formatSalary(o.salary, o.salaryMax) : null,
    o.locations.length ? o.locations.slice(0, 3).join(", ") : null,
    o.closes ? `closes ${formatDate(o.closes)}` : null,
  ].filter(Boolean);
  return {
    title: `${o.title} at ${o.company}`,
    description: `Level ${o.level} degree apprenticeship at ${o.company}${bits.length ? `: ${bits.join(" · ")}` : ""}. Free on ${site.name}.`,
    alternates: { canonical: `/roles/${o.id}` },
  };
}

// schema.org JobPosting, only emitted when we have enough for it to be valid.
function jobPostingJsonLd(o: Apprenticeship) {
  const datePosted = o.opens ?? o.lastVerified;
  if (!o.description || !datePosted || o.locations.length === 0) return null;
  const json = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: o.title,
    description: o.description,
    datePosted,
    ...(o.closes && { validThrough: `${o.closes}T23:59:59Z` }),
    employmentType: "FULL_TIME",
    hiringOrganization: { "@type": "Organization", name: o.company, ...(o.companyWebsite && { sameAs: o.companyWebsite }) },
    jobLocation: o.locations.map((l) => ({
      "@type": "Place",
      address: { "@type": "PostalAddress", addressLocality: l, addressCountry: "GB" },
    })),
    ...(o.salary !== null && {
      baseSalary: {
        "@type": "MonetaryAmount",
        currency: "GBP",
        value: { "@type": "QuantitativeValue", minValue: o.salary, maxValue: o.salaryMax ?? o.salary, unitText: "YEAR" },
      },
    }),
    directApply: false,
  };
  // Escape "<" so a description can never close the script tag.
  return JSON.stringify(json).replace(/</g, "\\u003c");
}

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-0.5">
      <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</dt>
      <dd className="text-sm">{children}</dd>
    </div>
  );
}

const WORK_PATTERN = { "on-site": "On-site", hybrid: "Hybrid", remote: "Remote" } as const;

export default async function ApprenticeshipPage({ params }: PageProps<"/roles/[id]">) {
  const o = getApprenticeship((await params).id);
  if (!o) notFound();

  const jsonLd = jobPostingJsonLd(o);
  const moreFromCompany = getApprenticeships()
    .filter((x) => x.company === o.company && x.id !== o.id)
    .slice(0, 3)
    .map(toSummary);

  return (
    <div className="space-y-10">
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />}

      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <Link href="/roles" className="hover:text-foreground">Degree apprenticeships</Link>
        {" / "}
        <Link href={`/roles?level=${o.level}`} className="hover:text-foreground">Level {o.level}</Link>
      </nav>

      <header className="flex flex-col gap-5 md:flex-row md:items-start">
        <CompanyLogo src={o.logoUrl} name={o.company} size="lg" />
        <div className="min-w-0 flex-1 space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-balance md:text-3xl">{o.title}</h1>
          <p className="text-muted-foreground">
            {o.company}
          </p>
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="secondary">Level {o.level}</Badge>
            {o.sectors.map((s) => (
              <Badge key={s} variant="outline">{s}</Badge>
            ))}
            <DeadlineBadge opens={o.opens} closes={o.closes} rolling={o.rolling} />
          </div>
        </div>
        <div className="flex gap-2">
          <Button nativeButton={false} render={<a href={o.applyUrl} target="_blank" rel="noopener noreferrer" />}>
            Apply on {o.company}&apos;s site
            <ExternalLinkIcon />
          </Button>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        <div className="space-y-8">
          <dl className="grid gap-5 rounded-2xl border p-5 sm:grid-cols-2 lg:grid-cols-3">
            <Fact label="Salary">
              {formatSalary(o.salary, o.salaryMax)}
              {o.salaryNote && <span className="block text-muted-foreground">{o.salaryNote}</span>}
            </Fact>
            <Fact label="Locations">
              {o.locations.length ? o.locations.join(", ") : "Not published"}
              {o.workPattern && <span className="block text-muted-foreground">{WORK_PATTERN[o.workPattern]}</span>}
            </Fact>
            <Fact label="Applications close">
              {o.closes ? formatDate(o.closes) : o.rolling ? "Rolling" : "Not published"}
              {o.rolling && o.closes && <span className="block text-muted-foreground">May close early</span>}
            </Fact>
            <Fact label="Applications open">{formatDate(o.opens)}</Fact>
            <Fact label="Start date">{formatDate(o.starts)}</Fact>
            <Fact label="Duration">{o.duration ?? "Not published"}</Fact>
            {o.eligibility && <Fact label="Who can apply">{o.eligibility}</Fact>}
            {o.qualification && <Fact label="Qualification">{o.qualification}</Fact>}
            {o.trainingProvider && <Fact label="Training provider">{o.trainingProvider}</Fact>}
            {o.visaSponsorship !== null && (
              <Fact label="Visa sponsorship">{o.visaSponsorship ? "Available" : "Not available"}</Fact>
            )}
          </dl>

          <section aria-labelledby="about-role" className="space-y-3">
            <h2 id="about-role" className="text-lg font-semibold">About the role</h2>
            {o.description ? (
              <Markdown>{o.description}</Markdown>
            ) : (
              <p className="text-sm text-muted-foreground">
                No description yet.{" "}
                <a href={githubEditUrl(o.file)} target="_blank" rel="noopener noreferrer" className="underline">
                  Add one from the employer&apos;s page
                </a>
                .
              </p>
            )}
          </section>
        </div>

        <aside className="space-y-4">
          <div className="space-y-3 rounded-2xl border p-5 text-sm">
            <h2 className="font-semibold">Source and accuracy</h2>
            <p className="text-muted-foreground">
              {o.lastVerified ? (
                <>Last checked against the employer&apos;s site on <strong className="text-foreground">{formatDate(o.lastVerified)}</strong>.</>
              ) : (
                <>These details haven&apos;t been verified yet.</>
              )}{" "}
              Always confirm dates and eligibility on the official page before applying.
            </p>
            <a href={o.sourceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-primary">
              <ExternalLinkIcon className="size-4" /> Official source
            </a>
            <a href={githubEditUrl(o.file)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-primary">
              <PencilIcon className="size-4" /> Edit this listing
            </a>
            <a
              href={githubNewIssueUrl("report-problem.yml", `Problem with ${o.id}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-primary"
            >
              <FlagIcon className="size-4" /> Report a problem
            </a>
          </div>
        </aside>
      </div>

      {moreFromCompany.length > 0 && (
        <section aria-labelledby="more" className="space-y-4">
          <h2 id="more" className="text-lg font-semibold">More from {o.company}</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {moreFromCompany.map((x) => (
              <ApprenticeshipCard key={x.id} apprenticeship={x} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
