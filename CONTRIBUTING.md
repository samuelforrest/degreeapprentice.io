# Contributing

Thanks for helping. This is a directory of **UK degree apprenticeships (Level 6 and 7)** only. Most contributions are **adding listings and keeping them accurate**, and you can do that entirely in your browser on GitHub. No coding or setup needed.

## Add a listing

1. Open [`content/apprenticeships/`](content/apprenticeships) and choose **Add file → Create new file**.
2. Name the file using the [naming convention](#naming-the-file) below, e.g. `rolls-royce-aerospace-engineering-derby-2027.md`.
3. Paste the template below (the values are only an example), fill it in **from the employer's official page only**, and choose **Propose changes**.

Don't want to touch files? [Suggest a listing](../../issues/new?template=add-apprenticeship.yml) instead, and a maintainer will add it.

```yaml
---
title: "Aerospace Engineering Degree Apprenticeship"
company: "Rolls-Royce"
company_website: "https://www.rolls-royce.com"
level: 6
sectors: ["Engineering", "Defence & Aerospace"]
locations: ["Derby"]
work_pattern: hybrid
salary: 24000
salary_max: null
salary_note: "Rises each year of the programme"
duration: "4 years"
eligibility: "A levels at BBC including Maths and a science, or equivalent"
qualification: "BEng (Hons) Aerospace Engineering"
training_provider: "University of Derby"
visa_sponsorship: null
opens: 2026-09-01
closes: 2026-12-15
rolling: true
starts: 2027-09-06
apply_url: "https://careers.rolls-royce.com/..."
source_url: "https://careers.rolls-royce.com/..."
last_verified: 2026-11-20
---

A short description **in your own words**: what you'd do, what you'd study, how the weeks are split.
Markdown headings and lists are fine. Don't paste the employer's marketing copy.
```

## Naming the file

The filename is the listing's **permanent web address**: `content/apprenticeships/amazon-software-development-engineer-london-2027.md` is published at `/apprenticeships/amazon-software-development-engineer-london-2027`. Every name follows the same pattern:

```
{company}-{role}-{location}-{start year}.md
```

| Part | Rule | Examples |
|---|---|---|
| **company** | The `company` field written in lowercase with hyphens. `&` becomes `and`; full stops and apostrophes are dropped | `amazon`, `jp-morgan` (from "J.P. Morgan"), `lloyds-banking-group` |
| **role** | What the job is, in 2 to 4 words. Leave out "apprentice", "apprenticeship", "degree", "level 6", contract notes and the company or town name | `software-engineer`, `civil-engineering`, `chartered-surveyor` |
| **location** | The town or city. If there are several, use `multiple-locations`. If none is published, use `uk` | `bristol`, `newcastle-upon-tyne`, `multiple-locations`, `uk` |
| **start year** | The year the apprenticeship starts. Leave it off if the start date isn't published | `2027` |

Everything is lowercase, with words separated by single hyphens, and no spaces, capitals or other symbols.

**Good:**

```
amazon-software-development-engineer-london-2027.md
lloyds-banking-group-accounting-and-finance-bristol-2027.md
bae-systems-degree-apprenticeships-uk-2027.md
kpmg-technology-uk.md                                ← start date not published
```

**Not like this:**

```
Amazon_Software_Apprentice.md                        ← capitals and underscores
amazon-software-development-engineer-apprentice.md   ← "apprentice" is filler; no location or year
amazon-063426.md                                     ← a number tells nobody anything
software-engineer-london-2027.md                     ← must start with the company
```

### Each intake is its own listing

Most employers run the same programme every year. **Add a new file for each year's intake** (e.g. `…-2027.md`, then `…-2028.md`) rather than editing last year's. That way each intake keeps its own dates, salary and page, and old links still show what they originally pointed to. Last year's listing stays on the site and shows as "Closed".

If two listings would otherwise get the same name, for example two separate vacancies for the same role in the same city, add `-2` to the second, `-3` to the third, and so on.

### Never rename a published file

Once a listing is live, people share its link and search engines index it. Renaming the file breaks those links. If a name is wrong, keep it. If it really has to change, ask a maintainer to add a redirect from the old address in `next.config.ts` in the same pull request.

The automatic checks reject filenames that don't start with the company or that use capitals, spaces or symbols.

## Fields

Only `title`, `company`, `level`, `sectors`, `apply_url` and `source_url` are required. Use `null` (or `[]` for lists) for anything not published. **Never guess.**

| Field | Notes |
|---|---|
| `level` | `6` (bachelor's degree) or `7` (master's). Only degree apprenticeships are listed: no Level 3 to 5 apprenticeships, graduate schemes or sponsored degrees |
| `sectors` | 1 to 3 from the list in the [schema](content/schema/apprenticeship.schema.json) |
| `company` | Spell it exactly as in the employer's other listings. The filename starts with this name (see [Naming the file](#naming-the-file)) |
| `salary` | Whole pounds per year, no symbols or commas. For a range, put the lowest in `salary` and the highest in `salary_max`. Weekly pay or bonuses go in `salary_note` |
| `opens`, `closes`, `starts` | `YYYY-MM-DD` |
| `rolling` | `true` if the employer says it may close early once places are filled |
| `apply_url` / `source_url` | `https://` links to the employer's own site (or their official applicant system) |
| `last_verified` | The date you checked the details against `source_url` |

## Update a listing

On any listing page, choose **Edit this listing**. Fix what's changed, set `last_verified` to today, and propose the change.

Don't delete a listing because it has closed: it shows as "Closed" automatically and stays useful as a record of past intakes. Only delete a file if it should never have been added, for example a duplicate or a role that turned out not to be a degree apprenticeship.

## Rules

- **Official sources only.** No details from forums, agencies or other job boards.
- **Real UK apprenticeships only**, from the employer directly. No agencies, and nothing that charges applicants.
- **Descriptions in your own words**, kept short.
- One listing per programme per intake. When the same scheme opens for a new year, add a new file (see [Each intake is its own listing](#each-intake-is-its-own-listing)).

## Checks

Every pull request runs `bun run validate`, which checks the format, dates, links, company spelling and filename, plus a full build. If a check fails, the error message names the file and field.

## For maintainers: reviewing listings

1. Open the `source_url` and confirm every filled-in field against it.
2. Check that it isn't a duplicate (search the employer's name), and that the filename follows [the naming convention](#naming-the-file).
3. Look at the preview deployment, then merge. It goes live on the next deploy.

## Working on the site

```bash
bun install && bun run dev
```

Run `bun run check && bun run build` before opening a PR. Keep the student side free and private: anything that adds tracking, ads or data sharing will not be merged.
