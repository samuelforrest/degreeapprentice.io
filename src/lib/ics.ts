// Builds an iCalendar (RFC 5545) file of a role's application dates, so
// applicants can drop deadlines straight into Google, Apple or Outlook calendars.
import { site } from "@/config/site";
import type { Role } from "@/lib/types";

const host = new URL(site.url).hostname;

// YYYY-MM-DD → YYYYMMDD, and the day after (all-day events end exclusively).
const icsDate = (d: string) => d.replaceAll("-", "");
const nextDay = (d: string) => icsDate(new Date(Date.parse(`${d}T00:00:00Z`) + 86_400_000).toISOString().slice(0, 10));

const escape = (s: string) => s.replace(/[\\;,]/g, (c) => `\\${c}`).replace(/\r?\n/g, "\\n");

// Lines longer than 75 octets must be folded onto continuation lines starting with a space.
function fold(line: string) {
  const out: string[] = [];
  let current = "";
  let bytes = 0;
  for (const ch of line) {
    const size = new TextEncoder().encode(ch).length;
    if (bytes + size > (out.length ? 74 : 75)) {
      out.push(current);
      current = "";
      bytes = 0;
    }
    current += ch;
    bytes += size;
  }
  out.push(current);
  return out.join("\r\n ");
}

// Reminders at 9am, a week before and the day before (relative to midnight on the day).
const alarm = (trigger: string, text: string) => [
  "BEGIN:VALARM",
  "ACTION:DISPLAY",
  `TRIGGER:${trigger}`,
  `DESCRIPTION:${escape(text)}`,
  "END:VALARM",
];

export const hasCalendarDates = (o: Pick<Role, "opens" | "closes">) => Boolean(o.opens || o.closes);

export function roleCalendar(o: Role) {
  const url = `${site.url}/roles/${o.id}`;
  const stamp = `${new Date().toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`;
  const name = `${o.company}: ${o.title}`;

  const event = (kind: "opens" | "closes", date: string, summary: string, detail: string, alarms: string[][]) => [
    "BEGIN:VEVENT",
    `UID:${o.id}-${kind}@${host}`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${icsDate(date)}`,
    `DTEND;VALUE=DATE:${nextDay(date)}`,
    `SUMMARY:${escape(summary)}`,
    `DESCRIPTION:${escape(`${detail}\n\nApply: ${o.applyUrl}\nDetails: ${url}`)}`,
    `URL:${url}`,
    "TRANSP:TRANSPARENT",
    ...alarms.flat(),
    "END:VEVENT",
  ];

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${site.name}//Application deadlines//EN`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...(o.opens
      ? event("opens", o.opens, `Applications open: ${name}`, `Applications open for ${o.title} at ${o.company}.`, [
          alarm("-PT15H", `Applications open tomorrow: ${name}`),
        ])
      : []),
    ...(o.closes
      ? event(
          "closes",
          o.closes,
          `Deadline: ${name}`,
          `Applications close for ${o.title} at ${o.company}.${o.rolling ? " Recruitment is rolling, so it may close early." : ""} Some employers close earlier in the day, so check the official page.`,
          [
            alarm("-P6DT15H", `One week left to apply: ${name}`),
            alarm("-PT15H", `Applications close tomorrow: ${name}`),
          ],
        )
      : []),
    "END:VCALENDAR",
  ];

  return `${lines.map(fold).join("\r\n")}\r\n`;
}
