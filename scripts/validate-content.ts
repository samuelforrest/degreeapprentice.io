// Checks every content/apprenticeships/*.md file. Runs in CI on every pull request
// and locally with `bun run validate`. Exits non-zero if anything is wrong.
import fs from "node:fs";
import path from "node:path";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import matter from "gray-matter";

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname), "..");
const DIR = path.join(ROOT, "content", "apprenticeships");
const schema = JSON.parse(
  fs.readFileSync(
    path.join(ROOT, "content", "schema", "apprenticeship.schema.json"),
    "utf8",
  ),
);

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);

const normalise = (data: Record<string, unknown>) =>
  Object.fromEntries(
    Object.entries(data).map(([k, v]) => [
      k,
      v instanceof Date ? v.toISOString().slice(0, 10) : v,
    ]),
  );

const errors: string[] = [];
const fail = (file: string, message: string) =>
  errors.push(`${file}: ${message}`);

const files = fs.readdirSync(DIR).filter((f) => !f.startsWith("."));
const applyUrls = new Map<string, string>();
const companyNames = new Map<string, Set<string>>();

for (const file of files) {
  if (!file.endsWith(".md")) {
    fail(file, "only .md files belong in content/apprenticeships");
    continue;
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*\.md$/.test(file)) {
    fail(
      file,
      "filename must be lowercase letters, numbers and hyphens, e.g. acme-graduate-scheme-2027.md",
    );
  }

  let parsed: matter.GrayMatterFile<string>;
  try {
    parsed = matter(fs.readFileSync(path.join(DIR, file), "utf8"));
  } catch (e) {
    fail(
      file,
      `the frontmatter isn't valid YAML (${(e as Error).message.split("\n")[0]})`,
    );
    continue;
  }

  const data = normalise(parsed.data);
  if (!validate(data)) {
    for (const err of validate.errors ?? []) {
      const field = err.instancePath.replace(/^\//, "") || "(frontmatter)";
      const detail =
        err.keyword === "additionalProperties"
          ? `unknown field "${(err.params as { additionalProperty: string }).additionalProperty}"`
          : err.keyword === "enum"
            ? `must be one of: ${(err.params as { allowedValues: unknown[] }).allowedValues.filter(Boolean).join(", ")}`
            : err.message;
      fail(file, `${field} ${detail}`);
    }
    continue;
  }

  const d = data as Record<string, string | number | null | undefined>;

  const companySlug = String(d.company)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[.'’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  if (!file.startsWith(`${companySlug}-`)) {
    fail(
      file,
      `filename should start with the company, e.g. ${companySlug}-software-engineer-london-2027.md`,
    );
  }
  if (d.opens && d.closes && d.opens > d.closes)
    fail(file, "opens is after closes");
  if (d.salary != null && d.salary_max != null && d.salary_max < d.salary)
    fail(file, "salary_max is below salary");
  if (
    d.last_verified &&
    d.last_verified > new Date().toISOString().slice(0, 10)
  )
    fail(file, "last_verified is in the future");

  const apply = String(d.apply_url).replace(/\/$/, "");
  const isDeepLink = new URL(apply).pathname.length > 1;
  if (isDeepLink && applyUrls.has(apply))
    fail(
      file,
      `same apply_url as ${applyUrls.get(apply)}: is this a duplicate?`,
    );
  applyUrls.set(apply, file);

  const key = String(d.company)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  companyNames.set(
    key,
    (companyNames.get(key) ?? new Set()).add(String(d.company)),
  );
}

for (const names of companyNames.values()) {
  if (names.size > 1)
    errors.push(
      `company is spelled more than one way: ${[...names].map((n) => `"${n}"`).join(", ")}`,
    );
}

if (errors.length) {
  console.error(
    `✗ ${errors.length} problem${errors.length === 1 ? "" : "s"} in content/apprenticeships:\n`,
  );
  for (const e of errors) console.error(`  • ${e}`);
  process.exit(1);
}
console.log(`✓ ${files.length} apprenticeships are valid`);
