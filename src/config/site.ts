// The one place the brand lives. Rename the project here (and in package.json).
export const site = {
  name: "degreeapprentice.io",
  description:
    "A free, open-source directory of every UK degree apprenticeship, with salaries, closing dates and entry requirements. No paywalls, no ads, no sign-up.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://degreeapprentice.io",
  repoUrl:
    process.env.NEXT_PUBLIC_REPO_URL ??
    "https://github.com/samuelforrest/degreeapprentice",
} as const;

export const githubEditUrl = (path: string) =>
  `${site.repoUrl}/edit/main/${path}`;

export const githubNewIssueUrl = (template: string, title?: string) =>
  `${site.repoUrl}/issues/new?template=${template}${title ? `&title=${encodeURIComponent(title)}` : ""}`;
