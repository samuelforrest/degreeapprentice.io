// The one place the brand lives. Rename the project here (and in package.json).
export const site = {
  name: "degreeapprentice.io",
  description:
    "A free, open-source directory of every UK degree apprenticeship, with salaries, closing dates and entry requirements. No paywalls, no ads, no sign-up.",
  // Set NEXT_PUBLIC_SITE_URL to override, e.g. once a custom domain is live.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://degreeapprenticeio.vercel.app",
  repoUrl:
    process.env.NEXT_PUBLIC_REPO_URL ??
    "https://github.com/samuelforrest/degreeapprentice.io",
} as const;

export const githubEditUrl = (path: string) =>
  `${site.repoUrl}/edit/main/${path}`;

export const githubNewIssueUrl = (template: string, title?: string) =>
  `${site.repoUrl}/issues/new?template=${template}${title ? `&title=${encodeURIComponent(title)}` : ""}`;
