// Loads content/apprenticeships/*.md at build time. Server-only: every listing
// page is pre-rendered, so there is no database behind the directory.
import "server-only";

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

import type { Level, Sector } from "@/lib/taxonomy";
import type { Apprenticeship, ApprenticeshipSummary } from "@/lib/types";

const DIR = path.join(process.cwd(), "content", "apprenticeships");

// YAML turns unquoted 2027-01-31 into a Date; keep dates as YYYY-MM-DD strings.
const toDate = (v: unknown) =>
  v instanceof Date ? v.toISOString().slice(0, 10) : typeof v === "string" && v ? v : null;

function logoFor(website: string | null) {
  if (!website) return null;
  try {
    // careers.example.co.uk → example.co.uk
    const labels = new URL(website).hostname.toLowerCase().replace(/^www\./, "").split(".");
    const secondLevel = /^(co|org|ac|gov|nhs|ltd|plc|me|net|sch)$/.test(labels.at(-2) ?? "");
    const domain = labels.slice(secondLevel ? -3 : -2).join(".");
    const token = process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN;
    return token
      ? `https://img.logo.dev/${domain}?token=${token}&size=128&format=png&retina=true`
      : `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  } catch {
    return null;
  }
}

let cache: Apprenticeship[] | undefined;

export function getApprenticeships(): Apprenticeship[] {
  if (cache) return cache;
  cache = fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const { data, content } = matter(fs.readFileSync(path.join(DIR, file), "utf8"));
      return {
        id: file.replace(/\.md$/, ""),
        file: `content/apprenticeships/${file}`,
        title: String(data.title),
        company: String(data.company),
        companyWebsite: data.company_website ?? null,
        logoUrl: logoFor(data.company_website ?? null),
        level: data.level as Level,
        sectors: (data.sectors ?? []) as Sector[],
        locations: data.locations ?? [],
        workPattern: data.work_pattern ?? null,
        salary: data.salary ?? null,
        salaryMax: data.salary_max ?? null,
        salaryNote: data.salary_note ?? null,
        duration: data.duration ?? null,
        eligibility: data.eligibility ?? null,
        qualification: data.qualification ?? null,
        trainingProvider: data.training_provider ?? null,
        visaSponsorship: data.visa_sponsorship ?? null,
        opens: toDate(data.opens),
        closes: toDate(data.closes),
        rolling: Boolean(data.rolling),
        starts: toDate(data.starts),
        applyUrl: String(data.apply_url),
        sourceUrl: String(data.source_url),
        lastVerified: toDate(data.last_verified),
        description: content.trim() || null,
      } satisfies Apprenticeship;
    })
    .sort((a, b) => a.company.localeCompare(b.company) || a.title.localeCompare(b.title));
  return cache;
}

export const getApprenticeship = (id: string) => getApprenticeships().find((o) => o.id === id) ?? null;

export function toSummary(o: Apprenticeship): ApprenticeshipSummary {
  const summary: Partial<Apprenticeship> = { ...o };
  delete summary.description;
  delete summary.file;
  return summary as ApprenticeshipSummary;
}
