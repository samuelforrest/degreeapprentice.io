import type { Metadata } from "next";

import { Markdown } from "@/components/markdown";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: `What ${site.name} collects about you, and why.`,
  alternates: { canonical: "/privacy" },
};

// Keep this accurate whenever the product changes: it's a promise to users.
const body = `
_Last updated: 20 November 2026_

${site.name} has no accounts and collects nothing about you.

- **No sign-up, no cookies.** Browsing and searching need no account and set no tracking or advertising cookies.
- **Hosting.** Our hosting provider processes standard request logs, such as IP addresses, to serve the site and keep it secure.
- **Company logos** are loaded from a logo service, which receives your IP address when your browser fetches the image.
- **Apply links** take you to the employer's own website, and their privacy policy then applies.

Questions? Open an issue on [GitHub](${site.repoUrl}/issues).
`;

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-3xl font-semibold tracking-tight">Privacy</h1>
      <Markdown>{body}</Markdown>
    </article>
  );
}
