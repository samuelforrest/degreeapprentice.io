// Statistics for /insights, computed from the listings at build time so they're
// always in step with the directory. External figures live in SOURCES with citations.
import "server-only";

import { getRoles } from "@/lib/roles";

const median = (xs: number[]) => {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : Math.round((s[mid - 1] + s[mid]) / 2);
};

const countBy = (keys: string[]) => {
  const out = new Map<string, number>();
  for (const k of keys) out.set(k, (out.get(k) ?? 0) + 1);
  return [...out.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
};

/** Sectors need at least this many salaried listings before we show a median for them. */
const MIN_SAMPLE = 5;
const BAND = 2000;

export function getInsights() {
  const roles = getRoles();
  const salaried = roles.filter((r) => r.salary !== null);
  const salaries = salaried.map((r) => r.salary!);

  const lo = Math.floor(Math.min(...salaries) / BAND) * BAND;
  const hi = Math.floor(Math.max(...salaries) / BAND) * BAND;
  const bands = [];
  for (let from = lo; from <= hi; from += BAND) {
    bands.push({ from, to: from + BAND, count: salaries.filter((s) => s >= from && s < from + BAND).length });
  }

  const sectors = countBy(roles.flatMap((r) => r.sectors)).map(([sector, count]) => {
    const inSector = roles.filter((r) => r.sectors.includes(sector as (typeof r.sectors)[number]));
    const pay = inSector.filter((r) => r.salary !== null).map((r) => r.salary!);
    return {
      sector,
      count,
      employers: new Set(inSector.map((r) => r.company)).size,
      salaried: pay.length,
      median: pay.length >= MIN_SAMPLE ? median(pay) : null,
    };
  });

  // Every month from the first deadline to the last, including empty ones, so the axis spacing is honest.
  const byMonth = new Map(countBy(roles.flatMap((r) => (r.closes ? [r.closes.slice(0, 7)] : []))));
  const months = [...byMonth.keys()].sort();
  const closing: [string, number][] = [];
  if (months.length) {
    for (let d = new Date(`${months[0]}-01T00:00:00Z`); d <= new Date(`${months.at(-1)}-01T00:00:00Z`); d.setUTCMonth(d.getUTCMonth() + 1)) {
      const key = d.toISOString().slice(0, 7);
      closing.push([key, byMonth.get(key) ?? 0]);
    }
  }

  const employers = countBy(roles.map((r) => r.company));

  return {
    total: roles.length,
    employerCount: employers.length,
    topEmployers: employers.slice(0, 8),
    levels: { 6: roles.filter((r) => r.level === 6).length, 7: roles.filter((r) => r.level === 7).length },
    salaried: salaried.length,
    salary: { median: median(salaries)!, min: Math.min(...salaries), max: Math.max(...salaries) },
    salaries: [...salaries].sort((a, b) => a - b),
    bands,
    sectors,
    salarySectors: sectors.filter((s) => s.median !== null).sort((a, b) => b.median! - a.median!),
    locations: countBy(roles.flatMap((r) => r.locations)).slice(0, 12),
    closing,
    lastVerified: roles.map((r) => r.lastVerified).filter(Boolean).sort().at(-1) ?? null,
    minSample: MIN_SAMPLE,
  };
}

export type Insights = ReturnType<typeof getInsights>;

/** External figures quoted on the page. `id` is what the footnote markers point at. */
export const SOURCES = [
  {
    id: "dfe",
    title: "Apprenticeships, academic year 2024/25",
    publisher: "Department for Education, Explore education statistics",
    url: "https://explore-education-statistics.service.gov.uk/find-statistics/apprenticeships/2024-25",
  },
  {
    id: "ise",
    title: "Apprenticeships rise as graduate vacancies drop 8% (Student Recruitment Survey 2025)",
    publisher: "Institute of Student Employers",
    url: "https://ise.org.uk/knowledge/insights/492/apprenticeships_rise_as_graduate_vacancies_drop_8",
  },
  {
    id: "the",
    title: "Large employers hire more apprentices as graduate jobs cut back",
    publisher: "Times Higher Education",
    url: "https://www.timeshighereducation.com/news/large-employers-hire-more-apprentices-graduate-jobs-cut-back",
  },
  {
    id: "nmw",
    title: "National Minimum Wage and National Living Wage rates",
    publisher: "GOV.UK",
    url: "https://www.gov.uk/national-minimum-wage-rates",
  },
  {
    id: "fees",
    title: "Changes to tuition fees: 2026 to 2027 and 2027 to 2028 academic years",
    publisher: "Department for Education, GOV.UK",
    url: "https://www.gov.uk/government/publications/tuition-fees-and-student-support-2026-to-2027-academic-year/changes-to-tuition-fees-2026-to-2027-academic-year-and-2027-to-2028-academic-year",
  },
  {
    id: "nofees",
    title: "What are apprenticeships? Everything you need to know",
    publisher: "Department for Education, The Education Hub",
    url: "https://educationhub.blog.gov.uk/2025/02/what-are-apprenticeships-everything-you-need-to-know-and-how-you-can-apply/",
  },
  {
    id: "l7",
    title: "Level 7 apprenticeship funding to be axed from January 2026",
    publisher: "FE Week",
    url: "https://feweek.co.uk/level-7-apprenticeship-funding-to-be-axed-from-january-2026",
  },
] as const;

export type SourceId = (typeof SOURCES)[number]["id"];

/** External figures, kept here so the page text and the comparison chart can't disagree. */
export const CONTEXT = {
  /** Apprentice rate per hour from 1 April 2026. */
  apprenticeRate: 8,
  /** Hours used to annualise it (a typical full-time week). */
  weeklyHours: 37.5,
  graduateMedian: 33_000,
  schoolLeaverMedian: 24_000,
  feeCap2026: 9_790,
  feeCap2027: 10_050,
  starts: { total: 60_350, previous: 50_110, level6: 26_780, level7: 33_560, shareOfAll: 17.1 },
};
