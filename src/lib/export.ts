// Shapes listings for the public /roles.json and /roles.csv downloads.
import "server-only";

import { site } from "@/config/site";
import { getRoles } from "@/lib/roles";
import type { Role } from "@/lib/types";

/** One listing as published in the data downloads: internal fields dropped, page URL added. */
export type ExportedRole = Omit<Role, "file" | "logoUrl"> & { url: string };

export function getExportedRoles(): ExportedRole[] {
  return getRoles().map((o) => {
    const role: Partial<Role> = { ...o };
    delete role.file;
    delete role.logoUrl;
    return { ...(role as Omit<Role, "file" | "logoUrl">), url: `${site.url}/roles/${o.id}` };
  });
}

// Column order for the CSV. The Markdown description is left out to keep it spreadsheet-friendly.
const CSV_COLUMNS = [
  "id", "title", "company", "level", "sectors", "locations", "workPattern", "salary", "salaryMax", "salaryNote",
  "duration", "eligibility", "qualification", "trainingProvider", "visaSponsorship", "opens", "closes", "rolling",
  "starts", "applyUrl", "sourceUrl", "companyWebsite", "lastVerified", "url",
] as const satisfies readonly (keyof ExportedRole)[];

function csvCell(value: unknown): string {
  if (value == null) return "";
  let text = Array.isArray(value) ? value.join("; ") : String(value);
  // Stop spreadsheet apps treating community-written text as a formula.
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function toCsv(roles: ExportedRole[]): string {
  const lines = [CSV_COLUMNS.join(","), ...roles.map((r) => CSV_COLUMNS.map((c) => csvCell(r[c])).join(","))];
  // A byte-order mark so Excel reads the file as UTF-8 (£, accents).
  return `﻿${lines.join("\r\n")}\r\n`;
}
