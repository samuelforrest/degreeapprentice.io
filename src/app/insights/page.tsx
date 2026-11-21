import type { Metadata } from "next";
import Link from "next/link";

import { BarList, Columns, Stat } from "@/components/insights/charts";
import { PageHeader, PageShell } from "@/components/site/page-header";
import { formatDate, formatSalary } from "@/lib/format";
import { CONTEXT, getInsights, SOURCES, type SourceId } from "@/lib/insights";

export const metadata: Metadata = {
  title: "Degree apprenticeship salaries and trends",
  description:
    "What UK degree apprenticeships pay, by sector and level, where the roles are and when applications close, from every live listing, alongside official national figures.",
  alternates: { canonical: "/insights" },
};

const k = (n: number) => `£${Math.round(n / 1000)}k`;
const MONTH = new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric", timeZone: "UTC" });
const MONTH_SHORT = new Intl.DateTimeFormat("en-GB", { month: "short", timeZone: "UTC" });

/** A footnote marker linking to the source list at the bottom of the page. */
function Cite({ id }: { id: SourceId }) {
  const n = SOURCES.findIndex((s) => s.id === id) + 1;
  return (
    <sup className="ml-0.5 text-[0.7em]">
      <a href={`#source-${id}`} className="text-primary hover:underline" aria-label={`Source ${n}`}>
        [{n}]
      </a>
    </sup>
  );
}

function Section({ id, title, intro, children }: { id: string; title: string; intro?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="space-y-4 rounded-xl border bg-card p-5 md:p-6">
      <div className="space-y-1">
        <h2 id={id} className="text-lg font-semibold tracking-tight">
          {title}
        </h2>
        {intro && <p className="text-sm text-muted-foreground">{intro}</p>}
      </div>
      {children}
    </section>
  );
}

export default function InsightsPage() {
  const d = getInsights();
  const minimumWage = Math.round(CONTEXT.apprenticeRate * CONTEXT.weeklyHours * 52);
  const growth = ((CONTEXT.starts.total - CONTEXT.starts.previous) / CONTEXT.starts.previous) * 100;
  const salaryShare = Math.round((d.salaried / d.total) * 100);
  // Below the full-time equivalent usually means fewer hours (e.g. 30 a week), not illegal pay.
  const busiest = [...d.closing].sort((a, b) => b[1] - a[1])[0];
  const belowFullTime = d.salaries.filter((s) => s < minimumWage).length;

  return (
    <PageShell>
      <PageHeader
        title="Salaries and trends"
        description={
          <>
            What degree apprenticeships pay, where they are and when they close, calculated from all {d.total} listings in the directory
            {d.lastVerified && <> (last checked {formatDate(d.lastVerified)})</>}, alongside official national figures.
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Median advertised salary" value={formatSalary(d.salary.median)} note={`From the ${d.salaried} listings that publish pay`} />
        <Stat label="Salary range" value={`${k(d.salary.min)} to ${k(d.salary.max)}`} note="Lowest to highest starting salary listed" />
        <Stat label="Listings" value={d.total} note={`${d.levels[6]} at Level 6, ${d.levels[7]} at Level 7`} />
        <Stat label="Employers" value={d.employerCount} note={`${salaryShare}% of listings publish a salary`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Section
          id="pay-compared"
          title="How the pay compares"
          intro="Median starting salaries: degree apprenticeships in this directory against national benchmarks, and the full-time apprentice minimum wage."
        >
          <BarList
            title="Starting salaries compared"
            valueLabel="Salary"
            rows={[
              { label: "Graduate", value: CONTEXT.graduateMedian, display: formatSalary(CONTEXT.graduateMedian), detail: "ISE 2025", highlight: false },
              { label: "Degree apprentice", value: d.salary.median, display: formatSalary(d.salary.median), detail: `${d.salaried} listings` },
              { label: "School leaver", value: CONTEXT.schoolLeaverMedian, display: formatSalary(CONTEXT.schoolLeaverMedian), detail: "ISE 2025", highlight: false },
              { label: "Apprentice minimum", value: minimumWage, display: formatSalary(minimumWage), detail: `£${CONTEXT.apprenticeRate.toFixed(2)}/hr × ${CONTEXT.weeklyHours} hrs`, highlight: false },
            ]}
          />
          <p className="text-sm text-muted-foreground">
            Large graduate employers paid a median starting salary of {formatSalary(CONTEXT.graduateMedian)} in 2025, and{" "}
            {formatSalary(CONTEXT.schoolLeaverMedian)} for school and college leavers
            <Cite id="the" />. Degree apprenticeships here sit close to the school-leaver figure, but come with no tuition fees: the employer
            and government pay for the degree
            <Cite id="nofees" />, where university fees in England are {formatSalary(CONTEXT.feeCap2026)} a year in 2026/27, rising to{" "}
            {formatSalary(CONTEXT.feeCap2027)} in 2027/28
            <Cite id="fees" />. The legal minimum for apprentices is £{CONTEXT.apprenticeRate.toFixed(2)} an hour from April 2026
            <Cite id="nmw" />.{" "}
            {belowFullTime === 0
              ? "Every salary in this directory is above the full-time equivalent."
              : `${belowFullTime} ${belowFullTime === 1 ? "listing pays" : "listings pay"} less than the full-time equivalent, usually because of fewer weekly hours.`}
          </p>
        </Section>

        <Section id="distribution" title="Advertised starting salaries" intro={`How many listings offer each £2,000 band, from the ${d.salaried} that publish pay.`}>
          <Columns
            title="Listings by salary band"
            valueLabel="Listings"
            axisEvery={2}
            bars={d.bands.map((b) => ({
              label: `${formatSalary(b.from)} to ${formatSalary(b.to - 1)}`,
              short: k(b.from),
              value: b.count,
              display: `${b.count} ${b.count === 1 ? "listing" : "listings"}`,
            }))}
          />
        </Section>
      </div>

      <Section
        id="by-sector"
        title="Median salary by sector"
        intro={`Sectors with at least ${d.minSample} listings that publish pay. A listing can belong to more than one sector, and a few large employers post one listing per region, so medians can lean towards them.`}
      >
        <BarList
          title="Median advertised salary by sector"
          valueLabel="Median salary"
          rows={d.salarySectors.map((s) => ({
            label: s.sector,
            value: s.median!,
            display: formatSalary(s.median),
            detail: `${s.salaried} listings, ${s.employers} ${s.employers === 1 ? "employer" : "employers"}`,
          }))}
        />
      </Section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Section id="sectors" title="Roles by sector" intro="Number of listings in each sector.">
          <BarList
            title="Listings by sector"
            valueLabel="Listings"
            rows={d.sectors.map((s) => ({
              label: s.sector,
              value: s.count,
              display: String(s.count),
              detail: `${s.employers} ${s.employers === 1 ? "employer" : "employers"}`,
            }))}
          />
        </Section>

        <div className="space-y-4">
          <Section id="locations" title="Where the roles are" intro="The 12 locations with the most listings. Roles in several places count once per location.">
            <BarList
              title="Listings by location"
              valueLabel="Listings"
              rows={d.locations.map(([place, count]) => ({ label: place, value: count, display: String(count) }))}
            />
          </Section>

          <Section id="employers" title="Employers with the most listings" intro="Some employers post one listing per region or office.">
            <BarList
              title="Listings by employer"
              valueLabel="Listings"
              rows={d.topEmployers.map(([company, count]) => ({ label: company, value: count, display: String(count) }))}
            />
          </Section>
        </div>
      </div>

      <Section
        id="deadlines"
        title="When applications close"
        intro={
          <>
            Listings by closing month.
            {busiest && (
              <>
                {" "}
                The busiest is {MONTH.format(new Date(`${busiest[0]}-01T00:00:00Z`))}, with {busiest[1]} deadlines, so it pays to apply early.
              </>
            )}{" "}
            Browse them on the{" "}
            <Link href="/roles" className="text-primary hover:underline">
              roles page
            </Link>
            .
          </>
        }
      >
        <Columns
          title="Listings by closing month"
          valueLabel="Listings"
          bars={d.closing.map(([month, count]) => {
            const date = new Date(`${month}-01T00:00:00Z`);
            return { label: MONTH.format(date), short: MONTH_SHORT.format(date), value: count, display: `${count} ${count === 1 ? "listing" : "listings"}` };
          })}
        />
      </Section>

      <Section id="national" title="The national picture" intro="Official figures for England, beyond this directory.">
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat
            label="Level 6 and 7 starts, 2024/25"
            value={CONTEXT.starts.total.toLocaleString("en-GB")}
            note={<>Up {growth.toFixed(1)}% on the year before</>}
          />
          <Stat label="Share of all apprenticeship starts" value={`${CONTEXT.starts.shareOfAll}%`} note="Level 6 and 7 combined" />
          <Stat
            label="Split by level"
            value={`${(CONTEXT.starts.level6 / 1000).toFixed(1)}k / ${(CONTEXT.starts.level7 / 1000).toFixed(1)}k`}
            note="Level 6 (bachelor's) / Level 7 (master's)"
          />
        </div>
        <ul className="ml-5 list-disc space-y-2 text-[15px] leading-relaxed text-foreground/90">
          <li>
            Degree-level apprenticeships are growing fast: {CONTEXT.starts.total.toLocaleString("en-GB")} people started one at Level 6 or 7 in
            2024/25, {growth.toFixed(1)}% more than the year before
            <Cite id="dfe" />.
          </li>
          <li>
            Large employers are shifting hiring towards apprentices: in 2025 they cut graduate vacancies by 8% while increasing apprentice hiring
            <Cite id="ise" />.
          </li>
          <li>
            Level 7 (master&apos;s) apprenticeships changed in January 2026: government funding now only covers new apprentices aged 21 and under,
            with some exceptions up to 24, so most Level 7 roles are now aimed at school leavers or paid for in full by the employer
            <Cite id="l7" />. That&apos;s one reason Level 6 dominates this directory, with {d.levels[6]} of {d.total} listings.
          </li>
        </ul>
      </Section>

      <section aria-labelledby="method" className="mx-auto max-w-3xl space-y-4 text-sm text-muted-foreground">
        <h2 id="method" className="text-base font-semibold text-foreground">
          How these figures are made
        </h2>
        <p>
          Directory figures are recalculated every time the site is built, from the same listings you can browse. They count listings, not
          places: one listing can have several vacancies, and some employers list each region separately. Salaries are the advertised
          starting salary (the lower end where a range is given), and only {d.salaried} of {d.total} listings publish one. The full dataset is
          free to download as{" "}
          <a href="/roles.csv" className="text-primary hover:underline">
            CSV
          </a>{" "}
          or{" "}
          <a href="/roles.json" className="text-primary hover:underline">
            JSON
          </a>
          . The minimum-wage figure assumes a {CONTEXT.weeklyHours}-hour week for 52 weeks.
        </p>
        <h3 className="font-semibold text-foreground">Sources</h3>
        <ol className="ml-5 list-decimal space-y-1.5">
          {SOURCES.map((s) => (
            <li key={s.id} id={`source-${s.id}`} className="scroll-mt-20">
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                {s.title}
              </a>
              , {s.publisher}.
            </li>
          ))}
        </ol>
      </section>
    </PageShell>
  );
}
