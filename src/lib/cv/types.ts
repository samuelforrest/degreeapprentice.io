// The CV builder's data. It lives only in the visitor's browser (localStorage); nothing is sent to a server.

export type CvEntry = {
  id: string;
  title: string;
  organisation: string;
  location: string;
  dates: string;
  /** One bullet point per line. */
  bullets: string;
};

type SectionBase = {
  id: string;
  title: string;
  hidden?: boolean;
  /** Editor-only advice, shown under the section heading. Never printed. */
  hint?: string;
};

export type CvSection =
  | (SectionBase & { kind: "text"; body: string })
  | (SectionBase & { kind: "entries"; entries: CvEntry[] })
  /** One item per line. */
  | (SectionBase & { kind: "list"; items: string });

export type Cv = {
  version: 1;
  name: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  /** One link per line, such as LinkedIn or a portfolio. */
  links: string;
  sections: CvSection[];
};

export const lines = (text: string) =>
  text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

/** Email · phone · town · links, skipping anything blank. */
export const contactLine = (cv: Cv) => [cv.email, cv.phone, cv.location, ...lines(cv.links)].filter((s) => s.trim());

export const visibleSections = (cv: Cv) => cv.sections.filter((s) => !s.hidden);
