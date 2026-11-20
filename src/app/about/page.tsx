import type { Metadata } from "next";

import { Markdown } from "@/components/markdown";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "About",
  description: `Why ${site.name} exists, how it stays accurate and how it pays for itself.`,
  alternates: { canonical: "/about" },
};

const body = `
Finding a degree apprenticeship shouldn't mean checking twenty careers sites, creating ten accounts and wading through sponsored listings. **${site.name}** puts every UK degree apprenticeship (Level 6 and 7: a full degree, a salary and no tuition fees) in one searchable place.

## Our promises

- **Free for students, forever.** Browsing and searching will never sit behind a paywall or a "premium" tier.
- **No accounts, no tracking.** You don't need to sign up to use anything, and we don't sell or share data with employers or advertisers.
- **Honest listings.** Every listing links to the employer's official page and shows when it was last checked. Paid promotion, if we ever offer it, will always be clearly labelled and never changes the order of search results.
- **Open source.** The code and the listings are public on [GitHub](${site.repoUrl}) under the MIT licence. If we ever let you down, you can take the data and build something better.

## How listings stay accurate

Listings are plain text files that anyone can add to or correct. Every change is checked automatically and reviewed by a maintainer before it goes live, the same way open-source software is built.

## How it pays for itself

Running the site costs little, because the directory is pre-built static pages. As it grows, the plan is to charge **employers**, never students: for example, clearly labelled featured listings or employer profile pages. Students' access and data will never be part of the deal.

## Get involved

[Add or fix a listing](/contribute), or star the project on [GitHub](${site.repoUrl}).
`;

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-3xl font-semibold tracking-tight">About {site.name}</h1>
      <Markdown>{body}</Markdown>
    </article>
  );
}
