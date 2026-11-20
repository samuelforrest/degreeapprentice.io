import type { Level, Sector } from "@/lib/taxonomy";

export type Apprenticeship = {
  id: string;
  file: string;
  title: string;
  company: string;
  companyWebsite: string | null;
  logoUrl: string | null;
  level: Level;
  sectors: Sector[];
  locations: string[];
  workPattern: "on-site" | "hybrid" | "remote" | null;
  salary: number | null;
  salaryMax: number | null;
  salaryNote: string | null;
  duration: string | null;
  eligibility: string | null;
  qualification: string | null;
  trainingProvider: string | null;
  visaSponsorship: boolean | null;
  opens: string | null;
  closes: string | null;
  rolling: boolean;
  starts: string | null;
  applyUrl: string;
  sourceUrl: string;
  lastVerified: string | null;
  description: string | null;
};

// The slim shape sent to client components (directory, tracker lookups): drops
// the Markdown body so page payloads stay small.
export type ApprenticeshipSummary = Omit<Apprenticeship, "description" | "file">;
