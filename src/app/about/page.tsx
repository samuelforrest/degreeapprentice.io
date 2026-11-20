import type { Metadata } from "next";

import { Markdown } from "@/components/markdown";
import { Button } from "@/components/ui/button";
import { githubNewIssueUrl, site } from "@/config/site";

export const metadata: Metadata = {
  title: "About",
  description: `Why ${site.name} exists, how it stays accurate, how it pays for itself and how to add or fix a listing.`,
  alternates: { canonical: "/about" },
};

const about = `
Finding a degree apprenticeship shouldn't mean checking twenty careers sites, creating ten accounts and wading through sponsored listings. **${site.name}** puts every UK degree apprenticeship (Level 6 and 7: a full degree, a salary and no tuition fees) in one searchable place.

## Our promises

- **Free for students, forever.** Browsing and searching will never sit behind a paywall or a "premium" tier.
- **No accounts, no tracking.** You don't need to sign up to use anything, and we don't sell or share data with employers or advertisers.
- **Honest listings.** Every listing links to the employer's official page and shows when it was last checked. Paid promotion, if we ever offer it, will always be clearly labelled and never changes the order of search results.
- **Open source.** The code and the listings are public on [GitHub](${site.repoUrl}) under the MIT licence. If we ever let you down, you can take the data and build something better.

## How listings stay accurate

Listings are plain text files that anyone can add to or correct. Every change is checked automatically and reviewed by a maintainer before it goes live, the same way open-source software is built.

## How it pays for itself

Running the site costs little, because the directory is pre-built static pages. To cover those small hosting costs, we'll set up a simple **donation page**. Donating will always be optional: everything stays free, and students' access and data will never be part of the deal.
`;

const contribute = `
### The quick way: suggest a listing

Fill in a short form on GitHub with the role's name, the employer and a link to its official page. A maintainer adds it for you. You'll need a free GitHub account.

### The direct way: edit the file yourself

Every listing is one text file in [\`content/roles\`](${site.repoUrl}/tree/main/content/roles). You can change it in your browser:

1. On any listing, choose **Edit this listing**. To add a new one, copy an existing file and name it \`company-role-location-startyear.md\`, such as \`acme-software-engineer-leeds-2027.md\`. The filename becomes the page address.
2. Fill in the details **from the employer's official page only**, and set \`source_url\` to that page.
3. Set \`last_verified\` to today's date.
4. Choose **Propose changes** and open a pull request. Automatic checks catch typos in the format, and a maintainer reviews it.

The full guide, including every field, is in [CONTRIBUTING.md](${site.repoUrl}/blob/main/CONTRIBUTING.md).

### Rules for listings

- Only real, currently or recently advertised UK apprenticeships, taken from the employer's own site.
- No recruitment agencies or paid-placement schemes that charge applicants.
- Copy facts, not marketing: keep descriptions short and in your own words.
`;

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-3xl font-semibold tracking-tight">About {site.name}</h1>
      <Markdown>{about}</Markdown>

      <section id="contribute" aria-labelledby="contribute-heading" className="scroll-mt-20 space-y-4 pt-6">
        <div className="space-y-2">
          <h2 id="contribute-heading" className="text-xl font-semibold tracking-tight">Add or fix a listing</h2>
          <p className="text-muted-foreground">
            {site.name} is only as good as its listings. Spotted a missing role or an out-of-date deadline? You can fix
            it in a couple of minutes, with no coding needed.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button nativeButton={false} render={<a href={githubNewIssueUrl("add-role.yml")} target="_blank" rel="noopener noreferrer" />}>
            Suggest a role
          </Button>
          <Button variant="outline" nativeButton={false} render={<a href={githubNewIssueUrl("report-problem.yml")} target="_blank" rel="noopener noreferrer" />}>
            Report a problem
          </Button>
        </div>
        <Markdown>{contribute}</Markdown>
      </section>
    </article>
  );
}
