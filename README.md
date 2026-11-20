# degreeapprentice.io

**A free, open-source directory of every UK degree apprenticeship** (Level 6 and 7), with salaries, closing dates and entry requirements. No accounts, no paywalls, no ads.

Every listing is one Markdown file in [`content/apprenticeships/`](content/apprenticeships). Anyone can add or fix one with a pull request; see [CONTRIBUTING.md](CONTRIBUTING.md).

## How it's built

| | |
|---|---|
| Framework | [Next.js](https://nextjs.org) 16 (App Router), React 19, TypeScript |
| UI | [shadcn/ui](https://ui.shadcn.com) (Base UI), Tailwind CSS v4 |
| Listings | Markdown + YAML frontmatter, validated against [a JSON Schema](content/schema/apprenticeship.schema.json), pre-rendered at build time |

Listings live in git rather than a database on purpose: every change is reviewed, the full history is public, the data can't be held hostage, and every page is static HTML, which is fast, cheap to host and good for search engines.

## Run it locally

```bash
bun install
bun run dev
```

No setup or environment variables are needed. Optionally, set `NEXT_PUBLIC_LOGO_DEV_TOKEN` to a [logo.dev](https://www.logo.dev) publishable key for sharper company logos.

| Command | |
|---|---|
| `bun run dev` | Dev server |
| `bun run validate` | Check every listing against the schema |
| `bun run check` | Validate, lint and typecheck (what CI runs, plus a build) |
| `bun run build` | Production build |

## Project layout

```
content/apprenticeships/   one .md file per listing (the filename is the URL)
content/schema/          JSON Schema for listing frontmatter
scripts/                 content validation
src/app/                 routes
src/components/          UI (ui/ is shadcn)
src/config/site.ts       name, URLs: rename the project here
src/app/globals.css      theme (dark only)
```

## Licence

[MIT](LICENSE). Code and listings alike.
