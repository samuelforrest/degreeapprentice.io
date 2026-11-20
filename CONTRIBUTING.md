# Contributing

Thanks for helping. This is a directory of **UK degree apprenticeships (Level 6 and 7)** only. Most contributions are **adding listings and keeping them accurate**, and you can do that entirely in your browser on GitHub. No coding or setup needed.

## Add a listing

1. Open [`content/apprenticeships/`](content/apprenticeships) and choose **Add file → Create new file**.
2. Name it **`company-role-location-startyear.md`** in lowercase with hyphens, e.g. `rolls-royce-aerospace-engineering-derby-2027.md`. **The filename becomes the page address, so it can't change later.**
   - **company:** as written in `company`, e.g. `jp-morgan`, `lloyds-banking-group`
   - **role:** the programme in a few words, with no "apprenticeship", "degree" or "level 6"
   - **location:** the town, or `multiple-locations` if there are several, or `uk` if none is published
   - **startyear:** leave it off if the start date isn't published
   - If two listings would get the same name, add `-2` to the second
3. Paste the template below (the values are only an example), fill it in **from the employer's official page only**, and choose **Propose changes**.

Don't want to touch files? [Suggest a listing](../../issues/new?template=add-apprenticeship.yml) instead, and a maintainer will add it.

```yaml
---
title: "Aerospace Engineering Degree Apprenticeship"
company: "Rolls-Royce"
company_website: "https://www.rolls-royce.com"
level: 6
sectors: ["Engineering", "Defence & Aerospace"]
locations: ["Derby", "Bristol"]
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

## Fields

Only `title`, `company`, `level`, `sectors`, `apply_url` and `source_url` are required. Use `null` (or `[]` for lists) for anything not published. **Never guess.**

| Field | Notes |
|---|---|
| `level` | `6` (bachelor's degree) or `7` (master's). Only degree apprenticeships are listed: no Level 3 to 5 apprenticeships, graduate schemes or sponsored degrees |
| `sectors` | 1 to 3 from the list in the [schema](content/schema/apprenticeship.schema.json) |
| `company` | Spell it exactly as in the employer's other listings, so they group on one page |
| `salary` | Whole pounds per year, no symbols or commas. For a range, put the lowest in `salary` and the highest in `salary_max`. Weekly pay or bonuses go in `salary_note` |
| `opens`, `closes`, `starts` | `YYYY-MM-DD` |
| `rolling` | `true` if the employer says it may close early once places are filled |
| `apply_url` / `source_url` | `https://` links to the employer's own site (or their official applicant system) |
| `last_verified` | The date you checked the details against `source_url` |

## Update a listing

On any listing page, choose **Edit this listing**. Fix what's changed, set `last_verified` to today, and propose the change. If a programme has closed for good (not just for this year), open a pull request that deletes the file.

## Rules

- **Official sources only.** No details from forums, agencies or other job boards.
- **Real UK apprenticeships only**, from the employer directly. No agencies, and nothing that charges applicants.
- **Descriptions in your own words**, kept short.
- One listing per programme per intake. If the same scheme runs every year, update the file rather than adding a new one.

## Checks

Every pull request runs `bun run validate`, which checks the format, dates, links and company spelling, plus a full build. If a check fails, the error message names the file and field.

## For maintainers: reviewing listings

1. Open the `source_url` and confirm every filled-in field against it.
2. Check that it isn't a duplicate (search the employer's name).
3. Look at the preview deployment, then merge. It goes live on the next deploy.

## Working on the site

```bash
bun install && cp .env.example .env.local && bun run dev
```

Run `bun run check && bun run build` before opening a PR. Keep the student side free and private: anything that adds tracking, ads or data sharing will not be merged.
