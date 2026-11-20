// The public MCP server behind /mcp: lets AI assistants such as Claude and ChatGPT search
// the listings and read the guides. Read-only, no sign-in, and stateless (a fresh server
// per request), so it runs as an ordinary serverless function.
import "server-only";

import { McpServer } from "@modelcontextprotocol/server";
import * as z from "zod/v4";

import { site } from "@/config/site";
import { getGuide, getGuides } from "@/lib/guides";
import { getExportedRoles } from "@/lib/export";
import { getRoles } from "@/lib/roles";
import { LEVELS, SECTORS } from "@/lib/taxonomy";
import { TESTS } from "@/lib/tests";
import type { Role } from "@/lib/types";

const INSTRUCTIONS = `${site.name} is a free, open-source directory of UK degree apprenticeships (Level 6 bachelor's and Level 7 master's), plus guides and practice tests for applicants.

- Use search_roles to find apprenticeships by keyword, sector, level or location. Closed roles are hidden unless include_closed is true.
- Use get_role for the full details of one role, including entry requirements and the description.
- Use list_filters to see valid sectors and the most common locations.
- Use list_guides and get_guide for advice on applying, online tests, interviews and assessment centres.

Always give the user the role's url and remind them to confirm details on the employer's official page (applyUrl) before applying, because listings can change.`;

/** Today's date in the UK, as YYYY-MM-DD. */
const todayUK = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London" }).format(new Date());

const roleUrl = (id: string) => `${site.url}/roles/${id}`;

function summary(r: Role) {
  return {
    id: r.id,
    title: r.title,
    company: r.company,
    level: r.level,
    sectors: r.sectors,
    locations: r.locations,
    salary: r.salary,
    salaryMax: r.salaryMax,
    opens: r.opens,
    closes: r.closes,
    rolling: r.rolling,
    url: roleUrl(r.id),
  };
}

const json = (data: unknown) => ({
  content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
  structuredContent: data as Record<string, unknown>,
});

const READ_ONLY = { readOnlyHint: true, openWorldHint: false, idempotentHint: true } as const;

export function createServer() {
  const server = new McpServer({ name: site.name, version: "1.0.0" }, { instructions: INSTRUCTIONS });

  server.registerTool(
    "search_roles",
    {
      title: "Search degree apprenticeships",
      description:
        "Search UK degree apprenticeship listings. Every word in `query` must appear in the title, employer, sectors, locations or qualification. Results are sorted by closing date (soonest first) unless sort is 'salary'.",
      inputSchema: z.object({
        query: z.string().optional().describe("Keywords, e.g. 'software', 'civil engineering' or 'Rolls-Royce'"),
        sector: z.enum(SECTORS).optional().describe("Only roles in this sector"),
        level: z.union([z.literal(6), z.literal(7)]).optional().describe("6 = bachelor's degree, 7 = master's degree"),
        location: z.string().optional().describe("Town, city or region, e.g. 'Manchester' or 'London'"),
        include_closed: z.boolean().optional().describe("Include roles whose closing date has passed (default false)"),
        sort: z.enum(["deadline", "salary"]).optional().describe("deadline (default) or salary (highest first)"),
        limit: z.number().int().min(1).max(50).optional().describe("Maximum results to return (default 20)"),
      }),
      annotations: READ_ONLY,
    },
    async ({ query, sector, level, location, include_closed, sort, limit }) => {
      const today = todayUK();
      const terms = (query ?? "").toLowerCase().split(/\s+/).filter(Boolean);
      const place = location?.toLowerCase().trim();

      const matches = getRoles().filter((r) => {
        if (!include_closed && r.closes && r.closes < today) return false;
        if (sector && !r.sectors.includes(sector)) return false;
        if (level && r.level !== level) return false;
        if (place && !r.locations.some((l) => l.toLowerCase().includes(place))) return false;
        if (terms.length) {
          const haystack = [r.title, r.company, r.qualification ?? "", ...r.sectors, ...r.locations].join(" ").toLowerCase();
          if (!terms.every((t) => haystack.includes(t))) return false;
        }
        return true;
      });

      matches.sort((a, b) =>
        sort === "salary"
          ? (b.salaryMax ?? b.salary ?? -1) - (a.salaryMax ?? a.salary ?? -1)
          : (a.closes ?? "9999").localeCompare(b.closes ?? "9999"),
      );

      const roles = matches.slice(0, limit ?? 20).map(summary);
      return json({ today, total: matches.length, returned: roles.length, roles });
    },
  );

  server.registerTool(
    "get_role",
    {
      title: "Get a degree apprenticeship",
      description: "Full details of one listing by its id (from search_roles): salary, dates, entry requirements, training provider and description.",
      inputSchema: z.object({ id: z.string().describe("The role id, e.g. 'accenture-software-engineering-newcastle-upon-tyne-2027'") }),
      annotations: READ_ONLY,
    },
    async ({ id }) => {
      const role = getExportedRoles().find((r) => r.id === id);
      if (!role) {
        return { content: [{ type: "text" as const, text: `No role with id "${id}". Use search_roles to find valid ids.` }], isError: true };
      }
      return json({ ...role, today: todayUK() });
    },
  );

  server.registerTool(
    "list_filters",
    {
      title: "List sectors, levels and locations",
      description: "The sectors and levels you can filter search_roles by, and the most common locations, each with a count of open roles.",
      inputSchema: z.object({}),
      annotations: READ_ONLY,
    },
    async () => {
      const today = todayUK();
      const open = getRoles().filter((r) => !r.closes || r.closes >= today);
      const count = (pick: (r: Role) => readonly (string | number)[]) => {
        const counts = new Map<string | number, number>();
        for (const r of open) for (const v of pick(r)) counts.set(v, (counts.get(v) ?? 0) + 1);
        return counts;
      };
      const sectors = count((r) => r.sectors);
      const locations = [...count((r) => r.locations)].sort((a, b) => b[1] - a[1]).slice(0, 40);
      return json({
        today,
        openRoles: open.length,
        sectors: SECTORS.map((s) => ({ sector: s, openRoles: sectors.get(s) ?? 0 })),
        levels: LEVELS.map((l) => ({ level: l.id, qualification: l.qualification, openRoles: open.filter((r) => r.level === l.id).length })),
        topLocations: locations.map(([location, openRoles]) => ({ location, openRoles })),
      });
    },
  );

  server.registerTool(
    "list_guides",
    {
      title: "List guides and practice tests",
      description: "Guides and articles about applying for degree apprenticeships, plus the free practice tests on the site.",
      inputSchema: z.object({}),
      annotations: READ_ONLY,
    },
    async () =>
      json({
        guides: getGuides().map((g) => ({ slug: g.slug, title: g.title, description: g.description, type: g.type, url: `${site.url}/guides/${g.slug}` })),
        practiceTests: TESTS.map((t) => ({ title: t.title, category: t.category, questions: t.questions.length, url: `${site.url}/tests/${t.slug}` })),
        cvBuilder: `${site.url}/cv`,
      }),
  );

  server.registerTool(
    "get_guide",
    {
      title: "Read a guide",
      description: "The full text (Markdown) of one guide or article, by its slug from list_guides.",
      inputSchema: z.object({ slug: z.string().describe("e.g. 'video-interviews'") }),
      annotations: READ_ONLY,
    },
    async ({ slug }) => {
      const guide = getGuide(slug);
      if (!guide) {
        return { content: [{ type: "text" as const, text: `No guide with slug "${slug}". Use list_guides to find valid slugs.` }], isError: true };
      }
      return {
        content: [{ type: "text" as const, text: `# ${guide.title}\n\n${guide.body}\n\nSource: ${site.url}/guides/${guide.slug}` }],
      };
    },
  );

  return server;
}
