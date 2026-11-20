// Loads content/guides/*.md at build time. Every guide page is pre-rendered.
// Frontmatter is checked here, so a broken guide fails the build (and CI) with a clear message.
import "server-only";

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const DIR = path.join(process.cwd(), "content", "guides");

export const GUIDE_TYPES = {
  guide: { label: "Guide", plural: "Guides", description: "Step-by-step help with each stage of applying." },
  blog: { label: "Article", plural: "Articles", description: "Opinions, comparisons and things we wish we'd known." },
} as const;
export type GuideType = keyof typeof GUIDE_TYPES;

export type Guide = {
  slug: string;
  file: string;
  title: string;
  description: string;
  type: GuideType;
  published: string;
  updated: string | null;
  readingMinutes: number;
  body: string;
};

// YAML turns unquoted 2026-11-20 into a Date; keep dates as YYYY-MM-DD strings.
const toDate = (v: unknown) =>
  v instanceof Date ? v.toISOString().slice(0, 10) : typeof v === "string" && v ? v : null;

function parse(file: string): Guide {
  const { data, content } = matter(fs.readFileSync(path.join(DIR, file), "utf8"));
  const problem = (message: string) => new Error(`content/guides/${file}: ${message}`);
  for (const field of ["title", "description", "type", "published"]) {
    if (!data[field]) throw problem(`missing "${field}" in frontmatter`);
  }
  if (!(data.type in GUIDE_TYPES)) throw problem(`"type" must be one of: ${Object.keys(GUIDE_TYPES).join(", ")}`);
  const published = toDate(data.published);
  if (!published || !/^\d{4}-\d{2}-\d{2}$/.test(published)) throw problem(`"published" must be a date like 2026-11-20`);

  const body = content.trim();
  return {
    slug: file.replace(/\.md$/, ""),
    file: `content/guides/${file}`,
    title: String(data.title),
    description: String(data.description),
    type: data.type as GuideType,
    published,
    updated: toDate(data.updated),
    readingMinutes: Math.max(1, Math.round(body.split(/\s+/).length / 220)),
    body,
  };
}

let cache: Guide[] | undefined;

/** Newest first. */
export function getGuides(): Guide[] {
  cache ??= fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map(parse)
    .sort((a, b) => b.published.localeCompare(a.published) || a.title.localeCompare(b.title));
  return cache;
}

export const getGuide = (slug: string) => getGuides().find((g) => g.slug === slug) ?? null;
