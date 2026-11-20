import type { Metadata } from "next";

import { Markdown } from "@/components/markdown";
import { ContentCard } from "@/components/site/content-card";
import { PageHeader, PageShell } from "@/components/site/page-header";
import { Button } from "@/components/ui/button";
import { githubNewIssueUrl, site } from "@/config/site";

export const metadata: Metadata = {
  title: "About",
  description: `Why ${site.name} exists, how it stays accurate, how it pays for itself and how to add or fix a listing.`,
  alternates: { canonical: "/about" },
};

const promises = `
- **Free for students, forever.** Browsing and searching will never sit behind a paywall or a "premium" tier.
- **No accounts, no cookies.** You don't need to sign up to use anything. We count visits with cookieless, anonymous analytics (Vercel Web Analytics) to see which pages help, and we never sell or share data with employers or advertisers.
- **Honest listings.** Every listing links to the employer's official page and shows when it was last checked. Paid promotion, if we ever offer it, will always be clearly labelled and never changes the order of search results.
- **Open source.** The code and the listings are public on [GitHub](${site.repoUrl}) under the MIT licence. You can also download every listing as [JSON](/roles.json) or [CSV](/roles.csv). If we ever let you down, you can take the data and build something better.
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
    <PageShell>
      <PageHeader
        title={`About ${site.name}`}
        description="Why the site exists, how listings stay accurate, and how you can help."
      />

      <div className="mx-auto max-w-3xl space-y-10">
        <ContentCard title="Why it exists">
          <Markdown>
            {`Finding a degree apprenticeship shouldn't mean checking twenty careers sites, creating ten accounts and wading through sponsored listings. **${site.name}** puts every UK degree apprenticeship (Level 6 and 7: a full degree, a salary and no tuition fees) in one searchable place.`}
          </Markdown>
        </ContentCard>

        <ContentCard title="Our promises">
          <Markdown>{promises}</Markdown>
        </ContentCard>

        <ContentCard title="How listings stay accurate">
          <Markdown>
            {`Listings are plain text files that anyone can add to or correct. Every change is checked automatically and reviewed by a maintainer before it goes live, the same way open-source software is built.`}
          </Markdown>
        </ContentCard>

        <ContentCard title="How it pays for itself">
          <Markdown>
            {`Running the site costs little, because the directory is pre-built static pages. To cover those small hosting costs, we'll set up a simple **donation page**. Donating will always be optional: everything stays free, and students' access and data will never be part of the deal.`}
          </Markdown>
        </ContentCard>

        <ContentCard id="contribute" title="Add or fix a listing">
          <p className="text-[15px] leading-relaxed text-foreground/90">
            {site.name} is only as good as its listings. Spotted a missing role or an out-of-date deadline? You can fix it
            in a couple of minutes, with no coding needed.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button nativeButton={false} render={<a href={githubNewIssueUrl("add-role.yml")} target="_blank" rel="noopener noreferrer" />}>
              Suggest a role
            </Button>
            <Button variant="outline" nativeButton={false} render={<a href={githubNewIssueUrl("report-problem.yml")} target="_blank" rel="noopener noreferrer" />}>
              Report a problem
            </Button>
          </div>
          <Markdown>{contribute}</Markdown>
        </ContentCard>
      </div>
    </PageShell>
  );
}
