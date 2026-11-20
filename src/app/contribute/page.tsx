import type { Metadata } from "next";

import { Markdown } from "@/components/markdown";
import { Button } from "@/components/ui/button";
import { githubNewIssueUrl, site } from "@/config/site";

export const metadata: Metadata = {
  title: "Contribute",
  description: `Add or correct a listing on ${site.name}. No coding needed.`,
  alternates: { canonical: "/contribute" },
};

const body = `
## The quick way: suggest a listing

Fill in a short form on GitHub with the role's name, the employer and a link to its official page. A maintainer adds it for you. You'll need a free GitHub account.

## The direct way: edit the file yourself

Every listing is one text file in [\`content/apprenticeships\`](${site.repoUrl}/tree/main/content/apprenticeships). You can change it in your browser:

1. On any listing, choose **Edit this listing**. To add a new one, copy an existing file and name it \`company-role-location-startyear.md\`, such as \`acme-software-engineer-leeds-2027.md\`. The filename becomes the page address.
2. Fill in the details **from the employer's official page only**, and set \`source_url\` to that page.
3. Set \`last_verified\` to today's date.
4. Choose **Propose changes** and open a pull request. Automatic checks catch typos in the format, and a maintainer reviews it.

The full guide, including every field, is in [CONTRIBUTING.md](${site.repoUrl}/blob/main/CONTRIBUTING.md).

## Rules for listings

- Only real, currently or recently advertised UK apprenticeships, taken from the employer's own site.
- No recruitment agencies or paid-placement schemes that charge applicants.
- Copy facts, not marketing: keep descriptions short and in your own words.
`;

export default function ContributePage() {
  return (
    <article className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Add or fix a listing</h1>
        <p className="text-muted-foreground">
          {site.name} is only as good as its listings. Spotted a missing role or an out-of-date deadline? You can fix
          it in a couple of minutes.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button nativeButton={false} render={<a href={githubNewIssueUrl("add-apprenticeship.yml")} target="_blank" rel="noopener noreferrer" />}>
          Suggest an apprenticeship
        </Button>
        <Button variant="outline" nativeButton={false} render={<a href={githubNewIssueUrl("report-problem.yml")} target="_blank" rel="noopener noreferrer" />}>
          Report a problem
        </Button>
      </div>
      <Markdown>{body}</Markdown>
    </article>
  );
}
