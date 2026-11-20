import { site } from "@/config/site";
import { getGuides } from "@/lib/guides";
import { getRoles } from "@/lib/roles";
import { TESTS } from "@/lib/tests";

// A plain-text map of the site for AI assistants that browse the web (see https://llmstxt.org).
export const dynamic = "force-static";

export function GET() {
  const url = (path: string) => `${site.url}${path}`;
  const body = `# ${site.name}

> ${site.description}

${getRoles().length} Level 6 and 7 degree apprenticeship listings, updated by the community. Always confirm details on the employer's official page before applying.

## Data

- [All listings as JSON](${url("/roles.json")}): every field, including descriptions
- [All listings as CSV](${url("/roles.csv")}): spreadsheet-friendly, without descriptions
- MCP server: ${url("/mcp")} (Streamable HTTP, read-only, no sign-in). Tools: search_roles, get_role, list_filters, list_guides, get_guide. Setup: ${url("/ai")}

## Pages

- [Search roles](${url("/roles")})
- [Practice tests](${url("/tests")})
- [CV builder](${url("/cv")})
- [Guides](${url("/guides")})
- [About](${url("/about")})

## Guides

${getGuides()
  .map((g) => `- [${g.title}](${url(`/guides/${g.slug}`)}): ${g.description}`)
  .join("\n")}

## Practice tests

${TESTS.map((t) => `- [${t.title}](${url(`/tests/${t.slug}`)}): ${t.description}`).join("\n")}
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
