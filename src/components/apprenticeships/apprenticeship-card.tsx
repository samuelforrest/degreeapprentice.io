import { BanknoteIcon, CalendarIcon, MapPinIcon } from "lucide-react";
import Link from "next/link";

import { CompanyLogo } from "@/components/apprenticeships/company-logo";
import { DeadlineBadge } from "@/components/apprenticeships/deadline-badge";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatLocations, formatSalary } from "@/lib/format";
import type { ApprenticeshipSummary } from "@/lib/types";

export function ApprenticeshipCard({ apprenticeship: o }: { apprenticeship: ApprenticeshipSummary }) {
  const href = `/apprenticeships/${o.id}`;
  return (
    <article className="group relative flex flex-col gap-4 rounded-xl border bg-card p-5 transition-colors hover:border-foreground/15 hover:bg-muted/40">
      <div className="flex items-start gap-3">
        <CompanyLogo src={o.logoUrl} name={o.company} />
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 leading-snug font-semibold">
            {/* Stretched link: the whole card is clickable. */}
            <Link href={href} className="after:absolute after:inset-0 after:rounded-xl group-hover:underline">
              {o.title}
            </Link>
          </h3>
          <p className="text-sm text-muted-foreground">{o.company}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Badge variant="secondary">Level {o.level}</Badge>
        <DeadlineBadge opens={o.opens} closes={o.closes} rolling={o.rolling} />
      </div>

      <dl className="grid gap-1.5 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <BanknoteIcon className="size-4 shrink-0" aria-hidden />
          <dt className="sr-only">Salary</dt>
          <dd>{formatSalary(o.salary, o.salaryMax, "Salary not published")}</dd>
        </div>
        <div className="flex items-center gap-2">
          <CalendarIcon className="size-4 shrink-0" aria-hidden />
          <dt className="sr-only">Closing date</dt>
          <dd>{o.closes ? `Closes ${formatDate(o.closes)}` : o.rolling ? "Rolling deadline" : "Deadline not published"}</dd>
        </div>
        <div className="flex items-center gap-2">
          <MapPinIcon className="size-4 shrink-0" aria-hidden />
          <dt className="sr-only">Locations</dt>
          <dd className="truncate">{formatLocations(o.locations, 2, "Location not published")}</dd>
        </div>
      </dl>
    </article>
  );
}
